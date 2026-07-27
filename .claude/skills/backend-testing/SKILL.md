---
name: backend-testing
description: >
  Testing strategy for the Moves stack — Vitest unit tests for pure logic,
  integration tests against a local Supabase, pgTAP and TypeScript RLS policy
  tests that prove cross-tenant reads fail, and Playwright E2E.
  Activates when writing or fixing tests, adding a table or RLS policy that needs
  coverage, setting up CI, or when a change touches auth, permissions, or migrations.
---

# Backend Testing

The highest-value tests here are RLS tests. A broken component is a bug; a broken
policy is a data breach. Test the boundary, not the mock.

## Core Rules

1. **Every RLS policy ships with a test proving another user CANNOT read, update,
   or delete the row.** A happy-path-only test is worthless.
2. **Integration tests run against a real local Supabase** (`supabase start`).
   Never mock `supabase-js` to test a query — you would be testing the mock.
3. **Reset state between suites** via `supabase db reset` or transaction
   rollback, not cleanup code that gets skipped on failure.
4. **Never use the service-role key in the client under test.** It bypasses RLS.
5. **Unit-test pure logic only** — zod schemas, cursor encoding, formatters.
   If it needs a database, it is an integration test.
6. **CI replays migrations from zero on every PR.**
7. **E2E covers critical paths only**: signup, login, create, permission denial.

## Layout

```
apps/web/lib/__tests__/      # unit — vitest, node env
apps/web/e2e/                # playwright specs
supabase/tests/rls/          # pgTAP .sql policy tests
tests/integration/           # vitest against local supabase
tests/helpers/supabase.ts    # test-user factories
```

## Unit Tests

```ts
import { describe, it, expect } from 'vitest'
import { createMoveSchema } from '@moves/validation'
import { decodeCursor, encodeCursor } from '@/lib/pagination'

it('round-trips a cursor', () => {
  const c = encodeCursor({ createdAt: '2026-07-27T10:00:00.000Z', id: 'abc' })
  expect(decodeCursor(c)).toEqual({ createdAt: '2026-07-27T10:00:00.000Z', id: 'abc' })
})
it('returns null for a malformed cursor', () => expect(decodeCursor('!!')).toBeNull())

it('rejects a whitespace-only title', () => {
  expect(createMoveSchema.safeParse({ orgId: crypto.randomUUID(), title: ' ' }).success)
    .toBe(false)
})
it('rejects more than 20 tags', () => {
  const tagIds = Array.from({ length: 21 }, () => crypto.randomUUID())
  expect(createMoveSchema.safeParse({ orgId: crypto.randomUUID(), title: 'x', tagIds })
    .success).toBe(false)
})
```

Test schemas at their edges — that is where the bugs are.

## Integration Setup

```bash
supabase start          # postgres + auth + storage on 127.0.0.1:54321
supabase db reset       # replay migrations + seed.sql
supabase status         # prints local anon + service_role keys
```

`.env.test` is committed — local keys come from a fixed local JWT secret and are
not sensitive.

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,     // shared database — do not race
    testTimeout: 30_000,
  },
})
```

The **service role creates fixtures**; the **anon key plus a real sign-in
produces the client under test**.

```ts
// tests/helpers/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@moves/types/supabase'

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const admin = createClient<Database>(URL, process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } })

export type TestUser = { id: string; client: SupabaseClient<Database> }

export async function createTestUser(): Promise<TestUser> {
  const email = `test-${crypto.randomUUID()}@example.test`
  const password = 'test-password-123!'

  const { data, error } = await admin.auth.admin.createUser(
    { email, password, email_confirm: true })
  if (error) throw error

  // Anon key + sign-in → this client IS subject to RLS.
  const client = createClient<Database>(URL, ANON,
    { auth: { autoRefreshToken: false, persistSession: false } })
  const { error: signInError } = await client.auth.signInWithPassword({ email, password })
  if (signInError) throw signInError

  return { id: data.user.id, client }
}

export const deleteTestUser = (id: string) => admin.auth.admin.deleteUser(id)
```

## RLS Policy Tests — The Critical Suite

For each table prove four things: owner **can** read; stranger **cannot** read;
stranger **cannot** write; owner **cannot** escalate (reassign ownership).

```ts
// tests/integration/rls-moves.test.ts
import { admin, createTestUser, deleteTestUser, type TestUser } from '../helpers/supabase'

