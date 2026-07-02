/**
 * Mock data para el dashboard.
 * Proporciona reseñas de ejemplo; las respuestas se generan vía la API.
 */

import { Review, BusinessProfile, DashboardMetrics, UserSettings, OnboardingState } from "./types"

export const mockBusinessProfile: BusinessProfile = {
  id: "business_1",
  name: "La Pizzería del Centro",
  accountId: "acc_123456",
  locationId: "loc_789012",
  isConnected: false,
  lastSyncedAt: undefined,
  address: "Calle Principal 123, Buenos Aires, Argentina",
  phone: "+54 11 2345-6789",
}

const baseDate = new Date("2026-06-06T00:00:00Z")

export const mockReviews: Review[] = [
  {
    id: "review_1",
    rating: 5,
    text: "¡Excelente pizza! La mejor de la zona. El servicio fue rápido y el personal muy atento. Volveré seguro.",
    reviewerName: "Juan Pérez",
    reviewerImage: "https://i.pravatar.cc/100?img=1",
    createdAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000), // hace 1 día
    hasResponse: true,
    responseDate: new Date(baseDate.getTime() - 20 * 60 * 60 * 1000), // hace 20 horas
  },
  {
    id: "review_2",
    rating: 4,
    text: "Muy buena comida, aunque tardaron un poco en traer el pedido. Pero la pizza estaba deliciosa.",
    reviewerName: "María García",
    reviewerImage: "https://i.pravatar.cc/100?img=2",
    createdAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
    hasResponse: false,
  },
  {
    id: "review_3",
    rating: 1,
    text: "Muy decepcionado. La pizza llegó fría y el personal fue grosero. No recomiendo.",
    reviewerName: "Carlos López",
    reviewerImage: "https://i.pravatar.cc/100?img=3",
    createdAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000), // hace 3 días
    hasResponse: false,
  },
  {
    id: "review_4",
    rating: 2,
    text: "Esperamos 45 minutos por una pizza. Cuando llegó, no era lo que pedimos.",
    reviewerName: "Ana Rodríguez",
    reviewerImage: "https://i.pravatar.cc/100?img=4",
    createdAt: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000), // hace 4 días
    hasResponse: false,
  },
  {
    id: "review_5",
    rating: 5,
    text: "Fantástico lugar para comer pizza con familia. Los precios son justos y la calidad es excelente.",
    reviewerName: "Roberto Martínez",
    reviewerImage: "https://i.pravatar.cc/100?img=5",
    createdAt: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000), // hace 5 días
    hasResponse: true,
    responseDate: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review_6",
    rating: 4,
    text: "Buena pizza, buen lugar. Solo mejorar la música ambiente que estaba muy fuerte.",
    reviewerName: "Valentina Gómez",
    reviewerImage: "https://i.pravatar.cc/100?img=6",
    createdAt: new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000), // hace 6 días
    hasResponse: true,
    responseDate: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review_7",
    rating: 3,
    text: "Promedio. La pizza estaba bien pero nada especial. El ambiente no es muy cómodo.",
    reviewerName: "Diego Flores",
    createdAt: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000), // hace 7 días
    hasResponse: false,
  },
  {
    id: "review_8",
    rating: 5,
    text: "¡La mejor experiencia! Personal muy amable, pizza deliciosa y ambiente cálido. Recomiendo ampliamente.",
    reviewerName: "Sofía Herrera",
    reviewerImage: "https://i.pravatar.cc/100?img=8",
    createdAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000), // hace 8 días
    hasResponse: true,
    responseDate: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
  },
]

export const mockMetrics: DashboardMetrics = {
  totalReviews: mockReviews.length,
  averageRating:
    mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length,
  unansweredReviews: mockReviews.filter((r) => !r.hasResponse).length,
  negativeReviewsPending: mockReviews.filter(
    (r) => r.rating <= 2 && !r.hasResponse
  ).length,
}

export const mockUserSettings: UserSettings = {
  tone: "professional",
  autoRespond: false,
  alertNegativeReviews: true,
  monthlySummary: true,
  send3StarReviewsForReview: false,
  additionalInstructions: "",
}

export const mockOnboardingState: OnboardingState = {
  currentStep: "connect",
  googleConnected: false,
  responseToneSelected: false,
  automationConfigured: false,
}

export const mockBusinessProfileDisconnected: BusinessProfile = {
  id: "business_new",
  name: "Tu Negocio",
  isConnected: false,
}

// Función helper para obtener reseñas sin responder
export const getUnansweredReviews = () => mockReviews.filter((r) => !r.hasResponse)

// Función helper para obtener reseñas negativas
export const getNegativeReviews = () =>
  mockReviews.filter((r) => r.rating <= 2 && !r.hasResponse)

// Función helper para obtener reseñas ordenadas por fecha
export const getReviewsSortedByDate = (reviews: Review[] = mockReviews) => {
  return [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Función helper para obtener reseñas ordenadas por rating
export const getReviewsSortedByRating = (reviews: Review[] = mockReviews) => {
  return [...reviews].sort((a, b) => a.rating - b.rating)
}
