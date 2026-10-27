"use client";

import * as React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  id?: string;
  url: string;
  title?: string | null;
  caption?: string | null;
  altText?: string | null;
  linkUrl?: string | null;
}

interface GalleryLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  albumTitle?: string;
}

export function GalleryLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  albumTitle,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard events (Left, Right, Escape)
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      {/* Top Bar: Title, Counter & Close */}
      <div
        className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-3.5 sm:px-6 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {albumTitle && (
            <span className="text-xs font-semibold text-white/70 tracking-wide uppercase">
              {albumTitle}
            </span>
          )}
          <span className="text-sm font-bold text-white">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-lg transition-transform hover:scale-105 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-lg transition-transform hover:scale-105 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div
        className="relative flex h-full w-full max-h-[85vh] max-w-6xl items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-full w-full">
          <Image
            src={currentImg.url}
            alt={currentImg.altText || currentImg.title || `Gallery photo ${currentIndex + 1}`}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      </div>

      {/* Bottom Bar: Image Title & Caption */}
      {(currentImg.title || currentImg.caption) && (
        <div
          className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 text-center text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto max-w-3xl space-y-1">
            {currentImg.title && (
              <h3 className="text-base sm:text-lg font-bold text-white">
                {currentImg.title}
              </h3>
            )}
            {currentImg.caption && (
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {currentImg.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
