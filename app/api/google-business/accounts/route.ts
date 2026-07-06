import { NextResponse } from "next/server"
import {
  ACCOUNT_MANAGEMENT_BASE,
  BUSINESS_INFO_BASE,
  LOCATION_READ_MASK,
  googleFetch,
  mapLocation,
  requireGoogleAccessToken,
  type RawLocation,
} from "@/lib/google-business"
import type { GoogleBusinessAccount, GoogleBusinessLocation } from "@/lib/types"

interface RawAccount {
  name?: string
  accountName?: string
}

function getLocationAddress(location: RawLocation): string {
  const address = location.storefrontAddress

  return [
    ...(address?.addressLines ?? []),
    address?.locality,
    address?.administrativeArea,
  ]
    .filter(Boolean)
    .join(", ")
}

export async function GET() {
  const guard = await requireGoogleAccessToken()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }

  const { accessToken } = guard

  try {
    const accountsResult = await googleFetch<{ accounts?: RawAccount[] }>(
      `${ACCOUNT_MANAGEMENT_BASE}/accounts`,
      accessToken,
    )

    if (!accountsResult.ok) {
      return NextResponse.json(
        {
          error: "No se pudieron cargar las cuentas de Google Business Profile.",
          status: accountsResult.status,
          details: accountsResult.body,
        },
        { status: accountsResult.status },
      )
    }

    const accounts = Array.isArray(accountsResult.body.accounts)
      ? accountsResult.body.accounts
      : []

    const enrichedAccounts: GoogleBusinessAccount[] = await Promise.all(
      accounts.map(async (account) => {
        const accountId = account.name?.split("/").pop() ?? ""
        const locationsResult = await googleFetch<{ locations?: RawLocation[] }>(
          `${BUSINESS_INFO_BASE}/${account.name}/locations?readMask=${encodeURIComponent(
            LOCATION_READ_MASK,
          )}&pageSize=100`,
          accessToken,
        )

        const locations: GoogleBusinessLocation[] =
          locationsResult.ok && Array.isArray(locationsResult.body.locations)
            ? locationsResult.body.locations.map((location) => {
                const locationData = mapLocation(location, accountId)
                const locationId = locationData.locationId

                return {
                  id: locationId,
                  name: locationData.name,
                  title: locationData.title,
                  locationId,
                  accountId,
                  address: getLocationAddress(location),
                  phone: locationData.phone,
                  website: locationData.website,
                  category: locationData.category,
                }
              })
            : []

        return {
          id: accountId,
          accountId,
          name: account.accountName || account.name || "Cuenta de Google Business",
          locations,
        }
      }),
    )

    return NextResponse.json({ accounts: enrichedAccounts })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno al obtener las cuentas de Google Business Profile."

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    )
  }
}
