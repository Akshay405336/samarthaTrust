"use client";

import * as React from "react";
import Image from "next/image";
import { Images as ImagesIcon, ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Pagination } from "@/components/shared/pagination";
import {
  GalleryLightbox,
  type LightboxImage,
} from "@/components/customer/gallery/gallery-lightbox";
import type { GalleryPublicPhoto } from "@/lib/validations/gallery";

interface GalleryGridProps {
  photos: GalleryPublicPhoto[];
  search?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function GalleryGrid({ photos, search, pagination }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const lightboxImages: LightboxImage[] = photos.map((p) => ({
    id: p.id,
    url: p.url,
    altText: p.altText,
    title: p.altText,
    linkUrl: p.linkUrl,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="bg-[#FAF5FF]/30 py-10 sm:py-14 lg:py-16">
      <Container>
        {photos.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-[#EADDED] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF5FF] text-[#9200A8]">
              <ImagesIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#35123F]">No photos yet</h3>
            <p className="mt-2 text-xs text-[#75647B]">
              {search
                ? "No published photos match your search."
                : "Check back soon for updates from the field."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4">
            {photos.map((photo, index) => {
              const tileClassName =
                "group relative block h-full w-full overflow-hidden rounded-xl border border-[#EADDED] bg-[#FAF5FF] shadow-2xs";

              const imageArea = (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.altText}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="line-clamp-2 text-xs font-semibold text-white">
                      {photo.altText}
                    </p>
                    {photo.linkUrl && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-white/90">
                        <ExternalLink className="h-3 w-3" />
                        Linked
                      </span>
                    )}
                  </div>
                </div>
              );

              return (
                <div key={photo.id} className="min-h-0">
                  {photo.linkUrl ? (
                    <a
                      href={photo.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={tileClassName}
                    >
                      {imageArea}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={`${tileClassName} cursor-zoom-in text-left`}
                      onClick={() => openLightbox(index)}
                    >
                      {imageArea}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 border-t border-[#EADDED] pt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              limit={pagination.limit}
              recordLabel="photos"
              getPageUrl={(page) => {
                const params = new URLSearchParams();
                if (search) params.set("search", search);
                if (page > 1) params.set("page", String(page));
                const q = params.toString();
                return q ? `/gallery?${q}` : "/gallery";
              }}
            />
          </div>
        )}

        <GalleryLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </Container>
    </section>
  );
}
