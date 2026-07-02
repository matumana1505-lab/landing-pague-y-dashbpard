import { NextRequest, NextResponse } from "next/server"
import {
  BUSINESS_INFO_BASE,
  LOCATION_READ_MASK,
  googleFetch,
  mapLocation,
  requireGoogleAccessToken,
  type RawLocation,
} from "@/lib/google-business"

export async function GET(request: NextRequest) {
  const guard = await requireGoogleAccessToken()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }
  const { accessToken } = guard

  const accountId = request.nextUrl.searchParams.get("accountId")
  if (!accountId) {
    return NextResponse.json(
      { error: "Falta el parámetro 'accountId'." },
      { status: 400 },
    )
  }

  try {
    const result = await googleFetch<{ locations?: RawLocation[] }>(
      `${BUSINESS_INFO_BASE}/accounts/${accountId}/locations?readMask=${encodeURIComponent(
        LOCATION_READ_MASK,
      )}&pageSize=100`,
      accessToken,
      `locations.list(accounts/${accountId})`,
    )

    if (!result.ok) {
      return NextResponse.json(
        {
          error: "No se pudieron cargar las ubicaciones de Google Business Profile.",
          status: result.status,
          details: result.body,
        },
        { status: result.status },
      )
    }

    const locations = Array.isArray(result.body.locations)
      ? result.body.locations.map((location) => mapLocation(location, accountId))
      : []

    return NextResponse.json({ locations })
  } catch {
    return NextResponse.json(
      { error: "Error interno al obtener las ubicaciones de Google Business Profile." },
      { status: 500 },
    )
  }
}
