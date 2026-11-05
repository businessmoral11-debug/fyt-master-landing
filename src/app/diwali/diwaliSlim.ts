/** Thin mode for the Diwali bar: when the page is scrolled it folds to one slim row. */
export const DIWALI_SLIM_CSS = `
#fyt-dw-bar{transition:min-height .25s ease}
#fyt-dw-bar.fyt-dw-thin{min-height:0}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-inner{min-height:46px;padding:5px 96px 11px;gap:14px;flex-wrap:nowrap}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-msg{flex:0 1 auto}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-text{flex-direction:row;align-items:center;gap:10px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-eyebrow{font-size:10px;letter-spacing:.22em}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-eyebrow::before,#fyt-dw-bar.fyt-dw-thin .fyt-dw-eyebrow::after{display:none}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-head{font-size:15px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-lantern,#fyt-dw-bar.fyt-dw-thin .fyt-dw-diya,#fyt-dw-bar.fyt-dw-thin .fyt-dw-hdiya,#fyt-dw-bar.fyt-dw-thin .fyt-dw-petal,#fyt-dw-bar.fyt-dw-thin .fyt-dw-bokeh,#fyt-dw-bar.fyt-dw-thin .fyt-dw-rangoli--c{display:none}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-rangoli{width:110px;height:110px;margin-top:-55px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-ticket{height:30px;width:152px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-stub{padding:0 7px 0 10px;font-size:7px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-stub svg{width:10px;height:10px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-code{font-size:13px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-copyico{width:12px;height:12px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-ends{display:none}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-timer{flex-direction:row}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-tiles{gap:4px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-tile{width:31px;height:30px;border-radius:6px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-num{font-size:13px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-lbl{font-size:6px;margin-top:2px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-cta{height:30px;padding:0 14px;font-size:12px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-cta svg{width:12px;height:12px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-lights{height:10px}
#fyt-dw-bar.fyt-dw-thin .fyt-dw-bulb{top:3px;width:4px;height:5px}
@media (max-width:1259px){
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-inner{flex-wrap:nowrap;gap:10px;padding:5px 44px 11px 40px}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-msg{flex:0 1 auto}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-head{font-size:13px}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-ticket{width:132px}
}
@media (max-width:820px){ #fyt-dw-bar.fyt-dw-thin .fyt-dw-cta{display:none} }
@media (max-width:640px){
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-inner{gap:8px;padding:4px 34px 10px 10px;justify-content:space-between}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-msg{flex:1 1 auto;min-width:0;justify-content:flex-start;padding:0}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-text{flex-direction:column;align-items:flex-start;gap:1px}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-eyebrow{align-self:flex-start;font-size:8.5px;padding-left:0}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-head{font-size:11px}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-ticket,#fyt-dw-bar.fyt-dw-thin .fyt-dw-tile[data-u="s"]{display:none}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-tiles{gap:3px}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-tile{width:27px;height:27px;border-radius:5px}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-num{font-size:11.5px}
  #fyt-dw-bar.fyt-dw-thin .fyt-dw-lbl{font-size:5.5px}
}
@media (max-width:640px){
  /* top of the page on phones: tighter than the original so the banner covers less */
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-inner{padding:5px 10px 11px;gap:4px 6px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-msg{padding:0 34px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-text{gap:1px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-eyebrow{font-size:9px;letter-spacing:.24em;gap:5px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-eyebrow::before,#fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-eyebrow::after{width:12px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-head{font-size:clamp(12.5px,3.6vw,15px)}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-ticket{height:34px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-code{font-size:14px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-copyico{width:12px;height:12px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-tile{width:30px;height:34px;border-radius:6px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-num{font-size:14px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-lbl{font-size:6.5px;margin-top:2px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-cta{height:34px;padding:0 14px;font-size:12.5px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-lights{height:11px}
  #fyt-dw-bar:not(.fyt-dw-thin) .fyt-dw-bulb{top:4px;width:4px;height:6px}
}
`;
