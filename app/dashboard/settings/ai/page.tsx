"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { AiSettingsPanel } from "@/components/dashboard/ai-settings-panel"
import { Button } from "@/components/ui/button"
import { useBusinessAiConfig } from "@/hooks/use-business-ai-config"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-shell"

export default function AiSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const { activeBusinessId, activeBusinessName, loading: dashboardLoading, error: dashboardError } = useDashboard()

  const {
    config,
    isLoading: isConfigLoading,
    isSaving: isConfigSaving,
    isDefault,
    updateConfig,
    saveConfig,
  } = useBusinessAiConfig({ businessId: activeBusinessId, autoSave: false })

  const handleSave = async () => {
    if (!activeBusinessId) return
    try {
      await saveConfig(config)
      toast({ title: "Configuración guardada", description: "La configuración IA se actualizó correctamente." })
      router.push('/dashboard')
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : 'No se pudo guardar' })
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  if (dashboardLoading || isConfigLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Cargando configuración...</span>
      </div>
    )
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="p-8 max-w-md text-center space-y-4 bg-card border border-border rounded-lg">
          <p className="text-destructive">{dashboardError}</p>
          <button onClick={() => router.refresh()} className="text-sm text-primary hover:underline">Reintentar</button>
        </div>
      </div>
    )
  }

  if (!activeBusinessId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="p-8 max-w-md text-center space-y-4 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">No hay negocios disponibles. Agrega uno desde el onboarding.</p>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-primary hover:underline">Volver</button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configuración IA</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isConfigSaving}>
              {isConfigSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>

        <AiSettingsPanel
          config={config}
          businessName={activeBusinessName ?? 'Negocio'}
          isLoading={isConfigLoading}
          isSaving={isConfigSaving}
          isDefault={isDefault}
          onConfigChange={updateConfig}
        />
      </div>
    </div>
  )
}
