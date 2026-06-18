import { prisma } from "@/lib/prisma"
import type { User } from "@prisma/client"

export type UserProfileDto = {
  id: string
  email: string
  name: string | null
  onboardingCompleted: boolean
  activeBusinessId: string | null
}

export async function getUserProfile(userId: string): Promise<UserProfileDto | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      onboardingCompletedAt: true,
      activeBusinessId: true,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    onboardingCompleted: user.onboardingCompletedAt !== null,
    activeBusinessId: user.activeBusinessId,
  }
}

export async function completeUserOnboarding(
  userId: string,
  activeBusinessId: string
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      onboardingCompletedAt: new Date(),
      activeBusinessId,
    },
  })
}
