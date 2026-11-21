import { useEffect, useState, type MouseEvent } from "react";
import { PROMO_DEADLINE, formatHoursLeft } from "@/app/data/promoBanner";
import { BF_CODE, BF_MAX_OFF } from "@/app/data/blackfriday";
import { ensureBfAssets } from "./bfStyles";

function useTick(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** Black Friday bar above the menu. Phone: two rows at the top, one slim row once scrolled. */
export function BlackFridayBar({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { ensureBfAssets(); }, []);
  const left = formatHoursLeft(PROMO_DEADLINE, useTick());

  const go = () => { window.location.hash = "challenge"; };
  const copy = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(BF_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked: the code is still readable on the pill.
    }
  };
  const Flip = ({ className = "" }: { className?: string }) =>
    left.expired ? null : (
      <div className={`fyt-bf-flip ${className}`} aria-label={`${left.hh} hours ${left.mm} minutes left`}>
        <span>{left.hh}</span><em>H</em><span>{left.mm}</span><em>M</em><span>{left.ss}</span><em>S</em>
      </div>
    );

  return (
    <div
      className={`fyt-bf fyt-bf-bar ${compact ? "fyt-bf-compact" : ""}`}
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }}
      aria-label="Black Friday offer, jump to pricing"
    >
      <span className="fyt-bf-beam" aria-hidden="true" />
      <div className="fyt-bf-in">
        <div className="fyt-bf-row">
          <div className="fyt-bf-name"><b>BLACK</b> FRIDAY</div>
          <div className="fyt-bf-upto">UP TO</div>
          <div className="fyt-bf-55"><b>{BF_MAX_OFF}%</b> OFF</div>
          <Flip className="fyt-bf-mflip" />
        </div>
        <div className="fyt-bf-chips">
          <span className="fyt-bf-chip"><b>+1 free</b> account</span>
          <span className="fyt-bf-chip">Buy 4 · <b>get 10</b></span>
          <span className="fyt-bf-chip gd">★ Daily <b>100K</b> giveaway</span>
        </div>
        <div className="fyt-bf-row fyt-bf-m2">
          <button type="button" className="fyt-bf-code" onClick={copy} aria-label={`Copy code ${BF_CODE}`}>{copied ? "COPIED" : "CODE"} <b>{BF_CODE}</b></button>
          <Flip />
        </div>
        <button type="button" className="fyt-bf-code fyt-bf-d" onClick={copy} aria-label={`Copy code ${BF_CODE}`}>{copied ? "COPIED" : "CODE"} <b>{BF_CODE}</b></button>
        <Flip className="fyt-bf-d" />
        <div className="fyt-bf-cta">Claim now</div>
      </div>
    </div>
  );
}
