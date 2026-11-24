
(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const P={one:['ONE','£1,795',1,'£1,895'],core:['CORE','£2,250',2,'£2,350'],complete:['COMPLETE','£3,100',3,'£3,200']};const MAP={drift:'one',gaps:'core',crowd:'core',bite:'complete',unsure:'one'};let move='one';
function setMove(m,unsure){move=m;const [n,p,b]=P[m];$('#fxK').textContent=unsure?'Where you could start':'Your Move';$('#planName').innerHTML=(unsure?'From':'MOVES')+' <span>'+n+'</span>';$('#planPrice').textContent=p;$('#planWas').textContent=P[m][3];$('#fxS').textContent=unsure?'From, Black Friday price, ends 30 Nov':'Black Friday price, ends 30 Nov';$$('#bars i').forEach((x,i)=>x.classList.toggle('on',i<b));$$('.js-move,.js-move2').forEach(x=>x.textContent='MOVES '+n+', '+p)}
// Find your Move teeth (hover: teeth move · click: price changes)
(()=>{const box=$('#fxOpts');const T=[['c1',15.3,13,17,24,1],['l1',29.8,12,18.5,21.5,0],['i1',43.3,16,16,26,0],['i2',60.8,16,16,26,0],['l2',78.3,12,18.5,21.5,0],['c2',91.8,13,17,24,1]],LOW=[38.5,49.5,60.5,71.5];
const C={drift:{l2:[4,1.5,9,1],c2:[2,0,0]},gaps:{c1:[-3,0,0],l1:[-2.2,0,0],i1:[-1.6,0,0,1],i2:[1.6,0,0,1],l2:[2.2,0,0],c2:[3,0,0]},crowd:{l1:[2.5,1,-10,1],i1:[0,0,-3],i2:[-1.5,1.5,7,1]},bite:{i1:[0,0,-3],l2:[-1,0,5],low:[-5,-3,0,1]},unsure:{}};
const f=n=>Math.round(n*10)/10;
const up=(x,m,w,hh,can)=>{const y0=m-8,y1=m+hh,t=.6,r=3;return can?'M'+f(x)+' '+f(y0)+'H'+f(x+w)+'L'+f(x+w-t)+' '+f(y1-6)+'Q'+f(x+w-1)+' '+f(y1-2)+' '+f(x+w/2+1)+' '+f(y1)+'Q'+f(x+w/2)+' '+f(y1+.6)+' '+f(x+w/2-1)+' '+f(y1)+'Q'+f(x+1)+' '+f(y1-2)+' '+f(x+t)+' '+f(y1-6)+'Z':'M'+f(x)+' '+f(y0)+'H'+f(x+w)+'L'+f(x+w-t)+' '+f(y1-r)+'Q'+f(x+w-t)+' '+f(y1)+' '+f(x+w-t-r)+' '+f(y1)+'H'+f(x+t+r)+'Q'+f(x+t)+' '+f(y1)+' '+f(x+t)+' '+f(y1-r)+'Z'};
const lo=x=>{const y=36,w=10,r=3;return 'M'+x+' 60V'+(y+r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'H'+(x+w-r)+'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+r)+'V60Z'};
const gl='M15.3 20.5'+T.map(t=>'L'+f(t[1])+' '+f(t[3]+3.5)+'Q'+f(t[1]+t[2]/2)+' '+f(t[3]-4.5)+' '+f(t[1]+t[2])+' '+f(t[3]+3.5)).join('');
const svg=c=>{const m=C[c]||{},bite=c==='bite',st=v=>(v&&v[3]?' data-hl':'')+(v?' style="--x:'+v[0]+';--y:'+v[1]+';--r:'+v[2]+'"':'');
 let s='<svg viewBox="8 4 104 52" preserveAspectRatio="xMaxYMid meet" class="teeth'+(c==='unsure'?' is-scan':'')+'" aria-hidden="true" focusable="false">';
 if(bite)s+='<g class="tt"'+st(m.low)+'>'+LOW.map(x=>'<path d="'+lo(x)+'"/>').join('')+'</g><path class="gum" d="M0 70V49Q60 58 120 49V70Z"/><path class="gl" d="M30 51.5Q60 56 90 51.5"/>';
 s+=T.map(t=>'<g class="tt"'+st(m[t[0]])+'><path d="'+up(t[1],t[3],t[2],t[4],t[5])+'"/></g>').join('');
 s+='<path class="gum" d="M0 22L'+gl.slice(1)+'L120 22V0H0Z"/><path class="gl" d="'+gl+'"/>';if(c==='unsure')s+='<line class="scan" x1="0" y1="12" x2="0" y2="46"/>';return s+'</svg>'};
$$('.opt',box).forEach(o=>{const t=document.createElement('span');t.className='tv';t.setAttribute('aria-hidden','true');t.innerHTML=svg(o.querySelector('input').value);o.appendChild(t)});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const wake=()=>box.classList.remove('is-idle');['pointerenter','focusin','change'].forEach(ev=>box.addEventListener(ev,wake,{once:true}))}else box.classList.remove('is-idle');
const res=$('#fxRes');box.addEventListener('change',e=>{const v=e.target.value;res.classList.add('is-swap');setTimeout(()=>{setMove(MAP[v],v==='unsure');res.classList.remove('is-swap')},200)});})();
// prices tabs (mobile)
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));$$('.pc').forEach(c=>c.classList.toggle('on',c.dataset.p===b.dataset.t))}));
// faq
$$('.q button').forEach(b=>b.addEventListener('click',()=>{const q=b.closest('.q'),o=q.classList.toggle('open');b.setAttribute('aria-expanded',o)}));
// scroll dots
$$('[data-dots]').forEach(sc=>{const d=$('#'+sc.dataset.dots);if(!d)return;const dots=$$('i',d);sc.addEventListener('scroll',()=>{const kids=[...sc.children];let best=0,bd=1e9;kids.forEach((k,i)=>{const dd=Math.abs(k.offsetLeft-sc.scrollLeft-parseFloat(getComputedStyle(sc).paddingLeft));if(dd<bd){bd=dd;best=i}});dots.forEach((x,i)=>x.classList.toggle('on',i===best))},{passive:true});
 dots.forEach((x,i)=>{x.style.cursor='pointer';x.addEventListener('click',()=>{const k=sc.children[i];sc.scrollTo({left:k.offsetLeft-parseFloat(getComputedStyle(sc).paddingLeft),behavior:'smooth'})})})});
