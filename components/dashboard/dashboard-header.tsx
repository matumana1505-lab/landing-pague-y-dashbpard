"use client"

import { useSession } from "next-auth/react"
import { BusinessProfile, PersistedBusiness } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { BusinessSwitcher } from "@/components/dashboard/business-switcher"

interface DashboardHeaderProps {
  businessProfile: BusinessProfile
  businesses?: PersistedBusiness[]
  activeBusinessId?: string | null
  onBusinessChange?: (businessId: string) => void
  onConnectClick?: () => void
}

export function DashboardHeader({
  businessProfile,
  businesses = [],
  activeBusinessId = null,
  onBusinessChange,
  onConnectClick,
}: DashboardHeaderProps) {
  const { data: session } = useSession()

  return (
    <div className="border-b border-border bg-card/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Resply Dashboard</p>
              <p className="text-lg font-semibold text-foreground truncate">
                {businessProfile.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
            {businesses.length > 0 && onBusinessChange && (
              <BusinessSwitcher
                businesses={businesses}
                activeBusinessId={activeBusinessId}
                onBusinessChange={onBusinessChange}
              />
            )}

            {businessProfile.isConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Conectado
                  </span>
                </div>
                {session?.user && (
                  <div className="hidden md:block text-right">
                    <p className="text-xs text-muted-foreground">
                      {session.user.name || "Cuenta conectada"}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                )}
                {businessProfile.lastSyncedAt && (
                  <p className="text-xs text-muted-foreground hidden lg:block">
                    Sync hace{" "}
                    {formatDistanceToNow(businessProfile.lastSyncedAt, {
                      locale: es,
                      addSuffix: false,
                    })}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-700 dark:text-red-400">
                    No conectado
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={onConnectClick}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Conectar Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
