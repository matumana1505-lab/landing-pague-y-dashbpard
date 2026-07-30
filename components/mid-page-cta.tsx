"use client"

import { PrimaryCTAButton } from "@/components/premium-buttons"
import { signIn } from "next-auth/react"

export function MidPageCTA() {
  return (
    <section className="py-10 md:py-14 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-base sm:text-lg text-gray-400 mb-5">
          Dejá de perder tiempo respondiendo reseñas una por una.
        </p>
        <PrimaryCTAButton onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Probar gratis
        </PrimaryCTAButton>
      </div>
    </section>
  )
}
