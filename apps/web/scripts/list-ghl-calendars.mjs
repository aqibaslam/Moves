/**
 * List GoHighLevel calendars for the configured location.
 * Run from apps/web:  node --env-file=.env.local scripts/list-ghl-calendars.mjs
 */
const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-04-15';

const token = process.env.GHL_API_TOKEN;
const locationId = process.env.GHL_LOCATION_ID;

if (!token || !locationId) {
  console.error('Missing GHL_API_TOKEN or GHL_LOCATION_ID in .env.local');
  process.exit(1);
}

const url = new URL(`${BASE}/calendars/`);
url.searchParams.set('locationId', locationId);

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}`, Version: VERSION, Accept: 'application/json' },
});
const body = await res.text();

if (!res.ok) {
  console.error(`✗ ${res.status} ${res.statusText}`);
  console.error(body.slice(0, 500));
  if (res.status === 401) console.error('→ Token invalid, or missing calendars.readonly scope.');
  if (res.status === 422) console.error('→ locationId likely wrong for this token.');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(body);
} catch {
  console.error('Non-JSON response:', body.slice(0, 500));
  process.exit(1);
}

const calendars = data.calendars ?? data ?? [];
if (!Array.isArray(calendars) || calendars.length === 0) {
  console.log('No calendars returned for this location.');
  process.exit(0);
}

console.log(`\nFound ${calendars.length} calendar(s):\n`);
for (const c of calendars) {
  console.log(`  ${c.name}`);
  console.log(`    id:        ${c.id}`);
  console.log(`    slug:      ${c.slug ?? '—'}`);
  console.log(`    active:    ${c.isActive ?? '—'}`);
  console.log('');
}
