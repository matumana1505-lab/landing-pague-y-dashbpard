import { prisma } from "@/lib/prisma"
import type { UpsertBusinessInput } from "@/lib/ai-config/schema"
import type { Business } from "@prisma/client"

export async function listUserBusinesses(userId: string): Promise<Business[]> {
  return prisma.business.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  })
}

export async function upsertUserBusiness(
  userId: string,
  input: UpsertBusinessInput
): Promise<Business> {
  return prisma.business.upsert({
    where: {
      userId_googleAccountId_googleLocationId: {
        userId,
        googleAccountId: input.googleAccountId,
        googleLocationId: input.googleLocationId,
      },
    },
    create: {
      userId,
      googleAccountId: input.googleAccountId,
      googleLocationId: input.googleLocationId,
      name: input.name,
      address: input.address ?? null,
      phone: input.phone ?? null,
      isDemo: input.isDemo ?? false,
    },
    update: {
      name: input.name,
      address: input.address ?? null,
      phone: input.phone ?? null,
      isDemo: input.isDemo ?? false,
    },
  })
}

export async function getBusinessForUser(
  userId: string,
  businessId: string
): Promise<Business | null> {
  return prisma.business.findFirst({
    where: { id: businessId, userId },
  })
}

export async function setActiveBusiness(
  userId: string,
  businessId: string | null
): Promise<void> {
  if (businessId) {
    const owned = await getBusinessForUser(userId, businessId)
    if (!owned) {
      throw new Error("BUSINESS_NOT_FOUND")
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { activeBusinessId: businessId },
  })
}
