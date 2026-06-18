import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { User } from "@prisma/client"

export type SessionGuardSuccess = {
  ok: true
  user: User
}

export type SessionGuardFailure = {
  ok: false
  error: string
  status: 401
}

/**
 * Requiere sesión activa y devuelve el usuario persistido en BD.
 * Crea el usuario en el primer acceso (upsert por email).
 */
export async function requireSessionUser(): Promise<
  SessionGuardSuccess | SessionGuardFailure
> {
  const session = await auth()

  if (!session?.user?.email) {
    return { ok: false, error: "No hay sesión activa.", status: 401 }
  }

  const email = session.user.email
  const googleSub = session.user.id ?? undefined

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      googleSub: googleSub ?? null,
    },
    update: {
      name: session.user.name ?? undefined,
      image: session.user.image ?? undefined,
      ...(googleSub ? { googleSub } : {}),
    },
  })

  return { ok: true, user }
}
