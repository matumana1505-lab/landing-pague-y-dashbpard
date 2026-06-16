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
const GBP_ACCOUNT_MANAGEMENT_BASE_URL =
  "https://mybusinessaccountmanagement.googleapis.com/v1"
const GBP_BUSINESS_INFORMATION_BASE_URL =
  "https://mybusinessbusinessinformation.googleapis.com/v1"

type GoogleAccount = {
  name?: string
  accountName?: string
  type?: string
}

type GoogleLocation = {
  name?: string
  title?: string
  storeCode?: string
  primaryPhone?: string
  websiteUri?: string
  primaryCategory?: {
    displayName?: string
  }
  storefrontAddress?: {
    addressLines?: string[]
    locality?: string
    administrativeArea?: string
    postalCode?: string
    regionCode?: string
  }
}

async function readGoogleJson(response: Response) {
  const bodyText = await response.text()

  if (!bodyText) {
    return { bodyText, data: null }
  }

  try {
    return { bodyText, data: JSON.parse(bodyText) }
  } catch (error) {
    console.error("[GBP] Failed to parse Google response body", {
      status: response.status,
      bodyText,
      error,
    })
    return { bodyText, data: null }
  }
}

function getLocationAddress(location: GoogleLocation) {
  const address = location.storefrontAddress

  return [
    ...(address?.addressLines ?? []),
    address?.locality,
    address?.administrativeArea,
    address?.postalCode,
    address?.regionCode,
  ]
    .filter(Boolean)
    .join(", ")
}

async function fetchGoogleJson(url: string, accessToken: string, label: string) {
  console.log(`[GBP] Calling ${label}`, { url })

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  const { bodyText, data } = await readGoogleJson(response)

  console.log(`[GBP] ${label} response`, {
    status: response.status,
    ok: response.ok,
    url,
    body: data ?? bodyText,
  })

  return { response, data, bodyText }
}

async function fetchAccounts(accessToken: string) {
  const accounts: GoogleAccount[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(`${GBP_ACCOUNT_MANAGEMENT_BASE_URL}/accounts`)
    url.searchParams.set("pageSize", "20")
    if (pageToken) url.searchParams.set("pageToken", pageToken)

    const { response, data, bodyText } = await fetchGoogleJson(
      url.toString(),
      accessToken,
      "accounts.list"
    )

    if (!response.ok) {
      throw {
        message: "No se pudieron cargar las cuentas de Google Business Profile.",
        status: response.status,
        details: data ?? bodyText,
      }
    }

    const pageAccounts = Array.isArray(data?.accounts) ? data.accounts : []
    accounts.push(...pageAccounts)
    pageToken = typeof data?.nextPageToken === "string" ? data.nextPageToken : undefined
  } while (pageToken)

  console.log("[GBP] Accounts found", {
    count: accounts.length,
    accounts: accounts.map((account) => ({
      name: account.name,
      accountName: account.accountName,
      type: account.type,
    })),
  })

  return accounts
}

async function fetchLocationsForAccount(accountName: string, accessToken: string) {
  const locations: GoogleLocation[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(
      `${GBP_BUSINESS_INFORMATION_BASE_URL}/${accountName}/locations`
    )
    url.searchParams.set("pageSize", "100")
    url.searchParams.set(
      "readMask",
      [
        "name",
        "title",
        "storeCode",
        "primaryPhone",
        "websiteUri",
        "primaryCategory",
        "storefrontAddress",
      ].join(",")
    )
    if (pageToken) url.searchParams.set("pageToken", pageToken)

    const { response, data, bodyText } = await fetchGoogleJson(
      url.toString(),
      accessToken,
      `locations.list ${accountName}`
    )

    if (!response.ok) {
      console.error("[GBP] Locations request failed", {
        accountName,
        status: response.status,
        details: data ?? bodyText,
      })
      return []
    }

    const pageLocations = Array.isArray(data?.locations) ? data.locations : []
    locations.push(...pageLocations)
    pageToken = typeof data?.nextPageToken === "string" ? data.nextPageToken : undefined
  } while (pageToken)

  console.log("[GBP] Locations found", {
    accountName,
    count: locations.length,
    locations: locations.map((location) => ({
      name: location.name,
      title: location.title,
    })),
  })

  return locations
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
          locations: locations.map((location) => {
            const locationId = location.name?.split("/").pop() || ""

            return {
              id: locationId,
              name: location.name || location.title || "Ubicacion",
              title: location.title || "Ubicacion",
              locationId,
              accountId,
              address: getLocationAddress(location),
              phone: location.phone || "",
website: location.website || "",
category: location.category || "",
            }
          }),
        }
      }),
    )

    const totalLocations = enrichedAccounts.reduce(
      (total, account) => total + account.locations.length,
      0
    )

    console.log("[GBP] Accounts response ready", {
      accountsCount: enrichedAccounts.length,
      locationsCount: totalLocations,
    })

    return NextResponse.json({ accounts: enrichedAccounts })

  } catch (error: any) {
    console.error("[GBP] Google Business Profile API error", {
      message: error?.message,
      status: error?.status,
      details: error?.details,
      stack: error?.stack,
      error,
    })

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Error interno al obtener las cuentas de Google Business Profile.",
        details: error?.details,
      },
      { status: error?.status || 500 }


    )
  }
}
