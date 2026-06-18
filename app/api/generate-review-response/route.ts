import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { buildReviewResponsePrompt } from "@/lib/prompt/build-review-response-prompt"
import { responseToneSchema } from "@/lib/ai-config/schema"

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set")
}

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" })

const requestSchema = z.object({
  review: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  tone: responseToneSchema.optional(),
  additionalInstructions: z.string().max(4000).optional(),
  businessName: z.string().max(200).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Solicitud inválida", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const prompt = buildReviewResponsePrompt(parsed.data)
    const result = await model.generateContent(prompt)

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      return NextResponse.json(
        { error: "No se pudo generar una respuesta" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      response: responseText,
      success: true,
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "JSON inválido en el cuerpo de la solicitud" },
        { status: 400 }
      )
    }

    console.error("Error generating response:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Método GET no permitido. Usa POST para generar respuestas." },
    { status: 405 }
  )
}
