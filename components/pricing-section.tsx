"use client"

import { PrimaryCTAButton } from "@/components/premium-buttons"
import { Check } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { signIn } from "next-auth/react"

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const headerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
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
    <motion.section
      id="precio"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-16 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e]"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.h2
            variants={titleVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white text-balance leading-tight"
          >
            Un plan claro para gestionar reseñas y mejorar tu reputación.
          </motion.h2>
          <motion.span
            variants={underlineVariants}
            className="block h-[2px] w-16 bg-blue-500 rounded-full mx-auto mt-4 origin-left"
          />
          <motion.p
            variants={subtitleVariants}
            className="mt-4 text-base sm:text-lg text-gray-400 max-w-lg mx-auto"
          >
            Por $49.000/mes recibís la gestión completa de reseñas en Google: respuestas automáticas, alertas, reportes y configuración inicial lista para usar.
          </motion.p>
        </motion.div>

        {/* Pricing card */}
        <div className="relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-blue-600/30">
              Más popular
            </span>
          </div>

          <div className="bg-white/[0.02] rounded-2xl border border-blue-500/40 p-6 sm:p-8 md:p-10 shadow-lg shadow-blue-500/20 hover:border-blue-500/60 hover:shadow-blue-500/30 transition-all duration-300">
            {/* Price */}
            <div className="text-center mb-8 md:mb-10">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                  $49.000
                </span>
                <span className="text-base sm:text-lg text-gray-400 font-medium">
                  ARS / mes
                </span>
              </div>
              <p className="mt-3 text-gray-400 text-sm">
                Incluye monitoreo, respuestas automáticas, alertas y reporte mensual.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-8 md:mb-10" />

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white">
                Qué recibís por $49.000/mes
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-400 leading-relaxed">
                Un servicio diseñado para que no tengas que revisar cada reseña y puedas responder con coherencia y rapidez.
              </p>
            </div>

            {/* Benefits list */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4 mb-10 md:mb-12"
            >
              {benefits.map((benefit, index) => (
                <motion.div key={index} variants={itemVariants} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#3b82f6]" strokeWidth={3} />
                  </div>
                  <span className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA - DOMINANT */}
            <div className="text-center">
              <PrimaryCTAButton
                size="lg"
                showIcon
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                wrapperClassName="w-full sm:w-auto"
                className="w-full sm:w-auto"
              >
                Empezar prueba gratuita
              </PrimaryCTAButton>
              <p className="mt-4 text-sm text-gray-500">
                Probá el servicio gratis durante 14 días. Después de la prueba, el valor es de $49.000 ARS por mes. Cancelá cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
