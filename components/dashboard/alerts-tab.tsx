import { AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { DashboardReview } from "@/lib/types"
import { StarRating } from "@/components/dashboard/star-rating"

interface AlertsTabProps {
  reviews: DashboardReview[]
}

export function AlertsTab({ reviews }: AlertsTabProps) {
  const alerts = reviews
    .filter((r) => r.rating <= 2)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="p-6">
      <h2 className="mb-1 text-lg font-semibold text-white">Alertas</h2>
      <p className="mb-5 text-xs text-gray-500">Historial de reseñas negativas que dispararon una alerta.</p>

      {alerts.length === 0 ? (
        <p className="text-sm text-gray-500">No hay alertas por el momento.</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((review) => (
            <div
              key={review.id}
              className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white">Reseña negativa de {review.reviewerName}</p>
                  <span className="flex-shrink-0 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(review.createdAt), { locale: es, addSuffix: true })}
                  </span>
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-1 line-clamp-2 text-xs text-gray-400">{review.reviewText}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
