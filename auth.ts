import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authConfig = {
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
      }

      if (profile) {
        token.name = "name" in profile ? String(profile.name ?? token.name ?? "") : token.name
        token.email = "email" in profile ? String(profile.email ?? token.email ?? "") : token.email
        token.picture = "picture" in profile ? String(profile.picture ?? token.picture ?? "") : token.picture
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

      return session
    },
  },
}

const handler = NextAuth(authConfig)

export const { auth, signIn, signOut } = handler
export default handler
