"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  getPageUrl?: (page: number) => string;
  recordLabel?: string;
  showRange?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * Calculates visible page numbers with smart ellipsis.
 * Always includes page 1, page totalPages, and a window around currentPage.
 */
function getVisiblePages(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 1) return [1];

  // If 7 or fewer pages, show all without ellipsis
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const delta = 1; // Window around current page

  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);

  if (left > 2) {
    pages.push("ellipsis");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < totalPages - 1) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
  getPageUrl,
  recordLabel = "records",
  showRange = true,
  className = "",
  disabled = false,
}: PaginationProps) {
  const safeCurrentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);

  const startRecord =
    totalRecords !== undefined && limit !== undefined && totalRecords > 0
      ? (safeCurrentPage - 1) * limit + 1
      : undefined;

  const endRecord =
    totalRecords !== undefined && limit !== undefined && totalRecords > 0
      ? Math.min(safeCurrentPage * limit, totalRecords)
      : undefined;

  const hasPrev = safeCurrentPage > 1;
  const hasNext = safeCurrentPage < totalPages;

  if (totalPages <= 1 && (!totalRecords || totalRecords === 0)) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs text-[#75647B] ${className}`}
    >
      {/* Range / record count */}
      {showRange && totalRecords !== undefined && (
        <div className="text-center sm:text-left font-medium">
          {startRecord !== undefined && endRecord !== undefined ? (
            <span>
              Showing <span className="font-bold text-[#35123F]">{startRecord}</span> to{" "}
              <span className="font-bold text-[#35123F]">{endRecord}</span> of{" "}
              <span className="font-bold text-[#35123F]">{totalRecords}</span> {recordLabel}
            </span>
          ) : (
            <span>
              Page <span className="font-bold text-[#35123F]">{safeCurrentPage}</span> of{" "}
              <span className="font-bold text-[#35123F]">{totalPages}</span> ({totalRecords} {recordLabel})
            </span>
          )}
        </div>
      )}

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {/* Previous Button */}
          {getPageUrl ? (
            hasPrev ? (
              <Button asChild variant="outline" size="sm" className="h-8.5 px-3 text-xs gap-1 border-[#EADDED]">
                <Link href={getPageUrl(safeCurrentPage - 1)} aria-label="Go to previous page">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Previous</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="h-8.5 px-3 text-xs gap-1 border-[#EADDED] opacity-50">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Previous</span>
              </Button>
            )
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPrev || disabled}
              onClick={() => onPageChange?.(safeCurrentPage - 1)}
              className="h-8.5 px-3 text-xs gap-1 border-[#EADDED] cursor-pointer disabled:cursor-not-allowed"
              aria-label="Go to previous page"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Previous</span>
            </Button>
          )}

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {visiblePages.map((pageItem, index) => {
              if (pageItem === "ellipsis") {
                return (
                  <span key={`ellipsis-${index}`} className="px-1 text-[#75647B]/60 select-none" aria-hidden="true">
                    …
                  </span>
                );
              }

              const isCurrent = pageItem === safeCurrentPage;

              if (getPageUrl) {
                return (
                  <Link
                    key={pageItem}
                    href={getPageUrl(pageItem)}
                    aria-label={`Page ${pageItem}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`flex h-8.5 min-w-[34px] items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-xs"
                        : "border border-[#EADDED] bg-white text-[#75647B] hover:border-[#9200A8]/40 hover:bg-[#FCE7F3]/30"
                    }`}
                  >
                    {pageItem}
                  </Link>
                );
              }

              return (
                <button
                  key={pageItem}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPageChange?.(pageItem)}
                  aria-label={`Page ${pageItem}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex h-8.5 min-w-[34px] items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed ${
                    isCurrent
                      ? "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] text-white shadow-xs"
                      : "border border-[#EADDED] bg-white text-[#75647B] hover:border-[#9200A8]/40 hover:bg-[#FCE7F3]/30"
                  }`}
                >
                  {pageItem}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {getPageUrl ? (
            hasNext ? (
              <Button asChild variant="outline" size="sm" className="h-8.5 px-3 text-xs gap-1 border-[#EADDED]">
                <Link href={getPageUrl(safeCurrentPage + 1)} aria-label="Go to next page">
                  <span className="hidden xs:inline">Next</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="h-8.5 px-3 text-xs gap-1 border-[#EADDED] opacity-50">
                <span className="hidden xs:inline">Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasNext || disabled}
              onClick={() => onPageChange?.(safeCurrentPage + 1)}
              className="h-8.5 px-3 text-xs gap-1 border-[#EADDED] cursor-pointer disabled:cursor-not-allowed"
              aria-label="Go to next page"
            >
              <span className="hidden xs:inline">Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
