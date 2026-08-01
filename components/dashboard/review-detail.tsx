"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, Sparkles } from "lucide-react"
import type { DashboardReview } from "@/lib/types"
import { generateReviewResponse } from "@/lib/api-client"
import { StarRating } from "@/components/dashboard/star-rating"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { ReviewerAvatar } from "@/components/dashboard/reviewer-avatar"

interface ReviewDetailProps {
  review: DashboardReview | null
  isDemo: boolean
  businessId: string | null
  onResponseGenerated: (reviewId: string, generatedText: string) => void
}

export function ReviewDetail({ review, isDemo, businessId, onResponseGenerated }: ReviewDetailProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  if (!review) {
    return (
      <div className="flex flex-1 items-center justify-center p-5 text-sm text-gray-500">
        Seleccioná una reseña de la lista para ver el detalle.
      </div>
    )
  }

  const isPublished = review.status === "PUBLISHED" || review.status === "APPROVED"
  const displayedResponse = isPublished ? review.publishedText : review.generatedText

  const handleGenerate = async () => {
    if (!businessId || isDemo) return
    setIsGenerating(true)
    setGenError(null)
    try {
      const result = await generateReviewResponse({
        businessId,
        reviewId: review.id,
        review: review.reviewText,
        rating: review.rating,
      })
      onResponseGenerated(review.id, result.response)
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "No se pudo generar la respuesta")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ReviewerAvatar name={review.reviewerName} photoUrl={review.reviewerPhotoUrl} size="lg" />
          <div>
            <p className="font-medium text-white">{review.reviewerName}</p>
            <StarRating rating={review.rating} size="md" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(review.createdAt), { locale: es, addSuffix: true })}
          </span>
          <StatusBadge rating={review.rating} status={review.status} />
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white/5 p-4">
        <p className="text-sm leading-relaxed text-gray-300">{review.reviewText}</p>
      </div>

      {displayedResponse ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {isPublished ? (
              <span className="rounded-full border border-emerald-700/40 bg-emerald-700/20 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                Publicada ✓
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">
                <Sparkles className="h-3 w-3" /> Generada por IA
              </span>
            )}
          </div>
          <div
            className={`rounded-xl border p-4 ${
              isPublished ? "border-emerald-700/30 bg-emerald-700/10" : "border-blue-500/20 bg-blue-600/10"
            }`}
          >
            <p className="text-sm leading-relaxed text-gray-200">{displayedResponse}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Todavía no hay una respuesta generada para esta reseña.</p>
      )}

      {!isPublished && (
        <div className="mt-5">
          {isDemo ? (
            <p className="text-xs text-gray-600">Conectá tu negocio real para generar respuestas con IA.</p>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !businessId}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
              {displayedResponse ? "Regenerar respuesta con IA" : "Generar respuesta con IA"}
            </button>
          )}
          {genError && <p className="mt-2 text-xs text-red-400">{genError}</p>}
        </div>
      )}
    </div>
  )
}
