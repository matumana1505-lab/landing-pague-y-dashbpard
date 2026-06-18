import type { BusinessAiConfig } from "@prisma/client"
import type { BusinessAiConfigDto } from "@/lib/types"
import { DEFAULT_AI_CONFIG } from "@/lib/ai-config/defaults"

export function toBusinessAiConfigDto(
  config: BusinessAiConfig | null | undefined
): BusinessAiConfigDto {
  if (!config) {
    return { ...DEFAULT_AI_CONFIG }
  }

  return {
    tone: config.tone,
    additionalInstructions: config.additionalInstructions,
    autoRespond: config.autoRespond,
    alertNegativeReviews: config.alertNegativeReviews,
    monthlySummary: config.monthlySummary,
    send3StarReviewsForReview: config.send3StarReviewsForReview,
    advancedSettings:
      config.advancedSettings && typeof config.advancedSettings === "object"
        ? (config.advancedSettings as Record<string, unknown>)
        : null,
  }
}
