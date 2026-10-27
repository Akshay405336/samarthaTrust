import * as React from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { CONTACT_OFFICE } from "./contact-constants";

export function ContactMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#7DD3FC]/45 bg-white shadow-lg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0EA5E9] via-[#9200A8] to-[#14B8A6]"
      />

      <div className="flex flex-col items-start justify-between gap-3 border-b border-[#BAE6FD]/50 bg-gradient-to-r from-[#E0F2FE]/70 via-[#FAF5FF] to-[#ECFEFF]/60 px-5 py-3.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#0284C7]" />
          <span className="text-xs font-bold text-[#35123F]">
            Bengaluru Headquarters Location
          </span>
        </div>

        <a
          href={CONTACT_OFFICE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md text-xs font-bold text-[#0284C7] transition-colors hover:text-[#9200A8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="relative h-72 w-full bg-gradient-to-br from-[#E0F2FE]/40 to-[#FAF5FF] sm:h-96">
        <iframe
          title="Samartha Trust Registered Office Location"
          src={CONTACT_OFFICE.embedMapUrl}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="border-t border-[#BAE6FD]/50 bg-gradient-to-r from-white via-[#F0F9FF]/80 to-white px-5 py-3.5 text-center text-xs text-[#75647B]">
        <span className="font-semibold text-[#35123F]">
          {CONTACT_OFFICE.addressLine1}
        </span>
        {", "}
        {CONTACT_OFFICE.addressLine2}, {CONTACT_OFFICE.city}
      </div>
    </div>
  );
}
