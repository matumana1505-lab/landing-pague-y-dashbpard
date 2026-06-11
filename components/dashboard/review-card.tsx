"use client"

import { Review } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle2, Clock } from "lucide-react"

interface ReviewCardProps {
  review: Review
  onViewResponse?: (reviewId: string) => void
}

export function ReviewCard({ review, onViewResponse }: ReviewCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500/10 text-green-700 dark:text-green-400"
    if (rating >= 3) return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    return "bg-red-500/10 text-red-700 dark:text-red-400"
  }

  return (
    <Card className="p-4 hover:bg-card/80 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {review.reviewerImage && (
              <img
                src={review.reviewerImage}
                alt={review.reviewerName}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">
                {review.reviewerName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(review.createdAt, {
                  locale: es,
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-1 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < review.rating ? "text-yellow-400" : "text-muted-foreground/30"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Reseña */}
        <p className="text-sm text-foreground line-clamp-2">{review.text}</p>

        {/* Status y botón */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={`${getRatingColor(review.rating)} border-0`}
          >
            {review.hasResponse ? (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Respondida
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pendiente
              </div>
            )}
          </Badge>
          {review.hasResponse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewResponse?.(review.id)}
              className="text-xs h-6 px-2"
            >
              Ver respuesta
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