// reveal + ring
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
$$('.rv').forEach(x=>io.observe(x));io.observe($('#ring'));
// how it works: active step on scroll
const steps=$$('.step');const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=steps.indexOf(e.target);steps.forEach((s,j)=>{s.classList.toggle('act',j===i);s.classList.toggle('done',j<i)})}}),{rootMargin:'-45% 0px -45% 0px'});steps.forEach(s=>so.observe(s));
// sticky mobile CTA
const hero=$('.hero'),fin=$('#book'),st=$('#sticky');const vis={hero:true,fin:false};
const ho=new IntersectionObserver(es=>{es.forEach(e=>vis[e.target===hero?'hero':'fin']=e.isIntersecting);st.classList.toggle('on',!vis.hero&&!vis.fin)});ho.observe(hero);ho.observe(fin);
// ===== shared: attribution + Meta helper (same keys as the /book wizard) =====
const cookie=n=>document.cookie.split('; ').find(r=>r.startsWith(n+'='))?.split('=').slice(1).join('=')||'';
const sendMeta=(method,event,params={},opts)=>{if(typeof window.fbq==='function'){opts?window.fbq(method,event,params,opts):window.fbq(method,event,params);return}window.__movesMetaQueue=window.__movesMetaQueue||[];window.__movesMetaQueue.push([method,event,params,opts])};
const track=(event,detail={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...detail})};
const OFFER='black-friday-2026',VARIANT='landing-page-black-friday';
const attribution=()=>{const q=new URLSearchParams(location.search);let saved={};try{saved=JSON.parse(localStorage.getItem('mv-attribution')||'{}')}catch(e){}
 const take=(k,sk=k,max=200)=>(q.get(k)||saved[sk]||'').slice(0,max);
 const v={utmSource:take('utm_source'),utmMedium:take('utm_medium'),utmCampaign:take('utm_campaign'),utmContent:take('utm_content'),utmTerm:take('utm_term'),fbclid:take('fbclid','fbclid',500),fbc:cookie('_fbc').slice(0,500),fbp:cookie('_fbp').slice(0,500),eventSourceUrl:location.href.slice(0,2000),landingPageVariant:VARIANT,offer:OFFER};
 if(!v.fbc&&v.fbclid)v.fbc='fb.1.'+Date.now()+'.'+v.fbclid;
 try{localStorage.setItem('mv-attribution',JSON.stringify({utm_source:v.utmSource,utm_medium:v.utmMedium,utm_campaign:v.utmCampaign,utm_content:v.utmContent,utm_term:v.utmTerm,fbclid:v.fbclid,landing_page_variant:VARIANT}))}catch(e){}
 return v};

