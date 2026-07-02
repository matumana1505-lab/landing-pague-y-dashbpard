import { prisma } from "@/lib/prisma"
import type { ReviewResponseStatus } from "@/lib/types"

export interface ReviewResponsePersistenceInput {
  businessId: string
  reviewId: string
  googleReviewId?: string | null
  reviewText: string
  generatedText: string
  publishedText?: string | null
  status?: ReviewResponseStatus
  version?: number
  lastSyncedAt?: Date | null
  publishedAt?: Date | null
  publishedBy?: string | null
  editedByUser?: boolean
  rating?: number | null
  reviewSource?: string
}

export async function upsertReviewResponse(input: ReviewResponsePersistenceInput) {
  const existing = await prisma.reviewResponse.findUnique({
    where: {
      businessId_reviewId: {
        businessId: input.businessId,
        reviewId: input.reviewId,
      },
    },
  })

  if (existing) {
    return prisma.reviewResponse.update({
      where: { id: existing.id },
      data: {
        googleReviewId: input.googleReviewId ?? existing.googleReviewId,
        reviewText: input.reviewText,
        generatedText: input.generatedText,
        publishedText: input.publishedText ?? existing.publishedText,
        status: input.status ?? existing.status,
        version: input.version ?? existing.version,
        lastSyncedAt: input.lastSyncedAt ?? existing.lastSyncedAt,
        publishedAt: input.publishedAt ?? existing.publishedAt,
        publishedBy: input.publishedBy ?? existing.publishedBy,
        editedByUser: input.editedByUser ?? existing.editedByUser,
        rating: input.rating ?? existing.rating ?? null,
        reviewSource: input.reviewSource ?? existing.reviewSource,
      },
    })
  }

  return prisma.reviewResponse.create({
    data: {
      businessId: input.businessId,
      reviewId: input.reviewId,
      googleReviewId: input.googleReviewId ?? null,
      reviewText: input.reviewText,
      generatedText: input.generatedText,
      publishedText: input.publishedText ?? null,
      status: input.status ?? "GENERATED",
      version: input.version ?? 1,
      lastSyncedAt: input.lastSyncedAt ?? null,
      publishedAt: input.publishedAt ?? null,
      publishedBy: input.publishedBy ?? null,
      editedByUser: input.editedByUser ?? false,
      rating: input.rating ?? null,
      reviewSource: input.reviewSource ?? "mock",
    },
  })
}

export async function listReviewResponsesForBusiness(businessId: string) {
  return prisma.reviewResponse.findMany({
    where: { businessId },
    orderBy: { updatedAt: "desc" },
  })
}
