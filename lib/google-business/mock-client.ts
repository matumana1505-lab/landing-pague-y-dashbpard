import type { GoogleBusinessClient, GoogleReview } from "./client"

export class MockGoogleBusinessClient implements GoogleBusinessClient {
  async getNewReviews(locationId: string, since: Date): Promise<GoogleReview[]> {
    return [
      {
        googleReviewId: `mock-${Date.now()}`,
        reviewerName: "Cliente de Prueba",
        rating: 4,
        text: "Muy buena atención y excelente servicio.",
        createdAt: new Date(),
      },
      {
        googleReviewId: `mock-${Date.now() + 1}`,
        reviewerName: "Juan García",
        rating: 1,
        text: "Tardaron mucho y la atención fue pésima.",
        createdAt: new Date(),
      },
    ]
  }

  async publishResponse(
    locationId: string,
    googleReviewId: string,
    response: string
  ): Promise<void> {
    console.log(`[Mock] Publicando respuesta a reseña ${googleReviewId}:`)
    console.log(response)
  }
}
