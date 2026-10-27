"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TypewriterTextProps = {
  text: string;
  className?: string;
  /** Start typing when this becomes true. */
  active?: boolean;
  /** Delay before typing starts (ms). */
  delayMs?: number;
  /** Milliseconds per character. */
  charMs?: number;
  showCursor?: boolean;
};

export function TypewriterText({
  text,
  className,
  active = true,
  delayMs = 0,
  charMs = 28,
  showCursor = true,
}: TypewriterTextProps) {
  const [length, setLength] = React.useState(0);
  const [started, setStarted] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (!active) {
      setStarted(false);
      setLength(0);
      return;
    }
    if (reduceMotion) {
      setLength(text.length);
      setStarted(true);
      return;
    }

    const startTimer = window.setTimeout(() => setStarted(true), delayMs);
    return () => window.clearTimeout(startTimer);
  }, [active, delayMs, reduceMotion, text.length]);

  React.useEffect(() => {
    if (!started || reduceMotion) return;
    if (length >= text.length) return;

    const tick = window.setTimeout(() => {
      setLength((prev) => Math.min(prev + 1, text.length));
    }, charMs);

    return () => window.clearTimeout(tick);
  }, [started, length, text.length, charMs, reduceMotion]);

  const visible = text.slice(0, length);
  const typing = started && length < text.length;

  return (
    <span className={cn("inline", className)} aria-label={text}>
      <span aria-hidden="true">{visible}</span>
      {showCursor && (typing || (started && length === 0)) && (
        <span
          className="typewriter-cursor ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-current align-middle"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
