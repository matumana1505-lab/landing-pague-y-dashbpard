import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth"
import type { Account, Profile } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

// next-auth v4 expects NEXTAUTH_SECRET. We also accept AUTH_SECRET (Auth.js v5
// naming) so the project works regardless of which one is configured, but a
// single consistent value MUST be set or JWE decryption of the session cookie
// will fail with JWT_SESSION_ERROR / JWEDecryptionFailed.
const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

if (!secret) {
  console.error(
    "[next-auth] Missing NEXTAUTH_SECRET (or AUTH_SECRET). Session cookies cannot be encrypted/decrypted and you will see JWT_SESSION_ERROR / JWEDecryptionFailed.",
  )
}

async function refreshGoogleAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    console.error(
      "[next-auth][refresh] No refresh token available. The user must re-authenticate with access_type=offline & prompt=consent.",
    )
    return { ...token, error: "MissingRefreshToken" }
  }

  try {
    const body = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    })

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })

    const refreshed = (await response.json()) as {
      access_token?: string
      expires_in?: number
      refresh_token?: string
      error?: string
      error_description?: string
    }

    if (!response.ok) {
      console.error(
        "[next-auth][refresh] Google token refresh failed",
        "status:",
        response.status,
        "body:",
        JSON.stringify(refreshed),
      )
      return { ...token, error: "RefreshAccessTokenError" }
    }

    const expiresAt = Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 3600)

    return {
      ...token,
      accessToken: refreshed.access_token ?? token.accessToken,
      expiresAt,
      // Google does not always return a new refresh_token; keep the old one.
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: undefined,
    }
  } catch (error) {
    console.error("[next-auth][refresh] Unexpected error refreshing token", error)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

export const authConfig: NextAuthOptions = {
  secret,
  // Use stateless JWT sessions (no DB adapter present). The token is encrypted
  // (JWE) with `secret` and stored in the session cookie.
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          // include_granted_scopes keeps previously granted scopes when the
          // user re-consents.
          include_granted_scopes: "true",
          scope:
            "openid email profile https://www.googleapis.com/auth/business.manage",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT
      account?: Account | null
      profile?: Profile
    }) {
      // Initial sign in: persist OAuth tokens returned by Google.
      if (account) {
        token.provider = account.provider
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token ?? token.refreshToken
        token.expiresAt = account.expires_at
        token.scope = account.scope
        token.error = undefined

      }

      if (profile) {
        token.name = "name" in profile ? String(profile.name ?? token.name ?? "") : token.name
        token.email = "email" in profile ? String(profile.email ?? token.email ?? "") : token.email
        token.picture =
          "picture" in profile
            ? String((profile as { picture?: string }).picture ?? token.picture ?? "")
            : token.picture
      }

      // Subsequent requests: refresh the access token if it has expired.
      const expiresAtMs = (token.expiresAt ?? 0) * 1000
      if (token.accessToken && expiresAtMs && Date.now() < expiresAtMs - 60_000) {
        return token
      }

      if (token.refreshToken) {
        return refreshGoogleAccessToken(token)
      }

      if (token.expiresAt && Date.now() < Number(token.expiresAt) * 1000 - 60_000) {
        return token
      }

      if (token.provider === "google") {
        return refreshGoogleAccessToken(token)
      }

      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = (token.sub as string | undefined) ?? session.user.id
        session.user.provider = (token.provider as string | undefined) ?? session.user.provider
        session.user.image = (token.picture as string | undefined) ?? session.user.image
      }

      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined
      session.error = token.error as string | undefined
      session.scope = token.scope as string | undefined
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.error = token.error

      return session
    },
  },
}
const handler = NextAuth(authConfig)

export function auth() {
  return getServerSession(authConfig)
}

export default handler