// ===== booking: every "book" button lands on /book, the live GoHighLevel booking wizard =====
// (capture phase, so it wins over the older in-page booking window below, which is now unused)
let fx='';try{fx=localStorage.getItem('mv-fx')||''}catch(e){}
document.addEventListener('change',e=>{const t=e.target;if(t&&t.closest&&t.closest('#fxOpts')&&t.value){fx=t.value;try{localStorage.setItem('mv-fx',fx)}catch(x){}}});
const bookUrl=()=>{const a=attribution(),q=new URLSearchParams();
 [['utm_source',a.utmSource],['utm_medium',a.utmMedium],['utm_campaign',a.utmCampaign],['utm_content',a.utmContent],['utm_term',a.utmTerm],['fbclid',a.fbclid]].forEach(([k,v])=>{if(v)q.set(k,v)});
 q.set('lp','black-friday-2026');q.set('offer',OFFER);q.set('from','/black-friday');if(fx)q.set('fx',fx);return '/book?'+q.toString()};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-book]');if(!b)return;e.preventDefault();e.stopPropagation();track('book_click',{offer:OFFER,fx});location.href=bookUrl()},true);

// ===== (unused) in-page booking window: live GHL calendar via /api/booking/slots + /api/booking =====
const md=$('#modal'),sh=$('#sheet'),fm=$('#bk'),daysEl=$('#bk-days'),timesEl=$('#bk-times'),errEl=$('#bk-err'),goBtn=$('#bk-go');let last=null,D=[],S={di:0,slot:null},loadedAt=0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function showErr(msg){errEl.textContent=msg||'';errEl.hidden=!msg}
function renderDays(){daysEl.innerHTML=D.map((d,i)=>'<button type="button" data-i="'+i+'" aria-pressed="'+(i===S.di)+'" class="'+(i===S.di?'on':'')+'">'+esc(d.weekdayLabel+' '+d.dayLabel)+'</button>').join('')}
function renderTimes(){const t=(D[S.di]&&D[S.di].times)||[];timesEl.innerHTML=t.map((x,i)=>'<button type="button" data-i="'+i+'" aria-pressed="'+(S.slot===x.startISO)+'" class="'+(S.slot===x.startISO?'on':'')+'">'+esc(x.label)+'</button>').join('')}
async function loadSlots(force){if(!force&&D.length&&Date.now()-loadedAt<120000)return;daysEl.innerHTML='<span class="ld">Loading times…</span>';timesEl.innerHTML='';
 try{const r=await fetch('/api/booking/slots',{cache:'no-store'});const j=await r.json();if(!r.ok||!j.ok)throw new Error();D=(j.days||[]).filter(d=>d.times&&d.times.length);loadedAt=Date.now();S={di:0,slot:null};
  if(!D.length){daysEl.innerHTML='<span class="none">No times are free right now. Please check back soon.</span>';return}
  renderDays();renderTimes()}
 catch(e){D=[];daysEl.innerHTML='<span class="none">We couldn’t load times. <button type="button" data-retry style="text-decoration:underline">Try again</button></span>'}}
daysEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-retry')){loadSlots(true);return}S.di=+b.dataset.i;S.slot=null;renderDays();renderTimes()});
timesEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const x=D[S.di].times[+b.dataset.i];S.slot=x.startISO;renderTimes();timesEl.classList.remove('err');showErr('');track('slot_selected',{offer:OFFER})});
function open(e){if(e&&e.currentTarget&&e.currentTarget.tagName==='A')e.preventDefault();last=document.activeElement;sh.classList.remove('ok');showErr('');md.classList.add('open');md.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';track('book_modal_open',{offer:OFFER,move});loadSlots();setTimeout(()=>$('#bk-n').focus({preventScroll:true}),260)}
function close(){md.classList.remove('open');md.setAttribute('aria-hidden','true');document.body.style.overflow='';if(last)last.focus({preventScroll:true})}
$$('[data-book]').forEach(b=>b.addEventListener('click',open));$$('[data-close]').forEach(b=>b.addEventListener('click',close));
md.addEventListener('click',e=>{if(e.target===md)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&md.classList.contains('open'))close()});
const splitName=v=>{const p=v.trim().replace(/\s+/g,' ').split(' ');return p.length<2?null:{firstName:p[0],lastName:p.slice(1).join(' ')}};
const FIELD={firstName:'#bk-n',lastName:'#bk-n',email:'#bk-e',phone:'#bk-p',age:'#bk-a'};
const mark=(el,bad)=>el.classList.toggle('err',bad);
fm.addEventListener('submit',async e=>{e.preventDefault();showErr('');
 const n=$('#bk-n'),p=$('#bk-p'),em=$('#bk-e'),ag=$('#bk-a'),c=$('#bk-c');const nm=splitName(n.value);const age=parseInt(ag.value,10);
 const checks=[[n,!nm],[p,p.value.replace(/\D/g,'').length<10],[em,!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value.trim())],[ag,!(age>=15&&age<=120)]];let first=null;
 checks.forEach(([el,bad])=>{mark(el,bad);if(bad&&!first)first=el});
 c.closest('.cons').classList.toggle('err',!c.checked);
 if(first){showErr(first===n?'Please enter your first and last name.':'Please check the highlighted fields.');first.focus();return}
 if(!S.slot){showErr('Please choose a day and time for your call.');return}
 if(!c.checked){showErr('Please accept the terms to continue.');return}
 const a=attribution();const t=P[move];
 const payload={firstName:nm.firstName,lastName:nm.lastName,email:em.value.trim(),phone:p.value.trim(),age:String(age),referralCode:'',note:'',concern:('MOVES '+t[0]+' '+t[1]+' (Black Friday)').slice(0,80),...a,slotStart:S.slot,timezone:'Europe/London',consent:true,trackingConsent:cookie('moves_consent_v1')==='allowed'};
 goBtn.disabled=true;const label=goBtn.textContent;goBtn.textContent='Booking…';track('details_submitted',{offer:OFFER,slot_start:S.slot});
 try{const r=await fetch('/api/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const j=await r.json().catch(()=>({}));
  if(r.status===409){await loadSlots(true);showErr('That time has just been taken. Please choose another.');return}
  if(!r.ok||!j.ok){const fe=j.fieldErrors||{};Object.keys(fe).forEach(k=>{if(FIELD[k])mark($(FIELD[k]),true)});showErr(Object.values(fe)[0]||j.error||'Something went wrong booking your call. Please try again.');return}
  const d=D[S.di],x=d.times.find(z=>z.startISO===S.slot);$('.js-day').textContent=d.weekdayLabel+' '+d.dayLabel;$('.js-time').textContent=x?x.label:'';$('.js-email').textContent=payload.email;
  sh.classList.add('ok');sh.scrollTop=0;track('booking_confirmed',{offer:OFFER,appointment_id:j.confirmation&&j.confirmation.appointmentId,slot_start:S.slot,landing_page_variant:VARIANT});
  sendMeta('track','Schedule',{content_name:'Free video consultation'},{eventID:j.confirmation&&j.confirmation.appointmentId});
  D=[];S={di:0,slot:null}}
 catch(err){showErr('We couldn’t reach our booking system. Please check your connection and try again.')}
 finally{goBtn.disabled=false;goBtn.textContent=label}});
