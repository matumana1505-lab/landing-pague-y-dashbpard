"use client"

import { motion, useScroll, useTransform, useSpring, type Variants } from "framer-motion"
import { useState, useEffect } from "react"
import { Store, Star, CheckCircle2 } from "lucide-react"
import { DashboardMock, Counter } from "@/components/dashboard-mock"
import { GoogleAuthButton, SecondaryButton, NavPill } from "@/components/premium-buttons"
import { signIn } from "next-auth/react"

const headlineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const lineOneWords = ["Respondé", "automáticamente"]
const lineTwoWords = ["tus", "reseñas", "de", "Google"]

function FloatingStatCard({
  icon: Icon,
  to,
  decimals = 0,
  suffix = "",
  label,
  position,
  rotateClass = "",
  entered,
  delay,
  fromX,
  fromY,
}: {
  icon: typeof Store
  to: number
  decimals?: number
  suffix?: string
  label: string
  position: string
  rotateClass?: string
  entered: boolean
  delay: number
  fromX: number
  fromY: number
}) {
  const [countUp, setCountUp] = useState(false)

  useEffect(() => {
    if (!entered) return
    const t = setTimeout(() => setCountUp(true), delay * 1000 + 300)
    return () => clearTimeout(t)
  }, [entered, delay])

  return (
    <motion.div
      initial={{ opacity: 0, x: fromX, y: fromY, scale: 0.9 }}
      animate={entered ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 220, damping: 14, delay }}
      className={`absolute z-20 hidden lg:block p-px rounded-2xl bg-gradient-to-br from-white/20 via-blue-400/10 to-transparent shadow-2xl shadow-black/40 ${position} ${rotateClass}`}
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 0.9, scale: 1 }}
        animate={entered ? { opacity: 0, scale: 1.1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
        className="absolute inset-0 rounded-2xl border-2 border-blue-400 pointer-events-none"
      />
      <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-[0_0_30px_-5px_rgba(59,130,246,0.45)]">
        <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4.5 h-4.5 text-blue-400" />
        </div>
        <div>
          <p className="text-white text-2xl font-bold leading-tight">
            {countUp ? <Counter to={to} decimals={decimals} duration={400} suffix={suffix} /> : `${(0).toFixed(decimals)}${suffix}`}
          </p>
          <p className="text-gray-400 text-xs leading-tight whitespace-nowrap">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, { stiffness: 300, damping: 40 })

  const dashboardScale = useTransform(smoothScrollY, [0, 400], [1, 0.92])
  const dashboardY = useTransform(smoothScrollY, [0, 400], [0, -12])

  const [entered, setEntered] = useState(false)

  return (
    <section className="relative min-h-screen bg-[#0a0f1e] overflow-hidden flex flex-col items-center justify-start pt-32 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a2744_0%,_#0a0f1e_60%)]" />

      {/* Slow-moving light glow, CSS-only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-glow hero-glow-a absolute w-[36rem] h-[36rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="hero-glow hero-glow-b absolute w-[28rem] h-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>
      <style>{`
        @keyframes heroGlowA {
          0%, 100% { transform: translate(-15%, -10%) scale(1); }
          50% { transform: translate(10%, 15%) scale(1.2); }
        }
        @keyframes heroGlowB {
          0%, 100% { transform: translate(10%, 20%) scale(1); }
          50% { transform: translate(-15%, -5%) scale(1.1); }
        }
        .hero-glow-a { top: -10%; left: -5%; animation: heroGlowA 22s ease-in-out infinite; }
        .hero-glow-b { bottom: -15%; right: -10%; animation: heroGlowB 26s ease-in-out infinite; }
        @keyframes badgeShimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
        .badge-shimmer {
          animation: badgeShimmer 1.1s ease-in-out 0.6s 1;
        }
      `}</style>

      <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-8 overflow-hidden"
        >
          <span className="badge-shimmer absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Automatización simple para negocios locales
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={headlineContainer}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
        >
          {lineOneWords.map((word) => (
            <motion.span key={word} variants={wordVariant} className="inline-block mr-3 md:mr-4">
              {word}
            </motion.span>
          ))}
          <br />
          <span className="text-blue-400">
            {lineTwoWords.map((word) => (
              <motion.span key={word} variants={wordVariant} className="inline-block mr-3 md:mr-4 last:mr-0">
                {word}
              </motion.span>
            ))}
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
              transition={{ duration: 1.6, delay: 0.9, times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 1], ease: "linear" }}
              className="inline-block w-[3px] md:w-1 h-[0.85em] bg-blue-400 ml-1 align-middle"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Ahorrá horas respondiendo reseñas y mantené tu negocio siempre activo en Google.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <GoogleAuthButton size="lg" onClick={() => signIn("google", { callbackUrl: "/?welcome=true" })}>
            Iniciar sesión con Google
          </GoogleAuthButton>

          <SecondaryButton href="#como-funciona">Ver cómo funciona</SecondaryButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex items-center justify-center gap-2 flex-wrap mt-5"
        >
          <NavPill href="#ejemplos">Ver ejemplos</NavPill>
          <NavPill href="#precio">Ver precios</NavPill>
          <NavPill onClick={() => signIn("google", { callbackUrl: "/?welcome=true" })}>Empezar gratis</NavPill>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{ scale: dashboardScale, y: dashboardY }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-32 pt-10"
      >
        <motion.div
          className="relative"
          viewport={{ once: true, amount: 0.4 }}
          onViewportEnter={() => setEntered(true)}
        >
          <DashboardMock entered={entered} />

          <FloatingStatCard
            icon={Store}
            to={15}
            suffix="+"
            label="Negocios activos"
            position="top-8 -left-32"
            rotateClass="-rotate-2"
            entered={entered}
            delay={2.2}
            fromX={-50}
            fromY={-20}
          />
          <FloatingStatCard
            icon={Star}
            to={4.8}
            decimals={1}
            suffix="★"
            label="Calificación promedio"
            position="top-4 -right-32"
            rotateClass="rotate-1"
            entered={entered}
            delay={2.3}
            fromX={50}
            fromY={-20}
          />
          <FloatingStatCard
            icon={CheckCircle2}
            to={98}
            suffix="%"
            label="Reseñas respondidas"
            position="bottom-16 -right-28"
            rotateClass="-rotate-1"
            entered={entered}
            delay={2.4}
            fromX={50}
            fromY={20}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
