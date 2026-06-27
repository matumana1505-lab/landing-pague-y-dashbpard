import { prisma } from "@/lib/prisma";
import {
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/prompt/build-review-response-prompt";
import { requireSessionUser } from "@/lib/auth/require-session";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

function getModel() {
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite",
    systemInstruction: buildSystemPrompt(),
  });
}

interface ReviewRequestBody {
  review: string;
  businessId: string;
  rating?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSessionUser();
    if (!session.ok) {
      return NextResponse.json(
        { error: session.error },
        { status: session.status }
      );
    }

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

    if (
      body.rating !== undefined &&
      (body.rating < 1 || body.rating > 5)
    ) {
      return NextResponse.json(
        { error: "El rating debe estar entre 1 y 5" },
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

    if (business.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tenés permiso para acceder a este negocio" },
        { status: 403 }
      );
    }

    const userPrompt = buildUserPrompt({
      review: body.review,
      rating: body.rating,
      tone: business.aiConfig?.tone,
      additionalInstructions: business.aiConfig?.additionalInstructions,
      businessName: business.name,
    });

    const model = getModel();
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text().trim();

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

    if (error instanceof Error && "status" in error) {
      const status = (error as { status: number }).status;
      if (status === 429) {
        return NextResponse.json(
          { error: "Servicio temporalmente no disponible, intentá más tarde" },
          { status: 503 }
        );
      }
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