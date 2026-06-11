"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BusinessProfile } from "@/lib/types"
import { CheckCircle2, Loader2, Building2, Star } from "lucide-react"

interface BusinessLocation {
  id: string
  name: string
  title: string
  locationId: string
  accountId: string
  address: string
  phone: string
  website: string
  category: string
}

interface BusinessAccount {
  id: string
  accountId: string
  name: string
  locations: BusinessLocation[]
}

interface Step1ConnectGoogleProps {
  onConnect: () => void
  isLoading?: boolean
  onBusinessSelected?: (business: BusinessProfile) => void
  onContinue?: () => void
  selectedBusiness?: BusinessProfile | null
}

export function Step1ConnectGoogle({
  onConnect,
  isLoading = false,
  onBusinessSelected,
  onContinue,
  selectedBusiness,
}: Step1ConnectGoogleProps) {
  const { data: session, status } = useSession()
  const [accounts, setAccounts] = useState<BusinessAccount[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  const demoBusiness: BusinessProfile = {
    id: "demo-cafe-central",
    name: "Café Central (Demo)",
    accountId: "demo-account",
    locationId: "demo-location",
    isConnected: true,
    address: "Ubicación de demostración",
  }

  const hasBusinessLocations = accounts.some((account) => account.locations.length > 0)
  const shouldShowEmptyBusinessState =
    status === "authenticated" && !isLoadingLocations && !demoMode && (!hasBusinessLocations || Boolean(error))

  const handleDemoMode = () => {
    setDemoMode(true)
    onBusinessSelected?.(demoBusiness)
  }

  useEffect(() => {
    if (status !== "authenticated") return

    let isMounted = true
    setIsLoadingLocations(true)
    setError(null)

    fetch("/api/google-business/accounts")
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return
        if (data.error) {
          setError(data.error)
          setAccounts([])
          return
        }

        setAccounts(data.accounts || [])
      })
      .catch(() => {
        if (isMounted) {
          setError("No se pudieron cargar tus negocios de Google Business Profile.")
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingLocations(false)
      })

    return () => {
      isMounted = false
    }
  }, [status])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl border-0 shadow-lg">
        <div className="p-12">
          {/* Logo o marca */}
          <div className="mb-8 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              R
            </div>
          </div>

          {/* Progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Paso 1 de 3</span>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Conecta tu Google Business
              </h1>
              <p className="text-lg text-slate-600">
                Conecta tu perfil de Google Business para comenzar a automatizar la gestion de reseñas.
              </p>
            </div>

            {/* Beneficios */}
            <div className="pt-6 space-y-4 text-left max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Acceso automatico a tus reseñas</p>
                  <p className="text-sm text-slate-600">Sincronizamos tus reseñas de Google en tiempo real</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Responde directamente desde Resply</p>
                  <p className="text-sm text-slate-600">Tus respuestas se publican automaticamente en Google</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Seguro y verificado</p>
                  <p className="text-sm text-slate-600">Usamos OAuth seguro de Google</p>
                </div>
              </div>
            </div>
          </div>

          {/* BotÃ³n de acciÃ³n */}
          <div className="mt-10 flex justify-center">
            <Button
              onClick={onConnect}
              disabled={isLoading}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold"
            >
              {isLoading ? "Conectando..." : "Conectar Google Business"}
            </Button>
          </div>

          {status === "authenticated" && session?.user && (
            <div className="mt-8 space-y-4 text-left rounded-xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-blue-900">Cuenta conectada</p>
                <p className="text-sm text-blue-800">{session.user.name || "Cuenta de Google"}</p>
                <p className="text-xs text-blue-700">{session.user.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">Negocios disponibles</p>
                <p className="text-xs text-slate-500">Selecciona el negocio que usarias en el dashboard.</p>
              </div>

              {isLoadingLocations && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando negocios de Google Business Profile...
                </div>
              )}

              {shouldShowEmptyBusinessState && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                  <p className="text-sm font-medium text-amber-900">
                    No encontramos perfiles de Google Business
                  </p>

                  <p className="text-sm text-amber-800">
                    La cuenta conectada debe ser propietaria o administradora de un Perfil de Empresa de Google para utilizar Resply.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={onConnect}>
                      Conectar otra cuenta
                    </Button>

                    <Button onClick={handleDemoMode} className="bg-blue-600 hover:bg-blue-700">
                      Explorar modo demostración
                    </Button>
                  </div>
                </div>
              )}


              {demoMode && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Café Central (Demo)</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          4.8
                        </span>
                        <span>127 reseñas</span>
                      </div>
                    </div>
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {accounts.map((account) => (
                  <div key={account.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{account.name}</p>
                        <p className="text-xs text-slate-500">Account ID: {account.accountId}</p>
                      </div>
                      <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {account.locations.length} ubicaciones
                      </div>
                    </div>

                    <div className="space-y-2">
                      {account.locations.map((location) => {
                        const isSelected =
                          selectedBusiness?.locationId === location.locationId &&
                          selectedBusiness?.accountId === location.accountId

                        return (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() =>
                              onBusinessSelected?.({
                                id: location.id,
                                name: location.title,
                                accountId: location.accountId,
                                locationId: location.locationId,
                                isConnected: true,
                                address: location.address,
                                phone: location.phone,
                              })
                            }
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/60"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{location.title}</p>
                                <p className="text-xs text-slate-500">{location.address || "Sin direcciÃ³n disponible"}</p>
                                {location.phone && <p className="text-xs text-slate-500">{location.phone}</p>}
                              </div>
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 pt-4">
                <div>
                  <p className="text-sm text-slate-700">
                    {selectedBusiness
                      ? `Negocio seleccionado: ${selectedBusiness.name}`
                      : "Selecciona un negocio para continuar."}
                  </p>
                  {selectedBusiness?.accountId && (
                    <p className="text-xs text-slate-500">Account ID: {selectedBusiness.accountId}</p>
                  )}
                </div>
            <Button
  onClick={onContinue}
  disabled={!selectedBusiness && !demoMode}
  className="bg-blue-600 hover:bg-blue-700 text-white"
>
  Continuar al siguiente paso
</Button>
              </div>
            </div>
          )}

          {/* Pie de pÃ¡gina */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Protegemos tu privacidad. No almacenamos tus contraseñas.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
