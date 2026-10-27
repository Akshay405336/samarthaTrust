import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { GalleryStatus } from "@prisma/client";
import {
  createGalleryPhotoSchema,
} from "@/lib/validations/gallery";
import {
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  getGalleryPhotoById,
  listAdminGalleryPhotos,
  listPublishedGalleryPhotosPaginated,
  publishGalleryPhoto,
  unpublishGalleryPhoto,
} from "@/lib/gallery/gallery-service";

describe("Flat gallery photos", () => {
  const createdIds: string[] = [];

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.galleryPhoto.deleteMany({
        where: { id: { in: createdIds } },
      });
    }
  });

  it("validates create schema", () => {
    const parsed = createGalleryPhotoSchema.parse({
      url: "/uploads/test.png",
      altText: "Test photo",
      linkUrl: "https://example.com",
      status: "DRAFT",
      displayOrder: 0,
    });
    expect(parsed.altText).toBe("Test photo");
  });

  it("creates, publishes, lists, and deletes a photo", async () => {
    const photo = await createGalleryPhoto({
      url: "/uploads/gallery-test.png",
      altText: "Vitest gallery photo",
      status: GalleryStatus.DRAFT,
      displayOrder: 99,
    });
    createdIds.push(photo.id);
    expect(photo.altText).toBe("Vitest gallery photo");

    await publishGalleryPhoto(photo.id);
    const published = await getGalleryPhotoById(photo.id);
    expect(published?.status).toBe(GalleryStatus.PUBLISHED);

    const publicList = await listPublishedGalleryPhotosPaginated({
      page: 1,
      limit: 50,
      search: "Vitest",
    });
    expect(publicList.data.some((p) => p.id === photo.id)).toBe(true);

    await unpublishGalleryPhoto(photo.id);
    const adminList = await listAdminGalleryPhotos({
      page: 1,
      limit: 10,
      status: "ALL",
      sort: "order_asc",
    });
    expect(adminList.data.length).toBeGreaterThan(0);

    await updateGalleryPhoto(photo.id, { altText: "Updated alt" });
    const updated = await getGalleryPhotoById(photo.id);
    expect(updated?.altText).toBe("Updated alt");

    await deleteGalleryPhoto(photo.id);
    createdIds.pop();
    const gone = await getGalleryPhotoById(photo.id);
    expect(gone).toBeNull();
  });
});
