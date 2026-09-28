/**
 * The page uses `scroll-behavior: smooth` for same-page anchor links (the
 * hero's "Get Started Now" / "See How It Works" buttons, etc). That's a
 * native, browser-driven scroll that covers a long distance quickly — much
 * faster than a normal finger-drag scroll. If a WebGL canvas (trader globe)
 * is still actively rendering, or about to boot for the first time, while
 * that fast scroll fires, it's a much heavier GPU/main-thread load than
 * everyday scrolling — which is what was tipping some iPhones into a
 * frozen/black canvas or a full tab reload.
 *
 * This module lets a click on one of those anchor links tell every mounted
 * (or about-to-mount) WebGL scene to hold off, instead of relying purely on
 * each scene's own IntersectionObserver, which can lag behind a fast
 * programmatic scroll.
 */
const listeners = new Set<() => void>();
let pausedUntil = 0;

export function onHeavySceneNavPause(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Call on click, before the browser's native anchor-jump scroll begins. */
export function pauseHeavyScenesForNav(durationMs = 1200): void {
  pausedUntil = Date.now() + durationMs;
  listeners.forEach((fn) => fn());
}

/** True for a short window after a nav-triggered pause, so a scene's own
 * IntersectionObserver callback doesn't immediately flip it back on while
 * the fast scroll is still in flight. */
export function isHeavySceneNavPauseActive(): boolean {
  return Date.now() < pausedUntil;
}
