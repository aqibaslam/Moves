(() => {
  document.documentElement.dataset.bookingVersion = '3';
  const $ = id => document.getElementById(id);
  const track = (event, detail = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...detail });
    window.dispatchEvent(new CustomEvent('moves:booking', { detail: { event, ...detail } }));
  };
  const DW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], DL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let D = [];
  const S = { di: 0, m: null };
  const clinicHour = iso => +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hour12: false }).format(new Date(iso));
  const G = [['Morning', s => clinicHour(s.startISO) < 12], ['Afternoon', s => clinicHour(s.startISO) >= 12 && clinicHour(s.startISO) < 17], ['Evening', s => clinicHour(s.startISO) >= 17]];
  const dayName = (x, i) => i === 0 && x.isToday ? 'Today' : i === 0 && x.isTomorrow ? 'Tomorrow' : i === 1 && x.isTomorrow ? 'Tomorrow' : DL[x.d.getDay()];
  const days = () => { $('days').innerHTML = D.map((x, i) => '<button type="button" class="day" role="tab" data-i="' + i + '" aria-selected="' + (i === S.di) + '"><b>' + dayName(x, i) + '</b><small>' + DW[x.d.getDay()] + ' ' + x.d.getDate() + ' ' + MN[x.d.getMonth()] + '</small><span class="left">' + (i === 0 ? 'Soonest ' + x.a[0].label + '<br>' : '') + (x.a.length === 1 ? 'Last time left' : x.a.length + ' left') + '</span></button>').join(''); };
  const times = () => { const a = D[S.di]?.a || []; $('times').innerHTML = G.map(g => { const t = a.filter(g[1]); if (!t.length) return ''; return '<div class="grp"><span class="label">' + g[0] + '</span><div class="tl">' + t.map((s, i) => '<button type="button" class="t num" data-i="' + a.indexOf(s) + '" aria-pressed="' + (S.m?.startISO === s.startISO) + '">' + s.label + '</button>').join('') + '</div></div>'; }).join(''); };
  const go = () => { const ok = !!S.m; $('go').classList.toggle('is-ready', ok); $('goB').disabled = !ok; $('goP').innerHTML = ok ? '<span>Your call · 45 min</span><b>' + dayName(D[S.di], S.di) + ', ' + S.m.label + '</b>' : '<span>Free · 45 min · Google Meet</span><b>Choose a time</b>'; };
  const localDate = date => new Date(date + 'T12:00:00');
  const dateKey = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(d);
  async function loadAvailability() {
    $('times').innerHTML = '<p class="none" style="color:var(--m60)">Loading available times…</p>';
    try {
      const res = await fetch('/api/booking/slots', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Availability unavailable');
      const now = new Date(), today = dateKey(now), tomorrow = dateKey(new Date(now.getTime() + 86400000));
      D = data.days.filter(x => x.times?.length).slice(0, 3).map(x => ({ d: localDate(x.date), a: x.times, isToday: x.date === today, isTomorrow: x.date === tomorrow }));
      if (!D.length) { $('days').innerHTML = ''; $('times').innerHTML = '<p class="none" style="color:var(--m60)">No times in the next few days. Check back tomorrow.</p>'; return; }
      S.di = 0; S.m = null; days(); times(); go();
    } catch (err) { $('days').innerHTML = ''; $('times').innerHTML = '<p class="none" style="color:var(--m60)">We couldn’t load available times. Please refresh and try again.</p>'; }
  }
  $('days').addEventListener('click', e => { const b = e.target.closest('.day'); if (!b || +b.dataset.i === S.di) return; S.di = +b.dataset.i; S.m = null; days(); $('times').classList.add('is-swap'); setTimeout(() => { times(); $('times').classList.remove('is-swap'); }, 200); go(); });
  $('times').addEventListener('click', e => { const b = e.target.closest('.t'); if (!b || !D[S.di]) return; S.m = D[S.di].a[+b.dataset.i]; times(); go(); track('slot_selected', { slot_start:S.m.startISO }); try { navigator.vibrate && navigator.vibrate(8); } catch (err) {} });
  const FX = { drift:'A tooth or two has drifted', gaps:'Small gaps', crowd:'A few teeth out of line', bite:'Crowding, and my bite', unsure:'Not sure yet' };
  let fx = new URLSearchParams(location.search).get('fx'); try { fx = fx || localStorage.getItem('mv-fx'); } catch (e) {}
  if (fx && FX[fx]) { $('told').hidden = false; $('told').innerHTML = '<span class="label">You told us</span> ' + FX[fx] + '. We’ll start there.'; }
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = n => {
    $('s1').hidden = n !== 1; $('s2').hidden = n !== 2; $('s3').hidden = n !== 3; document.body.classList.toggle('is-done', n === 3); $('backA').style.visibility = n === 3 ? 'hidden' : '';
    [...$('prog').children].forEach((b, i) => b.classList.toggle('on', i < n)); $('prog').setAttribute('aria-label', 'Step ' + n + ' of 3');
    $('capK').textContent = n === 1 ? 'First Movers' : n === 2 ? 'Almost there' : 'Booked';
    $('capT').textContent = n === 1 ? 'In treatment now. Your call is the first move.' : n === 2 ? 'A few details, then your call is booked.' : 'You’re one of the first Movers.';
    if (n === 2) { const t = dayName(D[S.di], S.di) + ', ' + S.m.label; $('heldT').textContent = t; $('go2T').textContent = t; }
    scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
    if (n === 3) setTimeout(() => $('ttl3').focus({ preventScroll: true }), 60);
    if (n === 2) setTimeout(() => { const f = $('fn'); if (matchMedia('(min-width: 761px)').matches) f.focus(); else $('ttl2').focus({ preventScroll: true }); }, 60);
  };
  $('goB').addEventListener('click', () => { if (S.m !== null) step(2); });
  $('held').addEventListener('click', () => step(1));
  $('backA').addEventListener('click', e => { if (!$('s2').hidden) { e.preventDefault(); step(1); } });
  $('addCode').addEventListener('click', e => { e.currentTarget.hidden = true; $('codeF').hidden = false; $('rc').focus(); });
  $('addNote').addEventListener('click', e => { e.currentTarget.hidden = true; $('noteF').hidden = false; $('nt').focus(); });
  const R = {
    fn: v => /^\p{L}(?:[\p{L}'’ \-]*\p{L})?$/u.test(v.trim()) && v.trim().length >= 2 ? '' : 'Add your first name.',
    ln: v => /^\p{L}(?:[\p{L}'’ \-]*\p{L})?$/u.test(v.trim()) && v.trim().length >= 2 ? '' : 'Add your last name.',
    em: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Check your email.',
    ph: v => /^07\d{9}$/.test(v.replace(/[^\d+]/g, '').replace(/^(?:\+44|0044|44)/, '0')) ? '' : 'Add a UK mobile, starting 07.',
    ag: v => !v ? 'Add your age.' : +v < 15 ? 'Aligners at MOVES start from 15.' : +v > 120 ? 'Check your age.' : ''
  };
  const chk = id => { const el = $(id), m = R[id](el.value), f = el.closest('.f'); f.classList.toggle('bad', !!m); f.classList.toggle('ok', !m); f.querySelector('.msg').textContent = m; el.setAttribute('aria-invalid', String(!!m)); return !m; };
  Object.keys(R).forEach(id => { $(id).addEventListener('blur', () => { if ($(id).value) chk(id); }); $(id).addEventListener('input', () => { if ($(id).closest('.f').classList.contains('bad')) chk(id); if (id === 'ag') { $('ag').value = $('ag').value.replace(/\D/g, ''); const n = +$('ag').value; $('u18').hidden = !(n >= 15 && n < 18); } }); });
  $('form').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { const ids = ['fn','ln','em','ph','ag'], i = ids.indexOf(e.target.id); if (i > -1 && i < ids.length - 1) { e.preventDefault(); $(ids[i + 1]).focus(); } } });
  $('form').addEventListener('submit', async e => { e.preventDefault(); const bad = Object.keys(R).filter(id => !chk(id)); if (bad.length) { track('booking_validation_error', { fields:bad }); $(bad[0]).focus(); return; }
    if (!S.m) { step(1); return; }
    const submit = $('go2').querySelector('.btn'), original = submit.textContent; submit.disabled = true; submit.textContent = 'Booking…';
    try {
      const payload = { firstName:$('fn').value.trim(), lastName:$('ln').value.trim(), email:$('em').value.trim(), phone:$('ph').value.trim(), age:$('ag').value, referralCode:$('rc').value.trim(), note:$('nt').value.trim(), concern:fx || '', slotStart:S.m.startISO, timezone:'Europe/London', consent:true };
      track('details_submitted', { slot_start:payload.slotStart, concern:payload.concern });
      const res = await fetch('/api/booking', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.ok) { if (res.status === 409) { step(1); await loadAvailability(); $('times').insertAdjacentHTML('afterbegin','<p class="none" role="alert">That time’s just gone. Here’s the next one.</p>'); return; } throw new Error(data.error || 'Booking failed'); }
      const x = D[S.di], st = new Date(data.confirmation.startISO), en = new Date(st.getTime() + 45 * 60000);
      $('cDay').textContent = dayName(x, S.di); $('cHd').textContent = DW[x.d.getDay()] + ' ' + x.d.getDate() + ' ' + MN[x.d.getMonth()]; $('cT').textContent = S.m.label; $('cD').textContent = DL[x.d.getDay()] + ' ' + x.d.getDate() + ' ' + MN[x.d.getMonth()]; $('cE').textContent = payload.email; $('nx1').innerHTML = '<span class="label">Next</span> Your call, ' + dayName(x, S.di) + ' at ' + S.m.label + '. Then choose your Move and book your scan.'; $('cName').textContent = (payload.firstName + ' ' + payload.lastName).trim(); $('cRef').textContent = 'No. ' + data.confirmation.appointmentId.replace(/^stub-/, 'MV-').slice(-16).toUpperCase();
      const z = t => t.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''), title = 'MOVES free video consultation', det = 'Your 45-minute video call with a MOVES expert. Your Google Meet link is in your confirmation email.';
      $('gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + z(st) + '/' + z(en) + '&details=' + encodeURIComponent(det);
      $('gcal').addEventListener('click', () => track('calendar_added', { provider:'google' }), { once:true });
      $('ics').onclick = () => { track('calendar_added', { provider:'ics' }); const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MOVES//Booking//EN','BEGIN:VEVENT','UID:' + data.confirmation.appointmentId + '@moves','DTSTAMP:' + z(new Date()),'DTSTART:' + z(st),'DTEND:' + z(en),'SUMMARY:' + title,'DESCRIPTION:' + det,'END:VEVENT','END:VCALENDAR'].join('\\r\\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'moves-consultation.ics'; a.click(); URL.revokeObjectURL(a.href); };
      try { sessionStorage.removeItem('mv-bk'); } catch (err) {}
      track('booking_confirmed', { appointment_id:data.confirmation.appointmentId, slot_start:data.confirmation.startISO, stub:!!data.confirmation.stub });
      $('mc').dataset.t = st.getTime(); tick(); step(3);
    } catch (err) { let m = $('form').querySelector('.submit-error'); if (!m) { m = document.createElement('p'); m.className = 'msg submit-error'; m.setAttribute('role','alert'); $('go2').before(m); } m.textContent = err.message || 'Something went wrong booking your call. Please try again.'; }
    finally { submit.disabled = false; submit.textContent = original; }
  });
  function tick() { const t = +$('mc').dataset.t; if (!t) return; const d = t - Date.now(), mn = Math.round(d / 60000); $('cCd').textContent = d <= 0 ? 'now' : mn < 60 ? 'in ' + mn + ' min' : mn < 1440 ? 'in ' + Math.floor(mn / 60) + ' h ' + String(mn % 60).padStart(2, '0') + ' min' : 'in ' + Math.round(mn / 1440) + (Math.round(mn / 1440) === 1 ? ' day' : ' days'); }
  setInterval(tick, 30000);
  const flip = on => { $('mc').classList.toggle('is-flip', on); $('qF').inert = on; $('qB').inert = !on; setTimeout(() => $(on ? 'flipB' : 'flipF').focus({ preventScroll: true }), 350); };
  $('flipF').addEventListener('click', () => flip(true)); $('flipB').addEventListener('click', () => flip(false));
  const pc = $('mc'); if (pc && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) { pc.addEventListener('pointermove', e => { const r = pc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; pc.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 7).toFixed(2) + 'deg)'; pc.style.setProperty('--sx', ((x + .5) * 100).toFixed(1) + '%'); pc.style.setProperty('--sy', ((y + .5) * 100).toFixed(1) + '%'); pc.classList.add('is-tilt'); }); pc.addEventListener('pointerleave', () => { pc.style.transform = ''; pc.classList.remove('is-tilt'); }); }
  const ua = navigator.userAgent, isA = /Android/i.test(ua), isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua);
  let wPref = isA ? 'g' : isApple ? 'a' : 'a';
  const wSet = p => { wPref = p; $('aw').hidden = p !== 'a'; $('gw').hidden = p !== 'g'; $('wsw').hidden = false; $('wsw').textContent = p === 'a' ? 'On Android? Use Google Wallet' : 'On iPhone? Use Apple Wallet'; };
  wSet(wPref);
  $('wsw').addEventListener('click', () => wSet(wPref === 'a' ? 'g' : 'a'));
  $('calT').addEventListener('click', () => { const o = $('calM').hidden; $('calM').hidden = !o; $('calT').setAttribute('aria-expanded', String(o)); });
  const wn = t => { $('wnote').hidden = false; $('wnote').textContent = t; };
  $('aw').addEventListener('click', () => wn('Wallet passes are coming soon. Add your call to your calendar for now.'));
  $('gw').addEventListener('click', () => wn('Wallet passes are coming soon. Add your call to your calendar for now.'));
  const upd = () => { const n = document.querySelectorAll('.dshot.has').length; $('upN').textContent = n === 3 ? 'All 3 added' : n + ' of 3 added'; $('upB').hidden = n < 3; $('upN').classList.toggle('ok', n === 3); };
  document.querySelectorAll('.dshot input').forEach(inp => inp.addEventListener('change', () => { const f = inp.files && inp.files[0], lb = inp.closest('.dshot'); if (!f) return; lb.style.setProperty('--img', 'url(' + URL.createObjectURL(f) + ')'); lb.classList.add('has'); upd(); }));
  $('upB').addEventListener('click', () => { track('photos_prepared'); $('upP').hidden = true; $('upD').hidden = false; });
  if ($('upL')) $('upL').addEventListener('click', () => { $('upP').hidden = true; $('upD').hidden = false; $('upD').innerHTML = '<span class="label">No rush</span><p>We’ll send a link with your reminder. Photos can wait until then.</p>'; });
  // keep typed details if the page is refreshed
  try { const sv = JSON.parse(sessionStorage.getItem('mv-bk') || '{}'); ['fn','ln','em','ph','ag'].forEach(id => { if (sv[id]) $(id).value = sv[id]; }); } catch (err) {}
  $('form').addEventListener('input', () => { try { const o = {}; ['fn','ln','em','ph','ag'].forEach(id => o[id] = $(id).value); sessionStorage.setItem('mv-bk', JSON.stringify(o)); } catch (err) {} });
  track('book_view');
  loadAvailability();
})();
