import { useSyncExternalStore } from "react";
import { BF_TIERS, type BfTier } from "@/app/data/blackfriday";

/**
 * 24-hour Black Friday flash sale ("Black Friday Upgraded").
 * Every visitor gets their own 24 hours from the first time they open the site, in their own time zone.
 * During those 24 hours every bundle is 60% off. When their 24 hours end, the normal Black Friday tiers
 * (50 / 51 / 53 / 55) come back on their own.
 *
 * FLASH_MODE
 *  "off"     nobody sees it
 *  "preview" only a browser that opened the site once with ?flash=1 (test page); ?flash=reset starts a fresh 24 hours
 *  "live"    everyone
 */
export const FLASH_MODE: "off" | "preview" | "live" = "live";
export const FLASH_OFF = 60;
export const FLASH_HOURS = 24;
/** No new 24-hour windows start after this moment (windows already running finish normally). */
export const FLASH_LAST_START = "2026-12-01T17:00:00+05:30";
/** The checkout snippet hands out a signed start time here, so the checkout can check the same deadline. */
export const FLASH_START_URL = "/wp-admin/admin-ajax.php?action=fyt_flash_start";

const KEY = "fyt_flash_start";
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

function readLocal(): number {
  try { return Number(window.localStorage.getItem(KEY)) || 0; } catch { return 0; }
}
function writeLocal(start: number) {
  try { window.localStorage.setItem(KEY, String(start)); } catch { /* storage blocked: this visit only */ }
}

function boot() {
  if (booted || typeof window === "undefined") return;
  booted = true;
  const sp = new URLSearchParams(window.location.search);
  let preview = false;
  try {
    if (sp.get("flash") === "1" || sp.get("flash") === "reset") window.localStorage.setItem(PREVIEW_KEY, "1");
    if (sp.get("flash") === "off") window.localStorage.removeItem(PREVIEW_KEY);
    if (sp.get("flash") === "reset") window.localStorage.removeItem(KEY);
    preview = window.localStorage.getItem(PREVIEW_KEY) === "1";
  } catch { preview = sp.get("flash") === "1"; }
  const live = FLASH_MODE === "live";
  if (!(live || (FLASH_MODE === "preview" && preview))) return;

  // Live: the 60% only shows once the checkout has confirmed it is charging 60% too (the checkout snippet answers
  // "live"). That answer is remembered in this browser, so later pages show the flash at once.
  let ok = !live;
  try { if (live && window.localStorage.getItem(OK_KEY) === "1") ok = true; } catch { /* storage blocked */ }

  let start = readLocal();
  const now = Date.now();
  const tick = () => {
    const t = window.setInterval(() => {
      const n = Date.now();
      emit({ now: n });
      if (n >= state.end) window.clearInterval(t);
    }, 1000);
  };
  if (ok) {
    if (!start) {
      if (now > new Date(FLASH_LAST_START).getTime()) return; // sale closed for new visitors
      start = now;
      writeLocal(start);
    }
    emit({ enabled: true, start, end: start + MS, now });
    tick();
  }

  // Ask the site for the signed start time (same one the checkout checks). The server keeps the earliest.
  const qs = (start ? `&s=${Math.floor(start / 1000)}` : "") + (sp.get("flash") === "reset" ? "&reset=1" : "");
  fetch(`${FLASH_START_URL}${qs}`, { credentials: "include" })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (!j || !j.start) return;
      if (live && !j.live) return; // checkout not live yet: keep the normal Black Friday prices
      const s = Number(j.start) * 1000;
      writeLocal(s);
      if (live) { try { window.localStorage.setItem(OK_KEY, "1"); } catch { /* storage blocked */ } }
      if (ok) emit({ start: s, end: s + MS });
      else if (Date.now() < s + MS) { ok = true; emit({ enabled: true, start: s, end: s + MS, now: Date.now() }); tick(); }
    })
    .catch(() => { /* no answer: test page keeps its local start; the live site stays on normal prices */ });
}

function subscribe(f: () => void) {
  boot();
  subs.add(f);
  return () => { subs.delete(f); };
}
const snap = () => state;

export interface Flash { on: boolean; end: number; left: number; hh: string; mm: string; ss: string; share: number }

/** Live flash state for this visitor. `on` turns false the second their 24 hours end. */
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
