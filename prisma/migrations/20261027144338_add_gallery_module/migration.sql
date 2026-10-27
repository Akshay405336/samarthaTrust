-- CreateEnum
CREATE TYPE "GalleryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "caption" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Events',
    "eventDate" TIMESTAMP(3),
    "coverImage" TEXT,
    "status" "GalleryStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_items_slug_key" ON "gallery_items"("slug");

-- CreateIndex
CREATE INDEX "gallery_items_status_idx" ON "gallery_items"("status");

-- CreateIndex
CREATE INDEX "gallery_items_publishedAt_idx" ON "gallery_items"("publishedAt");

-- CreateIndex
CREATE INDEX "gallery_items_category_idx" ON "gallery_items"("category");

-- CreateIndex
CREATE INDEX "gallery_items_isFeatured_idx" ON "gallery_items"("isFeatured");

-- CreateIndex
CREATE INDEX "gallery_items_displayOrder_idx" ON "gallery_items"("displayOrder");

-- CreateIndex
CREATE INDEX "gallery_items_eventDate_idx" ON "gallery_items"("eventDate");

-- CreateIndex
CREATE INDEX "gallery_items_slug_idx" ON "gallery_items"("slug");

-- CreateIndex
CREATE INDEX "gallery_images_galleryId_idx" ON "gallery_images"("galleryId");

-- CreateIndex
CREATE INDEX "gallery_images_displayOrder_idx" ON "gallery_images"("displayOrder");

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
