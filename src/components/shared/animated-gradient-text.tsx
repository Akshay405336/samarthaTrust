import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_STAGGER_MS = 520;
const DEFAULT_CYCLE_MS = 6400;

const LETTER_GRADIENT =
  "bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent";

type AnimatedGradientTextProps = {
  text: string;
  className?: string;
  /** Delay before the kinetic loop begins (ms). */
  startDelayMs?: number;
  /** Time between each letter’s highlight peak (ms). */
  staggerMs?: number;
  /** Full loop duration including pause before repeat (ms). */
  cycleMs?: number;
  ariaLabel?: string;
};

export function AnimatedGradientText({
  text,
  className,
  startDelayMs = 980,
  staggerMs = DEFAULT_STAGGER_MS,
  cycleMs = DEFAULT_CYCLE_MS,
  ariaLabel,
}: AnimatedGradientTextProps) {
  const letters = [...text];

  return (
    <span
      className={cn("agt-root", className)}
      aria-label={ariaLabel ?? text}
      style={
        {
          "--agt-stagger": `${staggerMs}ms`,
          "--agt-start": `${startDelayMs}ms`,
          "--agt-cycle": `${cycleMs}ms`,
          "--agt-count": letters.length,
        } as CSSProperties
      }
    >
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          aria-hidden="true"
          className={cn("agt-letter", LETTER_GRADIENT)}
          style={
            {
              "--agt-i": index,
            } as CSSProperties
          }
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
