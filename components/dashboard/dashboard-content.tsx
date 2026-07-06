"use client"

import { signIn } from "next-auth/react"
import { useEffect, useMemo, useState } from "react"
import { useDashboard } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsSummary } from "@/components/dashboard/metrics-summary"
import { RequiresAttentionSection } from "@/components/dashboard/requires-attention-section"
import { ReviewsList } from "@/components/dashboard/reviews-list"
import { ReviewResponseDialog } from "@/components/dashboard/review-response-dialog"
import { OnboardingFlow } from "@/components/dashboard/onboarding/onboarding-flow"
import { AiSettingsPanel } from "@/components/dashboard/ai-settings-panel"
import { AutomationSettings } from "@/components/dashboard/automation-settings"
import {
  mockReviews,
  mockMetrics,
  mockOnboardingState,
} from "@/lib/mock-data"
import {
  aiConfigToUserSettings,
  completeOnboarding,
  fetchReviewResponses,
  persistedBusinessToProfile,
  userSettingsToAiConfig,
} from "@/lib/api-client"
import { Review, UserSettings, OnboardingState, BusinessProfile, PersistedBusiness } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useBusinessAiConfig } from "@/hooks/use-business-ai-config"
import { Loader2 } from "lucide-react"

export function DashboardContent() {
  const { sessionStatus, businesses: ctxBusinesses, activeBusinessId: ctxActiveBusinessId, setActiveBusinessId: setCtxActiveBusinessId, userProfile, loading: ctxLoading, reload: ctxReload, error: ctxError } = useDashboard()
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(mockOnboardingState)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  
  const [bootstrapError, setBootstrapError] = useState<string | null>(null)
  const businesses = ctxBusinesses as PersistedBusiness[]
  const activeBusinessId = ctxActiveBusinessId

  const {
    config: aiConfig,
    isLoading: isConfigLoading,
    isSaving: isConfigSaving,
    isDefault: isConfigDefault,
    updateConfig,
  } = useBusinessAiConfig({
    businessId: activeBusinessId,
    autoSave: true,
  })

  const userSettings: UserSettings = aiConfigToUserSettings(aiConfig)
  const businessProfile = useMemo(() => {
    const activeBusiness = businesses.find((business) => business.id === activeBusinessId)
    return activeBusiness ? persistedBusinessToProfile(activeBusiness) : null
  }, [businesses, activeBusinessId])

  useEffect(() => {
    if (userProfile) {
      if (userProfile.onboardingCompleted) {
        setOnboardingState({
          currentStep: "completed",
          googleConnected: true,
          responseToneSelected: true,
          automationConfigured: true,
        })
      }
    }
  }, [userProfile])

  useEffect(() => {
    const loadPersistedResponses = async () => {
      if (!activeBusinessId) return

      try {
        const data = await fetchReviewResponses(activeBusinessId)
        setReviews((prev) =>
          prev.map((review) => {
            const persisted = data.responses.find((item) => item.reviewId === review.id)
            if (!persisted) return review

            return {
              ...review,
              hasResponse: Boolean(persisted.publishedText || persisted.generatedText),
              response: persisted.publishedText ?? persisted.generatedText,
              responseDate: persisted.publishedAt ? new Date(persisted.publishedAt) : undefined,
            }
          })
        )
      } catch {
        // Se mantiene el estado actual si no hay respuestas persistidas.
      }
    }

    void loadPersistedResponses()
  }, [activeBusinessId])

  const handleConnectGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account",
    })
  }

  const handleBusinessSelected = () => {
  }

  const handleBusinessChange = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId)
    if (!business) return

    void setCtxActiveBusinessId(businessId)
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

  const handleGenerateResponse = (reviewId: string, response: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              response,
              hasResponse: false,
              responseDate: undefined,
            }
          : review
      )
    )
  }

  const handleOnboardingComplete = async (
    settings: UserSettings,
    selectedBusiness: BusinessProfile | null
  ) => {
    if (!selectedBusiness?.accountId || !selectedBusiness.locationId) {
      setBootstrapError("Debes seleccionar un negocio antes de continuar.")
      return
    }

    try {
      const data = await completeOnboarding({
        business: {
          googleAccountId: selectedBusiness.accountId,
          googleLocationId: selectedBusiness.locationId,
          name: selectedBusiness.name,
          address: selectedBusiness.address,
          phone: selectedBusiness.phone,
          isDemo: selectedBusiness.id.startsWith("demo"),
        },
        aiConfig: userSettingsToAiConfig(settings),
      })

      setOnboardingState({
        currentStep: "completed",
        googleConnected: true,
        responseToneSelected: true,
        automationConfigured: true,
      })

      // Update central dashboard state: set active business and reload lists
      await setCtxActiveBusinessId(data.business.id)
      await ctxReload()
    } catch (err) {
      setBootstrapError(
        err instanceof Error ? err.message : "Error al completar el onboarding"
      )
    }
  }

  const handleAutomationUpdate = (settings: UserSettings) => {
    updateConfig(userSettingsToAiConfig(settings))
  }

  if (sessionStatus === "loading" || ctxLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Cargando dashboard...</span>
      </div>
    )
  }

  if ((bootstrapError || ctxError) && onboardingState.currentStep === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center space-y-4">
          <p className="text-destructive">{bootstrapError ?? ctxError}</p>
          <button
            type="button"
            onClick={() => void ctxReload()}
            className="text-sm text-primary hover:underline"
          >
            Reintentar
          </button>
        </Card>
      </div>
    )
  }

  if (onboardingState.currentStep !== "completed") {
    return (
      <>
        {bootstrapError && (
          <div className="bg-destructive/10 text-destructive text-sm text-center py-2 px-4">
            {bootstrapError}
          </div>
        )}
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          initialState={onboardingState}
          onBusinessSelected={handleBusinessSelected}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        businessProfile={
          businessProfile ?? {
            id: "",
            name: "Sin negocio seleccionado",
            isConnected: false,
          }
        }
        businesses={businesses}
        activeBusinessId={activeBusinessId}
        onBusinessChange={handleBusinessChange}
        onConnectClick={handleConnectGoogle}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <MetricsSummary metrics={mockMetrics} />

          <RequiresAttentionSection
            reviews={reviews}
            tone={userSettings.tone}
            businessId={activeBusinessId}
            businessName={businessProfile?.name ?? "Tu negocio"}
            additionalInstructions={aiConfig.additionalInstructions}
            onApproveResponse={handleApproveResponse}
            onGenerateResponse={handleGenerateResponse}
          />

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Últimas reseñas</TabsTrigger>
              <TabsTrigger value="respondidas">Reseñas respondidas</TabsTrigger>
              <TabsTrigger value="settings">Configuración IA</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Todas las reseñas ({reviews.length} total)
                </h2>
                <ReviewsList reviews={reviews} onViewResponse={handleViewResponse} />
              </div>
            </TabsContent>

            <TabsContent value="respondidas" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Reseñas respondidas ({reviews.filter((r) => r.hasResponse).length})
                </h2>
                <div className="grid gap-4">
                  {reviews.filter((r) => r.hasResponse).length === 0 ? (
                    <Card className="p-12 text-center">
                      <p className="text-muted-foreground">Aún no hay reseñas respondidas.</p>
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

            <TabsContent value="settings" className="space-y-6">
              {activeBusinessId && businessProfile ? (
                <>
                  <AiSettingsPanel
                    config={aiConfig}
                    businessName={businessProfile.name}
                    isLoading={isConfigLoading}
                    isSaving={isConfigSaving}
                    isDefault={isConfigDefault}
                    onConfigChange={updateConfig}
                  />
                  <AutomationSettings
                    key={activeBusinessId}
                    settings={userSettings}
                    onUpdateSettings={handleAutomationUpdate}
                  />
                </>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Selecciona un negocio para configurar sus respuestas automáticas.
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ReviewResponseDialog
        review={selectedReview}
        open={showResponseDialog}
        onOpenChange={setShowResponseDialog}
      />
    </div>
  )
}
