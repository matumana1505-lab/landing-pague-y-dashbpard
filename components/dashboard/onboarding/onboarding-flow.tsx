"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { BusinessProfile, OnboardingState, UserSettings } from "@/lib/types"
import { Step1ConnectGoogle } from "./step-1-connect-google"
import { Step2CustomizeResponses } from "./step-2-customize-responses"


interface OnboardingFlowProps {
  onComplete: (settings: UserSettings, business: BusinessProfile | null) => void
  initialState?: OnboardingState
  onBusinessSelected?: (business: BusinessProfile) => void
}

export function OnboardingFlow({
  onComplete,
  initialState,
  onBusinessSelected,
}: OnboardingFlowProps) {
  const [state, setState] = useState<OnboardingState>(
    initialState || {
      currentStep: "connect",
      googleConnected: false,
      responseToneSelected: false,
      automationConfigured: false,
    }
  )

  const [tempSettings, setTempSettings] = useState<Partial<UserSettings>>({})
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConnectGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account",
    })
  }

  const handleBusinessSelected = (business: BusinessProfile) => {
    setSelectedBusiness(business)
    onBusinessSelected?.(business)
    setState((prev) => ({
      ...prev,
      googleConnected: true,
    }))
  }

  const handleContinueFromConnect = () => {
    if (!selectedBusiness) return

    setState((prev) => ({
      ...prev,
      googleConnected: true,
      currentStep: "customize",
    }))
  }

const handleCustomizeResponses = async (
  tone: "cercano" | "professional" | "formal",
  instructions: string
) => {
  const finalSettings: UserSettings = {
    tone,
    autoRespond: true,
    alertNegativeReviews: true,
    monthlySummary: true,
    send3StarReviewsForReview: true,
    additionalInstructions: instructions,
  }

  setTempSettings((prev) => ({
    ...prev,
    tone,
    additionalInstructions: instructions,
  }))

  setState((prev) => ({
    ...prev,
    responseToneSelected: true,
  }))

  setIsSubmitting(true)

  try {
    await onComplete(finalSettings, selectedBusiness)
  } finally {
    setIsSubmitting(false)
  }}

  return (
    <>
      {state.currentStep === "connect" && (
        <Step1ConnectGoogle
          onConnect={handleConnectGoogle}
          onBusinessSelected={handleBusinessSelected}
          onContinue={handleContinueFromConnect}
          selectedBusiness={selectedBusiness}
        />
      )}
      {state.currentStep === "customize" && (
        <Step2CustomizeResponses
          onContinue={handleCustomizeResponses}
          businessName={selectedBusiness?.name}
      />
    )}
  </>
)
}
