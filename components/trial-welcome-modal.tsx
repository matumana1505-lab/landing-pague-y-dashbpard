"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"

const STORAGE_KEY = "resply_demo_modal_shown"

interface TrialWelcomeModalProps {
  hasRealBusiness: boolean
}

export function TrialWelcomeModal({ hasRealBusiness }: TrialWelcomeModalProps) {
  const { status } = useSession()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (status !== "authenticated" || hasRealBusiness) return
    if (typeof window === "undefined") return
    const alreadyShown = window.localStorage.getItem(STORAGE_KEY)
    if (!alreadyShown) setOpen(true)
  }, [status, hasRealBusiness])

  const handleClose = () => {
    window.localStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-2xl border border-blue-500/30 bg-[#0a0e1a] p-8 text-center shadow-[0_0_60px_rgba(59,130,246,0.25)]"
          >
            <div className="mx-auto mb-5 flex items-center justify-center gap-2">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
                <rect x="2" y="2" width="24" height="20" rx="6" fill="#1e3a5f" />
                <rect x="2" y="2" width="24" height="20" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
                <path d="M8 22 L6 28 L14 22" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 7.5 L15.2 11H18.5L15.9 13.1L16.9 16.5L14 14.5L11.1 16.5L12.1 13.1L9.5 11H12.8Z" fill="#3b82f6" />
              </svg>
              <span className="text-lg font-semibold text-white">Resply</span>
            </div>

            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              ✨ Demo interactiva disponible
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white">¡Tu cuenta está lista!</h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Explorá el dashboard con datos de ejemplo y descubrí todo lo que Resply puede hacer por tu negocio.
            </p>

            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Probar el dashboard →
            </motion.button>

            <p className="mt-4 text-xs text-gray-500">Gratis, sin tarjeta de crédito</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
