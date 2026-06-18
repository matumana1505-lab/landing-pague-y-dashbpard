"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { getSuggestedResponseByTone } from "@/lib/mock-data"

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
  const [tone, setTone] = useState<ToneType>("professional")
  const [additionalInstructions, setAdditionalInstructions] = useState("")

  const handleContinue = () => {
    onContinue(tone, additionalInstructions)
  }

  const toneOptions = [
    {
      id: "cercano",
      label: "Cercano",
      description: "Cálido, amigable y personal. Ideal para crear conexiones auténticas.",
    },
    {
      id: "professional",
      label: "Profesional",
      description: "Equilibrado y confiable. Mantiene la credibilidad de tu negocio.",
    },
    {
      id: "formal",
      label: "Formal",
      description: "Elegante y correcto. Perfecto para servicios de alto nivel.",
    },
  ]

  const examples = [
    "Hablar en nombre del equipo.",
    "No usar emojis.",
    "Mantener respuestas breves.",
    "Sonar más cálido.",
  ]

  const exampleResponse = getSuggestedResponseByTone(tone as ToneType, 5)

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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna izquierda: Selección de tono */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Elige un tono</h2>
              <RadioGroup value={tone} onValueChange={(val) => setTone(val as ToneType)}>
                <div className="space-y-3">
                  {toneOptions.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-slate-900">{option.label}</div>
                        <div className="text-sm text-slate-600">{option.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Instrucciones adicionales */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Instrucciones adicionales (opcional)
              </h2>
              <Textarea
                placeholder="Ej: Mantener respuestas breves, no usar emojis, hablar de vos, sonar más cálido..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                className="resize-none h-32"
              />
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-slate-600">Ejemplos:</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        if (!additionalInstructions.includes(example)) {
                          setAdditionalInstructions(
                            (prev) => (prev ? prev + "\n" : "") + example
                          )
                        }
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      + {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Vista previa */}
          <div>
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Vista previa</h2>
              <Card className="bg-white border-slate-200 p-6">
                {/* Reseña simulada */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">Cliente satisfecho</p>
                      <p className="text-sm text-slate-600">Hace 2 días</p>
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
                  <p className="text-slate-700">¡Excelente servicio! Muy recomendado.</p>
                </div>

                {/* Respuesta sugerida */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-3">
                    Respuesta sugerida
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-slate-700 leading-relaxed">{exampleResponse}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

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
