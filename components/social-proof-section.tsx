"use client"

import { animate, motion, useInView, type Variants } from "framer-motion"
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react"
import { Store, Star, CheckCircle2, Clock } from "lucide-react"

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const metricContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const metricItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const categoryContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
}

const categoryItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

const categories = [
  { emoji: "🍽️", label: "6 restaurantes" },
  { emoji: "💪", label: "5 gimnasios" },
  { emoji: "✂️", label: "4 peluquerías" },
]

function AnimatedNumber({ to, decimals = 0, inView }: { to: number; decimals?: number; inView: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, to])

  return <>{display.toFixed(decimals)}</>
}

function MetricItem({
  icon: Icon,
  iconClassName,
  numberSize = "text-6xl md:text-8xl",
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  iconClassName: string
  numberSize?: string
  label: string
  children: ReactNode
}) {
  return (
    <motion.div variants={metricItemVariants} className="flex-1 flex flex-col items-center px-6 py-8 md:py-0">
      <Icon className={`w-5 h-5 mb-4 ${iconClassName}`} />
      <p
        className={`${numberSize} font-bold text-white tabular-nums transition-[text-shadow] duration-300 hover:[text-shadow:0_0_30px_rgba(59,130,246,0.3)]`}
      >
        {children}
      </p>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </motion.div>
  )
}

function Divider() {
  return (
    <div
      aria-hidden
      className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/10 to-transparent"
    />
  )
}

export function SocialProofSection() {
  const rowRef = useRef<HTMLDivElement>(null)
  const rowInView = useInView(rowRef, { once: true, margin: "-100px" })

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="relative max-w-5xl mx-auto text-center"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-blue-400/70 uppercase mb-14 md:mb-16">
          Números que hablan
        </p>

        <motion.div
          ref={rowRef}
          variants={metricContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-y-10 md:gap-y-0"
        >
          <MetricItem icon={Store} iconClassName="text-blue-400" label="Negocios activos">
            <AnimatedNumber to={15} inView={rowInView} />+
          </MetricItem>

          <Divider />

          <MetricItem icon={Star} iconClassName="text-yellow-400" label="Calificación promedio">
            <AnimatedNumber to={4.8} decimals={1} inView={rowInView} />
            <span className="text-yellow-400">★</span>
          </MetricItem>

          <Divider />

          <MetricItem icon={CheckCircle2} iconClassName="text-blue-400" label="Reseñas respondidas">
            <AnimatedNumber to={98} inView={rowInView} />%
          </MetricItem>

          <Divider />

          <MetricItem
            icon={Clock}
            iconClassName="text-blue-400"
            numberSize="text-5xl md:text-7xl"
            label="Tiempo de respuesta"
          >
            &lt;2min
          </MetricItem>
        </motion.div>

        <div className="border-t border-white/[0.08] mt-16 md:mt-20 pt-10">
          <motion.div
            variants={categoryContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-gray-500"
          >
            {categories.map((cat, i) => (
              <motion.span key={cat.label} variants={categoryItemVariants} className="flex items-center gap-3">
                <span>
                  {cat.emoji} {cat.label}
                </span>
                {i < categories.length - 1 && <span className="text-gray-700">·</span>}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
