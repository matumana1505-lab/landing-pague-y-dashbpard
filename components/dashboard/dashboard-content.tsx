"use client"

import { signIn } from "next-auth/react"
import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ReviewInbox } from "@/components/dashboard/review-inbox"
import { StatsTab } from "@/components/dashboard/stats-tab"
import { AiConfigTab } from "@/components/dashboard/ai-config-tab"
import { ComplaintsTab } from "@/components/dashboard/complaints-tab"
import { AlertsTab } from "@/components/dashboard/alerts-tab"
import { OnboardingFlow } from "@/components/dashboard/onboarding/onboarding-flow"
import { TrialExpired } from "@/components/trial-expired"
import { demoReviews } from "@/components/dashboard/demo-data"
import { mockOnboardingState } from "@/lib/mock-data"
import {
  completeOnboarding,
  fetchReviewResponses,
  persistedBusinessToProfile,
  userSettingsToAiConfig,
} from "@/lib/api-client"
import {
  BusinessProfile,
  DashboardReview,
  OnboardingState,
  PersistedBusiness,
  ReviewResponseRecord,
  UserSettings,
} from "@/lib/types"

function mapReviewResponseToDashboardReview(record: ReviewResponseRecord): DashboardReview {
  return {
    id: record.reviewId,
    reviewerName: record.reviewerName ?? "Cliente de Google",
    reviewerPhotoUrl: record.reviewerPhotoUrl,
    rating: record.rating ?? 0,
    reviewText: record.reviewText,
    generatedText: record.generatedText || null,
    publishedText: record.publishedText,
    status: record.status,
    createdAt: record.createdAt,
  }
}

export function DashboardContent() {
  const {
    sessionStatus,
    businesses: ctxBusinesses,
    activeBusinessId,
    setActiveBusinessId: setCtxActiveBusinessId,
    userProfile,
    loading: ctxLoading,
    reload: ctxReload,
    error: ctxError,
    activeTab,
  } = useDashboard()

  const [onboardingState, setOnboardingState] = useState<OnboardingState>(mockOnboardingState)
  const [bootstrapError, setBootstrapError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<DashboardReview[]>(demoReviews)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const businesses = ctxBusinesses as PersistedBusiness[]
  const hasRealBusiness = businesses.some((business) => !business.isDemo)
  const isTrialExpired =
    hasRealBusiness &&
    Boolean(userProfile?.trialEndsAt) &&
    new Date(userProfile.trialEndsAt).getTime() < Date.now()

  const businessProfile = useMemo(() => {
    const activeBusiness = businesses.find((business) => business.id === activeBusinessId)
    return activeBusiness ? persistedBusinessToProfile(activeBusiness) : null
  }, [businesses, activeBusinessId])

  useEffect(() => {
    if (userProfile?.onboardingCompleted) {
      setOnboardingState({
        currentStep: "completed",
        googleConnected: true,
        responseToneSelected: true,
        automationConfigured: true,
      })
    }
  }, [userProfile])

  useEffect(() => {
    if (!hasRealBusiness || !activeBusinessId) {
      setReviews(demoReviews)
      return
    }

    let cancelled = false
    setReviewsLoading(true)
    fetchReviewResponses(activeBusinessId)
      .then((data) => {
        if (cancelled) return
        setReviews(data.responses.map(mapReviewResponseToDashboardReview))
      })
      .catch(() => {
        if (!cancelled) setReviews([])
      })
      .finally(() => {
        if (!cancelled) setReviewsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [hasRealBusiness, activeBusinessId])

  const handleConnectGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account",
    })
  }

  const handleBusinessChange = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId)
    if (!business) return

    void setCtxActiveBusinessId(businessId)
  }

  const handleBusinessSelected = () => {}

  const handleResponseGenerated = (reviewId: string, generatedText: string) => {
    setReviews((prev) =>
      prev.map((review) => (review.id === reviewId ? { ...review, generatedText, status: "GENERATED" } : review))
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

      await setCtxActiveBusinessId(data.business.id)
      await ctxReload()
    } catch (err) {
      setBootstrapError(
        err instanceof Error ? err.message : "Error al completar el onboarding"
      )
    }
  }

  if (sessionStatus === "loading" || ctxLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Cargando dashboard...</span>
      </div>
    )
  }

  if ((bootstrapError || ctxError) && onboardingState.currentStep === "completed") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md space-y-4 rounded-xl border border-white/[0.06] bg-[#0f1628] p-8 text-center">
          <p className="text-red-400">{bootstrapError ?? ctxError}</p>
          <button
            type="button"
            onClick={() => void ctxReload()}
            className="text-sm text-blue-400 hover:underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (isTrialExpired) {
    return <TrialExpired />
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

  const headerProfile = businessProfile ?? {
    id: "",
    name: hasRealBusiness ? "Sin negocio seleccionado" : "Tu Negocio (Demo)",
    isConnected: hasRealBusiness,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        businessProfile={headerProfile}
        businesses={businesses}
        activeBusinessId={activeBusinessId}
        isDemo={!hasRealBusiness}
        onBusinessChange={handleBusinessChange}
        onConnectClick={handleConnectGoogle}
      />

      {!hasRealBusiness && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-blue-900/60 to-blue-950 px-6 py-3">
          <p className="text-sm text-blue-200">
            Estás viendo datos de ejemplo · Conectá tu Google Business para empezar tu trial de 14 días gratis
          </p>
          <button
            type="button"
            onClick={handleConnectGoogle}
            className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Conectar mi negocio →
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {activeTab === "inbox" &&
          (reviewsLoading ? (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <ReviewInbox
              reviews={reviews}
              isDemo={!hasRealBusiness}
              businessId={activeBusinessId}
              onResponseGenerated={handleResponseGenerated}
            />
          ))}
        {activeTab === "stats" && <StatsTab reviews={reviews} />}
        {activeTab === "ai-config" && (
          <AiConfigTab businessId={activeBusinessId} businessName={businessProfile?.name ?? "tu negocio"} />
        )}
        {activeTab === "complaints" && <ComplaintsTab />}
        {activeTab === "alerts" && <AlertsTab reviews={reviews} />}
      </div>
    </div>
  )
}
