"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Bell, Sparkles, CheckCircle2, AlertTriangle, Send, Star } from "lucide-react"

const CYCLE_MS = 2800

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

const CONNECTOR_LEN = 180
const connectorOffsets = [CONNECTOR_LEN, CONNECTOR_LEN / 2, 0]

function StepConnector({ activeStep, isBlue }: { activeStep: number; isBlue: boolean }) {
  const accent = isBlue ? "#60a5fa" : "#f87171"
  const nodeX = [10, 100, 190]

  return (
    <svg width="100%" viewBox="0 0 200 20" preserveAspectRatio="none" className="mb-4 overflow-visible">
      <line x1={nodeX[0]} y1="10" x2={nodeX[2]} y2="10" stroke="currentColor" className="text-white/10" strokeWidth="2" />
      <motion.line
        x1={nodeX[0]}
        y1="10"
        x2={nodeX[2]}
        y2="10"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={CONNECTOR_LEN}
        animate={{ strokeDashoffset: connectorOffsets[activeStep] }}
        transition={{
          duration: activeStep === 0 ? 0.4 : CYCLE_MS / 1000,
          ease: activeStep === 0 ? "easeOut" : "linear",
        }}
      />
      {nodeX.map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy="10"
          r="4"
          animate={{ fill: i <= activeStep ? accent : "rgba(255,255,255,0.12)" }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </svg>
  )
}

const positiveFlow = {
  name: "Reseña positiva",
  accent: "blue" as const,
  review: {
    initials: "MG",
    name: "María García",
    rating: 5,
    text: "Excelente atención, la comida espectacular. Volveremos sin duda.",
  },
  response: "¡Muchas gracias María! Nos alegra mucho que hayas disfrutado. Los esperamos pronto.",
  steps: [
    { label: "Llega una reseña nueva", icon: Bell },
    { label: "La IA genera una respuesta", icon: Sparkles },
    { label: "Se publica automáticamente", icon: CheckCircle2 },
  ],
}

const negativeFlow = {
  name: "Reseña negativa",
  accent: "red" as const,
  review: {
    initials: "AR",
    name: "Ana Rodríguez",
    rating: 1,
    text: "La espera fue muy larga y el pedido llegó frío. Muy decepcionante.",
  },
  response: "Se envió un formulario al cliente para que detalle su experiencia y reciba una solución personalizada.",
  steps: [
    { label: "Llega una reseña negativa", icon: Bell },
    { label: "El sistema la detecta", icon: AlertTriangle },
    { label: "Se envía un formulario al cliente", icon: Send },
  ],
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
        />
      ))}
    </div>
  )
}

function FlowCard({
  flow,
  activeStep,
}: {
  flow: typeof positiveFlow | typeof negativeFlow
  activeStep: number
}) {
  const isBlue = flow.accent === "blue"

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-sm">{flow.name}</h3>
        <div className="flex gap-1.5">
          {flow.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeStep
                  ? isBlue
                    ? "w-6 bg-blue-400"
                    : "w-6 bg-red-400"
                  : i < activeStep
                    ? isBlue
                      ? "w-1.5 bg-blue-400/40"
                      : "w-1.5 bg-red-400/40"
                    : "w-1.5 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <StepConnector activeStep={activeStep} isBlue={isBlue} />

      <div className="flex items-center gap-2 mb-5">
        {(() => {
          const Icon = flow.steps[activeStep].icon
          const isBell = activeStep === 0
          return (
            <motion.span
              key={activeStep}
              animate={isBell ? { rotate: [0, -14, 11, -8, 5, -2, 0] } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="inline-flex"
            >
              <Icon className={`w-4 h-4 ${isBlue ? "text-blue-400" : "text-red-400"}`} />
            </motion.span>
          )
        })()}
        <span className={`text-xs font-medium ${isBlue ? "text-blue-400" : "text-red-400"}`}>
          {flow.steps[activeStep].label}
        </span>
      </div>

      <div className="min-h-[168px]">
        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div
              key="notification"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 font-medium flex-shrink-0">
                {flow.review.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-medium">{flow.review.name}</span>
                  <span className="text-gray-600 text-xs">ahora</span>
                </div>
                <StarRow rating={flow.review.rating} />
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{flow.review.text}</p>
              </div>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-gray-400 text-xs leading-relaxed">{flow.review.text}</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isBlue ? "text-blue-400" : "text-red-400"}`} />
                </motion.div>
                <span className="text-gray-400 text-xs">Analizando reseña...</span>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {isBlue ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-blue-400 text-xs font-medium">Respuesta publicada</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400 text-xs font-medium">Formulario enviado</span>
                  </>
                )}
              </div>
              <div
                className={`rounded-xl p-4 border ${
                  isBlue ? "bg-blue-600/10 border-blue-500/20" : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <p className="text-gray-300 text-xs leading-relaxed">{flow.response}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function HowItWorksSection() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 3)
    }, CYCLE_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.section
      id="como-funciona"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#111b34_0%,_#0a0f1e_60%)]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          <motion.span
            variants={eyebrowVariants}
            className="text-xs sm:text-sm font-medium text-blue-400 uppercase tracking-wider"
          >
            Cómo funciona
          </motion.span>
          <motion.h2
            variants={titleVariants}
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-tight"
          >
            Así funciona Resply
          </motion.h2>
          <motion.span
            variants={underlineVariants}
            className="block h-[2px] w-16 bg-blue-500 rounded-full mx-auto mt-4 origin-left"
          />
          <motion.p
            variants={subtitleVariants}
            className="mt-4 text-base sm:text-lg text-gray-400 max-w-xl mx-auto"
          >
            Cada reseña que llega a tu negocio se procesa y responde sola, según las preferencias de tu negocio.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-6 md:gap-8"
        >
          <motion.div variants={cardVariants}>
            <FlowCard flow={positiveFlow} activeStep={step} />
          </motion.div>
          <motion.div variants={cardVariants}>
            <FlowCard flow={negativeFlow} activeStep={step} />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
