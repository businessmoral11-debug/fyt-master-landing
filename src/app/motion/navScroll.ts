import { useEffect, useState } from "react";

export function useScrollShrink(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > threshold);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return scrolled;
}

export interface MobileHeaderMode {
  /** Scrolled past the top: promo banner folds to one line, nav gets slimmer. */
  compact: boolean;
  /** Scrolling down: nav tucks away behind the banner; it comes back on any scroll up. */
  navHidden: boolean;
}

const MOBILE_HEADER_QUERY = "(max-width: 1023px)";

/**
 * Phone-only header behaviour. Desktop always gets { compact: false, navHidden: false }.
 * Only reads window.scrollY inside one rAF per scroll burst and only sets state when the
 * mode actually changes, so it doesn't re-render on every scroll frame.
 */
export function useMobileHeaderMode(compactAfter = 120, delta = 8): MobileHeaderMode {
  const [mode, setMode] = useState<MobileHeaderMode>({ compact: false, navHidden: false });

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_HEADER_QUERY);
    let raf = 0;
    let lastY = window.scrollY;
    let current: MobileHeaderMode = { compact: false, navHidden: false };

    function apply(next: MobileHeaderMode) {
      if (next.compact === current.compact && next.navHidden === current.navHidden) return;
      current = next;
      setMode(next);
    }

    function evaluate() {
      raf = 0;
      const y = window.scrollY;
      if (!mq.matches) {
        lastY = y;
        apply({ compact: false, navHidden: false });
        return;
      }
      const compact = y > compactAfter;
      let navHidden = current.navHidden;
      if (!compact) navHidden = false;
      else if (y - lastY > delta) navHidden = true;
      else if (lastY - y > delta) navHidden = false;
      if (Math.abs(y - lastY) > delta || !compact) lastY = y;
      apply({ compact, navHidden });
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(evaluate);
    }

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener?.("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener?.("change", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [compactAfter, delta]);

  return mode;
}
