import { prisma } from "@/lib/prisma"
import type { BusinessAiConfigInput } from "@/lib/ai-config/schema"
import { DEFAULT_AI_CONFIG } from "@/lib/ai-config/defaults"
import { toBusinessAiConfigDto } from "@/lib/ai-config/mappers"
import type { BusinessAiConfigDto } from "@/lib/types"
import type { Prisma } from "@prisma/client"
import { Prisma as PrismaNamespace } from "@prisma/client"

export async function getBusinessAiConfig(
  businessId: string
): Promise<BusinessAiConfigDto> {
  const config = await prisma.businessAiConfig.findUnique({
    where: { businessId },
  })

  return toBusinessAiConfigDto(config)
}

export async function upsertBusinessAiConfig(
  businessId: string,
  input: BusinessAiConfigInput
): Promise<BusinessAiConfigDto> {
  const data: Prisma.BusinessAiConfigUpdateInput = {}

  if (input.tone !== undefined) data.tone = input.tone
  if (input.additionalInstructions !== undefined) {
    data.additionalInstructions = input.additionalInstructions
  }
  if (input.autoRespond !== undefined) data.autoRespond = input.autoRespond
  if (input.alertNegativeReviews !== undefined) {
    data.alertNegativeReviews = input.alertNegativeReviews
  }
  if (input.monthlySummary !== undefined) data.monthlySummary = input.monthlySummary
  if (input.send3StarReviewsForReview !== undefined) {
    data.send3StarReviewsForReview = input.send3StarReviewsForReview
  }
  if (input.advancedSettings !== undefined) {
    data.advancedSettings =
      input.advancedSettings === null
        ? PrismaNamespace.JsonNull
        : (input.advancedSettings as Prisma.InputJsonValue)
  }

  const config = await prisma.businessAiConfig.upsert({
    where: { businessId },
    create: {
      businessId,
      tone: input.tone ?? DEFAULT_AI_CONFIG.tone,
      additionalInstructions:
        input.additionalInstructions ?? DEFAULT_AI_CONFIG.additionalInstructions,
      autoRespond: input.autoRespond ?? DEFAULT_AI_CONFIG.autoRespond,
      alertNegativeReviews:
        input.alertNegativeReviews ?? DEFAULT_AI_CONFIG.alertNegativeReviews,
      monthlySummary: input.monthlySummary ?? DEFAULT_AI_CONFIG.monthlySummary,
      send3StarReviewsForReview:
        input.send3StarReviewsForReview ??
        DEFAULT_AI_CONFIG.send3StarReviewsForReview,
      advancedSettings:
        input.advancedSettings === null || input.advancedSettings === undefined
          ? undefined
          : (input.advancedSettings as Prisma.InputJsonValue),
    },
    update: data,
  })

  return toBusinessAiConfigDto(config)
}
