"use client"

import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Resply
            </span>
          </a>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 sm:px-6 text-base sm:text-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Precio
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
