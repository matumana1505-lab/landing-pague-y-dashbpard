"use client"

import { Loader2 } from "lucide-react"
import type { ResponseTone } from "@/lib/types"
import { useBusinessAiConfig } from "@/hooks/use-business-ai-config"
import { TONE_LABELS, TONE_DESCRIPTIONS } from "@/lib/ai-config/defaults"

interface AiConfigTabProps {
  businessId: string | null
  businessName: string
}

const TONE_OPTIONS: ResponseTone[] = ["cercano", "professional", "formal"]

const TOGGLES: { key: "autoRespond" | "alertNegativeReviews" | "monthlySummary"; label: string; description: string }[] = [
  {
    key: "autoRespond",
    label: "Respuestas automáticas",
    description: "Generar y publicar respuestas automáticamente para todas las reseñas.",
  },
  {
    key: "alertNegativeReviews",
    label: "Alertas de reseñas negativas",
    description: "Recibir un aviso cuando llegue una reseña de 1 o 2 estrellas.",
  },
  {
    key: "monthlySummary",
    label: "Resumen mensual",
    description: "Recibir un resumen de reseñas y métricas cada mes.",
  },
]

function ToggleSwitch({ pressed, onToggle }: { pressed: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={onToggle}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${pressed ? "bg-blue-600" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
          pressed ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export function AiConfigTab({ businessId, businessName }: AiConfigTabProps) {
  const { config, isLoading, isSaving, isDefault, updateConfig } = useBusinessAiConfig({
    businessId,
    autoSave: true,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando configuración de {businessName}...
      </div>
    )
  }

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-2">
      <div className="space-y-6 rounded-xl border border-white/[0.06] bg-[#0f1628] p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-white">Configuración de respuestas</h2>
          <div className="flex items-center gap-2">
            {isDefault && (
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-gray-500">
                Valores por defecto
              </span>
            )}
            {isSaving && (
              <span className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" /> Guardando...
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Esta configuración es exclusiva de <span className="text-gray-300">{businessName}</span>.
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Tono de respuesta</p>
          <div className="space-y-2">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => updateConfig({ tone })}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  config.tone === tone
                    ? "border-blue-500/40 bg-blue-500/10"
                    : "border-white/[0.06] hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <p className="text-sm font-medium text-white">{TONE_LABELS[tone]}</p>
                <p className="text-xs text-gray-500">{TONE_DESCRIPTIONS[tone]}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Instrucciones adicionales</p>
          <textarea
            value={config.additionalInstructions}
            onChange={(e) => updateConfig({ additionalInstructions: e.target.value })}
            placeholder="Ej: Mantener respuestas breves, no usar emojis, hablar de vos..."
            className="h-28 w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-gray-200 placeholder:text-gray-600 focus:border-blue-500/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#0f1628] p-6">
        <h2 className="mb-4 text-base font-semibold text-white">Automatización</h2>
        <div className="space-y-4">
          {TOGGLES.map((toggle) => (
            <div key={toggle.key} className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-white">{toggle.label}</p>
                <p className="text-xs text-gray-500">{toggle.description}</p>
              </div>
              <ToggleSwitch pressed={config[toggle.key]} onToggle={() => updateConfig({ [toggle.key]: !config[toggle.key] })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
