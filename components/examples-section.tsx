"use client"

import { motion, type Variants } from "framer-motion"

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

const headerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const eyebrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
}

const titleVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const underlineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function ExamplesSection() {
  const examples = [
    {
      type: "positive",
      reviewer: {
        initials: "CL",
        name: "Carlos López",
        rating: 5,
        color: "bg-gray-700 text-gray-200",
      },
      review:
        "Increíble experiencia. El servicio fue excelente y la comida deliciosa. Definitivamente vamos a volver pronto con la familia.",
      response:
        "¡Muchas gracias Carlos! Nos alegra enormemente que hayas disfrutado tu visita. Será un placer recibirte a vos y tu familia nuevamente. ¡Los esperamos!",
      label: "Reseña positiva",
      labelColor: "bg-blue-500/10 text-blue-400",
    },
    {
      type: "negative",
      reviewer: {
        initials: "AM",
        name: "Ana Martínez",
        rating: 2,
        color: "bg-gray-700 text-gray-200",
      },
      review:
        "La espera fue muy larga y el pedido llegó incompleto. Esperaba más de este lugar que tantos recomiendan.",
      response:
        "Hola Ana, lamentamos mucho que tu experiencia no haya sido la esperada. Nos tomamos muy en serio este tipo de situaciones. ¿Podrías escribirnos por privado para resolver esto? Queremos que tu próxima visita sea excelente.",
      label: "Reseña negativa",
      labelColor: "bg-red-500/10 text-red-400",
    },
  ]

  return (
    <motion.section
      id="ejemplos"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <motion.span
            variants={eyebrowVariants}
            className="text-xs sm:text-sm font-medium text-blue-400 uppercase tracking-wider"
          >
            Ejemplos reales
          </motion.span>
          <motion.h2
            variants={titleVariants}
            className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white text-balance leading-tight"
          >
            Respuestas profesionales que cuidan tu reputación
          </motion.h2>
          <motion.span
            variants={underlineVariants}
            className="block h-[2px] w-16 bg-blue-500 rounded-full mx-auto mt-4 origin-left"
          />
          <motion.p
            variants={subtitleVariants}
            className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400 text-balance"
          >
            Mirá cómo gestionamos reseñas positivas y negativas con un enfoque profesional.
          </motion.p>
        </motion.div>

        {/* Examples grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-4 md:gap-6"
        >
          {examples.map((example, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10"
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
                    <span className="font-medium text-white text-sm">
                      {example.reviewer.name}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            i < example.reviewer.rating
                              ? "text-yellow-400"
                              : "text-white/10"
                          } fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {example.review}
                  </p>
                </div>
              </div>

              {/* Response */}
              <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-md flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
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
                  <span className="text-xs sm:text-sm font-medium text-white">
                    Respuesta de Resply
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs rounded-full font-medium">
                    Generada automáticamente
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed pl-7 sm:pl-8">
                  {example.response}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
