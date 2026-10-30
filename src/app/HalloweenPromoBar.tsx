/**
 * Halloween promo bar ("The Haunted Vault"), from the supplied design.
 * Desktop: one row. Phone: two rows; folds to one slim row when the header compacts on scroll.
 * Click anywhere (except the code) to jump to pricing; the code copies to clipboard.
 */
import { useEffect, useRef } from "react";
import { HALLOWEEN_CODE, HALLOWEEN_END, STAGE_LABEL, halloweenStage } from "@/app/data/halloween";
import { initHalloweenBar } from "./halloweenBarFx";

const CSS = `
/* ---------- Base / layout ---------------------------------------------- */
.fyt-hw-bar, .fyt-hw-bar *, .fyt-hw-bar *::before, .fyt-hw-bar *::after { box-sizing: border-box; }
.fyt-hw-bar {
  /* Brand colours: tweak here */
  --fyt-hw-navy: #0b0f1b;
  --fyt-hw-blue: #2354dc;
  --fyt-hw-orange-1: #fd8a42;
  --fyt-hw-orange-2: #ec6a1d;
  

  position: relative;            /* add "position: sticky; top: 0; z-index: 1000;" to make it sticky */
  width: 100%;
  min-height: 54px;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  font-family: 'Inter:Bold', Inter, "Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
  line-height: 1;
  background:
    radial-gradient(120% 140% at 50% 120%, rgba(255,138,61,.16), transparent 60%),
    linear-gradient(90deg, #0b0f1b 0%, #13215f 12%, #1a38a6 30%, #2354dc 48%, #1c3dae 66%, #1e2b62 82%, #121a40 100%);
  border-bottom: 1px solid rgba(255,255,255,.06);
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
}
.fyt-hw-inner {
  position: relative; z-index: 2;
  min-height: 54px;
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap;
  gap: 8px 22px;
  padding: 8px 64px;
}
.fyt-hw-offer { display: flex; align-items: center; gap: 12px; min-width: 0; }
.fyt-hw-headline {
  font-weight: 800; font-size: 15px; letter-spacing: .02em; white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0,0,0,.35);
}
.fyt-hw-divider { width: 1px; height: 18px; background: rgba(255,255,255,.35); }
.fyt-hw-sub {
  font-family: 'Inter:Semi_Bold', Inter, system-ui, sans-serif; font-weight: 600; font-size: 13.5px; letter-spacing: .04em; white-space: nowrap;
  color: rgba(235,240,255,.88);
}

/* ---------- Background effects ---------------------------------------- */
.fyt-hw-bg { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.fyt-hw-fog {
  position: absolute; top: -20%; left: 0; width: 200%; height: 140%;
  will-change: transform;
}
.fyt-hw-fog-1 {
  background:
    radial-gradient(30% 60% at 10% 70%, rgba(190,200,255,.10), transparent 70%),
    radial-gradient(25% 50% at 35% 40%, rgba(96,165,250,.12), transparent 70%),
    radial-gradient(30% 60% at 60% 75%, rgba(190,200,255,.08), transparent 70%),
    radial-gradient(25% 50% at 85% 40%, rgba(96,165,250,.10), transparent 70%);
  animation: fyt-hw-drift 38s linear infinite;
}
.fyt-hw-fog-2 {
  background:
    radial-gradient(22% 70% at 20% 90%, rgba(255,255,255,.07), transparent 70%),
    radial-gradient(22% 70% at 70% 90%, rgba(255,255,255,.06), transparent 70%);
  animation: fyt-hw-drift 26s linear infinite reverse, fyt-hw-breathe 7s ease-in-out infinite;
}
.fyt-hw-sweep {
  position: absolute; top: 0; bottom: 0; left: 0; width: 22%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,.10) 45%, rgba(255,190,120,.10) 55%, transparent 100%);
  transform: translateX(-120%) skewX(-18deg);
  animation: fyt-hw-sweep 9s ease-in-out 1.5s infinite;
  will-change: transform;
}
.fyt-hw-blast-glow {
  position: absolute; width: 180px; height: 180px; left: 0; top: 0; margin: -90px 0 0 -90px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,140,40,.55), rgba(96,165,250,.22) 45%, transparent 70%);
  opacity: 0; transform: scale(.2);
}
.fyt-hw-blast-glow.fyt-hw-on { animation: fyt-hw-blastglow .9s ease-out; }

.fyt-hw-web { position: absolute; top: 0; will-change: transform; }
.fyt-hw-web-l { left: 0;  transform-origin: 0 0;    animation: fyt-hw-sway 6s ease-in-out infinite alternate; }
.fyt-hw-web-r { right: 0; transform-origin: 100% 0; animation: fyt-hw-sway-r 7s ease-in-out infinite alternate; }

.fyt-hw-critters { position: absolute; inset: 0; }

/* Spider (built by JS). Thread + body move with transforms only. */
.fyt-hw-spider { position: absolute; top: 0; width: 22px; height: 1px; }
.fyt-hw-thread {
  position: absolute; left: 10.5px; top: 0; width: 1px; height: 1px;
  background: linear-gradient(rgba(255,255,255,.75), rgba(255,255,255,.45));
  transform-origin: 50% 0; transform: scaleY(0); will-change: transform;
}
.fyt-hw-spider-body { position: absolute; left: 0; top: -11px; width: 22px; height: 22px; will-change: transform; }
.fyt-hw-spider-body svg { display: block; overflow: visible; }
.fyt-hw-legs-l, .fyt-hw-legs-r { transform-origin: 0 0; animation: fyt-hw-legs .5s ease-in-out infinite alternate; }
.fyt-hw-legs-r { animation-direction: alternate-reverse; }
.fyt-hw-walking .fyt-hw-legs-l, .fyt-hw-walking .fyt-hw-legs-r { animation-duration: .12s; }
.fyt-hw-eye { animation: fyt-hw-eyes 2.4s ease-in-out infinite; }

/* Bat (built by JS) */
.fyt-hw-bat { position: absolute; left: 0; top: 0; width: 30px; height: 14px; will-change: transform; }
.fyt-hw-bat svg { display: block; overflow: visible; }
.fyt-hw-wing { transform-origin: 0 0; animation: fyt-hw-flap .18s ease-in-out infinite alternate; }

/* ---------- Pumpkin --------------------------------------------------- */
.fyt-hw-pumpkin { position: relative; display: inline-flex; width: 26px; height: 26px; flex: none; }
.fyt-hw-pumpkin svg { position: relative; display: block; transform-origin: 50% 85%; }
.fyt-hw-pumpkin-glow {
  position: absolute; inset: -10px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,150,40,.65), rgba(255,120,20,.15) 55%, transparent 70%);
  animation: fyt-hw-flicker 3.2s ease-in-out infinite;
}
.fyt-hw-face { animation: fyt-hw-facefl 2.1s steps(2, end) infinite; }
.fyt-hw-pumpkin.fyt-hw-pop svg  { animation: fyt-hw-wobble .95s cubic-bezier(.3,.7,.3,1); }
.fyt-hw-pumpkin.fyt-hw-pop .fyt-hw-pumpkin-glow { animation: fyt-hw-glowpop .95s ease-out; }

/* Ember particles & shock ring */
.fyt-hw-fxtop { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.fyt-hw-p { position: absolute; left: 0; top: 0; border-radius: 50%; will-change: transform, opacity; }
.fyt-hw-ring {
  position: absolute; left: 0; top: 0; width: 24px; height: 24px; margin: -12px 0 0 -12px;
  border-radius: 50%; border: 2px solid rgba(255,170,70,.9);
  box-shadow: 0 0 8px rgba(255,140,40,.8), inset 0 0 6px rgba(255,170,90,.5);
  will-change: transform, opacity;
}

/* ---------- Coupon pill ----------------------------------------------- */
.fyt-hw-code {
  position: relative; overflow: hidden; flex: none;
  display: inline-flex; align-items: center; gap: 8px;
  height: 32px; padding: 0 14px 0 16px; margin: 0;
  border-radius: 999px; border: 1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, #0d1324, #03050c);
  color: #fff; font: inherit; cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 0 0 0 rgba(96,165,250,0);
  transition: transform .15s ease, border-color .2s ease;
}
.fyt-hw-code:hover { transform: translateY(-1px); border-color: rgba(255,170,90,.55); }
.fyt-hw-code:active { transform: translateY(0) scale(.97); }
.fyt-hw-code:focus-visible { outline: 2px solid #ffb066; outline-offset: 2px; }
.fyt-hw-code::after { /* shimmer */
  content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.22), transparent);
  transform: translateX(-150%) skewX(-20deg);
  animation: fyt-hw-shimmer 4.5s ease-in-out .8s infinite;
  pointer-events: none;
}
.fyt-hw-code-lbl { font-family: 'Inter:Semi_Bold', Inter, system-ui, sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: .14em; color: #9aa6c4; }
.fyt-hw-code-val { display: inline-grid; font-size: 14px; font-weight: 800; letter-spacing: .06em; }
.fyt-hw-code-txt, .fyt-hw-code-ok { grid-area: 1 / 1; text-align: center; transition: opacity .2s ease, transform .25s ease; }
.fyt-hw-code-ok { color: #7dffb0; opacity: 0; transform: translateY(70%); }
.fyt-hw-code-ico { color: #9aa6c4; transition: color .2s; }
.fyt-hw-code:hover .fyt-hw-code-ico { color: #ffb066; }
.fyt-hw-code.fyt-hw-copied .fyt-hw-code-txt { opacity: 0; transform: translateY(-70%); }
.fyt-hw-code.fyt-hw-copied .fyt-hw-code-ok  { opacity: 1; transform: translateY(0); }
.fyt-hw-code.fyt-hw-copied { border-color: rgba(125,255,176,.6); }

/* ---------- Countdown pill -------------------------------------------- */
.fyt-hw-timer {
  position: relative; flex: none;
  display: inline-flex; align-items: center;
  height: 36px; padding: 0 20px; border-radius: 999px;
  background: linear-gradient(180deg, #ff6a2b, #e2380f);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 2px 12px rgba(226,56,15,.45);
}
.fyt-hw-timer::before { /* pulsing outer glow (opacity-only) */
  content: ""; position: absolute; inset: -5px; border-radius: inherit; z-index: -1;
  background: radial-gradient(closest-side, rgba(255,140,50,.85), rgba(255,120,30,0));
  filter: blur(4px);
  opacity: .4;
}
.fyt-hw-timer-body {
  display: inline-flex; align-items: baseline; gap: 7px;
  font-size: 17px; font-weight: 800; letter-spacing: .03em; white-space: nowrap;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 1px rgba(120,40,0,.35);
}
.fyt-hw-num { display: inline-block; min-width: 1.15em; text-align: right; transform-origin: 50% 0; }
.fyt-hw-num.fyt-hw-tick { animation: none; }
.fyt-hw-timer.fyt-hw-ended { background: linear-gradient(180deg, #5b6178, #3a3f52); animation: none; }
.fyt-hw-timer.fyt-hw-ended::before { display: none; }

.fyt-hw-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* Pause everything while the tab is hidden (toggled by JS) */
.fyt-hw-paused *, .fyt-hw-paused *::before, .fyt-hw-paused *::after { animation-play-state: paused !important; }

/* ---------- Keyframes (transform / opacity only) ---------------------- */
@keyframes fyt-hw-drift   { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes fyt-hw-breathe { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
@keyframes fyt-hw-sweep   { 0% { transform: translateX(-120%) skewX(-18deg); } 45%,100% { transform: translateX(560%) skewX(-18deg); } }
@keyframes fyt-hw-sway    { from { transform: rotate(-2.5deg); } to { transform: rotate(3deg); } }
@keyframes fyt-hw-sway-r  { from { transform: rotate(2.5deg); } to { transform: rotate(-3deg); } }
@keyframes fyt-hw-legs    { from { transform: rotate(-9deg); } to { transform: rotate(9deg); } }
@keyframes fyt-hw-eyes    { 0%,92%,100% { opacity: 1; } 95% { opacity: .1; } }
@keyframes fyt-hw-flap    { from { transform: scaleY(1); } to { transform: scaleY(-.35); } }
@keyframes fyt-hw-flicker { 0%,100% { opacity: .55; transform: scale(1); } 30% { opacity: .8; } 55% { opacity: .45; transform: scale(.92); } 75% { opacity: .9; transform: scale(1.05); } }
@keyframes fyt-hw-facefl  { 0% { opacity: 1; } 50% { opacity: .78; } }
@keyframes fyt-hw-wobble  {
  0%   { transform: rotate(0) scale(1); }
  12%  { transform: rotate(-14deg) scale(1.02); }
  24%  { transform: rotate(12deg) scale(1.04); }
  36%  { transform: rotate(-9deg) scale(1.08); }
  46%  { transform: rotate(0) scale(.82, 1.12); }
  56%  { transform: rotate(0) scale(1.38); }
  72%  { transform: rotate(0) scale(.94); }
  100% { transform: rotate(0) scale(1); }
}
@keyframes fyt-hw-glowpop { 0%,40% { opacity: .6; transform: scale(1); } 56% { opacity: 1; transform: scale(2.1); } 100% { opacity: .55; transform: scale(1); } }
@keyframes fyt-hw-blastglow { 0% { opacity: 0; transform: scale(.2); } 25% { opacity: .9; } 100% { opacity: 0; transform: scale(1.6); } }
@keyframes fyt-hw-shimmer { 0% { transform: translateX(-150%) skewX(-20deg); } 40%,100% { transform: translateX(350%) skewX(-20deg); } }
@keyframes fyt-hw-heartbeat { 0%,60%,100% { transform: scale(1); } 15% { transform: scale(1.045); } 30% { transform: scale(1); } 42% { transform: scale(1.025); } }
@keyframes fyt-hw-glow    { 0%,60%,100% { opacity: .35; } 15% { opacity: .95; } 42% { opacity: .7; } }
@keyframes fyt-hw-flip    { 0% { transform: translateY(-45%) scaleY(.2); opacity: 0; } 60% { transform: translateY(6%) scaleY(1.08); opacity: 1; } 100% { transform: none; opacity: 1; } }

/* ---------- Responsive ------------------------------------------------ */
@media (max-width: 1180px) {
  .fyt-hw-inner { gap: 8px 16px; padding: 8px 48px; }
  .fyt-hw-headline { font-size: 14px; }
  .fyt-hw-sub { font-size: 12.5px; }
  .fyt-hw-timer-body { font-size: 16px; }
}
@media (max-width: 960px) {            /* tablet: drop the secondary line */
  .fyt-hw-divider, .fyt-hw-sub { display: none; }
  .fyt-hw-inner { padding: 8px 16px; gap: 8px 12px; }
}
@media (max-width: 860px) {
  .fyt-hw-headline { font-size: 12px; }
  .fyt-hw-offer { gap: 9px; }
  .fyt-hw-timer { padding: 0 13px; }
  .fyt-hw-timer-body { font-size: 14px; gap: 4px; }
  .fyt-hw-code { padding: 0 13px; gap: 6px; }
  .fyt-hw-code-ico { display: none; }
}
@media (max-width: 640px) {            /* mobile: two compact rows */
  .fyt-hw-inner { padding: 8px 12px; gap: 7px 10px; }
  .fyt-hw-offer { flex-basis: 100%; justify-content: center; gap: 8px; }
  .fyt-hw-headline { font-size: 12px; letter-spacing: .01em; }
  .fyt-hw-pumpkin, .fyt-hw-pumpkin svg { width: 20px; height: 20px; }
  .fyt-hw-code { height: 28px; padding: 0 11px 0 12px; gap: 6px; }
  .fyt-hw-code-lbl { font-size: 9.5px; }
  .fyt-hw-code-val { font-size: 12.5px; }
  .fyt-hw-timer { height: 30px; padding: 0 13px; }
  .fyt-hw-timer-body { font-size: 13.5px; gap: 5px; }
  .fyt-hw-web { width: 44px; height: 40px; }
  .fyt-hw-fog-2, .fyt-hw-sweep { display: none; }
}
@media (max-width: 360px) {
  .fyt-hw-headline { font-size: 10.5px; }
  .fyt-hw-left { display: none; }
}

/* ---------- Reduced motion: static bar, countdown still live ----------- */
@media (prefers-reduced-motion: reduce) {
  .fyt-hw-bar *, .fyt-hw-bar *::before, .fyt-hw-bar *::after { animation: none !important; transition: none !important; }
  .fyt-hw-critters, .fyt-hw-fxtop, .fyt-hw-sweep, .fyt-hw-blast-glow { display: none !important; }
  .fyt-hw-pumpkin-glow { opacity: .6; }
}

/* ---------- Phone, header folded while scrolling: one slim row ---------- */
@media (max-width: 767px) {
  .fyt-hw-bar.fyt-hw-compact, .fyt-hw-bar.fyt-hw-compact .fyt-hw-inner { min-height: 36px; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-inner { padding: 5px 10px; flex-wrap: nowrap; gap: 8px; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-offer { flex-basis: auto; gap: 6px; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-code, .fyt-hw-bar.fyt-hw-compact .fyt-hw-web { display: none; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-pumpkin, .fyt-hw-bar.fyt-hw-compact .fyt-hw-pumpkin svg { width: 16px; height: 16px; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-headline { font-size: 10.5px; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-full { display: none; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-short { display: inline; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-timer { height: 20px; padding: 0 8px; animation: none; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-timer-body { font-size: 10px; gap: 3px; }
  .fyt-hw-bar.fyt-hw-compact .fyt-hw-left { display: none; }
}
/* ---------- Slimmer sizing (smaller countdown, slightly shorter bar) ---------- */
.fyt-hw-bar, .fyt-hw-inner { min-height: 46px; }
.fyt-hw-inner { padding-top: 5px; padding-bottom: 5px; }
.fyt-hw-headline { font-size: 14px; }
.fyt-hw-sub { font-size: 12.5px; }
.fyt-hw-pumpkin, .fyt-hw-pumpkin svg { width: 22px; height: 22px; }
.fyt-hw-code { height: 28px; padding: 0 12px 0 14px; }
.fyt-hw-code-val { font-size: 13px; }
.fyt-hw-timer { height: 25px; padding: 0 11px; }
.fyt-hw-timer::before { inset: -3px; }
.fyt-hw-timer-body { font-size: 12.5px; gap: 4px; }
@media (max-width: 860px) {
  .fyt-hw-headline { font-size: 12px; }
}
@media (max-width: 640px) {
  .fyt-hw-inner { padding: 6px 12px; gap: 5px 8px; }
  .fyt-hw-headline { font-size: 11.5px; }
  .fyt-hw-pumpkin, .fyt-hw-pumpkin svg { width: 18px; height: 18px; }
  .fyt-hw-code { height: 24px; padding: 0 10px 0 11px; }
  .fyt-hw-code-lbl { font-size: 9px; }
  .fyt-hw-code-val { font-size: 12px; }
  .fyt-hw-timer { height: 21px; padding: 0 9px; }
  .fyt-hw-timer-body { font-size: 10.5px; gap: 3px; }
}
.fyt-hw-short, .fyt-hw-mid { display: none; }
/* Laptops: keep everything on one row by dropping the secondary line earlier */
@media (max-width: 1280px) {
  .fyt-hw-divider, .fyt-hw-sub { display: none; }
}
/* Phones: a shorter headline so it always fits on one line */
@media (max-width: 480px) {
  .fyt-hw-bar:not(.fyt-hw-compact) .fyt-hw-full { display: none; }
  .fyt-hw-bar:not(.fyt-hw-compact) .fyt-hw-mid { display: inline; }
  .fyt-hw-offer { gap: 7px; }
}
@media (max-width: 380px) { .fyt-hw-headline { font-size: 11px; } }
`;

