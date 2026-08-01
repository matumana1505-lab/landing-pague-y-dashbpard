"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { MetricsSummary } from "@/components/dashboard/metrics-summary"
import { ReviewsList } from "@/components/dashboard/reviews-list"
import { ReviewResponseDialog } from "@/components/dashboard/review-response-dialog"
import { Review, DashboardMetrics } from "@/lib/types"

const now = Date.now()
const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000)

const demoReviews: Review[] = [
  {
    id: "demo_1",
    rating: 5,
    text: "¡Excelente atención! Pedí una consulta urgente y me respondieron el mismo día. Súper recomendable.",
    reviewerName: "Lucía Fernández",
    reviewerImage: "https://i.pravatar.cc/100?img=21",
    createdAt: daysAgo(1),
    hasResponse: true,
    response: "¡Gracias Lucía! Nos alegra mucho haberte podido ayudar rápido. Te esperamos la próxima vez 😊",
    responseDate: daysAgo(1),
  },
  {
    id: "demo_2",
    rating: 5,
    text: "Muy buena experiencia en general, aunque el tiempo de espera fue un poco más largo de lo esperado.",
    reviewerName: "Martín Gómez",
    reviewerImage: "https://i.pravatar.cc/100?img=32",
    createdAt: daysAgo(2),
    hasResponse: true,
    response: "¡Hola Martín! Gracias por tu comentario, estamos trabajando para reducir los tiempos de espera. ¡Te esperamos pronto!",
    responseDate: daysAgo(2),
  },
  {
    id: "demo_3",
    rating: 5,
    text: "El mejor servicio de la zona. El equipo es muy profesional y atento a los detalles.",
    reviewerName: "Camila Torres",
    reviewerImage: "https://i.pravatar.cc/100?img=45",
    createdAt: daysAgo(3),
    hasResponse: true,
    response: "¡Muchas gracias Camila! Nos esforzamos todos los días para brindar la mejor experiencia. ¡Nos vemos pronto!",
    responseDate: daysAgo(3),
  },
  {
    id: "demo_4",
    rating: 4,
    text: "Todo bien, pero esperaba un poco más por las reseñas que había leído. Nada grave igual.",
    reviewerName: "Diego Ramírez",
    createdAt: daysAgo(4),
    hasResponse: false,
  },
  {
    id: "demo_5",
    rating: 5,
    text: "Increíble atención de principio a fin. Se nota que les importa el cliente. ¡Volveré seguro!",
    reviewerName: "Sofía Molina",
    reviewerImage: "https://i.pravatar.cc/100?img=47",
    createdAt: daysAgo(5),
    hasResponse: true,
    response: "¡Gracias por tus palabras, Sofía! Nos encanta saber que tuviste una gran experiencia. ¡Te esperamos de nuevo!",
    responseDate: daysAgo(5),
  },
  {
    id: "demo_6",
    rating: 5,
    text: "Excelente relación calidad-precio y muy buena predisposición del personal para resolver dudas.",
    reviewerName: "Nicolás Herrera",
    reviewerImage: "https://i.pravatar.cc/100?img=51",
    createdAt: daysAgo(6),
    hasResponse: true,
    response: "¡Gracias Nicolás! Valoramos mucho tu confianza. Cualquier duda que tengas, contanos y te ayudamos encantados.",
    responseDate: daysAgo(6),
  },
  {
    id: "demo_7",
    rating: 3,
    text: "No fue lo que esperaba, tuve que volver a contactar varias veces para resolver mi consulta.",
    reviewerName: "Valentina Ríos",
    reviewerImage: "https://i.pravatar.cc/100?img=57",
    createdAt: daysAgo(7),
    hasResponse: true,
    response: "Hola Valentina, lamentamos mucho la demora. Ya estamos revisando internamente qué pasó para que no vuelva a suceder. Gracias por avisarnos.",
    responseDate: daysAgo(6),
  },
  {
    id: "demo_8",
    rating: 5,
    text: "Un lujo de lugar. Personal amable, buena onda y resultados excelentes. 100% recomendado.",
    reviewerName: "Tomás Acosta",
    reviewerImage: "https://i.pravatar.cc/100?img=60",
    createdAt: daysAgo(8),
    hasResponse: true,
    response: "¡Muchas gracias Tomás! Nos hace muy felices leer esto. ¡Esperamos verte pronto de nuevo!",
    responseDate: daysAgo(8),
  },
]

const demoMetrics: DashboardMetrics = {
  totalReviews: demoReviews.length,
  averageRating:
    demoReviews.reduce((sum, review) => sum + review.rating, 0) / demoReviews.length,
  unansweredReviews: demoReviews.filter((r) => !r.hasResponse).length,
  negativeReviewsPending: demoReviews.filter((r) => r.rating <= 2 && !r.hasResponse).length,
}

export function DemoDashboard() {
  const { toast } = useToast()
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showResponseDialog, setShowResponseDialog] = useState(false)

  const handleViewResponse = (reviewId: string) => {
    const review = demoReviews.find((r) => r.id === reviewId)
    if (review) {
      setSelectedReview(review)
      setShowResponseDialog(true)
    }
  }

  const handleConnectClick = () => {
    toast({
      title: "Próximamente disponible",
      description: "La conexión con Google Business estará disponible muy pronto.",
    })
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-sm">
          🎮 MODO DEMO
        </span>
      </div>

      <div className="border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-blue-100 text-center sm:text-left">
            Estás viendo datos de ejemplo · Conectá tu Google Business para empezar tu trial de 14 días gratis
          </p>
          <button
            type="button"
            onClick={handleConnectClick}
            className="shrink-0 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
          >
            Conectar mi negocio →
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Tu Negocio (Demo)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Así se ve tu dashboard una vez que conectás tu negocio real.
            </p>
            <MetricsSummary metrics={demoMetrics} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Reseñas de ejemplo ({demoReviews.length})
            </h2>
            <ReviewsList reviews={demoReviews} onViewResponse={handleViewResponse} />
          </div>
        </div>
      </main>

      <ReviewResponseDialog
        review={selectedReview}
        open={showResponseDialog}
        onOpenChange={setShowResponseDialog}
      />
    </>
  )
}
