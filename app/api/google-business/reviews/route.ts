import { NextRequest, NextResponse } from "next/server"
import {
  LEGACY_MYBUSINESS_BASE,
  googleFetch,
  requireGoogleAccessToken,
} from "@/lib/google-business"

interface RawReview {
  reviewId?: string
  reviewer?: { displayName?: string; profilePhotoUrl?: string }
  starRating?: "STAR_RATING_UNSPECIFIED" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
  comment?: string
  createTime?: string
  updateTime?: string
  reviewReply?: { comment?: string; updateTime?: string }
}

const STAR_MAP: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

export async function GET(request: NextRequest) {
  const guard = await requireGoogleAccessToken()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }
  const { accessToken } = guard

  const accountId = request.nextUrl.searchParams.get("accountId")
  const locationId = request.nextUrl.searchParams.get("locationId")

  if (!accountId || !locationId) {
    return NextResponse.json(
      { error: "Faltan los parámetros 'accountId' y/o 'locationId'." },
      { status: 400 },
    )
  }

  try {
    
    // Reviews are only available on the legacy My Business v4 API and require
    // the fully-qualified accounts/{id}/locations/{id} parent.
    const result = await googleFetch<{
      reviews?: RawReview[]
      averageRating?: number
      totalReviewCount?: number
    }>(
      `${LEGACY_MYBUSINESS_BASE}/accounts/${accountId}/locations/${locationId}/reviews`,
      accessToken,
      `reviews.list(accounts/${accountId}/locations/${locationId})`,
    )

    if (!result.ok) {
      return NextResponse.json(
        {
          error: "No se pudieron cargar las reseñas de Google Business Profile.",
          status: result.status,
          details: result.body,
        },
        { status: result.status },
      )
    }

    const reviews = Array.isArray(result.body.reviews)
      ? result.body.reviews.map((review) => ({
          id: review.reviewId ?? "",
          rating: review.starRating ? STAR_MAP[review.starRating] ?? 0 : 0,
          text: review.comment ?? "",
          reviewerName: review.reviewer?.displayName ?? "Cliente de Google",
          reviewerImage: review.reviewer?.profilePhotoUrl ?? "",
          createdAt: review.createTime ?? review.updateTime ?? null,
          hasResponse: Boolean(review.reviewReply?.comment),
          response: review.reviewReply?.comment ?? "",
          responseDate: review.reviewReply?.updateTime ?? null,
        }))
      : []

    return NextResponse.json({
      reviews,
      averageRating: result.body.averageRating ?? 0,
      totalReviewCount: result.body.totalReviewCount ?? reviews.length,
    })
  } catch {
    return NextResponse.json(
      { error: "Error interno al obtener las reseñas de Google Business Profile." },
      { status: 500 },
    )
  }
}
