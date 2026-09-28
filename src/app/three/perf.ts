/**
 * Shared "should this device get the lighter 3D settings" check, used by
 * the trader globe (and, on desktop-with-mouse, the hero scene) so both
 * scale down together instead of each guessing independently.
 *
 * Kept cheap and synchronous (no ResizeObserver, no async GPU probing) so
 * it can be called once on mount without adding a render pass. Combines a
 * few weak signals rather than relying on any single one, since no single
 * API reliably identifies "low power" across iOS/Android/desktop:
 *   - coarse pointer + narrow viewport  -> phone-class device
 *   - low logical core count            -> weaker CPU for our per-frame JS
 *   - low deviceMemory (Chrome/Android only, not available on iOS Safari)
 *   - prefers-reduced-motion            -> user explicitly asked for less
 */
export function isLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;

  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const narrowViewport = window.innerWidth < 900;
  const fewCores = typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4;
  const lowMemory =
    typeof navigator !== "undefined" && "deviceMemory" in navigator && (navigator as { deviceMemory?: number }).deviceMemory !== undefined
      ? (navigator as { deviceMemory: number }).deviceMemory <= 4
      : false;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (reducedMotion) return true;
  if (coarsePointer && narrowViewport) return true;
  if (fewCores || lowMemory) return true;
  return false;
}
