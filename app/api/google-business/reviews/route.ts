import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

const GBP_REVIEWS_BASE_URL = "https://mybusiness.googleapis.com/v4"

async function readGoogleJson(response: Response) {
  const bodyText = await response.text()

  if (!bodyText) {
    return { bodyText, data: null }
  }

  try {
    return { bodyText, data: JSON.parse(bodyText) }
  } catch (error) {
    console.error("[GBP Reviews] Failed to parse Google response body", {
      status: response.status,
      bodyText,
      error,
    })
    return { bodyText, data: null }
  }
}

async function fetchGoogleReviewsPage(
  url: string,
  accessToken: string,
  pageLabel: string
) {
  console.log("[GBP Reviews] Calling reviews.list", { url, pageLabel })

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  const { bodyText, data } = await readGoogleJson(response)

  console.log("[GBP Reviews] reviews.list response", {
    status: response.status,
    ok: response.ok,
    url,
    pageLabel,
    body: data ?? bodyText,
  })

  return { response, data, bodyText }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  const { searchParams } = request.nextUrl
  const accountId = searchParams.get("accountId")
  const locationId = searchParams.get("locationId")

  console.log("[GBP Reviews] Session and params check", {
    hasSession: Boolean(session),
    hasAccessToken: Boolean(session?.accessToken),
    userEmail: session?.user?.email,
    hasAccountId: Boolean(accountId),
    hasLocationId: Boolean(locationId),
  })

  if (!session?.accessToken) {
    console.error("[GBP Reviews] Missing Google access token in session")
    return NextResponse.json(
      { error: "No hay sesion activa de Google." },
      { status: 401 }
    )
  }

  if (!accountId || !locationId) {
    return NextResponse.json(
      { error: "Faltan accountId y locationId para obtener resenas." },
      { status: 400 }
    )
  }

  try {
    const reviews = []
    let averageRating: number | undefined
    let totalReviewCount: number | undefined
    let pageToken: string | undefined

    do {
      const url = new URL(
        `${GBP_REVIEWS_BASE_URL}/accounts/${accountId}/locations/${locationId}/reviews`
      )
      url.searchParams.set("pageSize", "50")
      url.searchParams.set("orderBy", "updateTime desc")
      if (pageToken) url.searchParams.set("pageToken", pageToken)

      const { response, data, bodyText } = await fetchGoogleReviewsPage(
        url.toString(),
        session.accessToken,
        pageToken ? "next-page" : "first-page"
      )

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "No se pudieron cargar las resenas de Google Business Profile.",
            details: data ?? bodyText,
          },
          { status: response.status }
        )
      }

      if (typeof data?.averageRating === "number") {
        averageRating = data.averageRating
      }

      if (typeof data?.totalReviewCount === "number") {
        totalReviewCount = data.totalReviewCount
      }

      if (Array.isArray(data?.reviews)) {
        reviews.push(...data.reviews)
      }

      pageToken = typeof data?.nextPageToken === "string" ? data.nextPageToken : undefined
    } while (pageToken)

    console.log("[GBP Reviews] Reviews found", {
      accountId,
      locationId,
      count: reviews.length,
      averageRating,
      totalReviewCount,
    })

    return NextResponse.json({
      reviews,
      averageRating,
      totalReviewCount,
    })
  } catch (error: any) {
    console.error("[GBP Reviews] Google Business Profile Reviews API error", {
      message: error?.message,
      stack: error?.stack,
      error,
    })

    return NextResponse.json(
      { error: "Error interno al obtener las resenas de Google Business Profile." },
      { status: 500 }
    )
  }
}
