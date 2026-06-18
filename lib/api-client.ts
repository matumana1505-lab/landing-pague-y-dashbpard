/**
 * Cliente API para negocios y configuración de IA por negocio.
 */

import type {
  BusinessAiConfigDto,
  BusinessAiConfigResponse,
  BusinessesListResponse,
  BusinessProfile,
  ErrorResponse,
  GenerateReviewResponseRequest,
  GenerateReviewResponseResponse,
  PersistedBusiness,
  UserProfileResponse,
  UserSettings,
} from "@/lib/types"

const API_BASE_URL = "/api"

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  if (!response.ok) {
    const errorData = data as ErrorResponse
    throw new Error(errorData.error || "Error en la solicitud")
  }
  return data as T
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/users/me`)
  return parseJsonResponse<UserProfileResponse>(response)
}

export async function completeOnboarding(payload: {
  business: {
    googleAccountId: string
    googleLocationId: string
    name: string
    address?: string
    phone?: string
    isDemo?: boolean
  }
  aiConfig: Partial<BusinessAiConfigDto>
}): Promise<{
  business: PersistedBusiness
  config: BusinessAiConfigDto
  user: UserProfileResponse["user"]
}> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return parseJsonResponse(response)
}

export async function fetchBusinesses(): Promise<BusinessesListResponse> {
  const response = await fetch(`${API_BASE_URL}/businesses`)
  return parseJsonResponse<BusinessesListResponse>(response)
}

export async function upsertBusiness(business: {
  googleAccountId: string
  googleLocationId: string
  name: string
  address?: string
  phone?: string
  isDemo?: boolean
}): Promise<{ business: PersistedBusiness }> {
  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(business),
  })
  return parseJsonResponse(response)
}

export async function setActiveBusiness(
  businessId: string | null
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activeBusinessId: businessId }),
  })
  await parseJsonResponse(response)
}

export async function fetchBusinessAiConfig(
  businessId: string
): Promise<BusinessAiConfigResponse> {
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/ai-config`)
  return parseJsonResponse<BusinessAiConfigResponse>(response)
}

export async function saveBusinessAiConfig(
  businessId: string,
  config: Partial<BusinessAiConfigDto>
): Promise<BusinessAiConfigResponse> {
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/ai-config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  })
  return parseJsonResponse<BusinessAiConfigResponse>(response)
}

export function persistedBusinessToProfile(
  business: PersistedBusiness
): BusinessProfile {
  return {
    id: business.id,
    name: business.name,
    accountId: business.googleAccountId,
    locationId: business.googleLocationId,
    isConnected: true,
    address: business.address ?? undefined,
    phone: business.phone ?? undefined,
  }
}

export function aiConfigToUserSettings(config: BusinessAiConfigDto): UserSettings {
  return {
    tone: config.tone,
    autoRespond: config.autoRespond,
    alertNegativeReviews: config.alertNegativeReviews,
    monthlySummary: config.monthlySummary,
    send3StarReviewsForReview: config.send3StarReviewsForReview,
    additionalInstructions: config.additionalInstructions,
  }
}

export function userSettingsToAiConfig(
  settings: UserSettings
): Partial<BusinessAiConfigDto> {
  return {
    tone: settings.tone,
    autoRespond: settings.autoRespond,
    alertNegativeReviews: settings.alertNegativeReviews,
    monthlySummary: settings.monthlySummary,
    send3StarReviewsForReview: settings.send3StarReviewsForReview,
    additionalInstructions: settings.additionalInstructions ?? "",
  }
}

/**
 * Genera una respuesta a una reseña usando la API con configuración opcional.
 */
export async function generateReviewResponse(
  request: GenerateReviewResponseRequest
): Promise<GenerateReviewResponseResponse> {
  const response = await fetch(`${API_BASE_URL}/generate-review-response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  return parseJsonResponse<GenerateReviewResponseResponse>(response)
}
