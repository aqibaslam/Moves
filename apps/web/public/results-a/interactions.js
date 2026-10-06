(() => {
  const ATTR_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'];
  const ATTR_STORE = 'mv-attribution';
  const sendMeta = (method, event, params = {}, options) => {
    if (typeof window.fbq === 'function') {
      if (options) window.fbq(method, event, params, options);
      else window.fbq(method, event, params);
      return;
    }
    window.__movesMetaQueue = window.__movesMetaQueue || [];
    window.__movesMetaQueue.push([method, event, params, options]);
  };
  const currentParams = new URLSearchParams(location.search);
  const pageVariant = document.querySelector('.results-a-page')?.dataset.landingPageVariant || 'results-a';
  let attribution = {};
  try { attribution = JSON.parse(localStorage.getItem(ATTR_STORE) || '{}'); } catch (err) {}
  ATTR_KEYS.forEach(key => { const value = currentParams.get(key); if (value) attribution[key] = value.slice(0, key === 'fbclid' ? 500 : 200); });
  attribution.landing_page_variant = currentParams.get('results') || pageVariant;
  try { localStorage.setItem(ATTR_STORE, JSON.stringify(attribution)); } catch (err) {}
  document.querySelectorAll('a[href^="/book"]').forEach((a, index) => {
    const url = new URL(a.href, location.href);
    ATTR_KEYS.forEach(key => { if (attribution[key]) url.searchParams.set(key, attribution[key]); });
    url.searchParams.set('lp', attribution.landing_page_variant);
    url.searchParams.set('from', location.pathname);
    a.href = url.pathname + url.search;
    a.addEventListener('click', () => sendMeta('trackCustom', 'ConsultationCTA', {
      landing_page_variant: attribution.landing_page_variant,
      cta_position: a.id || `cta-${index + 1}`
    }), { once:true });
  });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event:'lander_view', landing_page_variant:attribution.landing_page_variant, utm_source:attribution.utm_source || '', utm_campaign:attribution.utm_campaign || '' });
  window.dispatchEvent(new CustomEvent('moves:lander', { detail:{ event:'lander_view', landing_page_variant:attribution.landing_page_variant } }));
  sendMeta('track', 'ViewContent', { content_name:'Clear aligners paid landing', content_category:'Clear aligners' });
  sendMeta('trackCustom', 'LandingPageView', { landing_page_variant:attribution.landing_page_variant });
  const head = document.getElementById('head');
  const onScroll = () => head.classList.toggle('is-scrolled', window.scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('hero').classList.add('is-in')));
  setTimeout(() => document.getElementById('hero').classList.add('is-in'), 400);
  const reveal = () => document.querySelectorAll('#book-final,#first,#why,#prices').forEach(s => { if (!s.classList.contains('is-in') && s.getBoundingClientRect().top < innerHeight * .8) s.classList.add('is-in'); });
  addEventListener('scroll', reveal, { passive: true }); addEventListener('load', reveal);
  const dock = document.getElementById('dock');
  new IntersectionObserver(([e]) => {
    const on = !e.isIntersecting && e.boundingClientRect.top < 0;
    dock.classList.toggle('is-on', on); dock.setAttribute('aria-hidden', String(!on));
    dock.querySelector('a').tabIndex = on ? 0 : -1;
  }).observe(document.getElementById('heroCta'));
  const fin = document.getElementById('book-final'); if (fin) new IntersectionObserver(([e]) => document.body.classList.toggle('at-final', e.isIntersecting), { threshold: .15 }).observe(fin);
})();
(() => {
  const box = document.getElementById('fxOpts'); if (!box) return;
  const T = [['c1',15.3,13,17,24,1],['l1',29.8,12,18.5,21.5,0],['i1',43.3,16,16,26,0],['i2',60.8,16,16,26,0],['l2',78.3,12,18.5,21.5,0],['c2',91.8,13,17,24,1]];
  const LOW = [38.5,49.5,60.5,71.5];
  const C = { drift:{l2:[4,1.5,9,1],c2:[2,0,0]}, gaps:{c1:[-3,0,0],l1:[-2.2,0,0],i1:[-1.6,0,0,1],i2:[1.6,0,0,1],l2:[2.2,0,0],c2:[3,0,0]}, crowd:{l1:[2.5,1,-10,1],i1:[0,0,-3],i2:[-1.5,1.5,7,1]}, bite:{i1:[0,0,-3],l2:[-1,0,5],low:[-5,-3,0,1]}, unsure:{} };
  const f = n => Math.round(n * 10) / 10;
  const up = (x,m,w,hh,can) => { const y0 = m - 8, y1 = m + hh, t = .6, r = 3;
    return can ? 'M'+f(x)+' '+f(y0)+'H'+f(x+w)+'L'+f(x+w-t)+' '+f(y1-6)+'Q'+f(x+w-1)+' '+f(y1-2)+' '+f(x+w/2+1)+' '+f(y1)+'Q'+f(x+w/2)+' '+f(y1+.6)+' '+f(x+w/2-1)+' '+f(y1)+'Q'+f(x+1)+' '+f(y1-2)+' '+f(x+t)+' '+f(y1-6)+'Z'
      : 'M'+f(x)+' '+f(y0)+'H'+f(x+w)+'L'+f(x+w-t)+' '+f(y1-r)+'Q'+f(x+w-t)+' '+f(y1)+' '+f(x+w-t-r)+' '+f(y1)+'H'+f(x+t+r)+'Q'+f(x+t)+' '+f(y1)+' '+f(x+t)+' '+f(y1-r)+'Z'; };
  const lo = x => { const y = 36, w = 10, r = 3; return 'M'+x+' 60V'+(y+r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'H'+(x+w-r)+'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+r)+'V60Z'; };
  const gumLine = 'M15.3 20.5' + T.map(t => 'L'+f(t[1])+' '+f(t[3]+3.5)+'Q'+f(t[1]+t[2]/2)+' '+f(t[3]-4.5)+' '+f(t[1]+t[2])+' '+f(t[3]+3.5)).join('');
  const svg = c => { const m = C[c] || {}, bite = c === 'bite'; const st = v => (v && v[3] ? ' data-hl' : '') + (v ? ' style="--x:'+v[0]+';--y:'+v[1]+';--r:'+v[2]+'"' : '');
    let s = '<svg viewBox="8 4 104 52" preserveAspectRatio="xMaxYMid meet" class="teeth'+(c === 'unsure' ? ' is-scan' : '')+'" aria-hidden="true" focusable="false">';
    if (bite) s += '<g class="tt"'+st(m.low)+'>'+LOW.map(x => '<path d="'+lo(x)+'"/>').join('')+'</g><path class="gum" d="M0 70V49Q60 58 120 49V70Z"/><path class="gl" d="M30 51.5Q60 56 90 51.5"/>';
    s += T.map(t => '<g class="tt"'+st(m[t[0]])+'><path d="'+up(t[1],t[3],t[2],t[4],t[5])+'"/></g>').join('');
    s += '<path class="gum" d="M0 22L'+gumLine.slice(1)+'L120 22V0H0Z"/><path class="gl" d="'+gumLine+'"/>';
    if (c === 'unsure') s += '<line class="scan" x1="0" y1="12" x2="0" y2="46"/>';
    return s + '</svg>'; };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { box.classList.add('is-idle'); const wake = () => box.classList.remove('is-idle'); ['pointerenter','focusin','change'].forEach(ev => box.addEventListener(ev, wake, { once: true })); }
  box.querySelectorAll('.opt').forEach(o => { const t = document.createElement('span'); t.className = 'tv'; t.setAttribute('aria-hidden', 'true'); t.innerHTML = svg(o.querySelector('input').value); o.appendChild(t); });
  const M = { one:['ONE',1,'£63','a month · or £1,895','For one or two teeth that have drifted, often after braces.'], core:['CORE',2,'£78','a month · or £2,350','For small gaps, mild crowding or a few teeth out of line.'], complete:['COMPLETE',3,'£107','a month · or £3,200','For noticeable crowding, with a bite that needs correcting.'] };
  const map = { drift:'one', gaps:'core', crowd:'core', bite:'complete' };
  const res = document.getElementById('fxRes'), $ = id => document.getElementById(id);
  box.addEventListener('change', e => {
    const v = e.target.value, unsure = v === 'unsure', m = M[map[v] || 'one']; try { localStorage.setItem('mv-fx', v); } catch (err) {} document.querySelectorAll('a[href^="/book"]').forEach(a => { const u = new URL(a.href, location.href); u.searchParams.set('fx', v); a.href = u.pathname + u.search; });
    res.classList.add('is-swap');
    setTimeout(() => {
      $('fxK').textContent = unsure ? 'Where you could start' : 'Your likely Move';
      $('fxName').innerHTML = unsure ? 'From <span>ONE</span>' : 'MOVES <span>' + m[0] + '</span>';
      $('fxBars').querySelectorAll('i').forEach((b, k) => b.classList.toggle('on', k < (unsure ? 1 : m[1])));
      $('fxP').textContent = m[2]; $('fxS').textContent = m[3];
      $('fxWhy').textContent = unsure ? 'That’s what the free video consultation is for. We’ll tell you honestly.' : m[4] + ' Confirmed on your free video consultation.';
      res.classList.remove('is-swap');
      document.querySelectorAll('.tier[data-m]').forEach(t => t.classList.toggle('is-pick', !unsure && t.dataset.m === map[v]));
    }, 200);
  });
})();
(() => {
  const steps = [...document.querySelectorAll('#steps .step')]; if (!steps.length) return;
  steps.forEach((s, i) => { const src = document.querySelector('#frame img[data-k="' + s.dataset.img + '"]'); if (!src) return; const w = document.createElement('div'); w.className = 'm-img'; w.innerHTML = '<img src="' + src.getAttribute('src') + '" alt="" loading="lazy" class="' + (src.className.replace('is-on', '').trim()) + '"><span class="n num">0' + (i + 1) + '</span>'; s.insertBefore(w, s.firstChild); });
  const list = document.getElementById('steps'), big = document.getElementById('bigN'), imgs = [...document.querySelectorAll('#frame img')];
  let cur = 0;
  const setOn = i => { if (i === cur) return; cur = i; steps.forEach((s, k) => s.classList.toggle('is-on', k === i)); big.textContent = '0' + (i + 1); const tag = document.getElementById('stageTag'); if (tag) tag.textContent = steps[i].querySelector('.stage-label').textContent; const k = steps[i].dataset.img; imgs.forEach(im => im.classList.toggle('is-on', im.dataset.k === k)); document.querySelectorAll('#prog6 i').forEach((b, n) => b.classList.toggle('on', n <= i)); };
  const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { list.classList.add('has-on'); setOn(+e.target.dataset.i); } }); }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  steps.forEach(s => io.observe(s));
})();



