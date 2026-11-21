import { useEffect } from "react";
import { BF_TIERS } from "@/app/data/blackfriday";
import { ensureBfAssets } from "./bfStyles";

/** What the visitor gets for the account they picked, in the same look as the Black Friday top bar. */
export function BlackFridaySummary({ sizeLabel }: { sizeLabel: string }) {
  useEffect(() => { ensureBfAssets(); }, []);
  const base = BF_TIERS[0];
  const more = BF_TIERS.slice(1);
  return (
    <div className="fyt-bf fyt-bf-sum" aria-label={`Black Friday: ${base.off}% off, you get ${base.get} ${sizeLabel} accounts`}>
      <div className="fyt-bf-sum-bg" aria-hidden="true" />
      <div className="fyt-bf-sum-top">
        <div className="fyt-bf-sum-fan" aria-hidden="true"><i /><i /></div>
        <div style={{ minWidth: 0 }}>
          <div className="fyt-bf-sum-h">YOU GET <span>{base.get}</span> &times; {sizeLabel}</div>
          <div className="fyt-bf-sum-s">1 purchased + <b>1 bonus, free</b></div>
        </div>
        <span className="fyt-bf-sum-off">{base.off}% OFF</span>
      </div>
      <div className="fyt-bf-sum-more">
        <small>MORE AT CHECKOUT</small>
        {more.map((t, k) => (
          <div key={t.buy} className={`fyt-bf-sum-t${k === more.length - 1 ? " gd" : ""}`}>
            <small>BUY {t.buy} · {t.off}%</small>
            <b>GET {t.get}</b>
          </div>
        ))}
      </div>
      <div className="fyt-bf-sum-give">★ <b>1 entry</b> to win a $100K funded account today</div>
      <span className="fyt-bf-sum-line" aria-hidden="true" />
    </div>
  );
}
