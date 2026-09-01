/**
 * End-to-end write test against live GHL: pick the first free slot, upsert a
 * contact, create the appointment — printing the exact status + body at each
 * step so we can see precisely what GHL rejects.
 *
 * Run from apps/web:  node --env-file=.env.local scripts/test-ghl-booking.mjs
 */
const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-04-15';
const TZ = 'Europe/London';
const CONSULT_MIN = 45;

const token = process.env.GHL_API_TOKEN;
const calendarId = process.env.GHL_CALENDAR_ID;
const locationId = process.env.GHL_LOCATION_ID;
const h = { Authorization: `Bearer ${token}`, Version: VERSION, Accept: 'application/json', 'Content-Type': 'application/json' };

function show(label, res, body) {
  console.log(`\n${label}: ${res.status} ${res.statusText}`);
  console.log(body.slice(0, 600));
}

// 1) free slots → pick first
const now = Date.now();
const sUrl = new URL(`${BASE}/calendars/${calendarId}/free-slots`);
sUrl.searchParams.set('startDate', String(now + 24 * 864e5 / 24));
sUrl.searchParams.set('endDate', String(now + 21 * 864e5));
sUrl.searchParams.set('timezone', TZ);
const sRes = await fetch(sUrl, { headers: h });
const sBody = await sRes.text();
if (!sRes.ok) { show('free-slots', sRes, sBody); process.exit(1); }
const sData = JSON.parse(sBody);
let startISO = null;
for (const k of Object.keys(sData).filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort()) {
  if (Array.isArray(sData[k]?.slots) && sData[k].slots.length) { startISO = sData[k].slots[0]; break; }
}
console.log(`Picked slot: ${startISO}`);
const endISO = new Date(new Date(startISO).getTime() + CONSULT_MIN * 60000).toISOString();

// 2) upsert contact
const cRes = await fetch(`${BASE}/contacts/upsert`, {
  method: 'POST', headers: h,
  body: JSON.stringify({
    locationId, firstName: 'Diag', lastName: 'Test',
    email: 'diag.test@example.com', phone: '+447700900999',
    source: 'GHL diag script',
  }),
});
const cBody = await cRes.text();
show('contacts/upsert', cRes, cBody);
if (!cRes.ok) process.exit(1);
const contactId = (JSON.parse(cBody).contact?.id) ?? JSON.parse(cBody).id;
console.log(`contactId: ${contactId}`);

// 3) create appointment
const aRes = await fetch(`${BASE}/calendars/events/appointments`, {
  method: 'POST', headers: h,
  body: JSON.stringify({
    calendarId, locationId, contactId,
    startTime: startISO, endTime: endISO,
    title: 'Moves — diag test', appointmentStatus: 'confirmed',
    ignoreDateRange: false, toNotify: false,
  }),
});
const aBody = await aRes.text();
show('calendars/events/appointments', aRes, aBody);
console.log(aRes.ok ? '\n✓ Appointment created.' : '\n✗ Appointment create failed.');
