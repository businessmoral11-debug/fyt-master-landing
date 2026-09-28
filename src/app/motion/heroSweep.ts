
export const DWELL_S = 0.8;
export const MOVE_S = 0.6;
export const GLOW_RAMP_FRAC = 0.5;

const fmt = (n: number): string => {
  const r = Math.round(n * 1000) / 1000;
  return String(r);
};

export function passDuration(count: number): number {
  return count * DWELL_S + (count - 1) * MOVE_S;
}

export interface SweepStop {
  pct: number;
  deg: number;
  ease: boolean;
}

export function sweepStops(angles: readonly number[]): SweepStop[] {
  const total = passDuration(angles.length);
  const stops: SweepStop[] = [];
  angles.forEach((deg, i) => {
    const dwellStart = (i * (DWELL_S + MOVE_S) * 100) / total;
    const dwellEnd = dwellStart + (DWELL_S * 100) / total;
    stops.push({ pct: dwellStart, deg, ease: false });
    stops.push({ pct: dwellEnd, deg, ease: i < angles.length - 1 });
  });
  return stops;
}

export interface GlowWindow {
  riseStartPct: number | null;
  holdStartPct: number;
  holdEndPct: number;
  fallEndPct: number | null;
}

export function glowWindow(index: number, count: number): GlowWindow {
  const total = passDuration(count);
  const dwellStart = (index * (DWELL_S + MOVE_S) * 100) / total;
  const dwellEnd = dwellStart + (DWELL_S * 100) / total;
  const ramp = (GLOW_RAMP_FRAC * MOVE_S * 100) / total;
  return {
    riseStartPct: index === 0 ? null : dwellStart - ramp,
    holdStartPct: dwellStart,
    holdEndPct: dwellEnd,
    fallEndPct: index === count - 1 ? null : dwellEnd + ramp,
  };
}

export function sweepKeyframes(angles: readonly number[], classSuffix: string = ""): string {
  const lines = sweepStops(angles).map(
    (s) =>
      `  ${fmt(s.pct)}% { transform: rotate(${fmt(s.deg)}deg);${s.ease ? " animation-timing-function: ease-in-out;" : ""} }`,
  );
  return `@keyframes hero-sweep${classSuffix} {\n${lines.join("\n")}\n}`;
}

export function glowKeyframes(name: string, w: GlowWindow): string {
  const lines: string[] = [];
  if (w.riseStartPct === null) {
    lines.push(`  0% { opacity: 1; }`);
  } else {
    lines.push(`  0% { opacity: 0; }`);
    lines.push(`  ${fmt(w.riseStartPct)}% { opacity: 0; }`);
    lines.push(`  ${fmt(w.holdStartPct)}% { opacity: 1; }`);
  }
  if (w.fallEndPct === null) {
    lines.push(`  ${fmt(w.holdStartPct)}% { opacity: 1; }`);
    lines.push(`  100% { opacity: 1; }`);
  } else {
    lines.push(`  ${fmt(w.holdEndPct)}% { opacity: 1; }`);
    lines.push(`  ${fmt(w.fallEndPct)}% { opacity: 0; }`);
    lines.push(`  100% { opacity: 0; }`);
  }
  const byStop = new Map<string, string>();
  for (const l of lines) {
    const stop = l.trim().split("%")[0];
    const prev = byStop.get(stop);
    if (prev !== undefined && prev !== l) {
      throw new Error(`glowKeyframes(${name}): conflicting values at ${stop}%`);
    }
    byStop.set(stop, l);
  }
  return `@keyframes ${name} {\n${[...byStop.values()].join("\n")}\n}`;
}

export function heroSweepCss(labels: readonly { rotate: number }[], classSuffix: string = ""): string {
  const anim = `${fmt(passDuration(labels.length))}s linear infinite alternate`;
  const parts: string[] = [
    sweepKeyframes(labels.map((l) => -l.rotate), classSuffix),
    `.hero-sweep-arm${classSuffix} {`,
    `  animation: hero-sweep${classSuffix} ${anim};`,
    `  will-change: transform;`,
    `}`,
  ];
  labels.forEach((_, i) => {
    parts.push(glowKeyframes(`hero-glow${classSuffix}-${i}`, glowWindow(i, labels.length)));
    parts.push(`.hero-glow${classSuffix}-${i} {`, `  animation: hero-glow${classSuffix}-${i} ${anim};`, `}`);
  });
  const allClasses = [`.hero-sweep-arm${classSuffix}`, ...labels.map((_, i) => `.hero-glow${classSuffix}-${i}`)].join(
    ", ",
  );
  parts.push(
    `@media (prefers-reduced-motion: reduce) {`,
    `  ${allClasses} { animation: none; }`,
    `}`,
  );
  return parts.join("\n");
}
