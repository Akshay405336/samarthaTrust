"use client";

import * as React from "react";
import Image from "next/image";
import { Images as ImagesIcon, ExternalLink, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Pagination } from "@/components/shared/pagination";
import {
  GalleryLightbox,
  type LightboxImage,
} from "@/components/customer/gallery/gallery-lightbox";
import type { GalleryPublicPhoto } from "@/lib/validations/gallery";
import { useScrollInView } from "@/hooks/use-scroll-in-view";
import { cn } from "@/lib/utils";

const TILE_FRAMES = [
  "from-[#7100A8] via-[#9200A8] to-[#6366F1]",
  "from-[#E90078] via-[#9200A8] to-[#EC4899]",
  "from-[#6366F1] via-[#C026D3] to-[#9200A8]",
  "from-[#EC4899] via-[#E90078] to-[#7100A8]",
] as const;

const TILE_ENTERS = ["help-card-pop", "help-card-rise", "help-card-sway"] as const;

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
  const { ref, isInView, revealVariant } = useScrollInView<HTMLElement>({
    threshold: 0.06,
  });

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

  const totalCount = pagination?.total ?? photos.length;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#EDE9FE]/35 via-[#FDF8FF] to-[#FCE7F3]/45 py-10 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-32 h-56 w-56 rounded-full bg-[#9200A8]/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-16 h-48 w-48 rounded-full bg-[#E90078]/10 blur-3xl"
      />

      <Container className="relative">
        {photos.length > 0 && (
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#9200A8]/15 pb-6 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <div
                className={cn(
                  revealVariant("slide-left"),
                  "mb-3 inline-flex items-center gap-2 rounded-full border border-[#EADDED] bg-white/90 px-3 py-1.5 shadow-sm"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#E90078]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#75647B] sm:text-[11px]">
                  Visual Stories
                </span>
              </div>
              <h2
                className={cn(
                  revealVariant("scale-in"),
                  "text-2xl font-extrabold tracking-[-0.035em] text-[#35123F] sm:text-3xl"
                )}
                style={{ animationDelay: "100ms" }}
              >
                Photo{" "}
                <span className="relative inline-block">
                  <span className="help-team-wave bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                    Gallery
                  </span>
                  <span
                    className="about-title-underline absolute -bottom-0.5 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#7100A8] to-[#E90078]"
                    aria-hidden="true"
                  />
                </span>
              </h2>
              <p
                className={cn(
                  revealVariant("blur-in"),
                  "mt-2 max-w-xl text-sm leading-6 text-[#75647B]"
                )}
                style={{ animationDelay: "200ms" }}
              >
                Tap a photo to zoom in, or open linked stories from the field.
              </p>
            </div>
            <div
              className={cn(
                revealVariant("clip-up"),
                "about-ring-pulse flex w-fit items-center gap-3 rounded-xl border border-[#EADDED] bg-white/95 px-4 py-3 shadow-sm"
              )}
              style={{ animationDelay: "280ms" }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#7100A8] to-[#E90078] text-white">
                <ImagesIcon className="h-[18px] w-[18px]" />
              </div>
              <div>
                <p className="text-xl font-extrabold leading-none text-[#35123F]">
                  {String(totalCount).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#75647B]">
                  Photos
                </p>
              </div>
            </div>
          </div>
        )}

        {photos.length === 0 ? (
          <div
            className={cn(
              revealVariant("scale-in"),
              "mx-auto max-w-md rounded-2xl border border-[#EADDED] bg-gradient-to-br from-white to-[#FAF5FF] p-12 text-center shadow-md"
            )}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#FCE7F3] text-[#9200A8]">
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {photos.map((photo, index) => {
              const frame = TILE_FRAMES[index % TILE_FRAMES.length];
              const enterClass = TILE_ENTERS[index % TILE_ENTERS.length];
              const enterActive = `${enterClass}-active`;
              const delay = 80 + (index % 12) * 45;

              const inner = (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-[#FAF5FF]">
                  <Image
                    src={photo.url}
                    alt={photo.altText}
                    fill
                    unoptimized
                    className="home-img-zoom object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#35123F]/80 via-[#9200A8]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
                  <span
                    className={cn(
                      "absolute left-2 top-2 rounded-full bg-gradient-to-r px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm",
                      frame
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              );

              const wrapperClass = cn(
                enterClass,
                isInView && enterActive,
                "home-card-hover group rounded-xl bg-gradient-to-br p-[2px] shadow-[0_8px_24px_rgba(113,0,168,0.1)] transition-shadow hover:shadow-[0_14px_36px_rgba(113,0,168,0.16)]",
                frame
              );

              return (
                <div
                  key={photo.id}
                  className="min-h-0"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {photo.linkUrl ? (
                    <a
                      href={photo.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(wrapperClass, "block h-full w-full")}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={cn(wrapperClass, "block h-full w-full cursor-zoom-in text-left")}
                      onClick={() => openLightbox(index)}
                    >
                      {inner}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 border-t border-[#9200A8]/15 pt-6">
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
