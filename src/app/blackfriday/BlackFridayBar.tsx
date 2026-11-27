import { useEffect, useRef } from "react";
import { PROMO_DEADLINE } from "@/app/data/promoBanner";
import { BF_CODE } from "@/app/data/blackfriday";
// The same paste-in bar used on the WordPress pages (kept in one file so both stay identical).
import { FLASH_OFF, useFlash } from "@/app/data/flash";
import barHtml from "./topbar.html?raw";

/** Top bar: the 12-hour flash bar while this visitor's flash runs, the Black Friday bar otherwise. */
export function BlackFridayBar(props: { compact?: boolean }) {
  const f = useFlash();
  // Same bar in both cases; during the visitor's 12 hours it gets the flash look and counts down to their own deadline.
  return f.on ? <BfBar key="flash" {...props} flashEnd={f.end} /> : <BfBar key="bf" {...props} />;
}

/** Black Friday top bar. Full height at the top of the page, thin once the visitor scrolls. */
function BfBar({ flashEnd }: { compact?: boolean; flashEnd?: number }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || el.dataset.ready) return;
    el.dataset.ready = "1";
    // The file's opening comment also contains the word "<script>", so cut at the last one.
    const at = barHtml.lastIndexOf("<script>");
    const end = barHtml.lastIndexOf("</script>");
    const js = at >= 0 && end > at ? barHtml.slice(at + 8, end) : "";
    el.innerHTML = at >= 0 ? barHtml.slice(0, at) : barHtml;
    (window as unknown as { FYT_BF_CONFIG?: Record<string, unknown> }).FYT_BF_CONFIG = {
      stickyMode: "none", // the landing's own header stack keeps it at the top
      endDate: PROMO_DEADLINE,
      couponCode: BF_CODE,
      ctaUrl: "#challenge",
      whenEnded: "message",
      ...(flashEnd
        ? {
            theme: "flash",
            brand: ["BLACK FRIDAY", "UPGRADED"],
            endDate: new Date(flashEnd).toISOString(),
            endsText: "Your 12 hrs end in",
            hero: `${FLASH_OFF}% OFF EVERYTHING`,
            heroShort: `${FLASH_OFF}% OFF ALL`,
            ticker: ["BUY 1 GET 2 INSTANTLY", "BUY 2 GET 5 INSTANTLY"],
            tickerShort: ["BUY 1 GET 2", "BUY 2 GET 5"],
            ctaText: `Claim ${FLASH_OFF}% Off`,
            ctaTextShort: "Claim",
            srText: `Black Friday upgraded: ${FLASH_OFF}% off everything for your next 12 hours. Buy 1 get 2 instantly, buy 2 get 5 instantly.`,
            whenEnded: "hide",
            soonHours: 0,
          }
        : {}),
    };
    if (js) {
      try { new Function(js)(); } catch { /* bar stays static if the script fails */ }
    }
  }, []);
  return <div ref={host} style={{ width: "100%" }} />;
}
