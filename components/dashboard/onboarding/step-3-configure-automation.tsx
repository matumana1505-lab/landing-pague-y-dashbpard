"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle2 } from "lucide-react"

interface AutomationConfig {
  autoRespondPositive: boolean
  alertNegative: boolean
  monthlySummary: boolean
  send3StarForReview: boolean
}

interface Step3ConfigureAutomationProps {
  onActivate: (config: AutomationConfig) => void
  isLoading?: boolean
}

export function Step3ConfigureAutomation({
  onActivate,
  isLoading = false,
}: Step3ConfigureAutomationProps) {
  const [config, setConfig] = useState<AutomationConfig>({
    autoRespondPositive: true,
    alertNegative: true,
    monthlySummary: true,
    send3StarForReview: true,
  })

  const handleToggle = (key: keyof AutomationConfig) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleActivate = () => {
    onActivate(config)
  }

  const options = [
    {
      id: "autoRespondPositive",
      label: "Responder automáticamente reseñas de 4 y 5 estrellas",
      description: "Las reseñas positivas se responderán automáticamente usando tu tono configurado.",
      icon: "⭐",
    },
    {
      id: "alertNegative",
      label: "Alerta para reseñas negativas (1 y 2 estrellas)",
      description:
        "Recibirás notificaciones cuando aparezcan reseñas negativas que requieran tu atención.",
      icon: "⚠️",
    },
    {
      id: "send3StarForReview",
      label: "Enviar reseñas de 3 estrellas a revisión",
      description: "Las reseñas neutras se guardarán para que decidas si responder o no.",
      icon: "📋",
    },
    {
      id: "monthlySummary",
      label: "Resumen mensual del rendimiento",
      description: "Recibirás un reporte mensual con estadísticas y análisis de tus reseñas.",
      icon: "📊",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="mb-8 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Paso 3 de 3</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Activar automatización
          </h1>
          <p className="text-lg text-slate-600">
            Elige qué acciones automáticas deseas activar para tu negocio.
          </p>
        </div>

        {/* Opciones de automatización */}
        <div className="space-y-3">
          {options.map((option) => (
            <Card
              key={option.id}
              className={`p-6 border-2 cursor-pointer transition-all ${
                config[option.id as keyof AutomationConfig]
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => handleToggle(option.id as keyof AutomationConfig)}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={config[option.id as keyof AutomationConfig]}
                  onCheckedChange={() => handleToggle(option.id as keyof AutomationConfig)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{option.icon}</span>
                    <div>
                      <Label className="text-base font-semibold text-slate-900 cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="bg-blue-50 border border-blue-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-2">✨ Cómo funciona</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>Reseñas de 1-2 estrellas:</strong> Nunca se responden automáticamente.
              Recibirás una alerta para que las revises en caso de que sea necesario.
            </li>
            <li>
              <strong>Reseñas de 3 estrellas:</strong> Necesitan de tu aprobacion para ser publicadas.
            </li>
            <li>
              <strong>Reseñas de 4-5 estrellas:</strong> Se responden automáticamente y se publican
              inmediatamente.
            </li>
          </ul>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" disabled className="text-slate-500">
            Atrás
          </Button>
          <Button
            onClick={handleActivate}
            disabled={isLoading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8"
          >
            {isLoading ? "Activando..." : "Activar Resply"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
