import { useMotionValue, useMotionValueEvent, type MotionValue } from "motion/react";


export function trackMonotonicMax(previousMax: number, latest: number): number {
  return latest > previousMax ? latest : previousMax;
}

/**
 * A pure ratchet: once a card is revealed, it stays revealed. `latest` hits
 * exactly 0 not just at the section's true top edge but for the whole
 * clamped range above it (useScroll clamps to 0 while scrolled above
 * `target`'s start), so resetting on `latest === 0` wiped out an
 * already-earned reveal every time the user scrolled back up past the
 * section and re-entered -- the cards would replay/disappear instead of
 * staying visible. No reset branch here means they never do.
 */
export function useMonotonicProgress(source: MotionValue<number>): MotionValue<number> {
  const output = useMotionValue(source.get());
  useMotionValueEvent(source, "change", (latest) => {
    output.set(trackMonotonicMax(output.get(), latest));
  });
  return output;
}