(() => {
  const pr = document.getElementById('prices'); if (!pr) return;
  const mo = document.getElementById('payMo'), up = document.getElementById('payUp'), ind = document.getElementById('segI'); let mode = 'mo';
  const place = () => { const b = mode === 'mo' ? mo : up; ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + b.offsetLeft + 'px)'; };
  const set = m => { if (m === mode) return; mode = m; pr.classList.add('is-swap'); mo.setAttribute('aria-pressed', String(m === 'mo')); up.setAttribute('aria-pressed', String(m === 'up')); place();
    setTimeout(() => { pr.querySelectorAll('.amt b[data-mo]').forEach(b => b.textContent = b.dataset[m]); pr.querySelectorAll('.amt .unit').forEach(u => u.textContent = m === 'mo' ? 'per month' : 'upfront'); pr.querySelectorAll('.amt .altw').forEach(u => u.textContent = m === 'mo' ? 'upfront' : 'at 0% APR'); pr.querySelectorAll('.amt .altp').forEach(u => u.textContent = m === 'mo' ? 'or ' : 'or from '); pr.classList.remove('is-swap'); }, 220); };
  mo.addEventListener('click', () => set('mo')); up.addEventListener('click', () => set('up')); place(); addEventListener('resize', place); if (document.fonts) document.fonts.ready.then(place);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { pr.classList.add('is-in'); io.disconnect(); } }), { threshold: 0, rootMargin: '0px 0px -20% 0px' }); io.observe(pr.querySelector('.pr-head'));
  const fm = document.getElementById('first'); if (fm) { const fio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fm.classList.add('is-in'); fio.disconnect(); } }), { threshold: 0, rootMargin: '0px 0px -20% 0px' }); fio.observe(fm.querySelector('.fmx')); }
  const why = document.getElementById('why'); if (why) { const wio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { why.classList.add('is-in'); wio.disconnect(); } }), { threshold: 0, rootMargin: '0px 0px -20% 0px' }); wio.observe(why.querySelector('.why-head')); }
})();
(() => {
  document.querySelectorAll('.q').forEach(d => { const a = d.querySelector('.a'); const sync = () => { a.style.maxHeight = d.open ? a.scrollHeight + 'px' : '0px'; }; d.addEventListener('toggle', sync); sync(); addEventListener('resize', sync); });
  const fin = document.getElementById('book-final'); if (fin) { const fo = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fin.classList.add('is-in'); fo.disconnect(); } }), { threshold: 0, rootMargin: '0px 0px -20% 0px' }); fo.observe(fin); }
})();
