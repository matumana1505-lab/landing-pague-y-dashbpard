import { NextResponse } from "next/server"
import { requireSessionUser } from "@/lib/auth/require-session"
import { getBusinessForUser } from "@/lib/services/business-service"
import { listReviewResponsesForBusiness } from "@/lib/services/review-response-service"
import type { ReviewResponsesResponse } from "@/lib/types"

export async function GET(request: Request) {
  const session = await requireSessionUser()
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get("businessId")

  if (!businessId) {
    return NextResponse.json({ error: "businessId es requerido" }, { status: 400 })
  }

  const business = await getBusinessForUser(session.user.id, businessId)
  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 })
  }

  const responses = await listReviewResponsesForBusiness(businessId)
  const payload: ReviewResponsesResponse = {
    responses: responses.map((response) => ({
      id: response.id,
      businessId: response.businessId,
      reviewId: response.reviewId,
      googleReviewId: response.googleReviewId,
      reviewText: response.reviewText,
      generatedText: response.generatedText,
      publishedText: response.publishedText,
      status: response.status,
      version: response.version,
      lastSyncedAt: response.lastSyncedAt ? response.lastSyncedAt.toISOString() : null,
      publishedAt: response.publishedAt ? response.publishedAt.toISOString() : null,
      publishedBy: response.publishedBy,
      editedByUser: response.editedByUser,
      rating: response.rating,
      reviewSource: response.reviewSource,
      createdAt: response.createdAt.toISOString(),
      updatedAt: response.updatedAt.toISOString(),
    })),
  }

  return NextResponse.json(payload)
}
