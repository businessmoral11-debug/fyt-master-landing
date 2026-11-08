import { useEffect, useState } from "react";
import { GIFT_END, isGiftLive } from "@/app/data/gift";

const GOLD = "#f0be5a";
const pad = (n: number) => String(n).padStart(2, "0");

/** Live seconds left of the 30-hour gift window, or null when the gift is not running. */
export function useGiftClock(): { h: string; m: string; s: string } | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!isGiftLive(now)) return null;
  const left = Math.max(0, new Date(GIFT_END).getTime() - now);
  return { h: pad(Math.floor(left / 36e5)), m: pad(Math.floor(left / 6e4) % 60), s: pad(Math.floor(left / 1e3) % 60) };
}

export function GiftIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12" />
      <path d="M12 8c-1.2-3.2-5-3.6-5-1.4C7 8 10 8 12 8zM12 8c1.2-3.2 5-3.6 5-1.4C17 8 14 8 12 8z" />
    </svg>
  );
}

function Clock({ c, big = false }: { c: { h: string; m: string; s: string }; big?: boolean }) {
  const cell = (v: string, u: string) => (
    <span className="flex items-baseline gap-[2px]">
      <b className={`font-semibold tabular-nums text-white ${big ? "text-[15px]" : "text-[13px]"}`}>{v}</b>
      <i className="text-[10px] not-italic" style={{ color: GOLD }}>{u}</i>
    </span>
  );
  return (
    <span className="flex items-center gap-[7px] rounded-full px-[10px] py-[3px]" style={{ background: "rgba(240,190,90,0.12)", border: "1px solid rgba(240,190,90,0.4)" }} role="timer" aria-label={`${c.h} hours ${c.m} minutes ${c.s} seconds left`}>
      {cell(c.h, "h")}
      {cell(c.m, "m")}
      {cell(c.s, "s")}
    </span>
  );
}

/** Thin gold strip under the Diwali bar (sticks with the header). */
export function GiftStrip() {
  const c = useGiftClock();
  if (!c) return null;
  return (
    <div className="relative flex w-full items-center justify-center gap-[10px] px-[12px] py-[4px] sm:gap-[12px]" style={{ background: "linear-gradient(90deg,#071636,#0d2a66 50%,#071636)", borderBottom: "1px solid rgba(240,190,90,0.4)" }}>
      <GiftIcon size={15} />
      <span className="hidden text-[10.5px] font-semibold uppercase tracking-[0.2em] sm:inline" style={{ color: GOLD }}>Special Diwali gift by FYT</span>
      <span className="text-[12.5px] font-light text-[#eef0f6] sm:text-[13.5px]">
        <span className="sm:hidden">Surprise gift with every purchase</span>
        <span className="hidden sm:inline">Every purchase today gets a surprise gift</span>
      </span>
    </div>
  );
}

/** Same message as a quiet row inside the pricing card (desktop and phone). */
export function GiftLine() {
  const c = useGiftClock();
  if (!c) return null;
  return (
    <div className="relative flex shrink-0 flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px] rounded-[16px] px-[14px] py-[10px]" style={{ background: "linear-gradient(90deg, rgba(249,115,22,0.14), rgba(240,190,90,0.08))", border: "1px solid rgba(249,115,22,0.38)" }}>
      <div className="flex min-w-0 items-center gap-[10px]">
        <GiftIcon size={22} />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Special Diwali gift by FYT</span>
          <span className="text-[13px] font-light text-[#eef0f6]">Every purchase today gets a surprise gift</span>
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#aab3c8]">Gift ends in</span>
        <Clock c={c} big />
      </div>
    </div>
  );
}
