"use client"

import { Review } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface AlertsSectionProps {
  reviews: Review[]
  onGenerateResponse?: (reviewId: string) => void
}

export function AlertsSection({
  reviews,
  onGenerateResponse,
}: AlertsSectionProps) {
  // Filtrar reseñas negativas sin responder
  const negativeReviews = reviews.filter(
    (r) => r.rating <= 2 && !r.hasResponse
  )

  if (negativeReviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="inline-flex p-3 bg-green-500/20 rounded-lg mb-3">
          <AlertTriangle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-muted-foreground">
          ¡Excelente! No hay reseñas negativas sin responder.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        Atención requerida
      </h2>

      <div className="space-y-3">
        {negativeReviews.map((review) => (
          <Card key={review.id} className="p-4 border-amber-500/20 bg-amber-500/5">
            <div className="space-y-3">
              {/* Header con rating y fecha */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating
                            ? "text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {review.rating}/5 estrellas
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(review.createdAt, {
                    locale: es,
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Nombre del reviewer */}
              <div className="flex items-center gap-2">
                {review.reviewerImage && (
                  <img
                    src={review.reviewerImage}
                    alt={review.reviewerName}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <p className="text-sm font-medium text-foreground">
                  {review.reviewerName}
                </p>
              </div>

              {/* Texto de la reseña */}
              <p className="text-sm text-foreground leading-relaxed">
                {review.text}
              </p>

              {/* Botón para generar respuesta */}
              <Button
                onClick={() => onGenerateResponse?.(review.id)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                Generar respuesta
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
