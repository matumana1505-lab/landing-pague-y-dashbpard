"use client"

import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsSummary } from "@/components/dashboard/metrics-summary"
import { RequiresAttentionSection } from "@/components/dashboard/requires-attention-section"
import { ReviewsList } from "@/components/dashboard/reviews-list"
import { ReviewResponseDialog } from "@/components/dashboard/review-response-dialog"
import { OnboardingFlow } from "@/components/dashboard/onboarding/onboarding-flow"
import {
  mockBusinessProfile,
  mockReviews,
  mockMetrics,
  mockUserSettings,
  mockOnboardingState,
} from "@/lib/mock-data"
import { Review, UserSettings, OnboardingState, BusinessProfile } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export function DashboardContent() {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(mockBusinessProfile)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [userSettings, setUserSettings] = useState<UserSettings>(mockUserSettings)
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(mockOnboardingState)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showResponseDialog, setShowResponseDialog] = useState(false)

  const handleConnectGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account",
    })
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const stored = window.localStorage.getItem("selected-google-business")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as BusinessProfile
        setBusinessProfile((prev) => ({
          ...prev,
          ...parsed,
          isConnected: true,
          name: parsed.name || prev.name,
          accountId: parsed.accountId || prev.accountId,
          locationId: parsed.locationId || prev.locationId,
          address: parsed.address || prev.address,
          phone: parsed.phone || prev.phone,
        }))
      } catch {
        window.localStorage.removeItem("selected-google-business")
      }
    }
  }, [])

  const handleBusinessSelected = (selectedBusiness: BusinessProfile) => {
    setBusinessProfile((prev) => {
      const nextProfile = {
        ...prev,
        ...selectedBusiness,
        isConnected: true,
        name: selectedBusiness.name || prev.name,
        accountId: selectedBusiness.accountId || prev.accountId,
        locationId: selectedBusiness.locationId || prev.locationId,
        address: selectedBusiness.address || prev.address,
        phone: selectedBusiness.phone || prev.phone,
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("selected-google-business", JSON.stringify(nextProfile))
      }

      return nextProfile
    })
  }

  const handleViewResponse = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId)
    if (review) {
      setSelectedReview(review)
      setShowResponseDialog(true)
    }
  }

  const handleApproveResponse = (reviewId: string, response: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              hasResponse: true,
              response,
              responseDate: new Date(),
            }
          : r
      )
    )
    setShowResponseDialog(false)
  }

  const handleOnboardingComplete = (settings: UserSettings) => {
    setUserSettings(settings)
    setOnboardingState({
      currentStep: "completed",
      googleConnected: true,
      responseToneSelected: true,
      automationConfigured: true,
    })
    setBusinessProfile((prev) => ({
      ...prev,
      isConnected: true,
    }))

    // Simular respuestas automáticas para reseñas de 4 y 5 estrellas
    setReviews((prev) =>
      prev.map((r) => {
        if ((r.rating === 4 || r.rating === 5) && !r.hasResponse) {
          // Aquí se generaría una respuesta según el tono
          const tones: Record<string, string> = {
            cercano: "¡Gracias por tu reseña! Nos alegra mucho que te haya gustado.",
            professional: "Gracias por tu confianza. Continuaremos mejorando nuestro servicio.",
            formal: "Le agradecemos sinceramente por su excelente evaluación.",
          }
          return {
            ...r,
            hasResponse: true,
            response: tones[settings.tone] || "Gracias por tu reseña.",
            responseDate: new Date(),
          }
        }
        return r
      })
    )
  }

  // Si el onboarding no está completado, mostrar el flujo
  if (onboardingState.currentStep !== "completed") {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        initialState={onboardingState}
        onBusinessSelected={handleBusinessSelected}
      />
    )
  }

  // Dashboard principal después del onboarding
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader businessProfile={businessProfile} onConnectClick={handleConnectGoogle} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Metrics Summary */}
          <MetricsSummary metrics={mockMetrics} />

          {/* Requires Attention Section */}
          <RequiresAttentionSection
            reviews={reviews}
            tone={userSettings.tone}
            onApproveResponse={handleApproveResponse}
          />

          {/* Tabs para secciones adicionales */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Últimas reseñas</TabsTrigger>
              <TabsTrigger value="respondidas">Reseñas respondidas</TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Todas las reseñas ({reviews.length} total)
                </h2>
                <ReviewsList reviews={reviews} onViewResponse={handleViewResponse} />
              </div>
            </TabsContent>

            {/* Respondidas Tab */}
            <TabsContent value="respondidas" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Reseñas respondidas ({reviews.filter((r) => r.hasResponse).length})
                </h2>
                <div className="grid gap-4">
                  {reviews.filter((r) => r.hasResponse).length === 0 ? (
                    <Card className="p-12 text-center">
                      <p className="text-slate-600">Aún no hay reseñas respondidas.</p>
                    </Card>
                  ) : (
                    <ReviewsList
                      reviews={reviews.filter((r) => r.hasResponse)}
                      onViewResponse={handleViewResponse}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Review Response Dialog */}
      <ReviewResponseDialog
        review={selectedReview}
        open={showResponseDialog}
        onOpenChange={setShowResponseDialog}
      />
    </div>
  )
}
