/**
 * Tipos para la API de generación de respuestas a reseñas
 */

export interface GenerateReviewResponseRequest {
  review: string;
}

export interface GenerateReviewResponseResponse {
  response: string;
  success: true;
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
  tone: "cercano" | "professional" | "formal";
  autoRespond: boolean;
  alertNegativeReviews: boolean;
  monthlySummary: boolean;
  send3StarReviewsForReview: boolean;
  additionalInstructions?: string;
}

export type OnboardingStep = "connect" | "customize" | "automation" | "completed";

export interface OnboardingState {
  currentStep: OnboardingStep;
  googleConnected: boolean;
  responseToneSelected: boolean;
  automationConfigured: boolean;
}
