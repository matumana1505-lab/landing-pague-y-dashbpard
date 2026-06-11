"use client"

import { Review } from "@/lib/types"
import { ReviewCard } from "./review-card"

interface ReviewsListProps {
  reviews: Review[]
  onViewResponse?: (reviewId: string) => void
}

export function ReviewsList({ reviews, onViewResponse }: ReviewsListProps) {
  // Ordenar por fecha descendente
  const sortedReviews = [...reviews].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-3">
      {sortedReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onViewResponse={onViewResponse}
        />
      ))}
    </div>
  )
}