$$('#bk input').forEach(i=>i.addEventListener('input',()=>{i.classList.remove('err');if(i.type==='checkbox')i.closest('.cons').classList.remove('err');showErr('')}));

// ===== V4: countdown (ends Cyber Monday 30 Nov 2026, 23:59 London) =====
const END=Date.parse('2026-11-30T23:59:59Z');const pad=n=>String(n).padStart(2,'0');
function tick(){let s=Math.max(0,Math.floor((END-Date.now())/1000));const v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};$$('[data-cd]').forEach(c=>$$('[data-u]',c).forEach(b=>b.textContent=pad(v[b.dataset.u])))}
tick();setInterval(tick,1000);
// ===== announcement carousel =====
(()=>{const tr=$('.ann-tr');if(!tr)return;const n=tr.children.length;let i=0,t;const go=k=>{i=(k+n)%n;tr.style.transform='translateX('+(-100*i)+'%)'};const auto=()=>{clearInterval(t);t=setInterval(()=>go(i+1),3500)};
$$('.ann-a').forEach(a=>a.addEventListener('click',()=>{go(i+ +a.dataset.dir);auto()}));$('#ann').addEventListener('mouseenter',()=>clearInterval(t));$('#ann').addEventListener('mouseleave',auto);auto()})();
// ===== Black Friday popup: once per visit, 6s after load =====
(()=>{const p=$('#bfpop');if(!p)return;let seen=false;try{seen=sessionStorage.getItem('bfpop')==='1'}catch(e){}
const open=()=>{if($('#modal').classList.contains('open'))return;p.classList.add('open');p.setAttribute('aria-hidden','false');try{sessionStorage.setItem('bfpop','1')}catch(e){}};
const close=()=>{p.classList.remove('open');p.setAttribute('aria-hidden','true')};
$$('[data-bfclose]',p).forEach(b=>b.addEventListener('click',close));const nf=$('#nlf'),nlErr=$('#nl-err'),nlBtn=nf.querySelector('.nlbtn');nf.addEventListener('submit',async e=>{e.preventDefault();const i=$('#nl-e');nlErr.hidden=true;const ok=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim());i.classList.toggle('err',!ok);if(!ok){i.focus();return}
 nlBtn.disabled=true;const lab=nlBtn.textContent;nlBtn.textContent='Unlocking…';
 try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:i.value.trim(),website:$('#nl-hp').value,consent:true,...attribution(),trackingConsent:cookie('moves_consent_v1')==='allowed'})});const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.ok){nlErr.textContent=j.error||'We couldn’t save that just now. Please try again.';nlErr.hidden=false;return}
  track('lead_captured',{offer:OFFER,source:'black_friday_popup',emailed:!!j.emailed});if(j.emailed){const s=p.querySelector('.nld .nls');if(s)s.textContent='We’ve emailed you the details. Your £100 off is saved until 30 Nov. Book your free video call to use it.'}sendMeta('track','Lead',{content_name:'Black Friday email'});p.querySelector('.nl').classList.add('done')}
 catch(err){nlErr.textContent='We couldn’t reach us. Please check your connection and try again.';nlErr.hidden=false}
 finally{nlBtn.disabled=false;nlBtn.textContent=lab}});$('#nl-e').addEventListener('input',e=>e.target.classList.remove('err'));p.addEventListener('click',e=>{if(e.target===p)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
if(!seen&&Date.now()<END)setTimeout(open,6000)})();

// ===== mobile prices: tabs switch one card =====
(()=>{const sc=$('#pcs');if(!sc)return;const tabs=$$('.ptabs button');const cards=$$('.pc',sc);
const go=k=>{tabs.forEach(t=>t.classList.toggle('on',t.dataset.t===k));cards.forEach(c=>c.classList.toggle('sel',c.dataset.p===k))};
tabs.forEach(t=>t.addEventListener('click',()=>go(t.dataset.t)));go('core')})();

})();
