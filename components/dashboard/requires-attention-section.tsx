"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, Edit2, MessageSquare } from "lucide-react"
import { Review } from "@/lib/types"
import { generateReviewResponse } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface RequiresAttentionSectionProps {
  reviews: Review[]
  tone: "cercano" | "professional" | "formal"
  businessId: string | null
  businessName: string
  additionalInstructions?: string
  onApproveResponse?: (reviewId: string, response: string) => void
  onRejectResponse?: (reviewId: string) => void
  onGenerateResponse?: (reviewId: string, response: string) => void
}

interface ReviewDialogState {
  isOpen: boolean
  reviewId: string | null
  response: string
  mode: "view" | "edit" | "manual"
}

export function RequiresAttentionSection({
  reviews,
  tone,
  businessId,
  businessName,
  additionalInstructions,
  onApproveResponse,
  onRejectResponse,
  onGenerateResponse,
}: RequiresAttentionSectionProps) {
  const [dialogState, setDialogState] = useState<ReviewDialogState>({
    isOpen: false,
    reviewId: null,
    response: "",
    mode: "view",
  })

  const negativeReviews = reviews.filter((r) => r.rating <= 2)

  if (negativeReviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">¡Sin reseñas que requieran atención!</h3>
        <p className="text-slate-600">
          Todas tus reseñas negativas han sido respondidas. Mantén la calidad de tu servicio.
        </p>
      </Card>
    )
  }

  const openDialog = (review: Review, mode: "view" | "edit" | "manual" = "view") => {
    setDialogState({
      isOpen: true,
      reviewId: review.id,
      response: review.response ?? "",
      mode,
    })
  }

  const handleApprove = () => {
    if (dialogState.reviewId && onApproveResponse) {
      onApproveResponse(dialogState.reviewId, dialogState.response)
      setDialogState({ isOpen: false, reviewId: null, response: "", mode: "view" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold text-slate-900">Requieren atención</h2>
        <span className="ml-auto bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
          {negativeReviews.length} reseña{negativeReviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-4">
        {negativeReviews.map((review) => {
          const stars = Array(5)
            .fill(0)
            .map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? "text-yellow-400 fill-current" : "text-slate-300 fill-current"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))

          return (
            <Card key={review.id} className="p-6 border-l-4 border-l-red-600 hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Información de la reseña */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{review.reviewerName}</h3>
                      <p className="text-sm text-slate-600">
                        {review.createdAt.toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="flex gap-0.5">{stars}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-700">{review.text}</p>
                  </div>

                  {/* Respuesta sugerida */}
                  {!review.hasResponse && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                        Respuesta sugerida por IA
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-slate-700">{review.response ?? "Aún no se ha generado una respuesta."}</p>
                      </div>
                    </div>
                  )}

                  {review.hasResponse && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Tu respuesta</p>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-slate-700">{review.response}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                {!review.hasResponse && (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={async () => {
                        if (review.response) {
                          openDialog(review, "view")
                          return
                        }

                        if (!businessId) return

                        try {
                          const data = await generateReviewResponse({
                            review: review.text,
                            businessId,
                            businessName,
                            rating: review.rating,
                            tone,
                            additionalInstructions,
                            reviewId: review.id,
                            reviewSource: "mock",
                          })

                          onGenerateResponse?.(review.id, data.response)
                          openDialog(review, "view")
                        } catch {
                          // El error se maneja en la UI si se desea en una iteración futura.
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full"
                    >
                      <Check className="h-4 w-4" />
                      {review.response ? "Regenerar respuesta IA" : "Generar respuesta IA"}
                    </Button>
                    <Button
                      onClick={() => openDialog(review, "edit")}
                      variant="outline"
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => openDialog(review, "manual")}
                      variant="outline"
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Manual
                    </Button>
                  </div>
                )}

                {review.hasResponse && (
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-600">Respondida</p>
                      <p className="text-xs text-slate-500">
                        {review.responseDate?.toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Dialog para aprobar/editar respuesta */}
      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && setDialogState({ isOpen: false, reviewId: null, response: "", mode: "view" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === "view" && "Aprobar respuesta"}
              {dialogState.mode === "edit" && "Editar respuesta"}
              {dialogState.mode === "manual" && "Responder manualmente"}
            </DialogTitle>
            <DialogDescription>
              {dialogState.mode === "view" &&
                "Revisa la respuesta sugerida antes de publicarla."}
              {dialogState.mode === "edit" &&
                "Personaliza la respuesta sugerida antes de publicarla."}
              {dialogState.mode === "manual" &&
                "Escribe tu propia respuesta."}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={dialogState.response}
            onChange={(e) =>
              setDialogState((prev) => ({
                ...prev,
                response: e.target.value,
              }))
            }
            placeholder="Escribe tu respuesta aquí..."
            className="min-h-32"
            readOnly={dialogState.mode === "view"}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDialogState({
                  isOpen: false,
                  reviewId: null,
                  response: "",
                  mode: "view",
                })
              }
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Publicar respuesta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
