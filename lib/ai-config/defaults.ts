import type { BusinessAiConfigDto, ResponseTone } from "@/lib/types"

export const DEFAULT_AI_CONFIG: BusinessAiConfigDto = {
  tone: "professional",
  additionalInstructions: "",
  autoRespond: false,
  alertNegativeReviews: true,
  monthlySummary: true,
  send3StarReviewsForReview: false,
  advancedSettings: null,
}

export const TONE_LABELS: Record<ResponseTone, string> = {
  cercano: "Cercano",
  professional: "Profesional",
  formal: "Formal",
}

export const TONE_DESCRIPTIONS: Record<ResponseTone, string> = {
  cercano: "Cálido, cercano y personal",
  professional: "Cordial y profesional",
  formal: "Formal y corporativo",
}
