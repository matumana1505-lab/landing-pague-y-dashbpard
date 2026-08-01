import { MessageSquare, Star, Clock, AlertCircle } from "lucide-react"
import type { DashboardReview } from "@/lib/types"
import { getReviewCategory } from "@/components/dashboard/status-badge"

interface StatsTabProps {
  reviews: DashboardReview[]
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof MessageSquare
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0f1628] p-5">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  )
}

export function StatsTab({ reviews }: StatsTabProps) {
  const total = reviews.length
  const averageRating = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total
  const unanswered = reviews.filter((r) => getReviewCategory(r.rating, r.status) !== "responded").length
  const negativePending = reviews.filter((r) => getReviewCategory(r.rating, r.status) === "negative").length

  return (
    <div className="p-6">
      <h2 className="mb-5 text-lg font-semibold text-white">Estadísticas</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={MessageSquare}
          label="Total de reseñas"
          value={String(total)}
          accent="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Star}
          label="Calificación promedio"
          value={averageRating.toFixed(1)}
          accent="bg-yellow-500/10 text-yellow-400"
        />
        <StatCard
          icon={Clock}
          label="Sin responder"
          value={String(unanswered)}
          accent="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          icon={AlertCircle}
          label="Negativas pendientes"
          value={String(negativePending)}
          accent="bg-red-500/10 text-red-400"
        />
      </div>
    </div>
  )
}
