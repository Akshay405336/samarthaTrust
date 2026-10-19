import * as React from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { CONTACT_OFFICE } from "./contact-constants";

export function ContactMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#EADCCB] bg-white shadow-2xs">
      {/* Map Header Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EADCCB]/70 bg-[#FFFCF5] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#F52232]" />
          <span className="text-xs font-bold text-[#492A22]">
            Bengaluru Headquarters Location
          </span>
        </div>

        <a
          href={CONTACT_OFFICE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F52232] hover:text-[#FF8A00] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F52232] rounded-md"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Map iframe */}
      <div className="relative h-72 sm:h-96 w-full bg-[#F5EFE6]">
        <iframe
          title="Samartha Trust Registered Office Location"
          src={CONTACT_OFFICE.embedMapUrl}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Address Footer Strip */}
      <div className="bg-[#FFFDF9] px-5 py-3 border-t border-[#EADCCB]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#78685D]">
        <p className="font-medium">
          <strong className="text-[#492A22]">Address: </strong>
          {CONTACT_OFFICE.fullAddress}
        </p>
        <span className="shrink-0 text-[11px] font-semibold text-[#8C6D62]">
          Yeshwanthpur • Pin: 560022
        </span>
      </div>
    </div>
  );
}
