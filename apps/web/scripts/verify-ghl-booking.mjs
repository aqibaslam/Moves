/**
 * Verify a booking landed in GHL: look up the contact by email and list the
 * calendar's upcoming appointments.
 * Run from apps/web:  node --env-file=.env.local scripts/verify-ghl-booking.mjs test.booking@example.com
 */
const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-04-15';
const token = process.env.GHL_API_TOKEN;
const locationId = process.env.GHL_LOCATION_ID;
const calendarId = process.env.GHL_CALENDAR_ID;
const email = process.argv[2] ?? 'test.booking@example.com';

const h = { Authorization: `Bearer ${token}`, Version: VERSION, Accept: 'application/json' };

// 1) Contact by email
const cUrl = new URL(`${BASE}/contacts/`);
cUrl.searchParams.set('locationId', locationId);
cUrl.searchParams.set('query', email);
const cRes = await fetch(cUrl, { headers: h });
const cData = await cRes.json().catch(() => ({}));
const contacts = cData.contacts ?? [];
console.log(`\nContact lookup for "${email}": ${cRes.status}`);
if (contacts.length) {
  const c = contacts[0];
  console.log(`  ✓ ${c.contactName ?? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim()}  <${c.email}>  ${c.phone ?? ''}`);
  console.log(`    id: ${c.id}`);
} else {
  console.log('  (no contact found)');
}

// 2) Appointments on the calendar (next 21 days)
const now = Date.now();
const eUrl = new URL(`${BASE}/calendars/events`);
eUrl.searchParams.set('locationId', locationId);
eUrl.searchParams.set('calendarId', calendarId);
eUrl.searchParams.set('startTime', String(now));
eUrl.searchParams.set('endTime', String(now + 21 * 864e5));
const eRes = await fetch(eUrl, { headers: h });
const eData = await eRes.json().catch(() => ({}));
const events = eData.events ?? [];
console.log(`\nAppointments on calendar (${eRes.status}): ${events.length} found`);
for (const e of events.slice(0, 10)) {
  console.log(`  • ${e.startTime}  ${e.title ?? ''}  [${e.appointmentStatus ?? e.status ?? ''}]  id:${e.id}`);
}
console.log('');
