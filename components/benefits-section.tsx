import { Check } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    "Respuestas automáticas ilimitadas.",
    "Alertas de reseñas negativas.",
    "Monitoreo continuo de Google Reviews.",
    "Resumen mensual de rendimiento.",
    "Personalización del tono de respuesta.",
  ]

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Todo incluido
          </span>
          <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance leading-tight">
            Todo lo que necesitás para gestionar tu reputación online
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Un servicio pensado para proteger tu imagen en Google Business y mantener tu negocio visible, confiable y actualizado.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-5 rounded-3xl bg-background border border-border"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
