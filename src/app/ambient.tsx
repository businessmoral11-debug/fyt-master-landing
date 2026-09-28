import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const AMBIENT_BLOB_ACTIVE_MARGIN_PX = 600;

export function AmbientBlob({
  className, color, size = 480, duration = 20,
}: {
  className?: string; color: string; size?: number; duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [animsActive, setAnimsActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setAnimsActive(!!entries[0]?.isIntersecting),
      { rootMargin: `${AMBIENT_BLOB_ACTIVE_MARGIN_PX}px 0px ${AMBIENT_BLOB_ACTIVE_MARGIN_PX}px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const active = !reduceMotion && animsActive;

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(70px)",
        willChange: active ? "transform" : undefined,
      }}
      animate={active ? { x: [0, 34, -24, 0], y: [0, -26, 22, 0] } : undefined}
      transition={active ? { duration, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
}

export function StaticGlow({ className, color, size = 480 }: { className?: string; color: string; size?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(70px)",
      }}
    />
  );
}

export const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AccentLine({
  className, orientation = "horizontal",
}: {
  className?: string; orientation?: "horizontal" | "vertical";
}) {
  const gradient =
    orientation === "horizontal"
      ? "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.16) 50%, transparent 100%)"
      : "linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.16) 50%, transparent 100%)";
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none ${className ?? ""}`}
      style={orientation === "horizontal" ? { height: 1, background: gradient } : { width: 1, background: gradient }}
    />
  );
}
