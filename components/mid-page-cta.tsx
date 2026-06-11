"use client"

import { Button } from "@/components/ui/button"
import { triggerTryClick } from "@/lib/utils"

export function MidPageCTA() {
  return (
    <section className="py-10 md:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-base sm:text-lg text-muted-foreground mb-5">
          Dejá de perder tiempo respondiendo reseñas una por una.
        </p>
        <Button
          size="lg"
          onClick={() => triggerTryClick()}
          className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-10 h-14 text-base font-semibold shadow-lg shadow-foreground/10 transition-all duration-200 hover:shadow-xl hover:shadow-foreground/15 hover:scale-[1.02]"
        >
          Probar gratis
        </Button>
      </div>
    </section>
  )
}
