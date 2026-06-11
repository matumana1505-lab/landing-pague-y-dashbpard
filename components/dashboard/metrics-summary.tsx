"use client"

import { DashboardMetrics } from "@/lib/types"
import { MetricCard } from "./metric-card"
import { MessageSquare, Star, AlertCircle, Clock } from "lucide-react"

interface MetricsSummaryProps {
  metrics: DashboardMetrics
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total de reseñas"
        value={metrics.totalReviews}
        icon={MessageSquare}
        variant="default"
      />
      <MetricCard
        title="Calificación promedio"
        value={metrics.averageRating.toFixed(1)}
        subtitle="sobre 5"
        icon={Star}
        variant="highlight"
      />
      <MetricCard
        title="Sin responder"
        value={metrics.unansweredReviews}
        icon={Clock}
        variant="default"
      />
      <MetricCard
        title="Negativas pendientes"
        value={metrics.negativeReviewsPending}
        icon={AlertCircle}
        variant="warning"
      />
    </div>
  )
}
