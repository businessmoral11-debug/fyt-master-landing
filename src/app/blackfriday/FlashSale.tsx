import { useEffect, useState } from "react";
import { BF_LANDING_TIERS } from "@/app/data/blackfriday";
import { FLASH_OFF, useFlash } from "@/app/data/flash";
import { ensureFlashAssets } from "./flashStyles";

const toTable = () => document.getElementById("fyt-bf-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });

function Arrow({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 64 24" fill="none" aria-hidden="true">
      <defs><linearGradient id="fytFlAr" x1="0" x2="1"><stop offset="0" stopColor="#4d8dff" stopOpacity=".2" /><stop offset="1" stopColor="#ffe2a0" /></linearGradient></defs>
      <path d="M2 12h54M46 3l10 9-10 9" stroke="url(#fytFlAr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Top bar during this visitor's 12 hours. */
export function FlashBar({ compact }: { compact?: boolean }) {
  const f = useFlash();
  useEffect(() => { ensureFlashAssets(); }, []);
  const go = () => document.getElementById("challenge")?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className={`fyt-fl fyt-fl-bar${compact ? " fyt-fl-compact" : ""}`} onClick={go} role="button" aria-label="Black Friday upgraded: 60% off everything for 12 hours">
      <span className="fyt-fl-bolt" aria-hidden="true" />
      <div className="fyt-fl-in">
        <div className="fyt-fl-row">
          <span className="fyt-fl-name"><span className="fyt-fl-live" />BLACK FRIDAY <b>UPGRADED</b></span>
          <span className="fyt-fl-60"><span className="fyt-fl-was">50%</span><b className="fyt-fl-gold">{FLASH_OFF}%</b><small>OFF EVERYTHING</small></span>
        </div>
        <div className="fyt-fl-chips">
          <span className="fyt-fl-chip">Buy 1 <b>Get 2</b> Instantly</span>
          <span className="fyt-fl-chip gd">Buy 2 <b>Get 5</b> Instantly</span>
        </div>
        <div className="fyt-fl-row">
          <span className="fyt-fl-clock" aria-live="off"><i>ENDS IN</i><span>{f.hh}</span><em>:</em><span>{f.mm}</span><em>:</em><span>{f.ss}</span></span>
          <span className="fyt-fl-m">Buy 2 <b>&nbsp;Get 5&nbsp;</b> Instantly</span>
        </div>
        <span className="fyt-fl-cta">Claim {FLASH_OFF}%</span>
      </div>
    </div>
  );
}

/** 50 -> 60 once on load: the "upgrade" moment. Rests on 60. */
function useUpgradeCount(): number {
  const [n, setN] = useState(FLASH_OFF);
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0; const t0 = performance.now() + 350; const from = 50;
    setN(from);
    const step = (t: number) => {
      const k = Math.min(1, Math.max(0, (t - t0) / 1100));
      const e = 1 - Math.pow(1 - k, 3);
      setN(Math.round(from + (FLASH_OFF - from) * e));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return n;
}

/** Mini fanned account cards: blue = paid, gold = free. */
function Fan({ buy, get }: { buy: number; get: number }) {
  return (
    <span className="fyt-fl-fan" aria-hidden="true" style={{ width: `${34 + (get - 1) * 9}px` }}>
      {Array.from({ length: get }, (_, n) => (
        <i key={n} className={n < buy ? undefined : "f"} style={{ left: `${n * 9}px`, transform: `rotate(${(n - (get - 1) / 2) * 7}deg)`, zIndex: n }} />
      ))}
    </span>
  );
}

/** Offer block above the pricing table during this visitor's 12 hours. */
export function FlashOffer() {
  const f = useFlash();
  const n = useUpgradeCount();
  useEffect(() => { ensureFlashAssets(); }, []);
  return (
    <div className="fyt-fl fyt-fl-hero">
      <div className="fyt-fl-rays" aria-hidden="true" />
      <div className="fyt-fl-eye"><span className="fyt-fl-live" />LIVE <b>FOR 12 HOURS ONLY</b></div>
      <h2 className="fyt-fl-h1">Black Friday, <b className="fyt-fl-gold">upgraded.</b></h2>
      <div className="fyt-fl-mega" aria-label={`Upgraded from 50% to ${FLASH_OFF}% off`}>
        <span className="fyt-fl-old">50%</span>
        <Arrow className="fyt-fl-arrow" />
        <span className={`fyt-fl-num${n === FLASH_OFF ? " done" : ""}`}>{n}%</span>
        <span className="fyt-fl-offtxt"><b>OFF</b>EVERYTHING</span>
      </div>
      <div className="fyt-fl-time">
        <div className="fyt-fl-time-l"><span className="fyt-fl-live" />YOUR 12 HOURS END IN</div>
        <div className="fyt-fl-digits" role="timer">
          <div className="fyt-fl-dg"><b>{f.hh}</b><small>HRS</small></div><span className="fyt-fl-sep">:</span>
          <div className="fyt-fl-dg"><b>{f.mm}</b><small>MIN</small></div><span className="fyt-fl-sep">:</span>
          <div className="fyt-fl-dg"><b>{f.ss}</b><small>SEC</small></div>
        </div>
        <div className="fyt-fl-drain" aria-hidden="true"><i style={{ width: `${Math.max(2, f.share * 100)}%` }} /></div>
      </div>
      <div className="fyt-fl-deals">
        {BF_LANDING_TIERS.map((t, k) => {
          const best = k === BF_LANDING_TIERS.length - 1;
          return (
            <button key={t.buy} type="button" className={`fyt-fl-deal${best ? " gd" : ""}`} onClick={toTable} aria-label={`Buy ${t.buy}, get ${t.get} instantly, ${FLASH_OFF}% off`}>
              {best && <span className="fyt-fl-tag">BEST DEAL</span>}
              <div className="fyt-fl-di">
                <span className="fyt-fl-cnt">{t.get}</span>
                <span className="fyt-fl-dtx">
                  <span className="fyt-fl-dl">BUY {t.buy} &middot; GET {t.get}</span>
                  <span className="fyt-fl-dh">accounts <b>instantly</b></span>
                  <span className="fyt-fl-pct">{FLASH_OFF}% OFF</span>
                </span>
                <Fan buy={t.buy} get={t.get} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="fyt-fl-chips2">
        <span>Buy 3 Get 7 &middot; Buy 4 Get 10 <b>also {FLASH_OFF}% off</b></span>
        <span className="g"><i>100K</i>Daily funded account <b>giveaway</b></span>
      </div>
      <div id="fyt-bf-picker" />
    </div>
  );
}
