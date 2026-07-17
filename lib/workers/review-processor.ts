import { prisma } from "@/lib/prisma"
import { generateReviewResponse } from "@/lib/ai/gemini"
import type { GoogleBusinessClient } from "@/lib/google-business/client"

export async function processReviewsForAllBusinesses(
  client: GoogleBusinessClient
): Promise<void> {
  const businesses = await prisma.business.findMany({
    where: { isDemo: false },
    include: { aiConfig: true },
  })

  for (const business of businesses) {
    try {
      await processReviewsForBusiness(client, business)
    } catch (error) {
      console.error(`Error procesando reseñas para ${business.name}:`, error)
    }
  }
}

async function processReviewsForBusiness(
  client: GoogleBusinessClient,
  business: {
    id: string
    name: string
    googleLocationId: string
    aiConfig: {
      tone: string
      additionalInstructions: string
      autoRespond: boolean
      alertNegativeReviews: boolean
    } | null
  }
): Promise<void> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const reviews = await client.getNewReviews(business.googleLocationId, since)

  for (const review of reviews) {
    const exists = await prisma.reviewResponse.findUnique({
      where: {
        businessId_reviewId: {
          businessId: business.id,
          reviewId: review.googleReviewId,
        },
      },
    })

    if (exists) continue

    const generatedText = await generateReviewResponse({
      review: review.text,
      rating: review.rating,
      tone: business.aiConfig?.tone as "cercano" | "professional" | "formal",
      additionalInstructions: business.aiConfig?.additionalInstructions,
      businessName: business.name,
    })

    const shouldAutoPublish =
      business.aiConfig?.autoRespond && review.rating >= 2

    const shouldAlert =
      business.aiConfig?.alertNegativeReviews && review.rating === 1

    await prisma.reviewResponse.create({
      data: {
        businessId: business.id,
        reviewId: review.googleReviewId,
        googleReviewId: review.googleReviewId,
        reviewText: review.text,
        generatedText,
        rating: review.rating,
        reviewSource: "google",
        status: shouldAutoPublish ? "APPROVED" : "GENERATED",
      },
    })

    if (shouldAutoPublish) {
      await client.publishResponse(
        business.googleLocationId,
        review.googleReviewId,
        generatedText
      )

      await prisma.reviewResponse.update({
        where: {
          businessId_reviewId: {
            businessId: business.id,
            reviewId: review.googleReviewId,
          },
        },
        data: {
          status: "PUBLISHED",
          publishedText: generatedText,
          publishedAt: new Date(),
        },
      })
    }

    if (shouldAlert) {
      console.log(
        `[ALERTA] Reseña negativa de ${review.reviewerName} para ${business.name}`
      )
    }
  }
}
