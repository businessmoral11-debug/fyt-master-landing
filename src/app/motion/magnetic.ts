import { useRef, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { SPRING_CALM } from "@/app/motion/designSystem";

let cachedReduceMotion: boolean | null = null;
function prefersReducedMotion(): boolean {
  if (cachedReduceMotion === null) {
    cachedReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return cachedReduceMotion;
}

export interface Magnetic<T extends HTMLElement> {
  ref: RefObject<T | null>;
  style: { x: MotionValue<number>; y: MotionValue<number> };
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.3): Magnetic<T> {
  const ref = useRef<T>(null);
  const x = useSpring(useMotionValue(0), SPRING_CALM);
  const y = useSpring(useMotionValue(0), SPRING_CALM);

  function onMouseMove(e: React.MouseEvent) {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return { ref, style: { x, y }, onMouseMove, onMouseLeave };
}
