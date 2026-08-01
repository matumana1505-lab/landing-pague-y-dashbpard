"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { DashboardReview } from "@/lib/types"
import { StarRating } from "@/components/dashboard/star-rating"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { ReviewerAvatar } from "@/components/dashboard/reviewer-avatar"
import { ReviewDetail } from "@/components/dashboard/review-detail"

interface ReviewInboxProps {
  reviews: DashboardReview[]
  isDemo: boolean
  businessId: string | null
  onResponseGenerated: (reviewId: string, generatedText: string) => void
}

export function ReviewInbox({ reviews, isDemo, businessId, onResponseGenerated }: ReviewInboxProps) {
  const [selectedId, setSelectedId] = useState<string | null>(reviews[0]?.id ?? null)

  useEffect(() => {
    if (!reviews.some((r) => r.id === selectedId)) {
      setSelectedId(reviews[0]?.id ?? null)
    }
  }, [reviews, selectedId])

  const selected = reviews.find((r) => r.id === selectedId) ?? null

  if (reviews.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-500">
        Todavía no hay reseñas para mostrar.
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-white/[0.06]">
        {reviews.map((review) => {
          const isSelected = review.id === selectedId
          return (
            <button
              key={review.id}
              type="button"
              onClick={() => setSelectedId(review.id)}
              className={`block w-full border-b border-white/[0.06] border-l-2 px-4 py-3 text-left transition-colors ${
                isSelected ? "border-l-blue-500 bg-blue-600/10" : "border-l-transparent hover:bg-white/5"
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <ReviewerAvatar name={review.reviewerName} photoUrl={review.reviewerPhotoUrl} size="sm" />
                  <span className="truncate text-sm font-medium text-white">{review.reviewerName}</span>
                </div>
                <StatusBadge rating={review.rating} status={review.status} />
              </div>
              <StarRating rating={review.rating} />
              <p className="mt-1.5 line-clamp-2 text-xs text-gray-400">{review.reviewText}</p>
              <p className="mt-1.5 text-[11px] text-gray-600">
                {formatDistanceToNow(new Date(review.createdAt), { locale: es, addSuffix: true })}
              </p>
            </button>
          )
        })}
      </div>

      <ReviewDetail review={selected} isDemo={isDemo} businessId={businessId} onResponseGenerated={onResponseGenerated} />
    </div>
  )
}
