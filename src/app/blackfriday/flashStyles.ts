/** Styles for the 12-hour "Black Friday Upgraded" flash sale. Same light Inter look as Black Friday, FYT blue + gold, a red live pulse. */
import { ensureBfAssets } from "./bfStyles";

export const FLASH_CSS = `
.fyt-fl,.fyt-fl *{box-sizing:border-box}
.fyt-fl{font-family:'Inter',system-ui,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.fyt-fl-gold{background:linear-gradient(90deg,#fff3cf,#ffd36b 45%,#f0a93a);-webkit-background-clip:text;background-clip:text;color:transparent}
.fyt-fl-live{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff3b4e;box-shadow:0 0 0 0 rgba(255,59,78,.7);animation:fyt-fl-pulse 1.6s infinite}
@keyframes fyt-fl-pulse{70%{box-shadow:0 0 0 9px rgba(255,59,78,0)}100%{box-shadow:0 0 0 0 rgba(255,59,78,0)}}

/* ---------- top bar ---------- */
.fyt-fl-bar{position:relative;z-index:2;width:100%;background:#000;border-bottom:1px solid rgba(255,211,107,.45);overflow:hidden;cursor:pointer}
.fyt-fl-bar:before{content:"";position:absolute;inset:0;background:radial-gradient(420px 120px at 18% 100%,rgba(47,107,255,.55),transparent 70%),radial-gradient(360px 110px at 82% 0,rgba(240,169,58,.28),transparent 70%)}
.fyt-fl-bolt{position:absolute;top:0;bottom:0;width:30%;left:-32%;background:linear-gradient(115deg,transparent 25%,rgba(255,226,160,.35) 48%,rgba(255,255,255,.75) 50%,rgba(255,226,160,.3) 52%,transparent 75%);animation:fyt-fl-sweep 3.8s ease-in-out infinite}
@keyframes fyt-fl-sweep{0%{left:-32%}55%,100%{left:105%}}
.fyt-fl-in{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:20px;height:58px;padding:0 16px}
.fyt-fl-name{display:flex;align-items:center;gap:10px;font-weight:200;font-size:17px;letter-spacing:.3em;white-space:nowrap}
.fyt-fl-name b{font-weight:600}
.fyt-fl-60{font-size:30px;font-weight:200;letter-spacing:-.03em;white-space:nowrap;line-height:1}
.fyt-fl-60 b{font-weight:600}
.fyt-fl-60 small{font-size:11px;letter-spacing:.28em;font-weight:300;color:#ffe2a0;margin-left:8px}
.fyt-fl-was{font-size:13px;font-weight:300;color:#7f8db0;text-decoration:line-through;text-decoration-color:#ff3b4e;margin-right:8px}
.fyt-fl-chips{display:flex;gap:6px}
.fyt-fl-chip{font-size:12px;font-weight:300;padding:6px 11px;border-radius:999px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.22);white-space:nowrap}
.fyt-fl-chip b{font-weight:600}
.fyt-fl-chip.gd{border-color:#f0b44c;color:#ffe2a0}
.fyt-fl-clock{display:flex;align-items:center;gap:4px}
.fyt-fl-clock i{font-style:normal;font-size:9px;letter-spacing:.22em;color:#ffc9cf;margin-right:6px}
.fyt-fl-clock span{background:linear-gradient(180deg,#ff4658,#c81226);border-radius:7px;min-width:34px;text-align:center;padding:6px 0;font-weight:600;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 0 22px rgba(229,41,58,.55),inset 0 -9px 0 rgba(0,0,0,.14)}
.fyt-fl-clock em{font-style:normal;font-size:12px;color:#ffc9cf}
.fyt-fl-cta{background:linear-gradient(90deg,#ffe2a0,#f0a93a);color:#2a1800;border-radius:999px;padding:9px 18px;font-weight:600;font-size:13px;white-space:nowrap}
.fyt-fl-row{display:contents}
@media (max-width:1240px){.fyt-fl-chips .fyt-fl-chip:nth-child(2){display:none}}
@media (max-width:1060px){.fyt-fl-chips,.fyt-fl-was{display:none}}
@media (max-width:767px){
  .fyt-fl-in{flex-direction:column;height:auto;gap:6px;padding:8px 10px}
  .fyt-fl-row{display:flex;align-items:center;justify-content:center;gap:10px}
  .fyt-fl-name{font-size:11.5px;letter-spacing:.2em;gap:7px}
  .fyt-fl-60{font-size:20px}
  .fyt-fl-60 small{font-size:9px;letter-spacing:.16em;margin-left:5px}
  .fyt-fl-cta{display:none}
  .fyt-fl-clock span{min-width:27px;font-size:12px;padding:4px 0}
  .fyt-fl-clock i{font-size:8px;letter-spacing:.14em;margin-right:3px}
}
.fyt-fl-m{display:none;font-size:11px;font-weight:300;color:#ffe2a0;white-space:nowrap}
@media (max-width:767px){.fyt-fl-m{display:inline-flex}}
.fyt-fl-m b{font-weight:600}
@media (min-width:768px){.fyt-fl-m{display:none!important}}
.fyt-fl-compact .fyt-fl-name{display:none}
@media (max-width:767px){.fyt-fl-compact .fyt-fl-m{display:none}}

/* ---------- offer section ---------- */
.fyt-fl-hero{position:relative;padding:44px 16px 18px;text-align:center;overflow:hidden}
.fyt-fl-hero:before{content:"";position:absolute;inset:0;background:radial-gradient(640px 320px at 50% 30%,rgba(47,107,255,.42),transparent 70%),radial-gradient(420px 240px at 50% 40%,rgba(240,169,58,.18),transparent 70%);pointer-events:none}
.fyt-fl-rays{position:absolute;left:50%;top:210px;width:1200px;height:1200px;margin-left:-600px;margin-top:-600px;background:repeating-conic-gradient(from 0deg,rgba(255,226,160,.05) 0 1.5deg,transparent 1.5deg 10deg);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 45%);mask-image:radial-gradient(circle,#000 0,transparent 45%);animation:fyt-fl-spin 90s linear infinite;pointer-events:none}
@keyframes fyt-fl-spin{to{transform:rotate(360deg)}}
.fyt-fl-hero>*:not(.fyt-fl-rays){position:relative}
.fyt-fl-eye{display:inline-flex;align-items:center;gap:10px;padding:7px 15px;border-radius:999px;border:1px solid rgba(255,59,78,.45);background:rgba(255,59,78,.08);font-size:10.5px;letter-spacing:.34em;font-weight:300;color:#ffc9cf}
.fyt-fl-eye b{font-weight:600;color:#fff}
.fyt-fl-h1{font-weight:200;font-size:56px;letter-spacing:-.035em;line-height:1.02;margin:18px 0 0;color:#fff}
.fyt-fl-h1 b{font-weight:600}
.fyt-fl-mega{position:relative;display:flex;align-items:center;justify-content:center;gap:22px;margin:0 auto;height:210px}
.fyt-fl-old{position:relative;font-size:64px;font-weight:200;letter-spacing:-.05em;color:rgba(188,216,255,.32);line-height:1}
.fyt-fl-old:after{content:"";position:absolute;left:-8%;right:-8%;top:52%;height:3px;border-radius:3px;background:#ff3b4e;transform:rotate(-14deg);box-shadow:0 0 14px rgba(255,59,78,.8)}
.fyt-fl-arrow{width:56px;height:22px;flex:none;opacity:.9}
.fyt-fl-num{font-size:220px;line-height:210px;font-weight:200;letter-spacing:-.065em;font-variant-numeric:tabular-nums;background:linear-gradient(180deg,#fff 10%,#ffe2a0 50%,#f0a93a 82%,rgba(240,169,58,.15) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 36px rgba(240,169,58,.35));transition:filter .6s ease}
.fyt-fl-num.done{filter:drop-shadow(0 0 60px rgba(240,169,58,.6))}
.fyt-fl-offtxt{text-align:left;font-size:12px;letter-spacing:.42em;color:#ffe2a0;font-weight:300;line-height:1.6;white-space:nowrap}
.fyt-fl-offtxt b{display:block;font-size:44px;letter-spacing:.02em;font-weight:200;color:#fff;line-height:1}
.fyt-fl-time{margin:4px auto 0;max-width:470px;padding:16px 22px 16px;border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.015));border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 30px 60px -30px rgba(0,0,0,.9)}
.fyt-fl-time-l{display:flex;align-items:center;justify-content:center;gap:9px;font-size:10.5px;letter-spacing:.34em;color:#9cc8ff;font-weight:300}
.fyt-fl-digits{display:flex;justify-content:center;align-items:flex-start;gap:8px;margin-top:10px}
.fyt-fl-dg{min-width:92px;padding:10px 0 8px;border-radius:14px;background:#05080f;border:1px solid rgba(255,255,255,.08);border-top:1px solid rgba(255,59,78,.55);box-shadow:0 -6px 18px -10px rgba(255,59,78,.6)}
.fyt-fl-dg b{display:block;font-size:46px;font-weight:200;letter-spacing:-.02em;line-height:1;font-variant-numeric:tabular-nums}
.fyt-fl-dg small{display:block;margin-top:5px;font-size:8.5px;letter-spacing:.3em;color:#8f9bb8}
.fyt-fl-sep{font-size:34px;font-weight:200;color:#ff3b4e;line-height:56px;opacity:.7}
.fyt-fl-drain{height:3px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:14px;overflow:hidden}
.fyt-fl-drain i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#ff3b4e,#f0a93a,#ffe2a0);transition:width 1s linear}
.fyt-fl-deals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;max-width:640px;margin:26px auto 0}
.fyt-fl-deal{position:relative;border:0;font:inherit;color:inherit;text-align:left;cursor:pointer;border-radius:20px;padding:1px;background:linear-gradient(160deg,rgba(120,180,255,.85),rgba(255,255,255,.05) 60%);transition:transform .25s ease,box-shadow .25s ease}
.fyt-fl-deal:hover{transform:translateY(-4px);box-shadow:0 24px 50px -20px rgba(47,107,255,.6)}
.fyt-fl-deal:focus-visible{outline:2px solid #ffe2a0;outline-offset:3px}
.fyt-fl-deal.gd{background:linear-gradient(160deg,#ffe2a0,rgba(240,169,58,.12) 65%);box-shadow:0 -10px 60px rgba(240,169,58,.22)}
.fyt-fl-deal.gd:hover{box-shadow:0 24px 50px -20px rgba(240,169,58,.6)}
.fyt-fl-di{display:flex;align-items:center;gap:14px;border-radius:19px;background:linear-gradient(180deg,#0e1a40,#060912);padding:16px 18px;height:100%}
.fyt-fl-deal.gd .fyt-fl-di{background:linear-gradient(180deg,#2a1c05,#0a0703)}
.fyt-fl-cnt{font-size:64px;font-weight:200;letter-spacing:-.05em;line-height:.9;color:#fff;min-width:44px}
.fyt-fl-deal.gd .fyt-fl-cnt{background:linear-gradient(180deg,#fff3cf,#f0a93a);-webkit-background-clip:text;background-clip:text;color:transparent}
.fyt-fl-dtx{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.fyt-fl-tag{position:absolute;top:-10px;right:16px;z-index:3;font-size:9.5px;letter-spacing:.18em;font-weight:600;padding:4px 9px;border-radius:999px;background:linear-gradient(90deg,#ffe2a0,#f0a93a);color:#3a2200}
.fyt-fl-dl{font-size:10.5px;letter-spacing:.22em;color:#9cc8ff;font-weight:400}
.fyt-fl-deal.gd .fyt-fl-dl{color:#ffe2a0}
.fyt-fl-dh{font-size:19px;font-weight:200;letter-spacing:-.01em;line-height:1.15}
.fyt-fl-dh b{font-weight:600}
.fyt-fl-pct{align-self:flex-start;margin-top:5px;font-size:10.5px;font-weight:600;letter-spacing:.08em;padding:4px 9px;border-radius:999px;background:rgba(255,59,78,.16);border:1px solid rgba(255,59,78,.55);color:#ffc9cf;white-space:nowrap}
.fyt-fl-fan{position:relative;flex:none;height:44px}
.fyt-fl-fan i{position:absolute;top:8px;width:34px;height:24px;border-radius:5px;background:linear-gradient(135deg,#2f6bff,#7fb0ff);border:1px solid rgba(255,255,255,.45);box-shadow:0 6px 12px -4px rgba(0,0,0,.7);transform-origin:50% 120%}
.fyt-fl-fan i.f{background:linear-gradient(135deg,#ffe2a0,#e8982a)}
.fyt-fl-chips2{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:18px}
.fyt-fl-chips2>span{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.03);font-size:12.5px;font-weight:300;color:#b9c8e8}
.fyt-fl-chips2 b{font-weight:600;color:#fff}
.fyt-fl-chips2 .g{border-color:rgba(240,180,76,.45);background:rgba(240,169,58,.08);color:#ffe9bd;padding-left:5px}
.fyt-fl-chips2 i{font-style:normal;width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#ffe2a0,#e8982a);color:#3a2200;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:8.5px}
@media (max-width:1100px){.fyt-fl-offtxt{display:none}}
@media (max-width:767px){
  .fyt-fl-hero{padding:28px 14px 6px}
  .fyt-fl-rays{top:170px}
  .fyt-fl-eye{font-size:9px;letter-spacing:.22em;padding:6px 12px;gap:8px}
  .fyt-fl-h1{font-size:34px;margin-top:14px}
  .fyt-fl-mega{height:130px;gap:8px}
  .fyt-fl-old{font-size:28px}
  .fyt-fl-old:after{height:2px}
  .fyt-fl-arrow{width:24px;height:12px}
  .fyt-fl-num{font-size:min(33vw,140px);line-height:130px}
  .fyt-fl-time{padding:12px 12px 13px;border-radius:18px}
  .fyt-fl-time-l{font-size:9px;letter-spacing:.24em}
  .fyt-fl-dg{min-width:72px;padding:8px 0 7px;border-radius:12px}
  .fyt-fl-dg b{font-size:34px}
  .fyt-fl-sep{font-size:26px;line-height:44px}
  .fyt-fl-digits{gap:5px}
  .fyt-fl-deals{grid-template-columns:1fr;gap:12px;margin-top:20px}
  .fyt-fl-di{padding:13px 14px;gap:12px}
  .fyt-fl-cnt{font-size:50px;min-width:34px}
  .fyt-fl-dh{font-size:17px}
  .fyt-fl-chips2>span{font-size:11.5px}
  .fyt-fl-deal:hover{transform:none}
}
@media (prefers-reduced-motion:reduce){.fyt-fl-bolt,.fyt-fl-rays,.fyt-fl-live{animation:none}}
`;

export function ensureFlashAssets(): void {
  ensureBfAssets();
  if (typeof document === "undefined" || document.getElementById("fyt-fl-css")) return;
  const s = document.createElement("style");
  s.id = "fyt-fl-css";
  s.textContent = FLASH_CSS;
  document.head.appendChild(s);
}
