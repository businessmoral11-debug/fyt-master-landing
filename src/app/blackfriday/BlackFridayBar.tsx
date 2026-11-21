import { useEffect, useRef } from "react";
import { PROMO_DEADLINE } from "@/app/data/promoBanner";
import { BF_CODE } from "@/app/data/blackfriday";
// The same paste-in bar used on the WordPress pages (kept in one file so both stay identical).
import barHtml from "./topbar.html?raw";

/** Black Friday top bar. Full height at the top of the page, thin once the visitor scrolls. */
export function BlackFridayBar(_props: { compact?: boolean }) {
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
    };
    if (js) {
      try { new Function(js)(); } catch { /* bar stays static if the script fails */ }
    }
  }, []);
  return <div ref={host} style={{ width: "100%" }} />;
}
