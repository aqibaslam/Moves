/**
 * GoHighLevel connection check.
 *
 * Reads GHL_API_TOKEN / GHL_CALENDAR_ID / GHL_LOCATION_ID and verifies the
 * booking flow can reach the calendar. Run from apps/web:
 *
 *   node --env-file=.env.local scripts/check-ghl.mjs
 *
 * Node 22+ (has global fetch and --env-file).
 */
const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-04-15';
const TZ = 'Europe/London';

const token = process.env.GHL_API_TOKEN;
const calendarId = process.env.GHL_CALENDAR_ID;
const locationId = process.env.GHL_LOCATION_ID;

function mask(v) {
  if (!v) return '(missing)';
  return v.length <= 8 ? '****' : `${v.slice(0, 4)}…${v.slice(-4)}`;
}

console.log('\n GoHighLevel connection check');
console.log('──────────────────────────────');
console.log(` Token:      ${mask(token)}`);
console.log(` Calendar:   ${calendarId || '(missing)'}`);
console.log(` Location:   ${locationId || '(missing)'}\n`);

if (!token || !calendarId || !locationId) {
  console.error(' ✗ One or more values are missing. Fill them in apps/web/.env.local and retry.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  Version: VERSION,
  Accept: 'application/json',
};

const now = Date.now();
const start = now + 24 * 60 * 60 * 1000;
const end = now + 21 * 24 * 60 * 60 * 1000;

const url = new URL(`${BASE}/calendars/${calendarId}/free-slots`);
url.searchParams.set('startDate', String(start));
url.searchParams.set('endDate', String(end));
url.searchParams.set('timezone', TZ);

try {
  const res = await fetch(url, { headers });
  const body = await res.text();

  if (!res.ok) {
    console.error(` ✗ free-slots returned ${res.status} ${res.statusText}`);
    console.error(`   ${body.slice(0, 400)}\n`);
    if (res.status === 401) console.error('   → Token invalid or missing scopes (need calendars.readonly).');
    if (res.status === 404) console.error('   → Calendar ID not found for this token/location.');
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    console.error(' ✗ Response was not JSON:\n', body.slice(0, 400));
    process.exit(1);
  }

  const dayKeys = Object.keys(data).filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k));
  const totalSlots = dayKeys.reduce((n, k) => n + (Array.isArray(data[k]?.slots) ? data[k].slots.length : 0), 0);

  console.log(` ✓ Connected. Calendar returned ${dayKeys.length} day(s), ${totalSlots} open slot(s).`);
  if (dayKeys.length) {
    const first = dayKeys.sort()[0];
    console.log(`   First day with data: ${first} → ${data[first].slots?.slice(0, 3).join(', ') || 'none'}`);
  } else {
    console.log('   (No open slots in the next 21 days — check the calendar’s availability hours.)');
  }
  console.log('\n The /book form will use live data on the next dev-server restart.\n');
} catch (err) {
  console.error(' ✗ Network/error reaching GoHighLevel:', err.message);
  process.exit(1);
}
