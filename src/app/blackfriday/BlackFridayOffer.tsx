import { useEffect } from "react";
import { BF_CODE, BF_LANDING_TIERS as BF_TIERS } from "@/app/data/blackfriday";
import { ensureBfAssets } from "./bfStyles";
import { useFlash } from "@/app/data/flash";
import { FlashOffer } from "./FlashSale";

/** Black Friday offer block at the top of the pricing section: giant 50%, then the Buy 1 to Buy 4 staircase. */
export function BlackFridayOffer() {
  const flash = useFlash().on;
  return flash ? <FlashOffer /> : <BlackFridayBlock />;
}

function BlackFridayBlock() {
  useEffect(() => { ensureBfAssets(); }, []);
  const toPicker = () => document.getElementById("fyt-bf-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="fyt-bf fyt-bf-hero">
      <div className="fyt-bf-grid" aria-hidden="true" />
      <div className="fyt-bf-eyebrow">BLACK FRIDAY · CODE {BF_CODE}</div>
      <div className="fyt-bf-mega">
        <div className="fyt-bf-fan" aria-hidden="true">
          <div className="fyt-bf-card b"><i>YOU PAY</i><span>$100K</span></div>
          <div className="fyt-bf-card y"><i>FREE</i><span>$100K</span></div>
        </div>
        <div className="fyt-bf-num">50%</div>
        <div className="fyt-bf-off"><b>OFF</b>EVERY ACCOUNT<br />+ 1 FREE</div>
      </div>
      <h2 className="fyt-bf-h2"><span>Buy more. </span><b className="fyt-bf-g">Pay less. Get more.</b></h2>
      <div className="fyt-bf-stairs fyt-bf-two">
        {BF_TIERS.map((t, k) => (
          <button key={t.buy} type="button" className={`fyt-bf-st fyt-bf-s${k === BF_TIERS.length - 1 ? 4 : 2}`} onClick={toPicker} aria-label={`Buy ${t.buy}, ${t.off}% off, get ${t.get} accounts`}>
            <div className="fyt-bf-si">
              <div>
                {k === BF_TIERS.length - 1 && <span className="fyt-bf-ribbon">BEST DEAL</span>}
                <div className="fyt-bf-pct"><b className={k === BF_TIERS.length - 1 ? "fyt-bf-gold" : undefined}>{t.off}</b>%<small>OFF</small></div>
                <div className="fyt-bf-get">Get <b>{t.get}</b></div>
                <div className="fyt-bf-dots" aria-hidden="true">
                  {Array.from({ length: t.get }, (_, n) => <i key={n} className={n < t.buy ? undefined : "f"} />)}
                </div>
              </div>
              <div className="fyt-bf-lab">BUY {t.buy}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="fyt-bf-give"><i>100K</i><span>One <b>100K funded account</b> given away every day. Every purchase is an entry.</span></div>
      <div className="fyt-bf-note" id="fyt-bf-picker">Choose your account, then pick your deal below.</div>
    </div>
  );
}
