"use client"

import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  variant?: "default" | "highlight" | "warning"
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    highlight: "bg-primary/5 border-primary/20",
    warning: "bg-amber-500/5 border-amber-500/20",
  }

  return (
    <Card className={`p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl sm:text-4xl font-bold text-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-lg ${
              variant === "highlight"
                ? "bg-primary/20"
                : variant === "warning"
                  ? "bg-amber-500/20"
                  : "bg-secondary"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                variant === "highlight"
                  ? "text-primary"
                  : variant === "warning"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
              }`}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
