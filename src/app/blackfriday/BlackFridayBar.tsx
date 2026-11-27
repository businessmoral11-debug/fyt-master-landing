import { useEffect, useRef } from "react";
import { PROMO_DEADLINE } from "@/app/data/promoBanner";
import { BF_CODE } from "@/app/data/blackfriday";
// The same paste-in bar used on the WordPress pages (kept in one file so both stay identical).
import { FLASH_OFF, useFlash } from "@/app/data/flash";
import barHtml from "./topbar.html?raw";
import flashHtml from "./flashbar.html?raw";

/** Top bar: the 24-hour flash bar while this visitor's flash runs, the Black Friday bar otherwise. */
export function BlackFridayBar(props: { compact?: boolean }) {
  const f = useFlash();
  return f.on ? <FlashTopBar key="flash" end={f.end} /> : <BfBar key="bf" {...props} />;
}

type W = Window & { FYT_FLASH?: { off: number; end: number }; FYT_FS60_CONFIG?: Record<string, unknown> };

/** The fyt-fs60 flash bar (same file the WordPress pages use), counting down to this visitor's own deadline. */
function FlashTopBar({ end }: { end: number }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    const w = window as W;
    if (!el || el.dataset.ready) return;
    el.dataset.ready = "1";
    w.FYT_FLASH = { off: FLASH_OFF, end };
    w.FYT_FS60_CONFIG = { stickyMode: "none", ctaUrl: "#challenge", endDate: new Date(end).toISOString() };
    const at = flashHtml.lastIndexOf("<script>");
    const stop = flashHtml.lastIndexOf("</script>");
    const js = at >= 0 && stop > at ? flashHtml.slice(at + 8, stop) : "";
    el.innerHTML = at >= 0 ? flashHtml.slice(0, at) : flashHtml;
    if (js) {
      try { new Function(js)(); } catch { /* bar stays static if the script fails */ }
    }
    return () => { delete w.FYT_FLASH; delete w.FYT_FS60_CONFIG; };
  }, [end]);
  return <div ref={host} style={{ width: "100%" }} />;
}

/** Black Friday top bar. Full height at the top of the page, thin once the visitor scrolls. */
function BfBar(_props: { compact?: boolean }) {
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
