/**
 * Tipos para la API de generación de respuestas a reseñas
 */

export type ResponseTone = "cercano" | "professional" | "formal";

export interface GenerateReviewResponseRequest {
  review: string;
  rating?: number;
  tone?: ResponseTone;
  additionalInstructions?: string;
  businessName?: string;
  businessId: string;
  reviewId?: string;
  reviewSource?: string;
}

export interface GenerateReviewResponseResponse {
  response: string;
  success: true;
}

export type ReviewResponseStatus = "GENERATED" | "EDITED" | "PUBLISHED" | "APPROVED" | "FAILED" | "SCHEDULED";

export interface ReviewResponseRecord {
  id: string;
  businessId: string;
  reviewId: string;
  googleReviewId: string | null;
  reviewText: string;
  generatedText: string;
  publishedText: string | null;
  status: ReviewResponseStatus;
  version: number;
  lastSyncedAt: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
  editedByUser: boolean;
  rating: number | null;
  reviewSource: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponsesResponse {
  responses: ReviewResponseRecord[];
}

export interface GoogleBusinessLocation {
  id: string;
  name: string;
  title: string;
  locationId: string;
  accountId: string;
  address: string;
  phone: string;
  website: string;
  category: string;
}

export interface GoogleBusinessAccount {
  id: string;
  accountId: string;
  name: string;
  locations: GoogleBusinessLocation[];
}

export interface GoogleBusinessAccountsResponse {
  accounts: GoogleBusinessAccount[];
}

export interface ErrorResponse {
  error: string;
}

/**
 * Tipos para el Dashboard
 */

export interface Review {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  reviewerName: string;
  reviewerImage?: string;
  createdAt: Date;
  hasResponse: boolean;
  response?: string;
  responseDate?: Date;
}

export interface BusinessProfile {
  id: string;
  name: string;
  accountId?: string;
  locationId?: string;
  isConnected: boolean;
  lastSyncedAt?: Date;
  address?: string;
  phone?: string;
}

export interface DashboardMetrics {
  totalReviews: number;
  averageRating: number;
  unansweredReviews: number;
  negativeReviewsPending: number;
}

export interface UserSettings {
  tone: ResponseTone;
  autoRespond: boolean;
  alertNegativeReviews: boolean;
  monthlySummary: boolean;
  send3StarReviewsForReview: boolean;
  additionalInstructions?: string;
}

export interface BusinessAiConfigDto {
  tone: ResponseTone;
  additionalInstructions: string;
  autoRespond: boolean;
  alertNegativeReviews: boolean;
  monthlySummary: boolean;
  send3StarReviewsForReview: boolean;
  advancedSettings: Record<string, unknown> | null;
}

/** Negocio persistido en BD con metadatos de Google Business Profile. */
export interface PersistedBusiness {
  id: string;
  googleAccountId: string;
  googleLocationId: string;
  name: string;
  address: string | null;
  phone: string | null;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessAiConfigResponse {
  businessId: string;
  config: BusinessAiConfigDto;
  isDefault: boolean;
}

export interface BusinessesListResponse {
  businesses: PersistedBusiness[];
  activeBusinessId: string | null;
}

export interface UserProfileResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    onboardingCompleted: boolean;
    activeBusinessId: string | null;
  };
}

export type OnboardingStep = "connect" | "customize" | "automation" | "completed";

export interface OnboardingState {
  currentStep: OnboardingStep;
  googleConnected: boolean;
  responseToneSelected: boolean;
  automationConfigured: boolean;
}
