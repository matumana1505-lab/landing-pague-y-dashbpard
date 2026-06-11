"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"

interface EmptyStateProps {
  onConnectClick?: () => void
}

export function DashboardEmptyState({ onConnectClick }: EmptyStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center border-dashed">
        <div className="mb-6">
          <div className="inline-flex p-4 bg-primary/10 rounded-lg">
            <svg
              className="w-8 h-8 text-primary"
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
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          ¿Listo para empezar?
        </h2>

        <p className="text-muted-foreground mb-6">
          Conectá tu negocio de Google para comenzar a monitorear y responder
          reseñas automáticamente.
        </p>

        <Button
          onClick={onConnectClick}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3"
        >
          Conectar Google Business
        </Button>

        <p className="text-xs text-muted-foreground">
          Se abrirá una nueva ventana para autorizar Resply con tu cuenta de
          Google Business.
        </p>
      </Card>
    </div>
  )
}
