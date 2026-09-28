/**
 * Answers "is the page scrolling right now" for any source — a normal
 * finger drag, momentum/inertia after a swipe, or a same-page anchor jump's
 * programmatic scroll. scenePause.ts only covers the last of those (an
 * explicit click); this covers all of them, which matters because the
 * trader globe's heavy first-time boot (new WebGL context + a canvas-drawn
 * earth texture, all synchronous) can land during an ordinary swipe too,
 * not just a CTA click — a single scroll gesture on a phone is often
 * enough to bring the globe within its preload margin.
 *
 * A single passive, page-wide scroll listener updates a timestamp; anything
 * that wants to defer heavy work checks `isScrollSettled()` first.
 */
let lastScrollAt = 0;
let installed = false;

function ensureInstalled(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const mark = () => {
    lastScrollAt = Date.now();
  };
  window.addEventListener("scroll", mark, { passive: true, capture: true });
}

/** True once at least `settleMs` has passed since the last scroll event
 * (or if no scroll has happened yet this page load). */
export function isScrollSettled(settleMs = 220): boolean {
  ensureInstalled();
  if (lastScrollAt === 0) return true;
  return Date.now() - lastScrollAt > settleMs;
}
