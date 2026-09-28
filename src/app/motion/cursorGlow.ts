import { useEffect, useRef, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { SPRING_CALM } from "@/app/motion/designSystem";

let cachedReduceMotion: boolean | null = null;
function prefersReducedMotion(): boolean {
  if (cachedReduceMotion === null) {
    cachedReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return cachedReduceMotion;
}

export interface CursorGlow<T extends HTMLElement> {
  ref: RefObject<T | null>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export function useCursorGlow<T extends HTMLElement = HTMLElement>(): CursorGlow<T> {
  const ref = useRef<T>(null);
  const mx = useSpring(useMotionValue(50), SPRING_CALM);
  const my = useSpring(useMotionValue(50), SPRING_CALM);

  useEffect(() => {
    const unsubX = mx.on("change", (v) => {
      ref.current?.style.setProperty("--glow-x", `${v}%`);
    });
    const unsubY = my.on("change", (v) => {
      ref.current?.style.setProperty("--glow-y", `${v}%`);
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [mx, my]);

  function onMouseMove(e: React.MouseEvent) {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function onMouseLeave() {
    mx.set(50);
    my.set(50);
  }

  return { ref, onMouseMove, onMouseLeave };
}
