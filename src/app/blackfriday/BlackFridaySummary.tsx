import { useEffect } from "react";
import { BF_TIERS } from "@/app/data/blackfriday";
import { ensureBfAssets } from "./bfStyles";

/**
 * What the visitor gets for the account they picked. Kept calm on purpose: it sits next to the price and
 * the buy button, so it uses one gold accent, no motion and plain facts.
 */
export function BlackFridaySummary({ sizeLabel }: { sizeLabel: string }) {
  useEffect(() => { ensureBfAssets(); }, []);
  const base = BF_TIERS[0];
  const more = BF_TIERS.slice(1);
  return (
    <div className="fyt-bf fyt-bf-sum" aria-label={`Black Friday: ${base.off}% off, you get ${base.get} ${sizeLabel} accounts`}>
      <div className="fyt-bf-sum-top">
        <div className="fyt-bf-sum-txt">
          <div className="fyt-bf-sum-h">You get <b>{base.get}</b><small>&times; {sizeLabel} accounts</small></div>
          <div className="fyt-bf-sum-s">
            <span className="fyt-bf-sum-dots" aria-hidden="true"><i /><i /></span>
            <span>1 purchased + 1 bonus</span>
          </div>
        </div>
        <span className="fyt-bf-sum-off">{base.off}% off applied</span>
      </div>
      <div className="fyt-bf-sum-more">
        <small>MORE AT CHECKOUT</small>
        {more.map((t, k) => (
          <div key={t.buy} className={`fyt-bf-sum-t${k === more.length - 1 ? " gd" : ""}`}>
            <small>Buy {t.buy} · {t.off}%</small>
            <b>Get {t.get}</b>
          </div>
        ))}
      </div>
      <div className="fyt-bf-sum-give"><b>1 entry</b> in today's 100K funded account giveaway</div>
    </div>
  );
}
