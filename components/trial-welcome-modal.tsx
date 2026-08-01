"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

const STORAGE_KEY = "resply_welcome_shown"

const particles = [
  { left: "12%", top: "18%", size: 5, delay: 0, duration: 2.6 },
  { left: "82%", top: "22%", size: 4, delay: 0.4, duration: 3.1 },
  { left: "22%", top: "78%", size: 6, delay: 0.8, duration: 2.8 },
  { left: "70%", top: "70%", size: 4, delay: 1.2, duration: 3.4 },
  { left: "48%", top: "12%", size: 5, delay: 0.6, duration: 2.9 },
  { left: "90%", top: "55%", size: 3, delay: 1.6, duration: 3.2 },
]

export function TrialWelcomeModal() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const wantsWelcome = searchParams.get("welcome") === "true"

  useEffect(() => {
    if (!wantsWelcome || status !== "authenticated") return

    const alreadyShown = window.localStorage.getItem(STORAGE_KEY)
    if (alreadyShown) {
      router.replace("/")
      return
    }

    setOpen(true)
  }, [wantsWelcome, status, router])

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
    router.replace("/")
  }

  const handleTryDashboard = () => {
    window.localStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
    router.push("/dashboard")
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, duration: 0.4 }}
            className="relative w-full max-w-md rounded-2xl border border-blue-500/30 bg-[#0a0e1a] p-8 text-center shadow-[0_0_80px_rgba(59,130,246,0.3)]"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              {particles.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-blue-400/60"
                  style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -36 }}
                  transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatDelay: 0.6 }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 text-gray-500 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10">
              <div className="mx-auto mb-5 flex items-center justify-center gap-2">
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
                  <rect x="2" y="2" width="24" height="20" rx="6" fill="#1e3a5f" />
                  <rect x="2" y="2" width="24" height="20" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M8 22 L6 28 L14 22" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M14 7.5 L15.2 11H18.5L15.9 13.1L16.9 16.5L14 14.5L11.1 16.5L12.1 13.1L9.5 11H12.8Z" fill="#3b82f6" />
                </svg>
                <span className="text-lg font-semibold text-white">Resply</span>
              </div>

              <div className="mb-3 text-4xl">🎉</div>

              <h2 className="mb-2 text-2xl font-bold text-white">¡Tu cuenta está lista!</h2>
              <p className="mb-5 text-sm leading-relaxed text-gray-400">
                Explorá todas las funciones de Resply con datos de ejemplo. Sin tarjeta de crédito.
              </p>

              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                🎮 Demo interactiva · 14 días gratis al conectar tu negocio
              </div>

              <motion.button
                type="button"
                onClick={handleTryDashboard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group relative block w-full overflow-hidden rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-500"
              >
                <span className="relative z-10">Probar el dashboard →</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.button>

              <p className="mt-4 text-xs text-gray-500">
                Podés conectar tu negocio real en cualquier momento
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
