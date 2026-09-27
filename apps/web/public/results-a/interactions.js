
(() => {
  const head = document.getElementById('head');
  const onScroll = () => head.classList.toggle('is-scrolled', window.scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('hero').classList.add('is-in')));
  const dock = document.getElementById('dock');
  new IntersectionObserver(([e]) => {
    const on = !e.isIntersecting && e.boundingClientRect.top < 0;
    dock.classList.toggle('is-on', on); dock.setAttribute('aria-hidden', String(!on));
    dock.querySelector('a').tabIndex = on ? 0 : -1;
  }).observe(document.getElementById('heroCta'));
  const fin = document.getElementById('book-final'); if (fin) new IntersectionObserver(([e]) => document.body.classList.toggle('at-final', e.isIntersecting), { threshold: .15 }).observe(fin);
})();
(() => {
  const cases = [["9","10","Daniel K.","The check-ins kept me motivated, and my smile changed exactly as the plan showed. I’m really pleased with the result.","Dr Amelia Hart","GDC 251837"],["11","12","Sophie L.","I wanted straighter teeth without making treatment a big part of my life. The aligners fitted easily around everything.","Dr Hamzah","GDC 277550"],["13","14","Adam J.","My front teeth had bothered me for years. Now I smile naturally without thinking about how my teeth look.","Dr Amelia Hart","GDC 251837"],["15","16","Claire B.","I thought I had left it too late to straighten my teeth. The process was comfortable, supportive and easier than expected.","Dr Hamzah","GDC 277550"],["17","18","James T.","The treatment plan gave me a clear timeline from the beginning. Everything stayed on track, with support whenever I needed it.","Dr Amelia Hart","GDC 251837"],["19","20","Hannah W.","My teeth were something I always noticed in photos. Now my smile is the first thing I actually like about them.","Dr Hamzah","GDC 277550"],["21","22","Emily R.","I could see a difference within the first few trays. The whole process felt simple, clear and completely manageable.","Dr Amelia Hart","GDC 251837"]];
  const $ = id => document.getElementById(id);
  const caseSrc = n => document.querySelectorAll('#strip img')[n - 9]?.src || '';
  const file = $('file'), print = $('print'); if (!file || !print) return;
  let cur = 0, busy = false;
  const show = i => {
    if (busy) return; const n = (i + cases.length) % cases.length; if (n === cur) return;
    busy = true; cur = n; const c = cases[cur];
    file.classList.add('is-swap'); print.classList.add('is-swap');
    setTimeout(() => {
      $('imgB').src = caseSrc(c[0]); $('imgA').src = caseSrc(c[1]);
      $('imgB').alt = c[2] + ' before treatment'; $('imgA').alt = c[2] + ' after treatment';
      $('quote').textContent = c[3]; $('who').firstChild.textContent = c[2] + ' '; $('dr').textContent = c[4]; $('gdc').textContent = c[5];
      $('cur').textContent = String(cur + 1).padStart(2, '0');
      document.querySelectorAll('#strip button').forEach((b, k) => b.setAttribute('aria-current', String(k === cur)));
      file.classList.remove('is-swap'); print.classList.remove('is-swap'); busy = false;
    }, 440);
  };
  const mc = document.getElementById('mCases'); if (mc) mc.innerHTML = cases.map(c => '<article class="mc"><div class="pair"><figure><img src="' + caseSrc(c[0]) + '" alt=""><figcaption>Before</figcaption></figure><figure><img src="' + caseSrc(c[1]) + '" alt=""><figcaption>After</figcaption></figure></div><q>' + c[3] + '</q><p class="who"><b>' + c[2] + '</b><span><b>Signed by</b>' + c[4] + ' · ' + c[5] + '</span></p></article>').join('');
  $('prev').addEventListener('click', () => show(cur - 1));
  $('next').addEventListener('click', () => show(cur + 1));
  document.querySelectorAll('#strip button').forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
})();

