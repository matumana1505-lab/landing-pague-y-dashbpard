"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { triggerTryClick } from "@/lib/utils"

export function HeroSection() {
  const [clicked, setClicked] = useState(false)

  const handleTryClick = () => {
    console.log("Hero: Probar gratis clicked")
    setClicked(true)
    triggerTryClick()
    setTimeout(() => setClicked(false), 2000)
  }

  return (
    <section id="inicio" className="pt-24 pb-12 md:pt-28 md:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-5">
            <span className="text-sm text-muted-foreground">
              Solución de reputación online para negocios locales
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance leading-[1.15]">
            Cada reseña sin respuesta te cuesta clientes. Resply las responde sola.
          </h1>

          {/* Subheadline */}
          <p className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto text-balance leading-relaxed">
            Ahorrá tiempo cuidando tu imagen en Google y mantené tu perfil activo con respuestas profesionales.
          </p>

          {/* Primary CTA - DOMINANT */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={handleTryClick}
              className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/95 rounded-full px-10 sm:px-14 lg:px-16 h-16 sm:h-18 text-lg sm:text-xl font-semibold shadow-2xl shadow-foreground/15 transition-all duration-200 hover:shadow-[0_25px_75px_-30px_rgba(15,23,42,0.45)] hover:scale-[1.03]"
            >
              Probar gratis
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto text-muted-foreground hover:text-foreground rounded-full px-6 h-12 text-sm"
            >
              <a href="#como-funciona">Ver cómo funciona</a>
            </Button>
            {clicked && (
              <div className="mt-2 text-sm text-primary-foreground">Scroll triggered</div>
            )}
          </div>
        </div>

        {/* Product Mockup */}
        <div className="mt-12 md:mt-14">
          <div className="relative mx-auto max-w-2xl">
            <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-1 bg-background rounded-md text-xs text-muted-foreground">
                    business.google.com
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs sm:text-sm shrink-0">
                    MG
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground text-sm">
                        María García
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {"Excelente atención y la comida espectacular. Volveremos sin duda!"}
                    </p>

                    <div className="mt-2.5 sm:mt-3 pl-3 sm:pl-4 border-l-2 border-primary/20">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-foreground">
                          Respuesta del negocio
                        </span>
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] sm:text-xs rounded-full">
                          Auto
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        {"¡Muchas gracias María! Nos alegra mucho que hayan disfrutado. Los esperamos pronto."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
