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

interface RawAccount {
  name?: string
  accountName?: string
}

export async function GET() {
  const guard = await requireGoogleAccessToken()
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status })
  }
  const { accessToken } = guard

  try {
    // Accounts live on the Account Management API, NOT the Business Information
    // API. Calling the wrong host returns 404 and hides real businesses.
    const accountsResult = await googleFetch<{ accounts?: RawAccount[] }>(
      `${ACCOUNT_MANAGEMENT_BASE}/accounts`,
      accessToken,
      "accounts.list",
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

    console.log(`[google-business] accounts.list returned ${accounts.length} account(s).`)

    const enrichedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const accountId = account.name?.split("/").pop() ?? ""

        // Locations live on the Business Information API and require a readMask.
        const locationsResult = await googleFetch<{ locations?: RawLocation[] }>(
          `${BUSINESS_INFO_BASE}/${account.name}/locations?readMask=${encodeURIComponent(
            LOCATION_READ_MASK,
          )}&pageSize=100`,
          accessToken,
          `locations.list(${account.name})`,
        )

        const locations = locationsResult.ok && Array.isArray(locationsResult.body.locations)
          ? locationsResult.body.locations.map((location) => mapLocation(location, accountId))
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
    console.error("[google-business] accounts route error", error)
    return NextResponse.json(
      { error: "Error interno al obtener las cuentas de Google Business Profile." },
      { status: 500 },
    )
  }
}
