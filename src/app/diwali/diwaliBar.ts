// @ts-nocheck
/* Diwali Special sticky top bar v2: countdown, copy, fireworks, lights. Mounted by DiwaliPromoBar. */
export interface DwConfig { endDate:string; rollingDays:number|null; couponCode:string; headline:string; highlights:string[]; ctaText:string; ctaTextShort:string; ctaUrl:string; ctaNewTab:boolean; soonHours:number; soonText:string; whenEnded:string; endedText:string; sticky:boolean; stickyMode:string; zIndex:number; fireworks:boolean }
export function mountDiwaliBar(bar: HTMLElement, CONFIG: DwConfig): () => void {


  var $ = function(s){ return bar.querySelector(s); };
  var LS = null; try { localStorage.setItem('fyt-dw-t', '1'); localStorage.removeItem('fyt-dw-t'); LS = localStorage; } catch(e){}
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  bar.style.zIndex = CONFIG.zIndex;

  /* ---------- copy ---------- */
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  var hl = String(CONFIG.headline), ci = hl.indexOf(':');
  var eyebrow = ci > -1 ? hl.slice(0, ci).trim() : '', main = ci > -1 ? hl.slice(ci + 1).trim() : hl;
  var mainHtml = esc(main);
  (CONFIG.highlights || []).forEach(function(h){ if (h) mainHtml = mainHtml.split(esc(h)).join('<em>' + esc(h) + '</em>'); });
  $('.fyt-dw-eyetxt').textContent = eyebrow;
  if (!eyebrow) $('.fyt-dw-eyebrow').style.display = 'none';
  $('.fyt-dw-hbase').innerHTML = mainHtml;
  $('.fyt-dw-hshine > span').innerHTML = mainHtml;
  $('.fyt-dw-text').setAttribute('aria-label', hl);
  $('.fyt-dw-code').textContent = CONFIG.couponCode;
  var ticket = $('.fyt-dw-ticket');
  ticket.setAttribute('aria-label', 'Copy coupon code ' + CONFIG.couponCode);
  var cta = $('.fyt-dw-cta');
  cta.href = CONFIG.ctaUrl; $('.fyt-dw-ctal').textContent = CONFIG.ctaText; $('.fyt-dw-ctas').textContent = CONFIG.ctaTextShort || CONFIG.ctaText;
  cta.setAttribute('aria-label', CONFIG.ctaText);
  if (CONFIG.ctaNewTab) { cta.target = '_blank'; cta.rel = 'noopener'; }
  $('.fyt-dw-over').textContent = CONFIG.endedText;

  /* ---------- sticky / fixed positioning ---------- */
  var body = document.body, basePad = null, adminBar = document.getElementById('wpadminbar'), posRaf = null;
  function place(){
    posRaf = null;
    if (!CONFIG.sticky || bar.classList.contains('fyt-dw-hidden')) return;
    var top = 0;
    if (adminBar) {
      var cs = getComputedStyle(adminBar);
      if (cs.display !== 'none') {
        if (cs.position === 'fixed') top = adminBar.offsetHeight;
        else top = Math.max(0, adminBar.offsetHeight - (window.pageYOffset || 0)); // WP mobile: admin bar scrolls away
      }
    }
    bar.style.setProperty('--fyt-dw-top', top + 'px');
    if (CONFIG.stickyMode !== 'sticky') {
      if (basePad === null) basePad = parseFloat(getComputedStyle(body).paddingTop) || 0;
      body.style.paddingTop = (basePad + bar.offsetHeight) + 'px';
    }
  }
  function schedulePlace(){ if (!posRaf) posRaf = requestAnimationFrame(place); }
  function unplace(){ if (basePad !== null) body.style.paddingTop = basePad ? basePad + 'px' : ''; }
  if (CONFIG.sticky) {
    if (CONFIG.stickyMode === 'sticky') bar.classList.add('fyt-dw-sticky');
    else {
      if (bar.parentNode !== body) body.insertBefore(bar, body.firstChild); // escape theme wrappers (transforms/overflow)
      bar.classList.add('fyt-dw-fixed');
    }
    place();
    window.addEventListener('resize', schedulePlace);
    if (adminBar) window.addEventListener('scroll', schedulePlace, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedulePlace);
  }

  /* ---------- countdown ---------- */
  var end;
  if (CONFIG.rollingDays) {
    var key = 'fyt-dw-first-visit', first = LS && parseInt(LS.getItem(key), 10);
    if (!first) { first = Date.now(); if (LS) LS.setItem(key, String(first)); }
    end = first + CONFIG.rollingDays * 864e5;
  } else end = new Date(CONFIG.endDate).getTime();
  var tiles = {}; ['d','h','m','s'].forEach(function(u){ tiles[u] = bar.querySelector('.fyt-dw-tile[data-u="' + u + '"]'); });
  if (tiles.d) tiles.d.style.display = 'none';
  var prev = {}, lastMin = -1, timerId = null, srT = $('.fyt-dw-timesr'), endsEl = $('.fyt-dw-ends'), endsTxt = endsEl.textContent;
  var pad = function(n){ return n < 10 ? '0' + n : '' + n; };
  function tick(){
    var left = end - Date.now();
    if (!(left > 0)) { endOffer(); return; }
    var soon = left <= CONFIG.soonHours * 36e5;
    if (soon !== bar.classList.contains('fyt-dw-soon')) { bar.classList.toggle('fyt-dw-soon', soon); endsEl.textContent = soon ? CONFIG.soonText : endsTxt; }
    var s = Math.floor(left / 1000), v = { d: 0, h: Math.floor(s / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 }; /* hours only (41h, not 1 day 17h) */
    for (var u in v) if (prev[u] !== v[u]) {
      var t = tiles[u]; t.querySelector('.fyt-dw-num').textContent = pad(v[u]);
      if (!reduce && prev[u] !== undefined) { t.classList.remove('fyt-dw-flipping'); void t.offsetWidth; t.classList.add('fyt-dw-flipping'); }
      prev[u] = v[u];
    }
    var totalMin = Math.floor(s / 60);
    if (totalMin !== lastMin) { lastMin = totalMin; srT.textContent = (soon ? CONFIG.soonText + '. ' : '') + 'Offer ends in ' + v.h + ' hours, ' + v.m + ' minutes'; }
  }
  function endOffer(){
    if (timerId) clearInterval(timerId); timerId = null;
    if (CONFIG.whenEnded === 'hide') { stop(); bar.classList.add('fyt-dw-hidden'); unplace(); return; }
    bar.classList.remove('fyt-dw-soon'); bar.classList.add('fyt-dw-ended'); srT.textContent = CONFIG.endedText; schedulePlace();
  }

  /* ---------- copy coupon ---------- */
  var copySr = $('.fyt-dw-copysr'), codeEl = $('.fyt-dw-code'), stubTxt = $('.fyt-dw-stubtxt'), resetT;
  function legacyCopy(text){
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    var ok = false; try { ok = document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta); return ok;
  }
  function copied(ok){
    clearTimeout(resetT);
    if (ok) {
      ticket.classList.add('fyt-dw-copied'); codeEl.textContent = 'Copied!'; stubTxt.textContent = 'Done';
      copySr.textContent = 'Coupon code ' + CONFIG.couponCode + ' copied to clipboard';
      var b = bar.getBoundingClientRect(), r = ticket.getBoundingClientRect();
      if (fx) fx.sparkle(r.left - b.left + r.width / 2, r.top - b.top + r.height / 2);
    } else {
      try { var rg = document.createRange(); rg.selectNodeContents(codeEl); var sl = window.getSelection(); sl.removeAllRanges(); sl.addRange(rg); } catch(e){}
      copySr.textContent = 'Press Ctrl+C or Cmd+C to copy code ' + CONFIG.couponCode;
    }
    resetT = setTimeout(function(){ ticket.classList.remove('fyt-dw-copied'); codeEl.textContent = CONFIG.couponCode; stubTxt.textContent = 'Code'; copySr.textContent = ''; }, 2200);
  }
  ticket.addEventListener('click', function(){
    var code = CONFIG.couponCode;
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(function(){ copied(true); }, function(){ copied(legacyCopy(code)); });
    else copied(legacyCopy(code));
  });

  /* ---------- fairy lights ---------- */
  var lights = $('.fyt-dw-lights'), COLORS = ['#FFC845','#FF9933','#FF5C7A','#7CFFB2','#FFE29A','#6FB6FF'];
  function buildLights(){
    // n evenly spaced bulbs that exactly fill the width: first and last bulb sit gap/2 from each edge
    var w = bar.clientWidth, n = Math.max(1, Math.min(64, Math.round(w / (w < 640 ? 28 : 36)))), gap = w / n, path = 'M0 2', html = '';
    for (var i = 0; i < n; i++) {
      var x = +(i * gap).toFixed(2); path += ' Q' + (x + gap / 2).toFixed(2) + ' 10 ' + (x + gap).toFixed(2) + ' 2';
      html += '<span class="fyt-dw-bulb" style="left:' + (x + gap / 2).toFixed(2) + 'px;--c:' + COLORS[i % COLORS.length] + ';animation-delay:' + (-(i * 0.37) % 2.4).toFixed(2) + 's"></span>';
    }
    lights.innerHTML = '<svg class="fyt-dw-wire" viewBox="0 0 ' + w + ' 12" preserveAspectRatio="none"><path d="' + path + '" fill="none" stroke="rgba(255,226,154,.45)" stroke-width="1"/></svg>' + html;
  }
  buildLights();

  /* ---------- fireworks (canvas) ---------- */
  var fx = null;
  var cv = $('.fyt-dw-fx'), ctx = !reduce && cv.getContext ? cv.getContext('2d') : null;
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 1.5), raf = null, running = false, last = 0, zones = [];
  var P = [], G = [], C = [], F = [], R = [], Q = [];   // particles, glitter, crackles, flashes, rockets, queued events
  var MAXP = 200, MAXG = 150, MAXC = 40, nextSmall = 0, nextHero = 0;
  var PAL = [['#FFC845','#FFF1B8'],['#FF9933','#FFD27A'],['#FF5C7A','#FFC2D0'],['#FFE29A','#FFFFFF'],['#7CFFB2','#E6FFF0'],['#B9A2FF','#FFE29A']];
  function size(){
    W = bar.clientWidth; H = bar.clientHeight; if (!ctx) return;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var br = bar.getBoundingClientRect(), mobile = W <= 640, els = mobile ? ['.fyt-dw-text'] : ['.fyt-dw-text','.fyt-dw-ticket','.fyt-dw-timer','.fyt-dw-cta'];
    var l = W, r = 0, bot = H;
    els.forEach(function(s){ var e = $(s); if (!e || !e.offsetWidth) return; var q = e.getBoundingClientRect(); l = Math.min(l, q.left - br.left); r = Math.max(r, q.right - br.left); if (mobile) bot = q.bottom - br.top; });
    var yMax = mobile ? bot : H * 0.72;
    zones = [{ x0: 0, x1: Math.max(34, l - 10), y1: yMax }, { x0: Math.min(W - 34, r + 10), x1: W, y1: yMax }];
  }
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function spot(z){ var c = (z.x0 + z.x1) / 2, w = z.x1 - z.x0; return { x: c + rnd(-.18, .18) * w, y: rnd(Math.min(18, z.y1 * .35), z.y1 * 0.55), z: z }; }
  function burst(x, y, hero, t, z){
    var pal = PAL[(Math.random() * PAL.length) | 0], scale = Math.min(1, H / 96) * (W <= 640 ? 0.8 : 1);
    var n = hero ? 54 : 20, spd = (hero ? 2.5 : 1.45) * scale;
    if (z) { spd = Math.min(spd, Math.max(.6, Math.min(x - z.x0, z.x1 - x) / 27)); if (W <= 640) spd = Math.min(spd, Math.max(.6, (z.y1 + 14 - y) / 27)); } // radius ~= spd*26: stay inside the side zone
    for (var i = 0; i < n && P.length < MAXP; i++) {
      var a = Math.PI * 2 * i / n + rnd(-.08, .08), v = spd * rnd(.82, 1.08);
      P.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, d: hero ? rnd(.008, .012) : rnd(.016, .022), c: pal[0], g: hero });
    }
    if (hero) {
      for (var j = 0; j < 22 && P.length < MAXP; j++) { var a2 = Math.PI * 2 * j / 22, v2 = spd * .48; P.push({ x: x, y: y, vx: Math.cos(a2) * v2, vy: Math.sin(a2) * v2, l: 1, d: .016, c: pal[1], g: false }); }
      Q.push({ t: t + 650, f: function(){ for (var k = 0; k < 16 && C.length < MAXC; k++) { var aa = rnd(0, 6.283), rr = rnd(.3, 1) * spd * 26; C.push({ x: x + Math.cos(aa) * rr, y: y + Math.sin(aa) * rr + 8, l: 1, d: rnd(.06, .1), s: rnd(1.5, 3) }); } } });
    }
    F.push({ x: x, y: y, r: (hero ? 190 : 90) * scale, a: hero ? .34 : .16, c: pal[0] });
  }
  function rocket(z, hero){ var s = spot(z); R.push({ x: s.x, y: H + 2, ty: s.y, vy: -Math.max(2.2, H * .03), hero: hero, z: z }); }
  function loop(t){
    raf = null; if (!running) return;
    var dt = last ? Math.min(2.5, (t - last) / 16.67) : 1; last = t;
    if (CONFIG.fireworks) {
      if (t > nextHero) { rocket(zones[(Math.random() * 2) | 0], true); nextHero = t + rnd(6000, 9000); }
      if (t > nextSmall) { var z = zones[(Math.random() * 2) | 0], s = spot(z); burst(s.x, s.y, false, t, z); nextSmall = t + rnd(1700, 3000); }
    }
    for (var q = Q.length - 1; q >= 0; q--) if (t >= Q[q].t) { Q[q].f(); Q.splice(q, 1); }
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var f = F.length - 1; f >= 0; f--) {
      var fl = F[f], gr = ctx.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, fl.r);
      gr.addColorStop(0, fl.c); gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = fl.a; ctx.fillStyle = gr; ctx.fillRect(fl.x - fl.r, fl.y - fl.r, fl.r * 2, fl.r * 2);
      fl.a -= .012 * dt; if (fl.a <= 0) F.splice(f, 1);
    }
    ctx.globalAlpha = 1; ctx.lineCap = 'round';
    for (var i = R.length - 1; i >= 0; i--) {
      var r = R[i]; r.y += r.vy * dt;
      ctx.strokeStyle = 'rgba(255,214,120,.95)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + 10); ctx.stroke();
      if (G.length < MAXG && Math.random() < .5) G.push({ x: r.x + rnd(-1, 1), y: r.y + 8, vx: 0, vy: .3, l: .7, d: .05, w: rnd(0, 6) });
      if (r.y <= r.ty) { burst(r.x, r.y, r.hero, t, r.z); R.splice(i, 1); }
    }
    for (var j = P.length - 1; j >= 0; j--) {
      var p = P[j]; p.vx *= .962; p.vy = p.vy * .962 + .028 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.l -= p.d * dt;
      if (p.l <= 0) { P.splice(j, 1); continue; }
      if (p.g && p.l < .8 && G.length < MAXG && Math.random() < .22) G.push({ x: p.x, y: p.y, vx: p.vx * .15, vy: .25, l: 1, d: rnd(.02, .035), w: rnd(0, 6) });
      ctx.globalAlpha = Math.min(1, p.l * 1.15); ctx.strokeStyle = p.c; ctx.lineWidth = p.g ? 2 : 1.6;
      ctx.beginPath(); ctx.moveTo(p.x - p.vx * 3.2, p.y - p.vy * 3.2); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
    ctx.fillStyle = '#FFE7A8';
    for (var g = G.length - 1; g >= 0; g--) {
      var e = G[g]; e.vy += .012 * dt; e.x += e.vx * dt; e.y += e.vy * dt; e.l -= e.d * dt;
      if (e.l <= 0 || e.y > H) { G.splice(g, 1); continue; }
      ctx.globalAlpha = e.l * (.45 + .55 * Math.abs(Math.sin(t * .02 + e.w))); ctx.fillRect(e.x - .8, e.y - .8, 1.6, 1.6);
    }
    ctx.fillStyle = '#FFFFFF';
    for (var c = C.length - 1; c >= 0; c--) {
      var k = C[c]; k.l -= k.d * dt; if (k.l <= 0) { C.splice(c, 1); continue; }
      ctx.globalAlpha = k.l; var sz = k.s * (1.4 - k.l * .4);
      ctx.fillRect(k.x - sz, k.y - .5, sz * 2, 1); ctx.fillRect(k.x - .5, k.y - sz, 1, sz * 2);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(loop);
  }
  function start(){ if (!ctx || running || document.hidden) return; running = true; last = 0; raf = requestAnimationFrame(loop); }
  function stop(){ running = false; if (raf) cancelAnimationFrame(raf); raf = null; }
  if (ctx) {
    size();
    fx = { sparkle: function(x, y){ var pal = PAL[0]; for (var i = 0; i < 26 && P.length < MAXP; i++) { var a = rnd(0, 6.283), v = rnd(1, 2.4); P.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, d: .03, c: i % 2 ? pal[0] : pal[1], g: false }); } } };
    // one-time celebration on first load
    var t0 = performance.now();
    Q.push({ t: t0 + 300, f: function(){ var a = spot(zones[0]), b = spot(zones[1]); burst(a.x, a.y, true, performance.now(), a.z); burst(b.x, b.y, true, performance.now(), b.z); } });
    Q.push({ t: t0 + 900, f: function(){ var a = spot(zones[1]); burst(a.x, a.y, false, performance.now(), a.z); } });
    Q.push({ t: t0 + 1300, f: function(){ var a = spot(zones[0]); burst(a.x, a.y, false, performance.now(), a.z); } });
    nextHero = t0 + rnd(6500, 8000); nextSmall = t0 + 2200;
  }
  // pause animation work while the tab is in the background (the bar itself always stays visible)
  function sync(){ bar.classList.toggle('fyt-dw-paused', document.hidden); if (document.hidden) stop(); else start(); }
  document.addEventListener('visibilitychange', sync);
  var rz; function onResize(){ clearTimeout(rz); rz = setTimeout(function(){ size(); buildLights(); schedulePlace(); }, 120); }
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(bar); else window.addEventListener('resize', onResize);

  tick(); if (end - Date.now() > 0) timerId = setInterval(tick, 1000);
  start();
  return function teardown(){ try { stop(); } catch(e){} if (timerId) clearInterval(timerId); document.removeEventListener('visibilitychange', sync); };
}
