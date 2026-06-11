export function ProblemSection() {
  const problems = [
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Las reseñas se acumulan",
      description: "Cada día llegan reseñas nuevas y no tenés tiempo de responder. Se van acumulando y tu perfil parece abandonado.",
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      ),
      title: "Perdés clientes por falta de respuesta",
      description: "Cuando alguien busca tu negocio y ve reseñas sin responder, piensa que no te importa. Y elige otro lugar.",
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
      title: "La competencia responde más rápido",
      description: "Otros negocios ya están respondiendo rápido. Cada reseña sin responder es una oportunidad que perdés.",
    },
  ]

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-5xl mx-auto">
        {/* Section header - more emotional */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance leading-tight">
            Tu reputación online define si te eligen o no
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Cada reseña sin respuesta afecta la confianza del cliente y la visibilidad de tu negocio.
          </p>
        </div>

        {/* Problems grid */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-background border border-border"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-secondary flex items-center justify-center text-foreground mb-3 sm:mb-4">
                {problem.icon}
              </div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
