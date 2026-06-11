export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Conectás Google Business",
      subtitle: "En pocos minutos",
      description: "Vinculás tu perfil de Google Business para empezar a proteger tu reputación.",
    },
    {
      number: "2",
      title: "Generamos respuestas profesionales",
      subtitle: "En el tono de tu negocio",
      description: "Cada reseña recibe una respuesta clara y respetuosa, diseñada para cuidar tu imagen.",
    },
    {
      number: "3",
      title: "El sistema trabaja solo",
      subtitle: "Decisión y seguimiento centralizados",
      description: "Automatizá las respuestas a las reseñas positivas y recibí alertas inmediatas cuando aparezca una reseña negativa.",
    },
  ]

  return (
    <section id="como-funciona" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Cómo funciona
          </span>
          <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance leading-tight">
            Un proceso sencillo para cuidar tu reputación en Google
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-full w-full h-px bg-border -translate-x-4" />
              )}

              <div className="flex flex-col items-center text-center">
                {/* Number badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl sm:text-2xl font-semibold mb-4 sm:mb-5">
                  {step.number}
                </div>

                <h3 className="text-lg sm:text-xl font-medium text-foreground mb-1">
                  {step.title}
                </h3>
                
                {/* Subtitle - new */}
                <span className="text-xs sm:text-sm text-primary/70 font-medium mb-2">
                  {step.subtitle}
                </span>
                
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  )
}
