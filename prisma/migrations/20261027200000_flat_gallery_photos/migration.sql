-- CreateTable
CREATE TABLE "gallery_photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "linkUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "GalleryStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id")
);

-- Migrate existing gallery images into flat photos
INSERT INTO "gallery_photos" (
    "id",
    "url",
    "altText",
    "linkUrl",
    "displayOrder",
    "status",
    "publishedAt",
    "fileSize",
    "mimeType",
    "width",
    "height",
    "createdAt",
    "updatedAt"
)
SELECT
    gi."id",
    gi."url",
    COALESCE(
        NULLIF(TRIM(gi."altText"), ''),
        NULLIF(TRIM(gi."title"), ''),
        NULLIF(TRIM(g."title"), ''),
        'Gallery photo'
    ),
    NULL,
    (g."displayOrder" * 1000 + gi."displayOrder"),
    g."status",
    g."publishedAt",
    gi."fileSize",
    gi."mimeType",
    gi."width",
    gi."height",
    gi."createdAt",
    gi."updatedAt"
FROM "gallery_images" gi
INNER JOIN "gallery_items" g ON g."id" = gi."galleryId";

-- Drop legacy album tables
DROP TABLE "gallery_images";
DROP TABLE "gallery_items";

-- CreateIndex
CREATE INDEX "gallery_photos_status_idx" ON "gallery_photos"("status");
CREATE INDEX "gallery_photos_displayOrder_idx" ON "gallery_photos"("displayOrder");
CREATE INDEX "gallery_photos_publishedAt_idx" ON "gallery_photos"("publishedAt");
