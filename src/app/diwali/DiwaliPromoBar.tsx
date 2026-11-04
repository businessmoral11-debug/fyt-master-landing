import { useEffect, useRef } from "react";
import { DIWALI_CODE, DIWALI_END } from "@/app/data/diwali";
import { DIWALI_BAR_CSS, DIWALI_BAR_HTML } from "./diwaliBarMarkup";
import { mountDiwaliBar } from "./diwaliBar";
import { DIWALI_SLIM_CSS } from "./diwaliSlim";

const FONT_ID = "fyt-dw-fonts";

/** Diwali Special bar above the menu. Self-contained: own styles, countdown, copy button and lights. */
export function DiwaliPromoBar({ compact = false }: { compact?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (!document.getElementById(FONT_ID)) {
      const l = document.createElement("link");
      l.id = FONT_ID;
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;600;700&display=swap";
      document.head.appendChild(l);
    }
    el.innerHTML = `<style>${DIWALI_BAR_CSS}${DIWALI_SLIM_CSS}</style>${DIWALI_BAR_HTML}`;
    const bar = el.querySelector<HTMLElement>("#fyt-dw-bar");
    const stop = bar
      ? mountDiwaliBar(bar, {
          endDate: DIWALI_END,
          rollingDays: null,
          couponCode: DIWALI_CODE,
          headline: "Diwali Special: 45% Off + Buy 1 Get 3 Instantly",
          ctaText: "Claim Offer",
          ctaUrl: "#challenge",
          ctaNewTab: false,
          whenEnded: "hide",
          endedText: "Offer ended",
          sticky: false,
          showClose: true,
          fireworks: true,
        })
      : undefined;
    return () => {
      stop?.();
      el.innerHTML = "";
    };
  }, []);
  useEffect(() => {
    host.current?.querySelector("#fyt-dw-bar")?.classList.toggle("fyt-dw-compact", compact);
  }, [compact]);
  return <div ref={host} style={{ minHeight: 46 }} />;
}
