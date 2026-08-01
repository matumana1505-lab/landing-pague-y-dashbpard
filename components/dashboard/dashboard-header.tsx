"use client"

import { useSession } from "next-auth/react"
import { BusinessProfile, PersistedBusiness } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { BusinessSwitcher } from "@/components/dashboard/business-switcher"

interface DashboardHeaderProps {
  businessProfile: BusinessProfile
  businesses?: PersistedBusiness[]
  activeBusinessId?: string | null
  isDemo?: boolean
  onBusinessChange?: (businessId: string) => void
  onConnectClick?: () => void
}

export function DashboardHeader({
  businessProfile,
  businesses = [],
  activeBusinessId = null,
  isDemo = false,
  onBusinessChange,
  onConnectClick,
}: DashboardHeaderProps) {
  const { data: session } = useSession()

  return (
    <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-white/[0.02]">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Resply Dashboard</p>
              <p className="truncate text-lg font-semibold text-white">{businessProfile.name}</p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            {isDemo && (
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                🎮 MODO DEMO
              </span>
            )}

            {businesses.length > 0 && onBusinessChange && (
              <div className="dark">
                <BusinessSwitcher
                  businesses={businesses}
                  activeBusinessId={activeBusinessId}
                  onBusinessChange={onBusinessChange}
                />
              </div>
            )}

            {businessProfile.isConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-700/20 px-3 py-1.5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-sm text-emerald-400">Conectado</span>
                </div>
                {session?.user && (
                  <div className="hidden text-right md:block">
                    <p className="text-xs text-gray-500">{session.user.name || "Cuenta conectada"}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                )}
                {businessProfile.lastSyncedAt && (
                  <p className="hidden text-xs text-gray-500 lg:block">
                    Sync hace {formatDistanceToNow(businessProfile.lastSyncedAt, { locale: es, addSuffix: false })}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-sm text-red-400">No conectado</span>
                </div>
                <button
                  type="button"
                  onClick={onConnectClick}
                  className="rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  Conectar Google
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
