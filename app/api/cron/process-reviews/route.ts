import { NextResponse } from "next/server"
import { processReviewsForAllBusinesses } from "@/lib/workers/review-processor"
import { MockGoogleBusinessClient } from "@/lib/google-business/mock-client"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    )
  }

  try {
    const client = new MockGoogleBusinessClient()
    await processReviewsForAllBusinesses(client)

    return NextResponse.json({
      success: true,
      message: "Reseñas procesadas correctamente",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error en cron process-reviews:", error)
    return NextResponse.json(
      { error: "Error procesando reseñas" },
      { status: 500 }
    )
  }
}
