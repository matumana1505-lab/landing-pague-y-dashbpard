import { auth } from "@/auth"

// Google Business Profile APIs are split across several hosts. Using the wrong
// host (e.g. listing accounts on the Business Information API) returns 404 and
// makes real businesses silently disappear from onboarding.
export const ACCOUNT_MANAGEMENT_BASE =
  "https://mybusinessaccountmanagement.googleapis.com/v1"
export const BUSINESS_INFO_BASE =
  "https://mybusinessbusinessinformation.googleapis.com/v1"
// Reviews are only exposed by the legacy Google My Business v4 API.
export const LEGACY_MYBUSINESS_BASE = "https://mybusiness.googleapis.com/v4"

// readMask must reference real Business Information API location fields.
export const LOCATION_READ_MASK =
  "name,title,storeCode,storefrontAddress,phoneNumbers,websiteUri,categories,metadata"

export interface GoogleFetchResult<T = unknown> {
  ok: boolean
  status: number
  body: T
  rawBody: string
}

type SessionGuardSuccess = {
  ok: true
  accessToken: string
}

type SessionGuardFailure = {
  ok: false
  error: string
  status: 401
}

export async function requireGoogleAccessToken(): Promise<
  SessionGuardSuccess | SessionGuardFailure
> {
  const session = await auth()

  if (!session) {
    return { ok: false, error: "No hay sesión activa de Google.", status: 401 }
  }

  if (session.error) {
    return {
      ok: false,
      error: `Sesión de Google inválida (${session.error}). Vuelve a conectar tu cuenta.`,
      status: 401,
    }
  }

  if (!session.accessToken) {
    return { ok: false, error: "No hay sesión activa de Google.", status: 401 }
  }

  return { ok: true, accessToken: session.accessToken }
}

export async function googleFetch<T = unknown>(
  url: string,
  accessToken: string,
): Promise<GoogleFetchResult<T>> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  const rawBody = await response.text()
  let body: T
  try {
    body = (rawBody ? JSON.parse(rawBody) : {}) as T
  } catch {
    body = { raw: rawBody } as unknown as T
  }

  return { ok: response.ok, status: response.status, body, rawBody }
}

export interface RawLocation {
  name?: string
  title?: string
  storeCode?: string
  websiteUri?: string
  storefrontAddress?: { addressLines?: string[]; locality?: string; administrativeArea?: string }
  phoneNumbers?: { primaryPhone?: string }
  categories?: { primaryCategory?: { displayName?: string } }
}

export interface MappedLocation {
  id: string
  name: string
  title: string
  locationId: string
  accountId: string
  address: string
  phone: string
  website: string
  category: string
}

export function mapLocation(location: RawLocation, accountId: string): MappedLocation {
  // Business Information API returns location names as `locations/{locationId}`.
  const locationId = location.name?.split("/").pop() ?? ""
  const addressParts = [
    ...(location.storefrontAddress?.addressLines ?? []),
    location.storefrontAddress?.locality,
    location.storefrontAddress?.administrativeArea,
  ].filter(Boolean)

  return {
    id: locationId,
    name: location.title || location.name || "Ubicación",
    title: location.title || "Ubicación",
    locationId,
    accountId,
    address: addressParts.join(", "),
    phone: location.phoneNumbers?.primaryPhone ?? "",
    website: location.websiteUri ?? "",
    category: location.categories?.primaryCategory?.displayName ?? "",
  }
}
