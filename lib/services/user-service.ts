import { prisma } from "@/lib/prisma"
import type { User } from "@prisma/client"

export type UserProfileDto = {
  id: string
  email: string
  name: string | null
  onboardingCompleted: boolean
  activeBusinessId: string | null
  trialStartedAt: string | null
  trialEndsAt: string | null
}

const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000

export async function getUserProfile(userId: string): Promise<UserProfileDto | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      onboardingCompletedAt: true,
      activeBusinessId: true,
      trialStartedAt: true,
      trialEndsAt: true,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    onboardingCompleted: user.onboardingCompletedAt !== null,
    activeBusinessId: user.activeBusinessId,
    trialStartedAt: user.trialStartedAt ? user.trialStartedAt.toISOString() : null,
    trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
  }
}

export async function completeUserOnboarding(
  userId: string,
  activeBusinessId: string,
  isRealBusiness: boolean = true
): Promise<User> {
  let trialData: { trialStartedAt: Date; trialEndsAt: Date } | Record<string, never> = {}

  if (isRealBusiness) {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { trialStartedAt: true },
    })

    if (!existing?.trialStartedAt) {
      const trialStartedAt = new Date()
      trialData = {
        trialStartedAt,
        trialEndsAt: new Date(trialStartedAt.getTime() + TRIAL_DURATION_MS),
      }
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      onboardingCompletedAt: new Date(),
      activeBusinessId,
      ...trialData,
    },
  })
}
