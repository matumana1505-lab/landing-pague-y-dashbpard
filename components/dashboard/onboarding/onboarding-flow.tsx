"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { BusinessProfile, OnboardingState, UserSettings } from "@/lib/types"
import { Step1ConnectGoogle } from "./step-1-connect-google"
import { Step2CustomizeResponses } from "./step-2-customize-responses"
import { Step3ConfigureAutomation } from "./step-3-configure-automation"

interface OnboardingFlowProps {
  onComplete: (settings: UserSettings) => void
  initialState?: OnboardingState
  onBusinessSelected?: (business: BusinessProfile) => void
}

export function OnboardingFlow({ onComplete, initialState, onBusinessSelected }: OnboardingFlowProps) {
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

  const handleCustomizeResponses = (
    tone: "cercano" | "professional" | "formal",
    instructions: string
  ) => {
    setTempSettings((prev) => ({
      ...prev,
      tone,
      additionalInstructions: instructions,
    }))
    setState((prev) => ({
      ...prev,
      responseToneSelected: true,
      currentStep: "automation",
    }))
  }

  const handleConfigureAutomation = (config: {
    autoRespondPositive: boolean
    alertNegative: boolean
    monthlySummary: boolean
    send3StarForReview: boolean
  }) => {
    const finalSettings: UserSettings = {
      tone: (tempSettings.tone as "cercano" | "professional" | "formal") || "professional",
      autoRespond: config.autoRespondPositive,
      alertNegativeReviews: config.alertNegative,
      monthlySummary: config.monthlySummary,
      send3StarReviewsForReview: config.send3StarForReview,
      additionalInstructions: tempSettings.additionalInstructions || "",
    }

    onComplete(finalSettings)
  }

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
        <Step2CustomizeResponses onContinue={handleCustomizeResponses} />
      )}
      {state.currentStep === "automation" && (
        <Step3ConfigureAutomation onActivate={handleConfigureAutomation} />
      )}
    </>
  )
}
