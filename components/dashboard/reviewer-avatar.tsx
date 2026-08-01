const AVATAR_COLORS = [
  "bg-blue-500/20 text-blue-300",
  "bg-purple-500/20 text-purple-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-amber-500/20 text-amber-300",
  "bg-pink-500/20 text-pink-300",
  "bg-cyan-500/20 text-cyan-300",
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColorForName(name: string): string {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

const SIZE_CLASSES = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
}

interface ReviewerAvatarProps {
  name: string
  photoUrl?: string | null
  size?: keyof typeof SIZE_CLASSES
}

export function ReviewerAvatar({ name, photoUrl, size = "sm" }: ReviewerAvatarProps) {
  const sizeClass = SIZE_CLASSES[size]

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className={`flex-shrink-0 rounded-full object-cover ${sizeClass}`}
      />
    )
  }

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-semibold ${getColorForName(name)} ${sizeClass}`}
    >
      {getInitials(name)}
    </div>
  )
}
