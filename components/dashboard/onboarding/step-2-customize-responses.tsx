"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { AiSettingsPanel } from "@/components/dashboard/ai-settings-panel"
import type { BusinessAiConfigDto } from "@/lib/types"

type ToneType = "cercano" | "professional" | "formal"

interface Step2CustomizeResponsesProps {
  onContinue: (tone: ToneType, instructions: string) => void
  isLoading?: boolean
  businessName?: string
}

export function Step2CustomizeResponses({
  onContinue,
  isLoading = false,
  businessName,
}: Step2CustomizeResponsesProps) {
  const [config, setConfig] = useState<BusinessAiConfigDto>({
    tone: "professional",
    additionalInstructions: "",
    autoRespond: false,
    alertNegativeReviews: true,
    monthlySummary: true,
    send3StarReviewsForReview: false,
    advancedSettings: null,
  })

  const handleContinue = () => {
    onContinue(config.tone as ToneType, config.additionalInstructions ?? "")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="mb-8 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Paso 2 de 3</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Personalizá tus respuestas
          </h1>
          <p className="text-lg text-slate-600">
            Define el tono que quieres para tus respuestas automáticas
            {businessName ? (
              <>
                {" "}
                de <strong>{businessName}</strong>
              </>
            ) : null}
            .
          </p>
        </div>

        <AiSettingsPanel
          config={config}
          businessName={businessName ?? "Negocio"}
          onConfigChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
        />

        {/* Botones de acción */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" disabled className="text-slate-500">
            Atrás
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
          >
            {isLoading ? "Continuando..." : "Continuar"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
