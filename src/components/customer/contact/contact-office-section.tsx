import * as React from "react";
import { Container } from "@/components/shared/container";
import { ContactMap } from "./contact-map";

export function ContactOfficeSection() {
  return (
    <section className="bg-white py-12 sm:py-16 border-t border-[#EADDED]">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9200A8]">
            Physical Presence
          </span>
          <h2 className="text-2xl font-bold text-[#35123F] sm:text-3xl mt-1">
            Visit Our Registered Office
          </h2>
          <p className="mt-2 text-sm text-[#75647B] leading-relaxed">
            Located in Yeshwanthpur, Bengaluru, our central office coordinates
            grassroots health, disability empowerment, and education programs
            across Karnataka.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <ContactMap />
        </div>
      </Container>
    </section>
  );
}
