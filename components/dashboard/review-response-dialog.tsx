"use client"

import { Review } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle2 } from "lucide-react"

interface ReviewResponseDialogProps {
  review: Review | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewResponseDialog({
  review,
  open,
  onOpenChange,
}: ReviewResponseDialogProps) {
  if (!review) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reseña y respuesta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Review */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span>Reseña de {review.reviewerName}</span>
            </h3>

            <div className="p-4 bg-secondary/50 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating
                          ? "text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(review.createdAt, {
                    locale: es,
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground">{review.text}</p>
            </div>
          </div>

          {/* Response */}
          {review.hasResponse && review.response && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                Respuesta de Resply
              </h3>

              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Tu negocio respondió
                  </span>
                  {review.responseDate && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(review.responseDate, {
                        locale: es,
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground">{review.response}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