(() => {
  // Variants: ?results=a|b in the URL, or press V for the switcher
  const q = new URLSearchParams(location.search);
  const set = (key, v) => {
    document.querySelectorAll('[data-v^="' + key + ':"]').forEach(el => el.classList.toggle('is-on', el.dataset.v === key + ':' + v));
    document.querySelectorAll('#vsw button[data-set^="' + key + ':"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.set === key + ':' + v)));
    q.set(key, v); history.replaceState(null, '', '?' + q.toString());
  };
  set('results', q.get('results') === 'b' ? 'b' : 'a');
  document.querySelectorAll('#vsw button').forEach(b => b.addEventListener('click', () => { const [k, v] = b.dataset.set.split(':'); set(k, v); }));
  addEventListener('keydown', e => { if (e.key.toLowerCase() === 'v' && !/input|textarea/i.test(e.target.tagName)) document.getElementById('vsw').classList.toggle('is-open'); });
  const rail = document.getElementById('rail'); if (!rail) return;
  const step = () => rail.querySelector('.rc').getBoundingClientRect().width + 16;
  document.getElementById('railPrev').addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  document.getElementById('railNext').addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
  const prog = document.getElementById('prog');
  const upd = () => { const max = rail.scrollWidth - rail.clientWidth; const w = Math.max(rail.clientWidth / rail.scrollWidth, .12); prog.style.width = (w * 100) + '%'; prog.style.transform = 'translateX(' + (max ? (rail.scrollLeft / max) * (1 / w - 1) * 100 : 0) + '%)'; };
  rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
})();

(() => {
  const steps = [...document.querySelectorAll('#steps .step')]; if (!steps.length) return;
  steps.forEach((s, i) => { const src = document.querySelector('#frame img[data-k="' + s.dataset.img + '"]'); if (!src) return; const w = document.createElement('div'); w.className = 'm-img'; w.innerHTML = '<img src="' + src.getAttribute('src') + '" alt="" class="' + (src.className.replace('is-on', '').trim()) + '"><span class="n num">0' + (i + 1) + '</span>'; s.insertBefore(w, s.firstChild); });
  const list = document.getElementById('steps'), big = document.getElementById('bigN'), imgs = [...document.querySelectorAll('#frame img')];
  let cur = 0;
  const setOn = i => { if (i === cur) return; cur = i; steps.forEach((s, k) => s.classList.toggle('is-on', k === i)); big.textContent = '0' + (i + 1); const tag = document.getElementById('stageTag'); if (tag) tag.textContent = steps[i].querySelector('.stage-label').textContent; const k = steps[i].dataset.img; imgs.forEach(im => im.classList.toggle('is-on', im.dataset.k === k)); };
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
  const why = document.getElementById('why'); if (why) { const wio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { why.classList.add('is-in'); wio.disconnect(); } }), { threshold: 0, rootMargin: '0px 0px -20% 0px' }); wio.observe(why.querySelector('.why-head')); }
})();
(() => {
  document.querySelectorAll('.q').forEach(d => { const a = d.querySelector('.a'); const sync = () => { a.style.maxHeight = d.open ? a.scrollHeight + 'px' : '0px'; }; d.addEventListener('toggle', sync); sync(); addEventListener('resize', sync); });
  const fin = document.getElementById('book-final'); if (fin) { const fo = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fin.classList.add('is-in'); fo.disconnect(); } }), { threshold: 0, rootMargin: '0px 0px -20% 0px' }); fo.observe(fin.querySelector('.in')); }
})();
(() => {
  document.querySelectorAll('.reel').forEach(r => {
    const v = r.querySelector('video');
    const go = () => { if (r.classList.contains('is-playing')) return; const src = r.dataset.video; if (!src) { r.classList.add('is-soon'); setTimeout(() => r.classList.remove('is-soon'), 2200); return; }
      document.querySelectorAll('.reel.is-playing').forEach(o => { o.classList.remove('is-playing'); o.querySelector('video').pause(); });
      v.src = src; r.classList.add('is-playing'); v.play(); };
    r.addEventListener('click', e => { if (e.target === v) return; go(); });
    r.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    v.addEventListener('ended', () => r.classList.remove('is-playing'));
  });
})();
