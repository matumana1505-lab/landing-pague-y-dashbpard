"use client"

import { UserSettings } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"
import { Bell, Zap, BarChart3 } from "lucide-react"

interface AutomationSettingsProps {
  settings: UserSettings
  onUpdateSettings?: (settings: UserSettings) => void
}

export function AutomationSettings({
  settings: initialSettings,
  onUpdateSettings,
}: AutomationSettingsProps) {
  const [settings, setSettings] = useState<UserSettings>(initialSettings)

  const handleToggle = (key: keyof Omit<UserSettings, "tone">) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    setSettings(newSettings)
    onUpdateSettings?.(newSettings)
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Automatización
      </h2>

      <div className="space-y-4">
        {/* Auto Respond */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">Respuestas automáticas</p>
              <p className="text-xs text-muted-foreground">
                Generar respuestas automáticamente a todas las reseñas
              </p>
            </div>
          </div>
          <Toggle
            pressed={settings.autoRespond}
            onPressedChange={() => handleToggle("autoRespond")}
            className="ml-auto"
            aria-label="Toggle auto respond"
          />
        </div>

        {/* Alert Negative Reviews */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg mt-1">
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">Alertas de reseñas negativas</p>
              <p className="text-xs text-muted-foreground">
                Recibir notificaciones cuando haya reseñas de 1 o 2 estrellas
              </p>
            </div>
          </div>
          <Toggle
            pressed={settings.alertNegativeReviews}
            onPressedChange={() => handleToggle("alertNegativeReviews")}
            className="ml-auto"
            aria-label="Toggle negative review alerts"
          />
        </div>

        {/* Monthly Summary */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg mt-1">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">Resumen mensual</p>
              <p className="text-xs text-muted-foreground">
                Recibir un resumen de reseñas y métricas cada mes
              </p>
            </div>
          </div>
          <Toggle
            pressed={settings.monthlySummary}
            onPressedChange={() => handleToggle("monthlySummary")}
            className="ml-auto"
            aria-label="Toggle monthly summary"
          />
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Consejo:</strong> Las respuestas automáticas pueden estar
          sujetas a revisión manual para garantizar la calidad. Estas
          configuraciones se aplicarán a futuras respuestas.
        </p>
      </div>
    </Card>
  )
}
