"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export function MidPageCTA() {
  return (
    <section className="py-10 md:py-14 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-base sm:text-lg text-gray-400 mb-5">
          Dejá de perder tiempo respondiendo reseñas una por una.
        </p>
        <Button
          size="lg"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-blue-600 text-white hover:bg-blue-500 rounded-full px-10 h-14 text-base font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] hover:brightness-110"
        >
          Probar gratis
        </Button>
      </div>
    </section>
  )
}
