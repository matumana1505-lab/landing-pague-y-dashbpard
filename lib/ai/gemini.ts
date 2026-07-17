import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/prompt/build-review-response-prompt"
import type { ResponseTone } from "@/lib/types"

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) throw new Error("GEMINI_API_KEY is not set")

const genAI = new GoogleGenerativeAI(apiKey)

interface GenerateOptions {
  review: string
  rating?: number
  tone?: ResponseTone
  additionalInstructions?: string
  businessName?: string
}

export async function generateReviewResponse(
  options: GenerateOptions
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite",
    systemInstruction: buildSystemPrompt(),
  })

  const result = await model.generateContent(buildUserPrompt(options))
  return result.response.text().trim()
}
