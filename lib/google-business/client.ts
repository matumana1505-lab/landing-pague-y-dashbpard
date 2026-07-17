export interface GoogleReview {
  googleReviewId: string
  reviewerName: string
  rating: number
  text: string
  createdAt: Date
}

export interface GoogleBusinessClient {
  getNewReviews(locationId: string, since: Date): Promise<GoogleReview[]>
  publishResponse(locationId: string, googleReviewId: string, response: string): Promise<void>
}
