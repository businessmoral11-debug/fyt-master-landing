import { useEffect } from "react";
import { BF_TIERS } from "@/app/data/blackfriday";
import { ensureBfAssets } from "./bfStyles";

const usd = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

/**
 * Pick the deal right next to the price: Buy 1 to Buy 4. One tap changes the price above, what you get
 * below and the checkout. Kept calm: one question, four plain choices, the answer in one line.
 */
export function BlackFridaySummary({ sizeLabel, qty, onQty, unitList }: { sizeLabel: string; qty: number; onQty: (q: number) => void; unitList: number }) {
  useEffect(() => { ensureBfAssets(); }, []);
  const t = BF_TIERS.find((x) => x.buy === qty) ?? BF_TIERS[0];
  const bonus = t.get - t.buy;
  const each = Math.round(((unitList * t.buy * (1 - t.off / 100)) / t.get) * 100) / 100;
  return (
    <div className="fyt-bf fyt-bf-sum">
      <div className="fyt-bf-sum-q">How many accounts do you want?<span>Tap to change</span></div>
      <div className="fyt-bf-sum-tiles" role="radiogroup" aria-label="Black Friday deal">
        {BF_TIERS.map((x) => (
          <button key={x.buy} type="button" role="radio" aria-checked={x.buy === t.buy} className={`fyt-bf-sum-t${x.buy === t.buy ? " on" : ""}`} onClick={() => onQty(x.buy)}>
            {x.buy === 2 && <span className="fyt-bf-sum-tag">POPULAR</span>}
            {x.buy === 4 && <span className="fyt-bf-sum-tag gd">BEST VALUE</span>}
            <small>Buy {x.buy}</small>
            <b>Get {x.get}</b>
            <em>{x.off}% off</em>
          </button>
        ))}
      </div>
      <div className="fyt-bf-sum-res" aria-live="polite">
        <div className="fyt-bf-sum-txt">
          <div className="fyt-bf-sum-h">You get <b>{t.get}</b><small>&times; {sizeLabel} accounts</small></div>
          <div className="fyt-bf-sum-s">
            <span className="fyt-bf-sum-dots" aria-hidden="true">{Array.from({ length: t.get }, (_, n) => <i key={n} className={n < t.buy ? undefined : "f"} />)}</span>
            <span>{t.buy} purchased + {bonus} bonus</span>
          </div>
        </div>
        <div className="fyt-bf-sum-each"><b>{usd(each)}</b>per account</div>
      </div>
      <div className="fyt-bf-sum-give"><b>{t.buy} {t.buy === 1 ? "entry" : "entries"}</b> in today's 100K funded account giveaway</div>
    </div>
  );
}
