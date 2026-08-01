"use client"

import { useToast } from "@/hooks/use-toast"

export function TrialExpired() {
  const { toast } = useToast()

  const handleHire = () => {
    toast({
      title: "Próximamente disponible",
      description: "Muy pronto vas a poder contratar Resply directamente desde acá.",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tu período de prueba venció</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Contratá Resply para seguir respondiendo tus reseñas automáticamente
          </p>
        </div>

        <div className="py-2">
          <span className="text-4xl font-bold text-foreground">$49.000</span>
          <span className="text-muted-foreground"> ARS/mes</span>
        </div>

        <button
          type="button"
          onClick={handleHire}
          className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Contratar ahora →
        </button>

        <a
          href="mailto:hola@resply.io"
          className="block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Hablar con el equipo
        </a>
      </div>
    </div>
  )
}
