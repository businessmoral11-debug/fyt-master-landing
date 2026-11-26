import { useEffect } from "react";
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

/** Offer block above the pricing table during this visitor's 12 hours. */
export function FlashOffer() {
  const f = useFlash();
  useEffect(() => { ensureFlashAssets(); }, []);
  return (
    <div className="fyt-fl fyt-fl-hero">
      <div className="fyt-fl-rays" aria-hidden="true" />
      <div className="fyt-fl-eye"><span className="fyt-fl-live" />LIVE <b>FOR 12 HOURS ONLY</b></div>
      <h2 className="fyt-fl-h1">Black Friday, <b className="fyt-fl-gold">upgraded.</b></h2>
      <div className="fyt-fl-mega" aria-label={`Upgraded from 50% to ${FLASH_OFF}% off`}>
        <span className="fyt-fl-old">50%</span>
        <Arrow className="fyt-fl-arrow" />
        <span className="fyt-fl-num">{FLASH_OFF}%</span>
        <span className="fyt-fl-offtxt"><b>OFF</b>EVERYTHING<br />EVERY BUNDLE</span>
      </div>
      <div className="fyt-fl-time">
        <div className="fyt-fl-time-l">YOUR 12 HOURS END IN</div>
        <div className="fyt-fl-digits" role="timer">
          <div className="fyt-fl-dg"><b>{f.hh}</b><small>HOURS</small></div><span className="fyt-fl-sep">:</span>
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
                <div className="fyt-fl-dl">BUY {t.buy}</div>
                <div className="fyt-fl-dh">Get <b className={best ? "fyt-fl-gold" : undefined}>{t.get}</b> Instantly</div>
                <div className="fyt-fl-ds">
                  <span className="fyt-fl-dots" aria-hidden="true">{Array.from({ length: t.get }, (_, n) => <i key={n} className={n < t.buy ? undefined : "f"} />)}</span>
                  <span className="fyt-fl-pct">{FLASH_OFF}% OFF</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="fyt-fl-more">Buy 3 Get 7 and Buy 4 Get 10 are <b>{FLASH_OFF}% off</b> too, at checkout.</div>
      <div><span className="fyt-fl-give"><i>100K</i><span>One <b>100K funded account</b> given away every day.</span></span></div>
      <div className="fyt-fl-note" id="fyt-bf-picker">Choose your account, then pick your deal below.</div>
    </div>
  );
}
