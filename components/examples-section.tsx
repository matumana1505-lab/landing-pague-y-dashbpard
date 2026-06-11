export function ExamplesSection() {
  const examples = [
    {
      type: "positive",
      reviewer: {
        initials: "CL",
        name: "Carlos López",
        rating: 5,
        color: "bg-emerald-100 text-emerald-700",
      },
      review:
        "Increíble experiencia. El servicio fue excelente y la comida deliciosa. Definitivamente vamos a volver pronto con la familia.",
      response:
        "¡Muchas gracias Carlos! Nos alegra enormemente que hayas disfrutado tu visita. Será un placer recibirte a vos y tu familia nuevamente. ¡Los esperamos!",
      label: "Reseña positiva",
      labelColor: "bg-emerald-100 text-emerald-700",
    },
    {
      type: "negative",
      reviewer: {
        initials: "AM",
        name: "Ana Martínez",
        rating: 2,
        color: "bg-orange-100 text-orange-700",
      },
      review:
        "La espera fue muy larga y el pedido llegó incompleto. Esperaba más de este lugar que tantos recomiendan.",
      response:
        "Hola Ana, lamentamos mucho que tu experiencia no haya sido la esperada. Nos tomamos muy en serio este tipo de situaciones. ¿Podrías escribirnos por privado para resolver esto? Queremos que tu próxima visita sea excelente.",
      label: "Reseña negativa",
      labelColor: "bg-orange-100 text-orange-700",
    },
  ]

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Ejemplos reales
          </span>
          <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance leading-tight">
            Respuestas profesionales que cuidan tu reputación
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Mirá cómo gestionamos reseñas positivas y negativas con un enfoque profesional.
          </p>
        </div>

        {/* Examples grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {examples.map((example, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background border border-border"
            >
              {/* Label */}
              <span
                className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mb-3 sm:mb-4 ${example.labelColor}`}
              >
                {example.label}
              </span>

              {/* Review */}
              <div className="flex gap-3 sm:gap-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium shrink-0 ${example.reviewer.color}`}
                >
                  {example.reviewer.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-foreground text-sm">
                      {example.reviewer.name}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            i < example.reviewer.rating
                              ? "text-yellow-400"
                              : "text-border"
                          } fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {example.review}
                  </p>
                </div>
              </div>

              {/* Response */}
              <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-md flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    Respuesta de Resply
                  </span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs rounded-full font-medium">
                    Generada automáticamente
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7 sm:pl-8">
                  {example.response}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
