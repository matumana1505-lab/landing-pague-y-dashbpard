import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    error?: string
    user?: {
      id?: string
      provider?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    error?: string
    picture?: string
  }
}