describe('RLS: public.moves', () => {
  let alice: TestUser, bob: TestUser, aliceOrg: string, moveId: string

  beforeAll(async () => {
    alice = await createTestUser()
    bob   = await createTestUser()

    const { data: org } = await admin.from('orgs')
      .insert({ name: 'Alice Co' }).select('id').single()
    aliceOrg = org!.id
    await admin.from('memberships')
      .insert({ org_id: aliceOrg, user_id: alice.id, role: 'owner' })

    const { data: move } = await admin.from('moves')
      .insert({ org_id: aliceOrg, owner_id: alice.id, title: 'Alice secret' })
      .select('id').single()
    moveId = move!.id
  })

  afterAll(async () => {
    await admin.from('orgs').delete().eq('id', aliceOrg)
    await deleteTestUser(alice.id); await deleteTestUser(bob.id)
  })

  it('owner CAN read their own move', async () => {
    const { data, error } = await alice.client.from('moves').select('title').eq('id', moveId)
    expect(error).toBeNull()
    expect(data).toHaveLength(1)
  })

  // THE test. RLS FILTERS rows — it does not error. Assert empty, not an error.
  it('stranger CANNOT read another user\'s move', async () => {
    const { data, error } = await bob.client.from('moves').select('title').eq('id', moveId)
    expect(error).toBeNull()
    expect(data).toEqual([])            // filtered away, not 403
  })

  it('stranger CANNOT see it in an unfiltered list', async () => {
    const { data } = await bob.client.from('moves').select('id')
    expect(data?.map(r => r.id)).not.toContain(moveId)
  })

  it('stranger CANNOT update it', async () => {
    const { data } = await bob.client.from('moves')
      .update({ title: 'hacked' }).eq('id', moveId).select()
    expect(data).toEqual([])            // zero rows matched the USING clause
    // Confirm with admin that nothing actually changed.
    const { data: row } = await admin.from('moves').select('title').eq('id', moveId).single()
    expect(row!.title).toBe('Alice secret')
  })

  it('stranger CANNOT delete it', async () => {
    await bob.client.from('moves').delete().eq('id', moveId)
    const { count } = await admin.from('moves')
      .select('id', { count: 'exact', head: true }).eq('id', moveId)
    expect(count).toBe(1)
  })

  it('stranger CANNOT insert into an org they do not belong to', async () => {
    const { error } = await bob.client.from('moves')
      .insert({ org_id: aliceOrg, owner_id: bob.id, title: 'intruder' })
    expect(error?.code).toBe('42501')   // WITH CHECK violation — this one DOES error
  })

  it('owner CANNOT reassign the move to another user', async () => {
    const { data } = await alice.client.from('moves')
      .update({ owner_id: bob.id }).eq('id', moveId).select()
    expect(data).toEqual([])            // blocked by WITH CHECK
  })

  it('anonymous CANNOT read anything', async () => {
    const anon = createClient(URL, ANON)
    expect((await anon.from('moves').select('id')).data).toEqual([])
  })
})
```

**Internalise the trap:** a `select`/`update` denied by a `using` clause returns
`{ data: [], error: null }` — no error. Only a `with check` violation raises
`42501`. Assert on the data, then confirm with the admin client.

### pgTAP alternative

Faster for policy-dense tables, and `begin/rollback` removes all cleanup code.

```sql
-- supabase/tests/rls/moves.test.sql
begin;
select plan(3);

set local role authenticated;
set local request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is((select count(*)::int from public.moves), 1, 'alice sees her move');

set local request.jwt.claims to '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select is((select count(*)::int from public.moves), 0, 'bob sees nothing');
select throws_ok(
  $$ insert into public.moves (org_id, owner_id, title)
     values ('33333333-3333-3333-3333-333333333333','22222222-2222-2222-2222-222222222222','x') $$,
  '42501', null, 'bob cannot insert into alice org');

select * from finish();
rollback;
```

```bash
supabase test db     # runs everything in supabase/tests
```

## Integration Tests for Actions and Handlers

Server Actions are plain async functions — import and call them, then assert the
`ActionResult` envelope.

```ts
const result = await createMove(null, formDataFrom({ orgId, title: '' }))
expect(result.ok).toBe(false)
if (!result.ok) expect(result.error.code).toBe('VALIDATION')

// Cursor pagination must not duplicate or drop rows across pages.
const p1 = await alice.client.from('moves').select('id, created_at')
  .eq('org_id', orgId).order('created_at', { ascending: false }).limit(10)
const p2 = await alice.client.from('moves').select('id, created_at')
  .eq('org_id', orgId).order('created_at', { ascending: false })
  .lt('created_at', p1.data!.at(-1)!.created_at).limit(10)
expect(new Set([...p1.data!, ...p2.data!].map(r => r.id)).size).toBe(20)
```

## E2E with Playwright

```ts
// playwright.config.ts
export default defineConfig({
  testDir: './apps/web/e2e',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  webServer: { command: 'pnpm --filter web dev', url: 'http://localhost:3000',
               reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    { name: 'chromium', dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' } },
  ],
})
```

```ts
// apps/web/e2e/auth.setup.ts — sign in once, reuse the state
setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(process.env.E2E_EMAIL!)
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})
```

```ts
test('unauthenticated user is redirected to login', async ({ browser }) => {
  const page = await browser.newPage({ storageState: { cookies: [], origins: [] } })
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('creates a move and sees it listed', async ({ page }) => {
  await page.goto('/orgs/test-org/moves')
  await page.getByRole('button', { name: 'New move' }).click()
  await page.getByLabel('Title').fill('E2E move')
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByText('E2E move')).toBeVisible()
})
```

Role- and label-based locators only. Never `page.waitForTimeout()` — `expect()`
auto-retries.

## CI

```yaml
- uses: supabase/setup-cli@v1
  with: { version: latest }
- run: supabase start
- run: supabase db reset        # proves migrations replay from zero
- run: supabase test db         # pgTAP RLS suite
- run: pnpm vitest run
- run: pnpm exec playwright test
```

Block merges on a failing RLS suite. Treat an RLS failure as a security incident,
not a flaky test.

## Red Flags

- A new table or policy merged with no RLS test.
- An RLS test asserting only the owner's happy path.
- `expect(error).not.toBeNull()` used to assert a *read* was denied — denied reads
  return `[]` with no error.
- A "denied write" test that never re-reads with the admin client to confirm.
- The service-role key used to build the client under test.
- `vi.mock('@supabase/supabase-js')` in an integration test.
- Tests that pass alone but fail together — missing isolation or
  `fileParallelism: true` against a shared database.
- Cleanup in the test body instead of `afterAll` / rollback.
- Hardcoded user UUIDs or emails that collide across runs.
- `page.waitForTimeout()` or CSS-selector locators in Playwright.
- CI applying migrations incrementally instead of `supabase db reset`.
- Every form covered by E2E while nothing covers permission denial.
