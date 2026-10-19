import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function WorksCollaboration() {
  return (
    <section className="border-t border-[#F0E5D9] bg-white py-14 sm:py-18 lg:py-20">
      <Container>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#EADCCB] bg-white px-6 py-10 text-center sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C]"
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F0DFCF] bg-[#FFF5E9] text-[#F4510B]">
            <Handshake className="h-7 w-7" />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C54B20]">
            Let’s Work Together
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-[#492A22] sm:text-3xl lg:text-4xl">
            Have a Community Collaboration in Mind?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#78685D] sm:text-base">
            We welcome collaborative proposals from fellow non-profits, CSR
            foundations, and passionate civic volunteers to amplify grassroots
            impact.
          </p>

          <div className="mt-7 flex justify-center">
            <Button asChild size="lg">
              <Link href="/contact" className="inline-flex items-center gap-2">
                Propose a Collaboration
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
