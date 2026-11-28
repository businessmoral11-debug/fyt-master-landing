import { useSyncExternalStore } from "react";
import { BF_TIERS, type BfTier } from "@/app/data/blackfriday";

/**
 * Black Friday flash sale ("Black Friday Upgraded"): 60% off every account and every bundle, for everyone,
 * until FLASH_END (one fixed time; the checkout and the client dashboard count down to the same moment).
 * After FLASH_END the normal Black Friday tiers (50 / 51 / 53 / 55) come back on their own.
 *
 * FLASH_MODE
 *  "off"     nobody sees it
 *  "preview" only a browser that opened the site once with ?flash=1 (test page)
 *  "live"    everyone
 */
export const FLASH_MODE: "off" | "preview" | "live" = "live";
export const FLASH_OFF = 60;
/** 28 Nov 2026, 4:00 PM IST. */
export const FLASH_END = "2026-11-28T16:00:00+05:30";
/** Length shown on the drain bar / dial. */
export const FLASH_HOURS = 24;
/** The checkout snippet answers here whether it is charging 60% right now, and until when. */
export const FLASH_START_URL = "/wp-admin/admin-ajax.php?action=fyt_flash_start";

const PREVIEW_KEY = "fyt_flash_preview";
const OK_KEY = "fyt_flash_ok";
const MS = FLASH_HOURS * 3600e3;

interface State { enabled: boolean; start: number; end: number; now: number }

let state: State = { enabled: false, start: 0, end: 0, now: Date.now() };
const subs = new Set<() => void>();
let booted = false;

function emit(next: Partial<State>) {
  state = { ...state, ...next };
  subs.forEach((f) => f());
}

function boot() {
  if (booted || typeof window === "undefined") return;
  booted = true;
  const sp = new URLSearchParams(window.location.search);
  let preview = false;
  try {
    if (sp.get("flash") === "1") window.localStorage.setItem(PREVIEW_KEY, "1");
    if (sp.get("flash") === "off") window.localStorage.removeItem(PREVIEW_KEY);
    preview = window.localStorage.getItem(PREVIEW_KEY) === "1";
  } catch { preview = sp.get("flash") === "1"; }
  const live = FLASH_MODE === "live";
  if (!(live || (FLASH_MODE === "preview" && preview))) return;

  let end = new Date(FLASH_END).getTime();
  if (Date.now() >= end) return;

  // Live: show 60% once the checkout has confirmed it charges 60% (remembered in this browser).
  let ok = !live;
  try { if (live && window.localStorage.getItem(OK_KEY) === "1") ok = true; } catch { /* storage blocked */ }

  let ticking = false;
  const show = () => {
    emit({ enabled: true, start: end - MS, end, now: Date.now() });
    if (ticking) return;
    ticking = true;
    const t = window.setInterval(() => {
      const n = Date.now();
      emit({ now: n });
      if (n >= state.end) window.clearInterval(t);
    }, 1000);
  };
  if (ok) show();

  fetch(FLASH_START_URL, { credentials: "include" })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (!j) return;
      if (live && !j.live) { // checkout is not charging 60%: show the normal Black Friday prices
        try { window.localStorage.removeItem(OK_KEY); } catch { /* storage blocked */ }
        if (ok) emit({ enabled: false });
        return;
      }
      if (j.end) end = Number(j.end) * 1000; // the checkout's end time wins
      if (live) { try { window.localStorage.setItem(OK_KEY, "1"); } catch { /* storage blocked */ } }
      if (Date.now() < end) show();
    })
    .catch(() => { /* no answer: test page shows the flash; the live site keeps what it knew */ });
}

function subscribe(f: () => void) {
  boot();
  subs.add(f);
  return () => { subs.delete(f); };
}
const snap = () => state;

export interface Flash { on: boolean; end: number; left: number; hh: string; mm: string; ss: string; share: number }

/** Live flash state. `on` turns false the second the sale ends. */
export function useFlash(): Flash {
  const s = useSyncExternalStore(subscribe, snap, snap);
  const left = s.enabled ? Math.max(0, s.end - s.now) : 0;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    on: left > 0,
    end: s.end,
    left,
    hh: pad(Math.floor(left / 3600e3)),
    mm: pad(Math.floor(left / 60e3) % 60),
    ss: pad(Math.floor(left / 1e3) % 60),
    share: left / MS,
  };
}

/** Bundles for this visitor right now: all 60% during the flash, the normal Black Friday tiers after. */
export function useBfTiers(): BfTier[] {
  const f = useFlash();
  return f.on ? BF_TIERS.map((t) => ({ ...t, off: FLASH_OFF })) : BF_TIERS;
}
