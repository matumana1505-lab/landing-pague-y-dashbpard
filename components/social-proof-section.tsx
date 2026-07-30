"use client"

import { animate, motion, useInView, type Variants } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { UtensilsCrossed, Dumbbell, Scissors } from "lucide-react"

const stats = [
  { icon: UtensilsCrossed, value: 6, label: "Restaurantes" },
  { icon: Dumbbell, value: 5, label: "Gimnasios" },
  { icon: Scissors, value: 4, label: "Peluquerías" },
]

const businesses = [
  "La Pizzería del Centro",
  "Gym Pro Rosario",
  "Estética Valentina",
  "Hotel Plaza",
  "Odontología Del Valle",
]

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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [display, setDisplay] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => setDone(true),
    })
    return () => controls.stop()
  }, [isInView, value])

  return (
    <motion.span
      ref={ref}
      animate={done ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="inline-block"
    >
      {display}
    </motion.span>
  )
}

export function SocialProofSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e] border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 md:mb-14"
        >
          <motion.p
            variants={titleVariants}
            className="text-gray-500 text-xs font-medium uppercase tracking-widest"
          >
            Negocios que confían en Resply
          </motion.p>
          <motion.span
            variants={underlineVariants}
            className="block h-[2px] w-12 bg-blue-500 rounded-full mx-auto mt-4 origin-left"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-3 sm:divide-x sm:divide-white/10"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                className="flex flex-col items-center px-4 py-6 sm:py-0"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4"
                >
                  <Icon className="w-6 h-6 text-blue-400" />
                </motion.div>
                <p className="text-4xl sm:text-5xl font-bold text-blue-400 tabular-nums">
                  <Counter value={stat.value} />
                </p>
                <p className="text-white font-medium mt-2">{stat.label}</p>
                <p className="text-gray-400 text-sm mt-1">negocios activos</p>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="mt-14 md:mt-16 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-gray-600 text-xs sm:text-sm">
          {businesses.map((name, i) => (
            <span key={name} className="flex items-center gap-3">
              {name}
              {i < businesses.length - 1 && <span className="text-gray-700">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
