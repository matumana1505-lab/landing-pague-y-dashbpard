interface StarRatingProps {
  rating: number
  size?: "sm" | "md"
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const textSize = size === "md" ? "text-sm" : "text-xs"

  return (
    <div className={`flex gap-0.5 ${textSize}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-gray-700"}>
          ★
        </span>
      ))}
    </div>
  )
}
