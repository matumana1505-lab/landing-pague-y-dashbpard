"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { fetchUserProfile, fetchBusinesses, setActiveBusiness } from "@/lib/api-client"
import { Loader2, Inbox, BarChart3, Sparkles, FileWarning, Bell } from "lucide-react"

export type DashboardTab = "inbox" | "stats" | "ai-config" | "complaints" | "alerts"

type DashboardContextType = {
  sessionStatus: "loading" | "authenticated" | "unauthenticated"
  user?: any
  userProfile?: any
  businesses: any[]
  activeBusinessId: string | null
  activeBusinessName: string | null
  setActiveBusinessId: (id: string | null) => Promise<void>
  reload: () => Promise<void>
  loading: boolean
  error?: string | null
  activeTab: DashboardTab
  setActiveTab: (tab: DashboardTab) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const NAV_ITEMS: { id: DashboardTab; label: string; icon: typeof Inbox }[] = [
  { id: "inbox", label: "Bandeja", icon: Inbox },
  { id: "stats", label: "Estadísticas", icon: BarChart3 },
  { id: "ai-config", label: "Configuración IA", icon: Sparkles },
  { id: "complaints", label: "Formulario de quejas", icon: FileWarning },
  { id: "alerts", label: "Alertas", icon: Bell },
]

function Sidebar({
  activeTab,
  onTabChange,
  businessName,
}: {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  businessName: string | null
}) {
  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-white/[0.06] bg-[linear-gradient(180deg,#080c18_0%,#060a14_100%)]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] p-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white">
          R
        </div>
        <span className="text-sm font-semibold text-white">Resply</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-l-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-l-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-2 border-t border-white/[0.06] p-3">
        <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gray-700" />
        <span className="truncate text-xs text-gray-500">{businessName ?? "Mi negocio"}</span>
      </div>
    </aside>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { status: sessionStatus, data: session } = useSession()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [activeBusinessId, setActiveBusinessIdState] = useState<string | null>(null)
  const [activeBusinessName, setActiveBusinessName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<DashboardTab>("inbox")

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (sessionStatus !== "authenticated") {
        setBusinesses([])
        setActiveBusinessIdState(null)
        setActiveBusinessName(null)
        setUserProfile(null)
        return
      }

      const [profileRes, businessesRes] = await Promise.all([
        fetchUserProfile(),
        fetchBusinesses(),
      ])

      setUserProfile(profileRes.user)
      const bs = businessesRes.businesses
      setBusinesses(bs)
      const activeId = businessesRes.activeBusinessId ?? bs[0]?.id ?? null
      setActiveBusinessIdState(activeId)
      const activeName = bs.find((b: any) => b.id === activeId)?.name ?? null
      setActiveBusinessName(activeName)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar dashboard")
    } finally {
      setLoading(false)
    }
  }, [sessionStatus])

  useEffect(() => {
    let mounted = true
    void (async () => {
      if (!mounted) return
      await reload()
    })()
    return () => {
      mounted = false
    }
  }, [reload])

  const setActiveBusinessId = useCallback(async (id: string | null) => {
    try {
      await setActiveBusiness(id)
      setActiveBusinessIdState(id)
      const name = businesses.find((b) => b.id === id)?.name ?? null
      setActiveBusinessName(name)
    } catch (err) {
      // ignore errors client-side; caller can show toast
    }
  }, [businesses])

  const value = useMemo(
    () => ({
      sessionStatus: sessionStatus as DashboardContextType["sessionStatus"],
      user: session?.user,
      userProfile,
      businesses,
      activeBusinessId,
      activeBusinessName,
      setActiveBusinessId,
      reload,
      loading,
      error,
      activeTab,
      setActiveTab,
    }),
    [sessionStatus, session?.user, userProfile, businesses, activeBusinessId, activeBusinessName, setActiveBusinessId, reload, loading, error, activeTab]
  )

  return (
    <DashboardContext.Provider value={value}>
      <div className="flex min-h-screen bg-[#0a0f1e]">
        {sessionStatus === "authenticated" && (
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} businessName={activeBusinessName} />
        )}
        <main className="min-h-screen flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-screen items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardShell")
  return ctx
}
