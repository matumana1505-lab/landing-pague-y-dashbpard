import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection() {
  const benefits = [
    "Respuestas automáticas a reseñas positivas, neutras y negativas.",
    "Respuestas personalizadas con el tono de tu negocio.",
    "Alertas inmediatas cuando recibís reseñas negativas.",
    "Resumen mensual con calificación, cantidad de reseñas y evolución del negocio.",
    "Configuración inicial simple y rápida.",
    "Acceso a futuras funciones y mejoras sin costo adicional.",
  ]

  return (
    <section id="pricing" className="py-16 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance leading-tight">
            Un plan claro para gestionar reseñas y mejorar tu reputación.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
            Por $49.000/mes recibís la gestión completa de reseñas en Google: respuestas automáticas, alertas, reportes y configuración inicial lista para usar.
          </p>
        </div>

        {/* Pricing card */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 md:p-10 shadow-sm">
          {/* Price */}
          <div className="text-center mb-8 md:mb-10">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                $49.000
              </span>
              <span className="text-base sm:text-lg text-muted-foreground font-medium">
                ARS / mes
              </span>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Incluye monitoreo, respuestas automáticas, alertas y reporte mensual.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-8 md:mb-10" />

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground">
              Qué recibís por $49.000/mes
            </h3>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Un servicio diseñado para que no tengas que revisar cada reseña y puedas responder con coherencia y rapidez.
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-4 mb-10 md:mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                </div>
                <span className="text-sm sm:text-base text-foreground leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* CTA - DOMINANT */}
          <div className="text-center">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-full px-14 h-14 text-base font-semibold shadow-lg shadow-foreground/10 transition-all duration-200 hover:shadow-xl hover:shadow-foreground/15 hover:scale-[1.02]"
            >
              Empezar prueba gratuita
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Probá el servicio gratis durante 14 días. Después de la prueba, el valor es de $49.000 ARS por mes. Cancelá cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
