/**
 * Cliente para la API de generación de respuestas a reseñas
 * Este archivo facilita las llamadas a la API desde el frontend
 */

import {
  GenerateReviewResponseRequest,
  GenerateReviewResponseResponse,
  ErrorResponse,
} from "@/lib/types";

const API_BASE_URL = "/api";

/**
 * Genera una respuesta a una reseña usando la API
 * @param review - El texto de la reseña
 * @returns La respuesta generada por Gemini
 * @throws Error si la solicitud falla
 */
export async function generateReviewResponse(
  review: string
): Promise<GenerateReviewResponseResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/generate-review-response`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review,
        } as GenerateReviewResponseRequest),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new Error(errorData.error || "Error generating response");
    }

    return data as GenerateReviewResponseResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}
