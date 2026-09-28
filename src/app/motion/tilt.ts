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

export interface Tilt<T extends HTMLElement> {
  ref: RefObject<T | null>;
  style: { rotateX: MotionValue<number>; rotateY: MotionValue<number>; transformPerspective: number };
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export function useTilt<T extends HTMLElement = HTMLElement>(max = 8): Tilt<T> {
  const ref = useRef<T>(null);
  const rotateX = useSpring(useMotionValue(0), SPRING_CALM);
  const rotateY = useSpring(useMotionValue(0), SPRING_CALM);

  function onMouseMove(e: React.MouseEvent) {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * max * 2);
    rotateX.set(py * -max * 2);
  }

  function onMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return { ref, style: { rotateX, rotateY, transformPerspective: 600 }, onMouseMove, onMouseLeave };
}
