export function UpcomingSection() {
  const items = [
    "Detección de problemas recurrentes en reseñas.",
    "Comparación histórica de reputación.",
    "Análisis de tendencias y oportunidades.",
  ]

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs sm:text-sm font-medium text-blue-400 uppercase tracking-wider">
            Próximamente
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance leading-tight">
            Nuevas funciones en camino
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Sumaremos más herramientas para que tengas un panorama aún más claro de tu reputación sin robarle protagonismo a la oferta principal.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/10"
            >
              <p className="text-sm text-gray-300 leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
