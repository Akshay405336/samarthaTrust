"use client";

import * as React from "react";

export type MotionRevealVariant =
  | "fade-up"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "blur-in"
  | "clip-up";

type UseScrollInViewOptions = {
  /** Intersection ratio (0–1) before marking visible. */
  threshold?: number;
  /** If true, stays visible after first enter (default). */
  once?: boolean;
};

const MOTION_CLASS: Record<MotionRevealVariant, string> = {
  "fade-up": "motion-fade-up",
  "slide-left": "motion-slide-left",
  "slide-right": "motion-slide-right",
  "scale-in": "motion-scale-in",
  "blur-in": "motion-blur-in",
  "clip-up": "motion-clip-up",
};

export function useScrollInView<T extends HTMLElement = HTMLElement>(
  options: UseScrollInViewOptions = {}
) {
  const { threshold = 0.2, once = true } = options;
  const ref = React.useRef<T | null>(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting && entry.intersectionRatio >= threshold;
        if (visible) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold: [0, threshold, 0.5, 0.75, 1] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  /** @deprecated Use revealVariant — kept for existing impact-reveal call sites */
  const reveal = (active = isInView) =>
    active ? "impact-reveal impact-reveal-active" : "impact-reveal";

  const revealVariant = (
    variant: MotionRevealVariant = "fade-up",
    active = isInView
  ) => {
    const base = MOTION_CLASS[variant];
    return active ? `${base} motion-active` : base;
  };

  return { ref, isInView, reveal, revealVariant };
}
