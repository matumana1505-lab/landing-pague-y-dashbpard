"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { fetchUserProfile, fetchBusinesses, setActiveBusiness } from "@/lib/api-client"
import { Loader2 } from "lucide-react"
import Link from "next/link"

type Business = {
  id: string
  name: string
}

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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { status: sessionStatus, data: session } = useSession()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [activeBusinessId, setActiveBusinessIdState] = useState<string | null>(null)
  const [activeBusinessName, setActiveBusinessName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    }),
    [sessionStatus, session?.user, userProfile, businesses, activeBusinessId, activeBusinessName, setActiveBusinessId, reload, loading, error]
  )

  return (
    <DashboardContext.Provider value={value}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
            <nav className="sticky top-6 space-y-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted-foreground">Resply</p>
                <h3 className="text-lg font-semibold text-foreground">Dashboard</h3>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border space-y-2">
                <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-secondary/50">Últimas reseñas</Link>
                <Link href="/dashboard/settings/ai" className="block px-3 py-2 rounded hover:bg-secondary/50">Configuración IA</Link>
                <Link href="/dashboard/settings/billing" className="block px-3 py-2 rounded hover:bg-secondary/50 text-muted-foreground">Facturación</Link>
                <Link href="/dashboard/settings/profile" className="block px-3 py-2 rounded hover:bg-secondary/50 text-muted-foreground">Perfil</Link>
              </div>
            </nav>
          </aside>

          <main className="col-span-12 lg:col-span-9 xl:col-span-10">
            {loading ? (
              <div className="min-h-[300px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardShell")
  return ctx
}
