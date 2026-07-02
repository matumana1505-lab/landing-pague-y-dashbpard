DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReviewResponseStatus') THEN
    CREATE TYPE "ReviewResponseStatus" AS ENUM ('GENERATED', 'EDITED', 'PUBLISHED', 'APPROVED', 'FAILED', 'SCHEDULED');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "ReviewResponse" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "googleReviewId" TEXT,
    "reviewText" TEXT NOT NULL,
    "generatedText" TEXT NOT NULL,
    "publishedText" TEXT,
    "status" "ReviewResponseStatus" NOT NULL DEFAULT 'GENERATED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastSyncedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "editedByUser" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "reviewSource" TEXT NOT NULL DEFAULT 'mock',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewResponse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ReviewResponse_businessId_reviewId_key" ON "ReviewResponse"("businessId", "reviewId");

CREATE INDEX IF NOT EXISTS "ReviewResponse_businessId_status_idx" ON "ReviewResponse"("businessId", "status");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ReviewResponse_businessId_fkey'
  ) THEN
    ALTER TABLE "ReviewResponse"
      ADD CONSTRAINT "ReviewResponse_businessId_fkey"
      FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;
