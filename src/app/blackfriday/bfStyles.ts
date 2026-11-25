/** Styles for the Black Friday bar and offer section. Light Inter weights, black with FYT blue and a gold accent. */
export const BF_FONT_ID = "fyt-bf-fonts";
export const BF_FONT_HREF = "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Unbounded:wght@700;800&display=swap";

export const BF_CSS = `
.fyt-bf,.fyt-bf *{box-sizing:border-box}
.fyt-bf{font-family:'Inter',system-ui,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.fyt-bf-g{background:linear-gradient(90deg,#4d8dff,#bcd8ff 55%,#fff);-webkit-background-clip:text;background-clip:text;color:transparent}
.fyt-bf-gold{background:linear-gradient(90deg,#ffe2a0,#f0a93a);-webkit-background-clip:text;background-clip:text;color:transparent}

/* ---------- bar ---------- */
.fyt-bf-bar{position:relative;z-index:2;width:100%;background:#000;border-bottom:1px solid rgba(77,141,255,.5);overflow:hidden;cursor:pointer}
.fyt-bf-bar:before{content:"";position:absolute;inset:0;background:radial-gradient(500px 120px at 12% 100%,rgba(47,107,255,.5),transparent 70%)}
.fyt-bf-beam{position:absolute;top:0;bottom:0;width:38%;left:-40%;background:linear-gradient(115deg,transparent 20%,rgba(47,107,255,.55) 42%,rgba(120,180,255,.9) 50%,rgba(47,107,255,.5) 58%,transparent 80%);animation:fyt-bf-beam 5.5s ease-in-out infinite}
@keyframes fyt-bf-beam{0%{left:-40%}60%,100%{left:105%}}
.fyt-bf-bar:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(115deg,transparent 0 22px,rgba(255,255,255,.035) 22px 23px);pointer-events:none}
.fyt-bf-in{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:22px;height:56px;padding:0 16px;transition:height .3s ease}
.fyt-bf-name{font-weight:200;font-size:19px;letter-spacing:.34em;white-space:nowrap}
.fyt-bf-name b{font-weight:600}
.fyt-bf-upto{font-size:11px;letter-spacing:.3em;color:#bcd8ff;font-weight:300;white-space:nowrap}
.fyt-bf-55{font-size:28px;font-weight:200;letter-spacing:-.02em;white-space:nowrap;line-height:1}
.fyt-bf-55 b{font-weight:600}
.fyt-bf-chips{display:flex;gap:6px}
.fyt-bf-chip{font-size:12px;font-weight:300;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.2);white-space:nowrap}
.fyt-bf-chip b{font-weight:600}
.fyt-bf-chip.gd{border-color:#f0b44c;color:#ffe2a0}
.fyt-bf-code{font-family:inherit;display:inline-flex;align-items:center;gap:7px;border:1px dashed rgba(156,200,255,.7);background:rgba(0,0,0,.5);color:#9cc8ff;border-radius:999px;padding:6px 12px;font-size:10px;letter-spacing:.16em;cursor:pointer;white-space:nowrap}
.fyt-bf-code b{color:#fff;font-weight:600;font-size:12px;letter-spacing:.08em}
.fyt-bf-flip{display:flex;gap:4px;align-items:center}
.fyt-bf-flip span{background:linear-gradient(180deg,#ff4658,#c81226);border-radius:7px;min-width:34px;text-align:center;padding:6px 0;font-weight:600;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 0 22px rgba(229,41,58,.6),inset 0 -9px 0 rgba(0,0,0,.14)}
.fyt-bf-flip em{font-style:normal;font-size:9px;color:#ffc9cf;letter-spacing:.1em;margin:0 3px 0 1px}
.fyt-bf-cta{background:#fff;color:#020308;border-radius:999px;padding:9px 18px;font-weight:600;font-size:13px;white-space:nowrap}
.fyt-bf-m2{display:none}
@media (max-width:1180px){.fyt-bf-chips .fyt-bf-chip:nth-child(2){display:none}}
@media (max-width:1020px){.fyt-bf-chips{display:none}}
@media (max-width:767px){
  .fyt-bf-in{flex-direction:column;height:auto;gap:7px;padding:9px 10px}
  .fyt-bf-row{display:flex;align-items:center;justify-content:center;gap:10px}
  .fyt-bf-name{font-size:13px}
  .fyt-bf-55{font-size:21px}
  .fyt-bf-upto{font-size:9px}
  .fyt-bf-cta,.fyt-bf-d{display:none}
  .fyt-bf-m2{display:flex}
  .fyt-bf-flip span{min-width:28px;font-size:12px;padding:5px 0}
  .fyt-bf-code{padding:5px 10px}
  .fyt-bf-compact .fyt-bf-in{padding:6px 10px}
  .fyt-bf-compact .fyt-bf-m2{display:none}
  .fyt-bf-compact .fyt-bf-name{display:none}
  .fyt-bf-compact .fyt-bf-mflip{display:flex}
}
.fyt-bf-mflip{display:none}
@media (min-width:768px){.fyt-bf-row{display:contents}.fyt-bf-m2,.fyt-bf-mflip{display:none!important}}

/* ---------- offer section ---------- */
.fyt-bf-hero{position:relative;padding:56px 16px 20px;text-align:center;overflow:hidden}
.fyt-bf-hero:before{content:"";position:absolute;inset:0;background:radial-gradient(700px 380px at 50% 0,rgba(47,107,255,.5),transparent 70%),radial-gradient(500px 300px at 85% 70%,rgba(240,169,58,.12),transparent 70%);pointer-events:none}
.fyt-bf-grid{position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(700px 420px at 50% 20%,#000,transparent 75%);mask-image:radial-gradient(700px 420px at 50% 20%,#000,transparent 75%);pointer-events:none}
.fyt-bf-hero>*{position:relative}
.fyt-bf-eyebrow{font-size:12px;letter-spacing:.5em;color:#9cc8ff;font-weight:300}
.fyt-bf-mega{position:relative;height:300px;margin:6px auto 0;max-width:1200px}
.fyt-bf-num{position:absolute;left:0;right:0;top:-10px;font-size:330px;line-height:300px;font-weight:200;letter-spacing:-.06em;background:linear-gradient(180deg,#fff 10%,#6ea4ff 55%,rgba(47,107,255,0) 96%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 60px rgba(77,141,255,.55))}
.fyt-bf-off{position:absolute;left:50%;top:44px;margin-left:330px;text-align:left;font-size:13px;letter-spacing:.4em;color:#bcd8ff;font-weight:300;line-height:1.9;white-space:nowrap}
.fyt-bf-off b{display:block;font-size:44px;letter-spacing:.02em;font-weight:200;color:#fff;line-height:1}
.fyt-bf-fan{position:absolute;left:50%;top:70px;margin-left:-560px;width:250px;height:190px}
.fyt-bf-card{position:absolute;width:170px;height:106px;border-radius:14px;padding:12px 14px;text-align:left;border:1px solid rgba(255,255,255,.35);box-shadow:0 20px 40px rgba(0,0,0,.6)}
.fyt-bf-card i{display:block;font-style:normal;font-size:9px;letter-spacing:.24em;font-weight:500;opacity:.85}
.fyt-bf-card span{display:block;font-size:26px;font-weight:300;margin-top:20px;letter-spacing:-.02em}
.fyt-bf-card.b{background:linear-gradient(135deg,#1b4fe0,#5aa2ff);left:-30px;top:70px;transform:rotate(-14deg);animation:fyt-bf-f1 6s ease-in-out infinite}
.fyt-bf-card.y{background:linear-gradient(135deg,#ffe2a0,#e8982a);color:#3a2200;border-color:rgba(255,255,255,.7);left:90px;top:-6px;transform:rotate(7deg);animation:fyt-bf-f2 6s ease-in-out infinite}
@keyframes fyt-bf-f1{50%{transform:rotate(-11deg) translateY(-8px)}}
@keyframes fyt-bf-f2{50%{transform:rotate(9deg) translateY(8px)}}
.fyt-bf-h2{font-weight:200;font-size:46px;letter-spacing:-.02em;margin:6px 0 0;line-height:1.15;color:#fff}
.fyt-bf-h2 b{font-weight:600}
.fyt-bf-stairs{display:flex;justify-content:center;align-items:flex-end;gap:14px;margin:44px auto 0;max-width:980px}
.fyt-bf-st{flex:1;min-width:0;border-radius:20px 20px 14px 14px;padding:1px;background:linear-gradient(180deg,rgba(120,180,255,.9),rgba(255,255,255,.06));cursor:pointer;transition:transform .25s ease;border:0;font:inherit;color:inherit;text-align:left}
.fyt-bf-st:hover{transform:translateY(-6px)}
.fyt-bf-si{border-radius:19px 19px 13px 13px;background:linear-gradient(180deg,#0e1a40,#060912);padding:18px 16px 16px;display:flex;flex-direction:column;justify-content:space-between;height:100%}
.fyt-bf-pct{font-size:40px;font-weight:200;letter-spacing:-.03em;line-height:1}
.fyt-bf-pct b{font-weight:600}
.fyt-bf-pct small{font-size:12px;letter-spacing:.2em;color:#9cc8ff;font-weight:300;margin-left:6px}
.fyt-bf-get{font-size:15px;font-weight:300;color:#cdd6ea;margin-top:10px}
.fyt-bf-get b{font-weight:600;color:#fff}
.fyt-bf-dots{display:flex;flex-wrap:wrap;gap:4px;margin-top:12px}
.fyt-bf-s4 .fyt-bf-dots{max-width:105px}
.fyt-bf-dots i{width:17px;height:12px;border-radius:3px;background:#3f7dff}
.fyt-bf-dots i.f{background:linear-gradient(135deg,#ffe2a0,#e8982a)}
.fyt-bf-lab{font-size:11px;letter-spacing:.24em;color:#7f8db0;margin-top:14px}
.fyt-bf-s1{height:172px}.fyt-bf-s2{height:217px}.fyt-bf-s3{height:257px}.fyt-bf-s4{height:307px}
.fyt-bf-s4{background:linear-gradient(180deg,#ffe2a0,rgba(240,169,58,.15));box-shadow:0 -20px 80px rgba(240,169,58,.25)}
.fyt-bf-s4 .fyt-bf-si{background:linear-gradient(180deg,#2a1c05,#0a0703)}
.fyt-bf-s4 .fyt-bf-pct small{color:#ffe2a0}
.fyt-bf-ribbon{display:inline-block;font-size:10px;letter-spacing:.2em;font-weight:600;padding:4px 9px;border-radius:999px;background:linear-gradient(90deg,#ffe2a0,#f0a93a);color:#3a2200;margin-bottom:10px;align-self:flex-start}
.fyt-bf-give{display:inline-flex;align-items:center;gap:14px;margin-top:34px;padding:12px 22px 12px 12px;border-radius:999px;border:1px solid rgba(240,180,76,.5);background:linear-gradient(90deg,rgba(240,169,58,.18),rgba(240,169,58,.03));font-size:15px;font-weight:300;color:#ffe9bd;text-align:left}
.fyt-bf-give i{font-style:normal;flex:none;width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#ffe2a0,#e8982a);color:#3a2200;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px}
.fyt-bf-give b{font-weight:600;color:#fff}
.fyt-bf-note{margin-top:16px;font-size:13px;font-weight:300;color:#8f9bb8}
@media (max-width:1180px){.fyt-bf-fan,.fyt-bf-off{display:none}}
@media (max-width:767px){
  .fyt-bf-hero{padding:34px 14px 8px}
  .fyt-bf-eyebrow{font-size:10px}
  .fyt-bf-mega{height:150px}
  .fyt-bf-num{font-size:42vw;line-height:150px;top:0}
  .fyt-bf-h2{font-size:28px}
  .fyt-bf-stairs{gap:6px;margin-top:26px}
  .fyt-bf-si{padding:12px 8px 10px}
  .fyt-bf-pct{font-size:23px}
  .fyt-bf-pct small{display:none}
  .fyt-bf-get{font-size:12px;margin-top:6px}
  .fyt-bf-dots{gap:2px;margin-top:8px}
  .fyt-bf-s4 .fyt-bf-dots{max-width:48px}
  .fyt-bf-dots i{width:7px;height:7px;border-radius:2px}
  .fyt-bf-lab{font-size:9px;letter-spacing:.14em;margin-top:9px}
  .fyt-bf-s1{height:122px}.fyt-bf-s2{height:152px}.fyt-bf-s3{height:180px}.fyt-bf-s4{height:217px}
  .fyt-bf-ribbon{font-size:7.5px;letter-spacing:.08em;padding:3px 6px;margin-bottom:6px;white-space:nowrap}
  .fyt-bf-h2 span{display:block}
  .fyt-bf-give{font-size:13px;margin-top:22px}
  .fyt-bf-st:hover{transform:none}
}
/* ---------- table summary: calm, one gold accent, nothing moving next to the price ---------- */
.fyt-bf-sum{position:relative;border-radius:18px;padding:14px;background:linear-gradient(180deg,rgba(47,107,255,.13),rgba(47,107,255,.04));border:1px solid rgba(120,170,255,.28);text-align:left;font-family:Inter,system-ui,sans-serif}
.fyt-bf-sum-q{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12.5px;font-weight:500;color:#DCE6FA}
.fyt-bf-sum-q span{font-size:11px;font-weight:400;color:#8FA6D6}
.fyt-bf-sum-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:16px}
.fyt-bf-sum-tiles.fyt-bf-two{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.fyt-bf-stairs.fyt-bf-two{max-width:520px}
.fyt-bf-two .fyt-bf-s2{height:176px}.fyt-bf-two .fyt-bf-s4{height:214px}
@media (max-width:640px){.fyt-bf-two .fyt-bf-s2{height:128px}.fyt-bf-two .fyt-bf-s4{height:156px}}
.fyt-bf-sum-t{position:relative;min-width:0;appearance:none;cursor:pointer;border-radius:13px;padding:11px 2px 9px;text-align:center;font-family:inherit;color:#fff;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.12);transition:border-color .2s,background .2s,box-shadow .2s,transform .15s}
.fyt-bf-sum-t:hover{border-color:rgba(140,180,255,.6)}
.fyt-bf-sum-t:active{transform:scale(.97)}
.fyt-bf-sum-t small{display:block;font-size:11px;font-weight:400;color:#9FB3DC;line-height:1}
.fyt-bf-sum-t b{display:block;font-size:17px;font-weight:600;letter-spacing:-.01em;line-height:1;margin:6px 0 5px;white-space:nowrap}
.fyt-bf-sum-t em{display:block;font-style:normal;font-size:10.5px;font-weight:500;color:#9FB3DC;line-height:1;white-space:nowrap}
.fyt-bf-sum-t.on{border-color:#5B95FF;background:rgba(63,125,255,.2);box-shadow:0 8px 22px -10px rgba(63,125,255,.9)}
.fyt-bf-sum-t.on small,.fyt-bf-sum-t.on em{color:#CFE0FF}
.fyt-bf-sum-t.on:after{content:"";position:absolute;right:6px;top:6px;width:13px;height:13px;border-radius:50%;background:#5B95FF url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center/9px no-repeat}
.fyt-bf-sum-tag{position:absolute;left:50%;top:-8px;transform:translateX(-50%);font-size:8px;font-weight:700;letter-spacing:.07em;line-height:1;border-radius:999px;padding:3px 7px;white-space:nowrap;color:#fff;background:#2F6BFF}
.fyt-bf-sum-tag.gd{color:#3A2A00;background:#FFD98A}
.fyt-bf-sum-res{display:flex;align-items:center;justify-content:space-between;gap:10px 14px;flex-wrap:wrap;margin-top:13px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08)}
.fyt-bf-sum-txt{flex:1 1 170px;min-width:0}
.fyt-bf-sum-h{font-weight:300;font-size:22px;line-height:1.1;letter-spacing:-.02em;color:#fff}
.fyt-bf-sum-h b{font-weight:600}
.fyt-bf-sum-h small{font-size:13.5px;font-weight:400;color:#B9C8E8;letter-spacing:0;margin-left:6px}
.fyt-bf-sum-s{margin-top:7px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;line-height:1.2;color:#B9C8E8}
.fyt-bf-sum-dots{display:inline-flex;gap:3px;flex-wrap:wrap}
.fyt-bf-sum-dots i{width:16px;height:11px;border-radius:3px;background:#3F7DFF}
.fyt-bf-sum-dots i.f{background:rgba(255,217,138,.16);border:1px solid #E9C46A}
.fyt-bf-sum-each{flex:none;text-align:right;font-size:11px;line-height:1.25;color:#9FB3DC}
.fyt-bf-sum-each b{display:block;font-size:17px;font-weight:600;color:#86EFAC;letter-spacing:-.01em}
.fyt-bf-sum-give{margin-top:10px;font-size:12px;line-height:1.3;color:#B9C8E8}
.fyt-bf-sum-give b{color:#fff;font-weight:600}
@media (max-width:480px){.fyt-bf-sum-t.on:after{display:none}.fyt-bf-sum{padding:13px 11px}.fyt-bf-sum-tiles{gap:5px}.fyt-bf-sum-t b{font-size:15.5px}.fyt-bf-sum-t small{font-size:10.5px}.fyt-bf-sum-t em{font-size:10px}.fyt-bf-sum-h{font-size:20px}.fyt-bf-sum-q span{display:none}}
@media (max-width:360px){.fyt-bf-sum-t b{font-size:14px}.fyt-bf-sum-tag{font-size:7px;padding:3px 5px}.fyt-bf-sum-t em{font-size:9px}}
@media (prefers-reduced-motion:reduce){.fyt-bf-beam,.fyt-bf-card{animation:none}}
`;

export function ensureBfAssets(): void {
  if (typeof document === "undefined") return;
  if (!document.getElementById(BF_FONT_ID)) {
    const l = document.createElement("link");
    l.id = BF_FONT_ID;
    l.rel = "stylesheet";
    l.href = BF_FONT_HREF;
    document.head.appendChild(l);
  }
  if (!document.getElementById("fyt-bf-css")) {
    const s = document.createElement("style");
    s.id = "fyt-bf-css";
    s.textContent = BF_CSS;
    document.head.appendChild(s);
  }
}
