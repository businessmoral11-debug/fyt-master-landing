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
.fyt-fl-hero{position:relative;padding:58px 16px 22px;text-align:center;overflow:hidden}
.fyt-fl-hero:before{content:"";position:absolute;inset:0;background:radial-gradient(720px 400px at 50% 8%,rgba(47,107,255,.55),transparent 70%),radial-gradient(520px 320px at 50% 46%,rgba(240,169,58,.16),transparent 70%);pointer-events:none}
.fyt-fl-rays{position:absolute;left:50%;top:150px;width:1400px;height:1400px;margin-left:-700px;margin-top:-700px;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.045) 0 2deg,transparent 2deg 12deg);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 55%);mask-image:radial-gradient(circle,#000 0,transparent 55%);animation:fyt-fl-spin 80s linear infinite;pointer-events:none}
@keyframes fyt-fl-spin{to{transform:rotate(360deg)}}
.fyt-fl-hero>*{position:relative}
.fyt-fl-eye{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:999px;border:1px solid rgba(255,211,107,.5);background:rgba(0,0,0,.45);font-size:11px;letter-spacing:.38em;font-weight:300;color:#ffe2a0}
.fyt-fl-eye b{font-weight:600;color:#fff}
.fyt-fl-h1{font-weight:200;font-size:64px;letter-spacing:-.035em;line-height:1.02;margin:22px 0 0;color:#fff}
.fyt-fl-h1 b{font-weight:600}
.fyt-fl-mega{position:relative;display:flex;align-items:center;justify-content:center;gap:26px;margin:8px auto 0;height:250px}
.fyt-fl-old{position:relative;font-size:84px;font-weight:200;letter-spacing:-.05em;color:rgba(188,216,255,.35);line-height:1}
.fyt-fl-old:after{content:"";position:absolute;left:-6%;right:-6%;top:52%;height:3px;border-radius:3px;background:#ff3b4e;transform:rotate(-12deg);box-shadow:0 0 14px rgba(255,59,78,.8)}
.fyt-fl-arrow{width:64px;height:24px;flex:none;opacity:.85}
.fyt-fl-num{font-size:270px;line-height:250px;font-weight:200;letter-spacing:-.065em;background:linear-gradient(180deg,#fff 8%,#ffe2a0 48%,#f0a93a 78%,rgba(240,169,58,.05) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 50px rgba(240,169,58,.45))}
.fyt-fl-offtxt{text-align:left;font-size:13px;letter-spacing:.38em;color:#bcd8ff;font-weight:300;line-height:1.9;white-space:nowrap}
.fyt-fl-offtxt b{display:block;font-size:46px;letter-spacing:.01em;font-weight:200;color:#fff;line-height:1}
.fyt-fl-time{margin:6px auto 0;max-width:460px}
.fyt-fl-time-l{font-size:11px;letter-spacing:.34em;color:#9cc8ff;font-weight:300}
.fyt-fl-digits{display:flex;justify-content:center;align-items:flex-start;gap:10px;margin-top:12px}
.fyt-fl-dg{min-width:96px;padding:14px 0 10px;border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 20px 40px -20px rgba(0,0,0,.8)}
.fyt-fl-dg b{display:block;font-size:52px;font-weight:200;letter-spacing:-.02em;line-height:1;font-variant-numeric:tabular-nums}
.fyt-fl-dg small{display:block;margin-top:6px;font-size:9px;letter-spacing:.3em;color:#8f9bb8}
.fyt-fl-sep{font-size:40px;font-weight:200;color:#5b6a8c;line-height:64px}
.fyt-fl-drain{height:4px;border-radius:4px;background:rgba(255,255,255,.08);margin-top:14px;overflow:hidden}
.fyt-fl-drain i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#ff3b4e,#f0a93a,#ffe2a0);transition:width 1s linear}
.fyt-fl-deals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;max-width:620px;margin:38px auto 0}
.fyt-fl-deal{position:relative;border:0;font:inherit;color:inherit;text-align:left;cursor:pointer;border-radius:20px;padding:1px;background:linear-gradient(180deg,rgba(120,180,255,.9),rgba(255,255,255,.06));transition:transform .25s ease}
.fyt-fl-deal:hover{transform:translateY(-5px)}
.fyt-fl-deal.gd{background:linear-gradient(180deg,#ffe2a0,rgba(240,169,58,.15));box-shadow:0 -18px 70px rgba(240,169,58,.25)}
.fyt-fl-di{border-radius:19px;background:linear-gradient(180deg,#0e1a40,#060912);padding:18px 18px 16px;height:100%}
.fyt-fl-deal.gd .fyt-fl-di{background:linear-gradient(180deg,#2a1c05,#0a0703)}
.fyt-fl-tag{position:absolute;top:-10px;right:16px;font-size:9.5px;letter-spacing:.18em;font-weight:600;padding:4px 9px;border-radius:999px;background:linear-gradient(90deg,#ffe2a0,#f0a93a);color:#3a2200}
.fyt-fl-dl{font-size:11px;letter-spacing:.26em;color:#9cc8ff;font-weight:300}
.fyt-fl-deal.gd .fyt-fl-dl{color:#ffe2a0}
.fyt-fl-dh{font-size:30px;font-weight:200;letter-spacing:-.02em;line-height:1.1;margin-top:8px}
.fyt-fl-dh b{font-weight:600}
.fyt-fl-ds{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}
.fyt-fl-dots{display:flex;flex-wrap:wrap;gap:4px;max-width:150px}
.fyt-fl-dots i{width:17px;height:12px;border-radius:3px;background:#3f7dff}
.fyt-fl-dots i.f{background:linear-gradient(135deg,#ffe2a0,#e8982a)}
.fyt-fl-pct{font-size:12px;font-weight:600;letter-spacing:.06em;padding:6px 10px;border-radius:999px;background:rgba(255,59,78,.16);border:1px solid rgba(255,59,78,.55);color:#ffc9cf;white-space:nowrap}
.fyt-fl-more{margin-top:16px;font-size:13px;font-weight:300;color:#b9c8e8}
.fyt-fl-more b{font-weight:600;color:#fff}
.fyt-fl-give{display:inline-flex;align-items:center;gap:12px;margin-top:22px;padding:10px 20px 10px 10px;border-radius:999px;border:1px solid rgba(240,180,76,.45);background:linear-gradient(90deg,rgba(240,169,58,.16),rgba(240,169,58,.03));font-size:14px;font-weight:300;color:#ffe9bd;text-align:left}
.fyt-fl-give i{font-style:normal;flex:none;width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#ffe2a0,#e8982a);color:#3a2200;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px}
.fyt-fl-give b{font-weight:600;color:#fff}
.fyt-fl-note{margin-top:14px;font-size:13px;font-weight:300;color:#8f9bb8}
@media (max-width:1100px){.fyt-fl-offtxt{display:none}}
@media (max-width:767px){
  .fyt-fl-hero{padding:34px 14px 8px}
  .fyt-fl-rays{top:120px}
  .fyt-fl-eye{font-size:9px;letter-spacing:.22em;padding:7px 12px;gap:8px}
  .fyt-fl-h1{font-size:36px;margin-top:16px}
  .fyt-fl-mega{height:136px;gap:8px;margin-top:4px}
  .fyt-fl-old{font-size:30px}
  .fyt-fl-old:after{height:2px}
  .fyt-fl-arrow{width:26px;height:14px}
  .fyt-fl-num{font-size:min(34vw,150px);line-height:136px}
  .fyt-fl-dg{min-width:74px;padding:11px 0 8px;border-radius:13px}
  .fyt-fl-dg b{font-size:36px}
  .fyt-fl-sep{font-size:28px;line-height:48px}
  .fyt-fl-digits{gap:6px}
  .fyt-fl-deals{gap:8px;margin-top:28px}
  .fyt-fl-di{padding:14px 11px 12px}
  .fyt-fl-dl{font-size:9px;letter-spacing:.16em}
  .fyt-fl-dh{font-size:21px}
  .fyt-fl-ds{flex-direction:column;align-items:flex-start;gap:9px;margin-top:10px}
  .fyt-fl-dots i{width:9px;height:9px;border-radius:2px}
  .fyt-fl-pct{font-size:10.5px;padding:4px 8px}
  .fyt-fl-tag{font-size:8px;right:10px;padding:3px 7px}
  .fyt-fl-give{font-size:12.5px}
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
