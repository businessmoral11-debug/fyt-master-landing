/** Slim layout for the Diwali bar: one thin row on desktop, two rows on phones, one row when the header compacts on scroll. */
export const DIWALI_SLIM_CSS = `
#fyt-dw-bar .fyt-dw-inner{min-height:46px;padding:6px 110px 11px 90px;gap:16px}
#fyt-dw-bar .fyt-dw-msg{gap:8px}
#fyt-dw-bar .fyt-dw-text{flex-direction:row;align-items:center;gap:10px}
#fyt-dw-bar .fyt-dw-eyebrow{font-size:11px;letter-spacing:.2em}
#fyt-dw-bar .fyt-dw-head{font-size:15px;font-weight:700}
#fyt-dw-bar .fyt-dw-diya{width:24px;height:24px}
#fyt-dw-bar .fyt-dw-diya svg{width:24px;height:12px}
#fyt-dw-bar .fyt-dw-halo{width:24px;height:24px;margin-left:-12px;top:-5px}
#fyt-dw-bar .fyt-dw-flame{width:6px;height:11px;margin-left:-3px;bottom:9px}
#fyt-dw-bar .fyt-dw-ticket{height:30px;width:158px;border-radius:7px}
#fyt-dw-bar .fyt-dw-stub{padding:0 7px 0 10px;font-size:7px}
#fyt-dw-bar .fyt-dw-stub svg{width:10px;height:10px}
#fyt-dw-bar .fyt-dw-codewrap{padding:0 10px 0 8px;gap:6px}
#fyt-dw-bar .fyt-dw-code{font-size:13px}
#fyt-dw-bar .fyt-dw-copyico{width:12px;height:12px}
#fyt-dw-bar .fyt-dw-ends{display:none}
#fyt-dw-bar .fyt-dw-tiles{gap:4px}
#fyt-dw-bar .fyt-dw-tile{width:31px;height:30px;border-radius:6px}
#fyt-dw-bar .fyt-dw-num{font-size:13px}
#fyt-dw-bar .fyt-dw-lbl{font-size:6px;margin-top:2px}
#fyt-dw-bar .fyt-dw-cta{height:30px;padding:0 14px;font-size:12px;gap:6px}
#fyt-dw-bar .fyt-dw-cta svg{width:12px;height:12px}
#fyt-dw-bar .fyt-dw-lights{height:10px}
#fyt-dw-bar .fyt-dw-bulb{top:3px;width:4px;height:5px}
#fyt-dw-bar .fyt-dw-lantern svg{width:13px;height:24px}
#fyt-dw-bar .fyt-dw-l1 i,#fyt-dw-bar .fyt-dw-l4 i{height:3px}
#fyt-dw-bar .fyt-dw-l2 svg,#fyt-dw-bar .fyt-dw-l3 svg{width:11px;height:20px}
#fyt-dw-bar .fyt-dw-rangoli{width:90px;height:90px;margin-top:-45px}
#fyt-dw-bar .fyt-dw-close{width:22px;height:22px;right:10px;margin-top:-11px}
#fyt-dw-bar .fyt-dw-close svg{width:9px;height:9px}
@media (max-width:1240px){
  #fyt-dw-bar .fyt-dw-inner{flex-wrap:nowrap;gap:10px;padding:6px 44px 11px 40px}
  #fyt-dw-bar .fyt-dw-msg{flex:0 1 auto}
  #fyt-dw-bar .fyt-dw-text{align-items:center;text-align:left}
  #fyt-dw-bar .fyt-dw-eyebrow{align-self:center}
  #fyt-dw-bar .fyt-dw-diya{display:none}
  #fyt-dw-bar .fyt-dw-head{font-size:13px}
  #fyt-dw-bar .fyt-dw-ticket{width:136px}
}
@media (max-width:820px){ #fyt-dw-bar .fyt-dw-cta{display:none} }
@media (max-width:640px){
  #fyt-dw-bar .fyt-dw-inner{flex-wrap:wrap;gap:6px 8px;padding:7px 34px 12px 10px;min-height:0;justify-content:center}
  #fyt-dw-bar .fyt-dw-msg{flex:1 0 100%;justify-content:center;padding:0}
  #fyt-dw-bar .fyt-dw-text{flex-wrap:wrap;justify-content:center;gap:2px 8px}
  #fyt-dw-bar .fyt-dw-eyebrow{font-size:10px}
  #fyt-dw-bar .fyt-dw-head{font-size:13px;white-space:nowrap}
  #fyt-dw-bar .fyt-dw-ticket{height:30px;width:auto;flex:1 1 0;max-width:170px}
  #fyt-dw-bar .fyt-dw-code{font-size:13px;letter-spacing:.04em}
  #fyt-dw-bar .fyt-dw-tile{width:30px;height:30px}
  #fyt-dw-bar .fyt-dw-tiles{gap:3px}
  #fyt-dw-bar .fyt-dw-l1{left:4px}#fyt-dw-bar .fyt-dw-l4{right:30px}
  #fyt-dw-bar .fyt-dw-l1 svg,#fyt-dw-bar .fyt-dw-l4 svg{width:11px;height:20px}
  #fyt-dw-bar .fyt-dw-close{top:12px;right:6px;margin-top:0}
  #fyt-dw-bar .fyt-dw-rangoli{width:80px;height:80px;margin-top:-40px}
  /* scrolled: one thin row (like the Halloween bar) */
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-inner{flex-wrap:nowrap;gap:8px;padding:4px 34px 9px 10px;justify-content:space-between}
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-msg{flex:1 1 auto;min-width:0;justify-content:flex-start}
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-eyebrow,#fyt-dw-bar.fyt-dw-compact .fyt-dw-ticket,#fyt-dw-bar.fyt-dw-compact .fyt-dw-lantern,#fyt-dw-bar.fyt-dw-compact .fyt-dw-tile[data-u="d"]{display:none}
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-head{font-size:11.5px}
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-tile{width:25px;height:21px;border-radius:5px}
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-num{font-size:11px}
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-lbl{display:none}
  #fyt-dw-bar.fyt-dw-compact .fyt-dw-close{top:6px}
}
`;
