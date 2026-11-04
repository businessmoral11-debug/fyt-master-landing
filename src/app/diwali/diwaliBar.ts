// @ts-nocheck
/* Diwali Special top bar logic (countdown, copy, fireworks, lights). Mounted by DiwaliPromoBar. */
export interface DwConfig { endDate:string; rollingDays:number|null; couponCode:string; headline:string; ctaText:string; ctaUrl:string; ctaNewTab:boolean; whenEnded:string; endedText:string; sticky:boolean; showClose:boolean; fireworks:boolean }
export function mountDiwaliBar(bar: HTMLElement, CONFIG: DwConfig): () => void {


  var $ = function(s){ return bar.querySelector(s); };
  var store = function(type){ try { var s = window[type]; s.setItem('fyt-dw-t','1'); s.removeItem('fyt-dw-t'); return s; } catch(e){ return null; } };
  var LS = store('localStorage'), SS = store('sessionStorage');

  if (CONFIG.showClose && SS && SS.getItem('fyt-dw-closed') === '1') { bar.classList.add('fyt-dw-hidden'); return; }
  if (CONFIG.sticky) bar.classList.add('fyt-dw-sticky');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- copy into DOM ---- */
  var hl = String(CONFIG.headline), ci = hl.indexOf(':');
  var eyebrow = ci > -1 ? hl.slice(0, ci).trim() : '', main = ci > -1 ? hl.slice(ci + 1).trim() : hl;
  $('.fyt-dw-eyetxt').textContent = eyebrow;
  if (!eyebrow) $('.fyt-dw-eyebrow').style.display = 'none';
  $('.fyt-dw-head').textContent = main;
  $('.fyt-dw-text').setAttribute('aria-label', hl); $('.fyt-dw-text').setAttribute('role','text');
  $('.fyt-dw-code').textContent = CONFIG.couponCode;
  var ticket = $('.fyt-dw-ticket');
  ticket.setAttribute('aria-label', 'Copy coupon code ' + CONFIG.couponCode);
  var cta = $('.fyt-dw-cta');
  cta.href = CONFIG.ctaUrl; $('.fyt-dw-ctatxt').textContent = CONFIG.ctaText;
  if (CONFIG.ctaNewTab) { cta.target = '_blank'; cta.rel = 'noopener'; }
  $('.fyt-dw-over').textContent = CONFIG.endedText;

  /* ---- close ---- */
  var closeBtn = $('.fyt-dw-close');
  if (!CONFIG.showClose) closeBtn.parentNode.removeChild(closeBtn);
  else closeBtn.addEventListener('click', function(){ if (SS) SS.setItem('fyt-dw-closed','1'); teardown(); bar.classList.add('fyt-dw-hidden'); });

  /* ---- countdown ---- */
  var end;
  if (CONFIG.rollingDays) {
    var key = 'fyt-dw-first-visit', first = LS && parseInt(LS.getItem(key), 10);
    if (!first) { first = Date.now(); if (LS) LS.setItem(key, String(first)); }
    end = first + CONFIG.rollingDays * 864e5;
  } else end = new Date(CONFIG.endDate).getTime();
  var tiles = {}; ['d','h','m','s'].forEach(function(u){ tiles[u] = bar.querySelector('.fyt-dw-tile[data-u="'+u+'"]'); });
  var prev = {}, lastMin = -1, timerId = null, srT = $('.fyt-dw-timesr');
  var pad = function(n){ return n < 10 ? '0' + n : '' + n; };
  function tick(){
    var left = Math.max(0, end - Date.now());
    if (left <= 0) { endOffer(); return; }
    var s = Math.floor(left / 1000), v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (var u in v) if (prev[u] !== v[u]) {
      var t = tiles[u], n = t.querySelector('.fyt-dw-num'); n.textContent = pad(v[u]);
      if (!reduce && prev[u] !== undefined) { t.classList.remove('fyt-dw-tick'); void t.offsetWidth; t.classList.add('fyt-dw-tick'); }
      prev[u] = v[u];
    }
    var totalMin = Math.floor(s / 60);
    if (totalMin !== lastMin) { // announce at most once a minute
      lastMin = totalMin;
      srT.textContent = 'Offer ends in ' + v.d + ' days, ' + v.h + ' hours, ' + v.m + ' minutes';
    }
  }
  function endOffer(){
    clearInterval(timerId); timerId = null;
    if (CONFIG.whenEnded === 'hide') { teardown(); bar.classList.add('fyt-dw-hidden'); return; }
    bar.classList.add('fyt-dw-ended'); srT.textContent = CONFIG.endedText;
  }
  tick(); if (end - Date.now() > 0) timerId = setInterval(tick, 1000);

  /* ---- copy coupon ---- */
  var copySr = $('.fyt-dw-copysr'), codeEl = $('.fyt-dw-code'), stubTxt = $('.fyt-dw-stubtxt'), resetT;
  function legacyCopy(text){
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly','');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    var ok = false; try { ok = document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta); return ok;
  }
  function selectCode(){ try { var r = document.createRange(); r.selectNodeContents(codeEl); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch(e){} }
  function copied(ok){
    clearTimeout(resetT);
    if (ok) {
      ticket.classList.add('fyt-dw-copied'); codeEl.textContent = 'Copied!'; stubTxt.textContent = 'Done';
      copySr.textContent = 'Coupon code ' + CONFIG.couponCode + ' copied to clipboard';
      burstAt(ticket);
    } else {
      selectCode(); copySr.textContent = 'Press Ctrl+C or Cmd+C to copy code ' + CONFIG.couponCode;
    }
    resetT = setTimeout(function(){ ticket.classList.remove('fyt-dw-copied'); codeEl.textContent = CONFIG.couponCode; stubTxt.textContent = 'Code'; copySr.textContent = ''; }, 2200);
  }
  ticket.addEventListener('click', function(){
    var code = CONFIG.couponCode;
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(function(){ copied(true); }, function(){ copied(legacyCopy(code)); });
    else copied(legacyCopy(code));
  });

  /* ---- fairy lights along the bottom edge ---- */
  var lights = $('.fyt-dw-lights'), COLORS = ['#FFC845','#FF9933','#FF5C7A','#7CFFB2','#FFE29A','#6FB6FF'];
  function buildLights(){
    var w = bar.clientWidth, gap = w < 640 ? 30 : 38, n = Math.min(60, Math.ceil(w / gap) + 1), path = 'M0 2', html = '';
    for (var i = 0; i < n; i++) {
      var x = i * gap; path += ' Q' + (x + gap / 2) + ' 10 ' + (x + gap) + ' 2';
      var bx = x + gap / 2;
      html += '<span class="fyt-dw-bulb" style="left:' + bx + 'px;--c:' + COLORS[i % COLORS.length] + ';animation-delay:' + (-(i * 0.37) % 2.2).toFixed(2) + 's"></span>';
    }
    lights.innerHTML = '<svg class="fyt-dw-wire" viewBox="0 0 ' + w + ' 12" preserveAspectRatio="none"><path d="' + path + '" fill="none" stroke="rgba(255,226,154,.45)" stroke-width="1"/></svg>' + html;
  }
  // bulbs hang at the bottom of each scallop (y≈7)
  buildLights();

  /* ---- fireworks canvas ---- */
  var cv = $('.fyt-dw-fx'), ctx = cv.getContext && cv.getContext('2d'), W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var rockets = [], parts = [], MAX_P = 180, raf = null, nextLaunch = 0, running = false, onScreen = true, last = 0;
  var FW = ['#FFC845','#FF9933','#FFE29A','#FF5C7A','#FFFFFF','#7CFFB2'];
  function size(){ W = bar.clientWidth; H = bar.clientHeight; if (!ctx) return; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); ctx.setTransform(DPR,0,0,DPR,0,0); }
  function launch(){
    if (rockets.length >= 2) return;
    rockets.push({ x: W * (0.06 + Math.random() * 0.88), y: H + 4, vy: -(H * 0.028 + Math.random() * 0.6), ty: H * (0.18 + Math.random() * 0.3), c: FW[(Math.random() * FW.length) | 0] });
  }
  function burst(x, y, c, n, spd){
    n = Math.min(n, MAX_P - parts.length);
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n + Math.random() * 0.2, v = spd * (0.6 + Math.random() * 0.5);
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: 0.009 + Math.random() * 0.009, c: Math.random() < 0.25 ? '#FFF6D8' : c });
    }
  }
  function burstAt(el){
    if (reduce || !ctx) return;
    var b = bar.getBoundingClientRect(), r = el.getBoundingClientRect();
    burst(r.left - b.left + r.width / 2, r.top - b.top + r.height / 2, '#FFC845', 34, 2.6);
    if (!raf && running) loop(performance.now());
  }
  function loop(t){
    raf = null; if (!running) return;
    var dt = Math.min(2.5, (t - (last || t)) / 16.67 || 1); last = t;
    if (CONFIG.fireworks && t > nextLaunch) { launch(); nextLaunch = t + 1200 + Math.random() * 1600; }
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i]; r.y += r.vy * dt;
      ctx.strokeStyle = 'rgba(255,214,120,.95)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + 9); ctx.stroke();
      if (r.y <= r.ty) { burst(r.x, r.y, r.c, 28 + ((Math.random() * 10) | 0), 2.7 + Math.random() * 0.9); rockets.splice(i, 1); }
    }
    for (var j = parts.length - 1; j >= 0; j--) {
      var p = parts[j]; p.vx *= 0.965; p.vy = p.vy * 0.965 + 0.035 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt;
      if (p.life <= 0) { parts.splice(j, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life * 1.1); ctx.strokeStyle = p.c; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.fillStyle = p.c; ctx.fillRect(p.x - 1.2, p.y - 1.2, 2.4, 2.4);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(loop);
  }
  function start(){ if (reduce || !ctx || running || document.hidden || !onScreen) return; running = true; last = 0; raf = requestAnimationFrame(loop); }
  function stop(){ running = false; if (raf) cancelAnimationFrame(raf); raf = null; }
  size();
  var pauseCss = document.createElement('style'); pauseCss.textContent = '#fyt-dw-bar.fyt-dw-paused *,#fyt-dw-bar.fyt-dw-paused *::before,#fyt-dw-bar.fyt-dw-paused *::after{animation-play-state:paused!important}';
  bar.appendChild(pauseCss);
  function sync(){ var p = document.hidden || !onScreen; bar.classList.toggle('fyt-dw-paused', p); if (p) stop(); else start(); }
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(function(e){ onScreen = e[0].isIntersecting; sync(); }).observe(bar);
  var rz; function onResize(){ clearTimeout(rz); rz = setTimeout(function(){ size(); buildLights(); }, 120); }
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(bar); else window.addEventListener('resize', onResize);
  start();
  function teardown(){ stop(); clearInterval(timerId); document.removeEventListener('visibilitychange', sync); }
  return teardown;
}
