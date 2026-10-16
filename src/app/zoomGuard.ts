import { useEffect, useState } from "react";

/**
 * iPhone Safari can run out of memory and reload the page ("A problem repeatedly
 * occurred") when someone pinch-zooms a page with live 3D, blurred glass and
 * animations, because every layer is redrawn at the zoomed-in size.
 * While the page is pinch-zoomed we add `fyt-zoomed` to <html>: CSS turns off the
 * expensive effects and the globe stops drawing. Everything comes back on zoom-out.
 */
const ZOOM_CLASS = "fyt-zoomed";
const EVENT = "fyt:zoomchange";

export function isPinchZoomed(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains(ZOOM_CLASS);
}

export function installZoomGuard(): void {
  if (typeof window === "undefined" || !window.visualViewport) return;
  const vv = window.visualViewport;
  let raf = 0;
  const check = () => {
    raf = 0;
    const zoomed = vv.scale > 1.05;
    const root = document.documentElement;
    if (zoomed === root.classList.contains(ZOOM_CLASS)) return;
    root.classList.toggle(ZOOM_CLASS, zoomed);
    window.dispatchEvent(new Event(EVENT));
  };
  const schedule = () => {
    if (!raf) raf = window.requestAnimationFrame(check);
  };
  vv.addEventListener("resize", schedule);
  check();
}

export function usePinchZoomed(): boolean {
  const [zoomed, setZoomed] = useState(isPinchZoomed);
  useEffect(() => {
    const on = () => setZoomed(isPinchZoomed());
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return zoomed;
}
