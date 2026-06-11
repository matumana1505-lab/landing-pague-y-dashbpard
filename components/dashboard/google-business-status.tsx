"use client"

import { BusinessProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface GoogleBusinessStatusProps {
  businessProfile: BusinessProfile
  onConnectClick?: () => void
}

export function GoogleBusinessStatus({
  businessProfile,
  onConnectClick,
}: GoogleBusinessStatusProps) {
  if (businessProfile.isConnected) {
    return (
      <Card className="p-6 border-green-500/20 bg-green-500/5">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Google Business conectado
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                📍 {businessProfile.address || "Dirección no disponible"}
              </p>
              <p>📞 {businessProfile.phone || "Teléfono no disponible"}</p>
              {businessProfile.lastSyncedAt && (
                <p className="text-xs">
                  Última sincronización:{" "}
                  {formatDistanceToNow(businessProfile.lastSyncedAt, {
                    locale: es,
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-amber-500/20 bg-amber-500/5">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">
            Google Business no conectado
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Conectá tu negocio para comenzar a monitorear y responder reseñas
            automáticamente.
          </p>
          <Button
            onClick={onConnectClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            Conectar Google Business
          </Button>
        </div>
      </div>
    </Card>
  )
}
