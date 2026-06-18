"use client"

import { BusinessAiConfigDto, ResponseTone } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getSuggestedResponseByTone } from "@/lib/mock-data"
import { TONE_DESCRIPTIONS } from "@/lib/ai-config/defaults"
import { Loader2 } from "lucide-react"

interface AiSettingsPanelProps {
  config: BusinessAiConfigDto
  businessName: string
  isLoading?: boolean
  isSaving?: boolean
  isDefault?: boolean
  onConfigChange: (patch: Partial<BusinessAiConfigDto>) => void
}

const toneOptions: { id: ResponseTone; label: string; description: string }[] = [
  {
    id: "cercano",
    label: "Cercano",
    description: "Cálido, amigable y personal.",
  },
  {
    id: "professional",
    label: "Profesional",
    description: "Equilibrado y confiable.",
  },
  {
    id: "formal",
    label: "Formal",
    description: "Elegante y correcto.",
  },
]

const instructionExamples = [
  "Hablar en nombre del equipo.",
  "No usar emojis.",
  "Mantener respuestas breves.",
  "Sonar más cálido.",
]

export function AiSettingsPanel({
  config,
  businessName,
  isLoading = false,
  isSaving = false,
  isDefault = false,
  onConfigChange,
}: AiSettingsPanelProps) {
  const previewResponse = getSuggestedResponseByTone(config.tone, 5)

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Cargando configuración de {businessName}...</span>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            Configuración de respuestas
          </h2>
          <div className="flex items-center gap-2">
            {isDefault && (
              <Badge variant="outline" className="text-xs">
                Valores por defecto
              </Badge>
            )}
            {isSaving && (
              <Badge variant="outline" className="text-xs gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Guardando...
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Esta configuración es exclusiva de <strong>{businessName}</strong>. Al cambiar de
          negocio verás su configuración correspondiente.
        </p>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Tono de respuesta</label>
          <RadioGroup
            value={config.tone}
            onValueChange={(value) => onConfigChange({ tone: value as ResponseTone })}
          >
            <div className="space-y-2">
              {toneOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.id} id={`tone-${option.id}`} className="mt-1" />
                  <Label
                    htmlFor={`tone-${option.id}`}
                    className="flex-1 cursor-pointer p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="font-medium text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">{TONE_DESCRIPTIONS[config.tone]}</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Instrucciones adicionales (opcional)
          </label>
          <Textarea
            placeholder="Ej: Mantener respuestas breves, no usar emojis, hablar de vos..."
            value={config.additionalInstructions}
            onChange={(e) =>
              onConfigChange({ additionalInstructions: e.target.value })
            }
            className="resize-none h-32"
          />
          <div className="flex flex-wrap gap-2">
            {instructionExamples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  if (!config.additionalInstructions.includes(example)) {
                    onConfigChange({
                      additionalInstructions: config.additionalInstructions
                        ? `${config.additionalInstructions}\n${example}`
                        : example,
                    })
                  }
                }}
                className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
              >
                + {example}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Vista previa</h2>
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-foreground">Cliente satisfecho</p>
              <p className="text-sm text-muted-foreground">Hace 2 días</p>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-foreground">¡Excelente servicio! Muy recomendado.</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Respuesta sugerida ({config.tone})
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-foreground leading-relaxed">{previewResponse}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
