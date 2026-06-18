import { z } from "zod"

export const responseToneSchema = z.enum(["cercano", "professional", "formal"])

export const businessAiConfigSchema = z.object({
  tone: responseToneSchema.optional(),
  additionalInstructions: z.string().max(4000).optional(),
  autoRespond: z.boolean().optional(),
  alertNegativeReviews: z.boolean().optional(),
  monthlySummary: z.boolean().optional(),
  send3StarReviewsForReview: z.boolean().optional(),
  advancedSettings: z.record(z.unknown()).nullable().optional(),
})

export const upsertBusinessSchema = z.object({
  googleAccountId: z.string().min(1),
  googleLocationId: z.string().min(1),
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  isDemo: z.boolean().optional(),
})

export const updateActiveBusinessSchema = z.object({
  activeBusinessId: z.string().min(1).nullable(),
})

export const completeOnboardingSchema = z.object({
  business: upsertBusinessSchema,
  aiConfig: businessAiConfigSchema,
})

export type BusinessAiConfigInput = z.infer<typeof businessAiConfigSchema>
export type UpsertBusinessInput = z.infer<typeof upsertBusinessSchema>
