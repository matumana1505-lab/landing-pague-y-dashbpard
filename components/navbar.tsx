"use client"

import { motion } from "framer-motion"
import { signIn } from "next-auth/react"

const links = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Precio", href: "#precio" },
  { label: "Contacto", href: "#contacto" },
]

export function Navbar() {
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
                className="relative text-sm text-gray-400 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 h-px w-full bg-blue-400 scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] hover:brightness-105"
          >
            <motion.svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            >
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.97 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </motion.svg>
            <span className="hidden sm:inline">Iniciar sesión con Google</span>
            <span className="sm:hidden">Ingresar</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
