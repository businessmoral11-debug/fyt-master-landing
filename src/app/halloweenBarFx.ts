// @ts-nocheck
/* Halloween promo bar effects (from the supplied snippet), adapted for React: runs on a given element and returns a cleanup. */

export function initHalloweenBar(bar: any, cfg: any): () => void {
  'use strict';

  /* ===================================================================
     CONFIG: change these values only.
     endDate: when the offer ends, ISO 8601 with a timezone offset.
              (+05:30 = India Standard Time). Countdown shows
              OFFER ENDED once this moment passes.
     =================================================================== */
  var FYT_HW_CONFIG = cfg;
  var dead = false;
  var timers = [];
  function later(fn, ms) { var id = setTimeout(function () { if (!dead) fn(); }, ms); timers.push(id); if (timers.length > 200) timers.splice(0, 100); return id; }

  var $ = function (sel) { return bar.querySelector(sel); };
  var critters = $('.fyt-hw-critters');
  var fxTop    = $('.fyt-hw-fxtop');
  var pumpkin  = $('.fyt-hw-pumpkin');
  var blastGlow = $('.fyt-hw-blast-glow');

  var reduceMQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var smallMQ  = window.matchMedia ? matchMedia('(max-width: 640px)') : { matches: false };
  var canAnimate = typeof Element !== 'undefined' && !!Element.prototype.animate;
  function motionOK() { return canAnimate && !reduceMQ.matches && !document.hidden; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------------- Countdown ---------------- */
  var endTime = new Date(FYT_HW_CONFIG.endDate).getTime();
  var timer = $('.fyt-hw-timer');
  var nums = {};
  bar.querySelectorAll('.fyt-hw-num').forEach(function (el) { nums[el.getAttribute('data-unit')] = el; });
  var lastVals = {};
  var tickHandle = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function setNum(unit, val) {
    var el = nums[unit];
    if (!el || lastVals[unit] === val) return;
    var first = !(unit in lastVals);
    lastVals[unit] = val;
    el.textContent = val;
    if (!first && !reduceMQ.matches) {        // little flip/bump on change
      el.classList.remove('fyt-hw-tick');
      void el.offsetWidth;                    // restart the CSS animation
      el.classList.add('fyt-hw-tick');
    }
  }
  function updateCountdown() {
    var diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    if (isNaN(endTime) || diff <= 0) {
      timer.classList.add('fyt-hw-ended');
      timer.querySelector('.fyt-hw-timer-body').textContent = FYT_HW_CONFIG.endedText;
      timer.setAttribute('aria-label', FYT_HW_CONFIG.endedText);
      if (tickHandle) clearTimeout(tickHandle);
      return false;
    }
    var d = Math.floor(diff / 86400), h = Math.floor(diff % 86400 / 3600),
        m = Math.floor(diff % 3600 / 60), s = diff % 60;
    setNum('d', String(d)); setNum('h', pad(h)); setNum('m', pad(m)); setNum('s', pad(s));
    timer.setAttribute('aria-label', d + ' days ' + h + ' hours ' + m + ' minutes left');
    return true;
  }
  (function loop() {                          // aligned to the start of each second
    if (updateCountdown()) tickHandle = later(loop, 1000 - (Date.now() % 1000) + 15);
  })();

  /* ---------------- Click-to-copy coupon ---------------- */
  var codeBtn = $('.fyt-hw-code');
  var sr = $('.fyt-hw-sr');
  $('.fyt-hw-code-txt').textContent = FYT_HW_CONFIG.couponCode;
  $('.fyt-hw-code-ok').textContent = FYT_HW_CONFIG.copiedText;
  codeBtn.setAttribute('aria-label', 'Copy coupon code ' + FYT_HW_CONFIG.couponCode);
  var copyReset = null;

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  codeBtn.addEventListener('click', function (ev) {
    ev.stopPropagation(); ev.preventDefault();
    var code = FYT_HW_CONFIG.couponCode;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code).catch(function () { fallbackCopy(code); });
    } else { fallbackCopy(code); }
    codeBtn.classList.add('fyt-hw-copied');
    sr.textContent = 'Coupon code ' + code + ' copied';
    clearTimeout(copyReset);
    copyReset = later(function () { codeBtn.classList.remove('fyt-hw-copied'); sr.textContent = ''; }, 1800);
    burst(true);                               // a celebratory pumpkin pop
  });

  /* ---------------- Helpers for effects ---------------- */
  function rel(el) {                           // element rect relative to the bar
    var b = bar.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top,
             cx: (r.left + r.right) / 2 - b.left, cy: (r.top + r.bottom) / 2 - b.top };
  }
  // Horizontal gaps not covered by text/pills, so spiders never hang over the copy.
  function freeSpots() {
    var W = bar.clientWidth, blocks = [];
    ['.fyt-hw-pumpkin', '.fyt-hw-headline', '.fyt-hw-sub', '.fyt-hw-divider', '.fyt-hw-code', '.fyt-hw-timer']
      .forEach(function (s) {
        var el = $(s);
        if (el && el.offsetParent !== null) { var r = rel(el); blocks.push([r.l - 8, r.r + 8]); }
      });
    blocks.sort(function (a, b) { return a[0] - b[0]; });
    var gaps = [], x = 4;
    blocks.forEach(function (bk) { if (bk[0] - x >= 24) gaps.push([x, bk[0] - 22]); x = Math.max(x, bk[1]); });
    if (W - 26 - x >= 2) gaps.push([x, W - 26]);
    return gaps.filter(function (g) { return g[1] >= g[0]; });
  }
  var live = [];                               // running WAAPI animations (for pause/resume)
  function track(anim, el) {
    live.push(anim);
    anim.onfinish = anim.oncancel = function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      var i = live.indexOf(anim); if (i > -1) live.splice(i, 1);
    };
    return anim;
  }

  var SPIDER_SVG =
    '<svg viewBox="-10 -10 20 20" width="22" height="22">' +
    '<g stroke="#0b1430" stroke-width="1.25" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<g class="fyt-hw-legs-l"><path d="M-1.5-2.5L-5-7L-8-5.5M-2-1L-7-3L-9.5 0M-2 1L-7 2.5L-9 6M-1.5 2.5L-5 6.5L-6 9.5"/></g>' +
      '<g class="fyt-hw-legs-r"><path d="M1.5-2.5L5-7L8-5.5M2-1L7-3L9.5 0M2 1L7 2.5L9 6M1.5 2.5L5 6.5L6 9.5"/></g>' +
    '</g>' +
    '<ellipse cx="0" cy="2.4" rx="3.3" ry="4" fill="#070b18" stroke="rgba(190,210,255,.6)" stroke-width=".6"/>' +
    '<circle cx="0" cy="-2.6" r="2.2" fill="#070b18" stroke="rgba(190,210,255,.6)" stroke-width=".6"/>' +
    '<path d="M-1.6 3.2h3.2M0 1.2v4" stroke="#ff7a1a" stroke-width=".7" opacity=".8"/>' +
    '<g class="fyt-hw-eye" fill="#ff8a1f"><circle cx="-.9" cy="-3.1" r=".6"/><circle cx=".9" cy="-3.1" r=".6"/></g>' +
    '</svg>';

  var BAT_SVG =
    '<svg viewBox="-20 -8 40 16" width="30" height="12">' +
    '<g fill="#070b18" stroke="rgba(170,195,255,.35)" stroke-width=".5">' +
      '<path class="fyt-hw-wing" d="M-2-1C-6-6-12-6-18-3C-15-1-14 1-13 3C-11 1-9 1-8 3C-6 1-4 1-2 2Z"/>' +
      '<g transform="scale(-1 1)"><path class="fyt-hw-wing" d="M-2-1C-6-6-12-6-18-3C-15-1-14 1-13 3C-11 1-9 1-8 3C-6 1-4 1-2 2Z"/></g>' +
      '<ellipse cx="0" cy="0.5" rx="2.6" ry="3.4"/>' +
      '<path d="M-2-2L-1.6-5L-.4-2.6ZM2-2L1.6-5L.4-2.6Z"/>' +
    '</g>' +
    '<circle cx="-.9" cy="-.6" r=".45" fill="#ff9d3a"/><circle cx=".9" cy="-.6" r=".45" fill="#ff9d3a"/>' +
    '</svg>';

  /* ---------------- Spider dropping on a silk thread ---------------- */
  var activeDrops = 0, dropXs = [];
  function dropSpider() {
    if (!motionOK()) return;
    var maxDrops = smallMQ.matches ? 1 : 2;
    if (activeDrops >= maxDrops) return;
    var gaps = freeSpots();
    if (!gaps.length) { var W0 = bar.clientWidth; gaps = [[0, 3], [W0 - 25, W0 - 22]]; } // tight layouts: use the web corners
    var x, tries = 0;
    do { var g = pick(gaps); x = rand(g[0], g[1]); tries++; }
    while (tries < 8 && dropXs.some(function (o) { return Math.abs(o - x) < 34; }));
    if (dropXs.some(function (o) { return Math.abs(o - x) < 34; })) return;   // too close to another spider
    dropXs.push(x);
    var H = bar.clientHeight;
    var hang = rand(H * 0.42, H * 0.62);       // how far down it hangs
    var el = document.createElement('div');
    el.className = 'fyt-hw-spider';
    el.style.left = x + 'px';
    el.innerHTML = '<div class="fyt-hw-thread"></div><div class="fyt-hw-spider-body">' + SPIDER_SVG + '</div>';
    critters.appendChild(el);
    activeDrops++;
    var body = el.lastChild, thread = el.firstChild;
    var dur = rand(4200, 6000), sway = rand(-5, 5);
    var ys = [-12, hang, hang - 4, hang + 1, hang, hang, -12];
    var off = [0, .32, .42, .5, .56, .74, 1];
    var ease = ['cubic-bezier(.3,.6,.4,1)', 'ease-in-out', 'ease-in-out', 'ease-in-out', 'linear', 'cubic-bezier(.6,0,.8,.4)'];
    body.animate(ys.map(function (y, i) {
      return { transform: 'translateY(' + y + 'px) rotate(' + (i === 3 ? sway : i === 4 ? -sway / 2 : 0) + 'deg)', offset: off[i], easing: ease[i] };
    }), { duration: dur, fill: 'both' });
    var a = thread.animate(ys.map(function (y, i) {
      return { transform: 'scaleY(' + Math.max(0, y - 2) + ')', offset: off[i], easing: ease[i] };
    }), { duration: dur, fill: 'both' });
    track(a, el);
    a.addEventListener('finish', function () { activeDrops--; dropXs.splice(dropXs.indexOf(x), 1); });
  }

  /* ---------------- Spider scuttling along the top edge ---------------- */
  function scuttle() {
    if (!motionOK() || smallMQ.matches) return;
    var W = bar.clientWidth, ltr = Math.random() < 0.5;
    var el = document.createElement('div');
    el.className = 'fyt-hw-spider fyt-hw-walking';
    el.style.left = '0px';
    el.innerHTML = '<div class="fyt-hw-spider-body" style="top:0">' + SPIDER_SVG + '</div>';
    critters.appendChild(el);
    var body = el.firstChild, rot = ltr ? 90 : -90;
    var from = ltr ? -24 : W + 6, to = ltr ? W + 6 : -24;
    var stop = from + (to - from) * rand(0.25, 0.45);   // stops halfway to "look around"
    var y = 1;
    var a = body.animate([
      { transform: 'translate(' + from + 'px,' + y + 'px) rotate(' + rot + 'deg)', offset: 0 },
      { transform: 'translate(' + stop + 'px,' + y + 'px) rotate(' + rot + 'deg)', offset: .38, easing: 'ease-out' },
      { transform: 'translate(' + stop + 'px,' + (y + 1) + 'px) rotate(' + (rot + 20) + 'deg)', offset: .46 },
      { transform: 'translate(' + stop + 'px,' + y + 'px) rotate(' + (rot - 15) + 'deg)', offset: .54 },
      { transform: 'translate(' + stop + 'px,' + y + 'px) rotate(' + rot + 'deg)', offset: .58, easing: 'ease-in' },
      { transform: 'translate(' + to + 'px,' + y + 'px) rotate(' + rot + 'deg)', offset: 1 }
    ], { duration: Math.max(6000, W * 6.5), fill: 'both' });
    track(a, el);
  }

  /* ---------------- Bat flying across ---------------- */
  function bat() {
    if (!motionOK()) return;
    var W = bar.clientWidth, H = bar.clientHeight, rtl = Math.random() < 0.6;
    var el = document.createElement('div');
    el.className = 'fyt-hw-bat';
    el.innerHTML = BAT_SVG;
    critters.appendChild(el);
    var frames = [], n = 10, base = rand(2, Math.max(4, H * 0.22)), amp = rand(3, 6);
    for (var i = 0; i <= n; i++) {
      var t = i / n, x = rtl ? W + 10 - t * (W + 50) : -40 + t * (W + 50);
      var yy = base + Math.sin(t * Math.PI * 4) * amp;
      frames.push({ transform: 'translate(' + x + 'px,' + yy + 'px) scale(' + (smallMQ.matches ? .8 : 1) + ')' });
    }
    track(el.animate(frames, { duration: Math.max(3800, W * 4), easing: 'linear', fill: 'both' }), el);
  }

  /* ---------------- Pumpkin wobble + ember blast ---------------- */
  var COLORS = ['#ff8a1f', '#ffb347', '#ff6a00', '#ffd166', '#60a5fa', '#93c5fd', '#ffffff'];
  function burst(manual) {
    if (!motionOK() && !manual) return;
    if (!canAnimate || reduceMQ.matches) return;
    pumpkin.classList.remove('fyt-hw-pop'); void pumpkin.offsetWidth; pumpkin.classList.add('fyt-hw-pop');
    later(function () {                   // emit at the "pop" moment of the wobble
      var c = rel(pumpkin), H = bar.clientHeight;
      blastGlow.style.left = c.cx + 'px'; blastGlow.style.top = c.cy + 'px';
      blastGlow.classList.remove('fyt-hw-on'); void blastGlow.offsetWidth; blastGlow.classList.add('fyt-hw-on');

      var ring = document.createElement('div');
      ring.className = 'fyt-hw-ring';
      fxTop.appendChild(ring);
      track(ring.animate([
        { transform: 'translate(' + c.cx + 'px,' + c.cy + 'px) scale(.3)', opacity: 1 },
        { transform: 'translate(' + c.cx + 'px,' + c.cy + 'px) scale(3.4)', opacity: 0 }
      ], { duration: 700, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' }), ring);

      var count = smallMQ.matches ? 14 : 28;
      for (var i = 0; i < count; i++) {
        var p = document.createElement('div');
        p.className = 'fyt-hw-p';
        var size = rand(3, 7.5), col = pick(COLORS);
        p.style.width = p.style.height = size + 'px';
        p.style.marginLeft = p.style.marginTop = (-size / 2) + 'px';
        p.style.background = col;
        p.style.boxShadow = '0 0 ' + (size * 1.6) + 'px ' + col;
        fxTop.appendChild(p);
        var ang = rand(0, Math.PI * 2), dist = rand(26, smallMQ.matches ? 60 : 120);
        var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist * 0.45;
        // keep embers inside the bar vertically, then let them "fall" a little
        var ex = c.cx + dx, ey = Math.min(H - 4, Math.max(4, c.cy + dy));
        var fy = Math.min(H - 2, ey + rand(4, 12));
        track(p.animate([
          { transform: 'translate(' + c.cx + 'px,' + c.cy + 'px) scale(1)', opacity: 1 },
          { transform: 'translate(' + ex + 'px,' + ey + 'px) scale(.9)', opacity: 1, offset: .55 },
          { transform: 'translate(' + (ex + dx * 0.12) + 'px,' + fy + 'px) scale(0)', opacity: 0 }
        ], { duration: rand(900, 1600), easing: 'cubic-bezier(.15,.75,.35,1)', fill: 'both' }), p);
      }
    }, 520);
    later(function () { pumpkin.classList.remove('fyt-hw-pop'); }, 1000);
  }

  /* ---------------- Scheduler (random intervals, skips when hidden) ---------------- */
  function every(fn, firstDelay, min, max) {
    later(function run() {
      try { fn(); } catch (e) { /* never break the host page */ }
      later(run, rand(min, max) * (smallMQ.matches ? 1.6 : 1));
    }, firstDelay);
  }
  if (canAnimate) {
    every(function () { burst(false); }, 1100, 5500, 8000);   // pumpkin blast
    every(function () { dropSpider(); },  300, 2600, 4800);   // descending spiders
    every(function () { scuttle(); },    2300, 11000, 17000); // top-edge scuttler
    every(function () { bat(); },        3200, 9000, 15000);  // bat fly-by
  }

  /* ---------------- Pause when the tab is hidden ---------------- */
  function onVis() {
    var hidden = document.hidden;
    bar.classList.toggle('fyt-hw-paused', hidden);
    live.forEach(function (a) { try { hidden ? a.pause() : a.play(); } catch (e) {} });
    if (!hidden) updateCountdown();
  }
  document.addEventListener('visibilitychange', onVis);

  return function cleanup() {
    dead = true;
    timers.forEach(clearTimeout);
    document.removeEventListener('visibilitychange', onVis);
    live.slice().forEach(function (a) { try { a.cancel(); } catch (e) {} });
  };
}
