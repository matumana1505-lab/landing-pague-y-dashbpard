"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Loader2 } from "lucide-react"
import type { PersistedBusiness } from "@/lib/types"

interface BusinessSwitcherProps {
  businesses: PersistedBusiness[]
  activeBusinessId: string | null
  isLoading?: boolean
  onBusinessChange: (businessId: string) => void
}

export function BusinessSwitcher({
  businesses,
  activeBusinessId,
  isLoading = false,
  onBusinessChange,
}: BusinessSwitcherProps) {
  const [value, setValue] = useState(activeBusinessId ?? "")

  useEffect(() => {
    setValue(activeBusinessId ?? "")
  }, [activeBusinessId])

  if (businesses.length <= 1) {
    const single = businesses[0]
    if (!single) return null

    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
          {single.name}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
      <Select
        value={value}
        onValueChange={(next) => {
          setValue(next)
          onBusinessChange(next)
        }}
      >
        <SelectTrigger className="w-full max-w-[260px] h-9">
          <SelectValue placeholder="Seleccionar negocio" />
        </SelectTrigger>
        <SelectContent>
          {businesses.map((business) => (
            <SelectItem key={business.id} value={business.id}>
              {business.name}
              {business.isDemo ? " (Demo)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
