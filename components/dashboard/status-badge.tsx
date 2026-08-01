import type { ReviewResponseStatus } from "@/lib/types"

interface StatusBadgeProps {
  rating: number
  status: ReviewResponseStatus
}

const PUBLISHED_STATUSES: ReviewResponseStatus[] = ["PUBLISHED", "APPROVED"]

type Category = "new" | "responded" | "negative"

const CATEGORY_STYLES: Record<Category, { className: string; label: string }> = {
  new: { className: "bg-blue-500/15 text-blue-400 border-blue-500/30", label: "NUEVA" },
  responded: { className: "bg-emerald-700/20 text-emerald-400 border-emerald-700/40", label: "✓" },
  negative: { className: "bg-red-500/15 text-red-400 border-red-500/30", label: "⚠" },
}

export function getReviewCategory(rating: number, status: ReviewResponseStatus): Category {
  const isPublished = PUBLISHED_STATUSES.includes(status)
  if (rating <= 2 && !isPublished) return "negative"
  if (isPublished) return "responded"
  return "new"
}

export function StatusBadge({ rating, status }: StatusBadgeProps) {
  const category = getReviewCategory(rating, status)
  const { className, label } = CATEGORY_STYLES[category]

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${className}`}>
      {label}
    </span>
  )
}
