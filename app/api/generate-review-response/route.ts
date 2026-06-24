import { prisma } from "@/lib/prisma";
import {
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/prompt/build-review-response-prompt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: buildSystemPrompt(),
});

interface ReviewRequestBody {
  review: string;
  businessId: string;
  rating?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReviewRequestBody = await request.json();

    if (!body.businessId) {
      return NextResponse.json(
        { error: "El campo 'businessId' es requerido" },
        { status: 400 }
      );
    }

    if (!body.review || typeof body.review !== "string" || body.review.trim().length === 0) {
      return NextResponse.json(
        { error: "El campo 'review' es requerido y no puede estar vacío" },
        { status: 400 }
      );
    }

    if (body.review.length > 5000) {
      return NextResponse.json(
        { error: "La reseña no puede superar los 5000 caracteres" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: body.businessId },
      include: { aiConfig: true },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    const userPrompt = buildUserPrompt({
      review: body.review,
      rating: body.rating,
      tone: business.aiConfig?.tone,
      additionalInstructions: business.aiConfig?.additionalInstructions,
      businessName: business.name,
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    if (!responseText) {
      return NextResponse.json(
        { error: "No se pudo generar una respuesta" },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: responseText, success: true });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "JSON inválido en el cuerpo de la solicitud" },
        { status: 400 }
      );
    }

    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Método GET no permitido. Usa POST para generar respuestas." },
    { status: 405 }
  );
}
