"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, type ReactNode, type MouseEventHandler } from "react"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      whileHover={{ rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.97 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </motion.svg>
  )
}

/** White "Iniciar sesión con Google" button — shimmer sweep, spring scale, icon spin on hover. */
export function GoogleAuthButton({
  onClick,
  size = "lg",
  className = "",
  children,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  size?: "sm" | "lg"
  className?: string
  children: ReactNode
}) {
  const sizing = size === "lg" ? "gap-3 px-6 py-3 text-base" : "gap-2 px-4 py-2 text-sm"
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4"

  return (
    <>
      <style>{`
        @keyframes googleShimmerMove {
          from { background-position: -150% 0; }
          to { background-position: 150% 0; }
        }
        .google-shimmer {
          background: linear-gradient(120deg, transparent 30%, rgba(0,0,0,0.07) 50%, transparent 70%);
          background-size: 250% 100%;
          background-position: -150% 0;
        }
        .group:hover .google-shimmer {
          animation: googleShimmerMove 1s ease-in-out;
        }
      `}</style>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97, transition: { duration: 0 } }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`group relative overflow-hidden flex items-center bg-white text-gray-900 font-semibold rounded-full border border-black/5 hover:shadow-lg hover:shadow-white/20 transition-shadow duration-200 ${sizing} ${className}`}
      >
        <span className="google-shimmer absolute inset-0 pointer-events-none" aria-hidden />
        <GoogleIcon className={`relative z-10 flex-shrink-0 ${iconSize}`} />
        <span className="relative z-10">{children}</span>
      </motion.button>
    </>
  )
}

/** Transparent outlined button — brightening border + soft blue glow on hover. */
export function SecondaryButton({
  href,
  children,
  className = "",
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        boxShadow: hovered ? "0 0 20px rgba(59,130,246,0.3)" : "0 0 0px rgba(59,130,246,0)",
        transition: "box-shadow 0.3s ease, border-color 0.2s ease, color 0.2s ease",
      }}
      className={`inline-flex items-center text-gray-400 hover:text-white font-medium px-6 py-3 rounded-full border border-white/10 hover:border-white/60 ${className}`}
    >
      {children}
    </motion.a>
  )
}

/** Small pill link/button — brighter text, center-grown underline, sliding arrow, click flash. */
export function NavPill({
  href,
  onClick,
  children,
  className = "",
}: {
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
}) {
  const [flash, setFlash] = useState(false)

  const handleClick = () => {
    setFlash(true)
    window.setTimeout(() => setFlash(false), 400)
    onClick?.()
  }

  const sharedClassName = `group relative inline-flex items-center gap-1 overflow-hidden text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 text-xs font-medium px-3 py-1.5 rounded-full border border-white/5 hover:border-blue-500/20 transition-colors duration-200 ${className}`

  const content = (
    <>
      <span className="relative inline-block">
        {children}
        <span className="absolute left-1/2 -bottom-0.5 h-px w-full bg-blue-400 -translate-x-1/2 scale-x-0 origin-center transition-transform duration-200 group-hover:scale-x-100" />
      </span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-200 group-hover:translate-x-[3px]"
      >
        →
      </span>
      <AnimatePresence>
        {flash && (
          <motion.span
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-blue-400/40 rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  )

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={sharedClassName}>
        {content}
      </a>
    )
  }

  return (
    <button onClick={handleClick} className={sharedClassName}>
      {content}
    </button>
  )
}

/** Blue gradient primary CTA — spinning glow ring on hover, idle pulse, spring scale. */
export function PrimaryCTAButton({
  onClick,
  children,
  size = "default",
  className = "",
  wrapperClassName = "",
  showIcon = false,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
  size?: "default" | "lg"
  className?: string
  wrapperClassName?: string
  showIcon?: boolean
}) {
  const sizing = size === "lg" ? "px-14 h-14 text-base" : "px-10 h-14 text-base"

  return (
    <>
      <style>{`
        @keyframes ctaBorderSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes ctaPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .cta-pulse {
          animation: ctaPulse 2s ease-in-out infinite;
        }
        .group:hover .cta-pulse {
          animation-play-state: paused;
        }
        .group:hover .cta-border-ring {
          opacity: 1;
          animation: ctaBorderSpin 2.5s linear infinite;
        }
      `}</style>
      <motion.div
        className={`group relative inline-block rounded-full ${wrapperClassName}`}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 350, damping: 15 }}
      >
        <span
          aria-hidden
          className="cta-border-ring absolute -inset-1 rounded-full opacity-0 blur-[1px] pointer-events-none transition-opacity duration-300"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, #93c5fd 15%, transparent 35%)",
          }}
        />
        <button
          onClick={onClick}
          className={`cta-pulse relative z-10 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-300 ${sizing} ${className}`}
        >
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">{children}</span>
          {showIcon && (
            <span
              aria-hidden
              className="inline-block w-0 opacity-0 -translate-x-1 overflow-hidden transition-all duration-200 group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0"
            >
              →
            </span>
          )}
        </button>
      </motion.div>
    </>
  )
}
