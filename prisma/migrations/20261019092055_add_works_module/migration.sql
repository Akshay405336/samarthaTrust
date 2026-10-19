-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "works" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "badge" TEXT,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "beneficiaries" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "programStatus" TEXT DEFAULT 'Active & Ongoing',
    "ctaText" TEXT DEFAULT 'Support This Work',
    "ctaLink" TEXT DEFAULT '/contact',
    "featuredImage" TEXT,
    "iconName" TEXT DEFAULT 'GraduationCap',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "WorkStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "works_slug_key" ON "works"("slug");

-- CreateIndex
CREATE INDEX "works_status_idx" ON "works"("status");

-- CreateIndex
CREATE INDEX "works_publishedAt_idx" ON "works"("publishedAt");

-- CreateIndex
CREATE INDEX "works_category_idx" ON "works"("category");

-- CreateIndex
CREATE INDEX "works_isFeatured_idx" ON "works"("isFeatured");

-- CreateIndex
CREATE INDEX "works_displayOrder_idx" ON "works"("displayOrder");

-- CreateIndex
CREATE INDEX "works_slug_idx" ON "works"("slug");