const WEB_PATHS = (
  <>
    <path d="M0 0L64 6M0 0L56 30M0 0L38 52M0 0L14 56M0 0L0 56" />
    <path d="M14 1.3Q12 7 12.3 11.9Q8 13 6.1 16.4Q4 18 3 19.5Q1.5 20 0 20" />
    <path d="M28 2.6Q25 13 24.5 23.7Q17 28 13 33Q8 36 6 39Q3 40 0 40" />
    <path d="M44 4.1Q40 18 38.5 21.4M38.5 21.4Q33 34 26 36.8Q19 44 9.3 47Q5 49 0 50" />
    <path d="M56 5.3Q52 20 50 26.8Q42 38 33 44" />
  </>
);

export function HalloweenPromoBar({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return initHalloweenBar(el, { endDate: HALLOWEEN_END, couponCode: HALLOWEEN_CODE, endedText: "OFFER ENDED", copiedText: "COPIED!" });
  }, []);
  const stage = STAGE_LABEL[halloweenStage()].toUpperCase();
  const go = () => {
    window.location.hash = "challenge";
  };
  return (
    <div
      ref={ref}
      id="fyt-hw-bar"
      className={`fyt-hw-bar${compact ? " fyt-hw-compact" : ""}`}
      role="link"
      tabIndex={0}
      aria-label="Halloween offer: 45% off plus BOGO. Jump to pricing"
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
    >
      <style>{CSS}</style>
      <div className="fyt-hw-bg" aria-hidden="true">
        <div className="fyt-hw-fog fyt-hw-fog-1" />
        <div className="fyt-hw-fog fyt-hw-fog-2" />
        <div className="fyt-hw-sweep" />
        <div className="fyt-hw-blast-glow" />
        <svg className="fyt-hw-web fyt-hw-web-l" viewBox="0 0 64 56" width="64" height="56">
          <g fill="none" stroke="rgba(200,210,255,.38)" strokeWidth=".7">{WEB_PATHS}</g>
        </svg>
        <svg className="fyt-hw-web fyt-hw-web-r" viewBox="0 0 64 56" width="64" height="56">
          <g fill="none" stroke="rgba(200,210,255,.38)" strokeWidth=".7" transform="translate(64 0) scale(-1 1)">{WEB_PATHS}</g>
        </svg>
        <div className="fyt-hw-critters" />
      </div>

      <div className="fyt-hw-inner">
        <div className="fyt-hw-offer">
          <span className="fyt-hw-pumpkin" aria-hidden="true">
            <span className="fyt-hw-pumpkin-glow" />
            <svg viewBox="0 0 32 32" width="26" height="26">
              <path d="M16 7.5c0-2 .6-3.6 2.4-4.6" stroke="#3f7d20" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <ellipse cx="9.5" cy="18.5" rx="7.5" ry="10" fill="#e8630f" />
              <ellipse cx="22.5" cy="18.5" rx="7.5" ry="10" fill="#e8630f" />
              <ellipse cx="16" cy="18.5" rx="7.8" ry="10.6" fill="#ff8a1f" />
              <path d="M16 8.5v20" stroke="#e8630f" strokeWidth=".8" opacity=".7" />
              <g className="fyt-hw-face" fill="#ffe066">
                <path d="M9 15.5l3.4-2.4.4 3.6z" />
                <path d="M23 15.5l-3.4-2.4-.4 3.6z" />
                <path d="M16 17.2l1.5 2.4h-3z" />
                <path d="M8.6 21.6q7.4 5.6 14.8 0l-2 .4-1.2 1.6-1.6-1.2-1.8 1.6-1.6-1.6-1.8 1.4-1.2-1.6z" />
              </g>
            </svg>
          </span>
          <span className="fyt-hw-headline">
            <span className="fyt-hw-full">45% OFF + BOGO INSTANTLY + PICK ANY 2 TREATS</span>
            <span className="fyt-hw-mid">45% OFF + BOGO + PICK ANY 2 TREATS</span>
            <span className="fyt-hw-short">45% OFF + BOGO + 2 TREATS</span>
          </span>
          <span className="fyt-hw-divider" aria-hidden="true" />
          <span className="fyt-hw-sub">{stage}</span>
        </div>

        <button type="button" className="fyt-hw-code" aria-label={`Copy coupon code ${HALLOWEEN_CODE}`}>
          <span className="fyt-hw-code-lbl">CODE</span>
          <span className="fyt-hw-code-val">
            <span className="fyt-hw-code-txt">{HALLOWEEN_CODE}</span>
            <span className="fyt-hw-code-ok" aria-hidden="true">COPIED!</span>
          </span>
          <svg className="fyt-hw-code-ico" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            <rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 3.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>

        <div className="fyt-hw-timer" role="timer" aria-live="off">
          <span className="fyt-hw-timer-body">
            <span className="fyt-hw-seg"><span className="fyt-hw-num" data-unit="h">00</span>H</span>
            <span className="fyt-hw-seg"><span className="fyt-hw-num" data-unit="m">00</span>M</span>
            <span className="fyt-hw-seg"><span className="fyt-hw-num" data-unit="s">00</span>S</span>
            <span className="fyt-hw-left">LEFT</span>
          </span>
        </div>
      </div>

      <div className="fyt-hw-fxtop" aria-hidden="true" />
      <span className="fyt-hw-sr" aria-live="polite" />
    </div>
  );
}
