"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { GoogleAuthButton } from "@/components/premium-buttons"
import { AnimatePresence, motion } from "framer-motion"

const links = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Precio", href: "#precio" },
  { label: "Contacto", href: "#contacto" },
]

function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const name = session?.user?.name
  const image = session?.user?.image
  const initial = name?.[0]?.toUpperCase() ?? "?"

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Cuenta"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-blue-500/30 transition-shadow duration-200 hover:ring-2 hover:ring-blue-400/50"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name ?? "Usuario"}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-blue-500/20 text-sm font-semibold text-blue-300">
            {initial}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0a0f1e] shadow-xl shadow-black/40"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                router.push("/dashboard")
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Ir al dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                signOut({ callbackUrl: "/" })
              }}
              className="block w-full border-t border-white/10 px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const { status } = useSession()
  const isAuthenticated = status === "authenticated"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
              <rect x="2" y="2" width="24" height="20" rx="6" fill="#1e3a5f" />
              <rect x="2" y="2" width="24" height="20" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
              <path d="M8 22 L6 28 L14 22" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M14 7.5 L15.2 11H18.5L15.9 13.1L16.9 16.5L14 14.5L11.1 16.5L12.1 13.1L9.5 11H12.8Z" fill="#3b82f6" />
            </svg>
            <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Resply
            </span>
          </a>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 h-px w-full bg-[#3b82f6] scale-x-0 origin-center transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          {/* CTA */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <GoogleAuthButton size="sm" onClick={() => signIn("google", { callbackUrl: "/?welcome=true" })}>
              <span className="hidden sm:inline">Iniciar sesión con Google</span>
              <span className="sm:hidden">Ingresar</span>
            </GoogleAuthButton>
          )}
        </div>
      </div>
    </nav>
  )
}
