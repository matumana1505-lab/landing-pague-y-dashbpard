import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

async function refreshGoogleAccessToken(token: any) {
  if (!token.refreshToken) {
    console.error("[Google OAuth] Missing refresh token; cannot refresh access token")
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    console.log("[Google OAuth] Refresh token response", {
      status: response.status,
      ok: response.ok,
      hasAccessToken: Boolean(refreshedTokens.access_token),
      expiresIn: refreshedTokens.expires_in,
      error: refreshedTokens.error,
      errorDescription: refreshedTokens.error_description,
    })

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    }
  } catch (error) {
    console.error("[Google OAuth] Failed to refresh access token", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authConfig: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid email profile https://www.googleapis.com/auth/business.manage",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.provider = account.provider
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.scope = account.scope
      }

      if (profile) {
        token.name = "name" in profile ? String(profile.name ?? token.name ?? "") : token.name
        token.email = "email" in profile ? String(profile.email ?? token.email ?? "") : token.email
        token.picture = "picture" in profile ? String(profile.picture ?? token.picture ?? "") : token.picture
      }

      if (token.expiresAt && Date.now() < Number(token.expiresAt) * 1000 - 60_000) {
        return token
      }

      if (token.provider === "google") {
        return refreshGoogleAccessToken(token)
      }

      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.id
        session.user.provider = (token.provider as string | undefined) ?? session.user.provider
        session.user.image = token.picture ?? session.user.image
      }

      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined
      session.error = token.error as string | undefined
      session.scope = token.scope as string | undefined

      return session
    },
  },
}

export async function auth() {
  return getServerSession(authConfig) as Promise<any>
}

export default NextAuth(authConfig)
