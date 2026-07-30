"use client"

import { signIn } from "next-auth/react"
import { GoogleAuthButton } from "@/components/premium-buttons"

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
                className="relative text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 h-px w-full bg-[#3b82f6] scale-x-0 origin-center transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <GoogleAuthButton size="sm" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
            <span className="hidden sm:inline">Iniciar sesión con Google</span>
            <span className="sm:hidden">Ingresar</span>
          </GoogleAuthButton>
        </div>
      </div>
    </nav>
  )
}
