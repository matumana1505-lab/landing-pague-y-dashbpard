"use client"

import { UserSettings } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SettingsPanelProps {
  settings: UserSettings
  onSaveSettings?: (settings: UserSettings) => void
}

export function SettingsPanel({
  settings: initialSettings,
  onSaveSettings,
}: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [isSaved, setIsSaved] = useState(false)

  const handleToneChange = (value: "cercano" | "professional" | "formal") => {
    setSettings({ ...settings, tone: value })
    setIsSaved(false)
  }

  const handleSave = () => {
    onSaveSettings?.(settings)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const toneDescriptions = {
    cercano: "Cálido, cercano y personal",
    professional: "Cordial y profesional",
    formal: "Formal y corporativo",
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Configuración de respuestas
      </h2>

      <div className="space-y-6">
        {/* Tone Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Tono de respuesta
          </label>
          <Select value={settings.tone} onValueChange={handleToneChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Cercano</SelectItem>
              <SelectItem value="professional">Profesional</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {toneDescriptions[settings.tone]}
          </p>
        </div>

        {/* Example Response */}
        <div className="p-4 bg-secondary/50 rounded-lg border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Ejemplo de respuesta en tono {settings.tone}:
          </p>
          <p className="text-sm text-foreground italic">
            {settings.tone === "cercano" &&
              "¡Gracias por visitarnos! Nos alegra mucho que te haya gustado. Esperamos verte pronto 😊"}
            {settings.tone === "professional" &&
              "Agradecemos tu comentario. Nos complace saber que tuviste una buena experiencia. Te esperamos nuevamente."}
            {settings.tone === "formal" &&
              "Le agradecemos por su reseña y su preferencia. Esperamos poder servirle en futuras ocasiones."}
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Guardar preferencia
          </Button>
          {isSaved && (
            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-0">
              Guardado ✓
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
