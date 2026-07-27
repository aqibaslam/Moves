---
name: api-design
description: >
  Server-side API patterns for the Moves monorepo — choosing Server Components vs
  Server Actions vs Route Handlers, zod validation at every boundary, typed error
  envelopes, idempotency, cursor pagination, rate limiting, and how Expo calls in.
  Activates when writing a Server Action, a file under apps/web/app/api, a data
  fetch in a Server Component, or wiring apps/mobile to the backend.
---

# API Design

Supabase + RLS is the API. Route handlers exist only where the database cannot
answer alone. Every layer you add is a layer that can forget an auth check.

## Core Rules

1. **Read in Server Components. Write in Server Actions. Route Handlers only for
   non-browser callers** (Expo, webhooks, OAuth callbacks, cron).
2. **Validate every input with zod at the boundary.** Bodies, form data, search
   params and route params are all attacker-controlled.
3. **Never trust a client-supplied user id.** Derive it from `getUser()` per request.
4. **Return a discriminated result envelope, never a thrown string.**
5. **Cursor pagination only.** `offset` is O(n) and skips rows under concurrent writes.
6. **Creates take an idempotency key** — mobile networks retry.
7. **Rate limit every unauthenticated and every expensive endpoint.**
8. **Expo talks to Supabase directly.** Add a route handler only when the operation
   needs a secret the phone must never hold.

## Choosing the Primitive

| Need | Use |
|---|---|
| Render data | Server Component + `await createClient()` — no API layer, no waterfall |
| Web form mutation | Server Action — progressive enhancement, one surface to secure |
| Expo reads/writes | `supabase-js` directly — RLS already enforces auth |
| Third-party webhook | Route Handler `POST` — stable URL + signature check |
| OAuth / PKCE callback | Route Handler `GET` — must set cookies on a redirect |
| Server-only secret | Server Action or Route Handler — secret must not reach a bundle |
| Cron | Edge Function, or Route Handler + Vercel Cron — runs with no session |

Never build a route handler whose only job is to proxy a `select` the client
could make itself under RLS.

## Validation

Schemas live in `packages/validation`, shared by web and mobile.

```ts
import { z } from 'zod'

export const createMoveSchema = z.object({
  orgId: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  status: z.enum(['draft', 'active', 'done']).default('draft'),
  tagIds: z.array(z.string().uuid()).max(20).default([]),
})
export type CreateMoveInput = z.infer<typeof createMoveSchema>

export const listMovesSchema = z.object({
  orgId: z.string().uuid(),
  cursor: z.string().datetime().nullish(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'active', 'done']).optional(),
})
```

Parse at the boundary, then pass a typed object inward. Never thread raw
`FormData` or `unknown` deeper than the first function.

## Error Envelope

```ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ErrorCode; message: string
                          fields?: Record<string, string[]> } }

export type ErrorCode =
  | 'VALIDATION' | 'UNAUTHORIZED' | 'FORBIDDEN'
  | 'NOT_FOUND'  | 'CONFLICT'     | 'RATE_LIMITED' | 'INTERNAL'

export const ok  = <T>(data: T): ActionResult<T> => ({ ok: true, data })
export const err = (code: ErrorCode, message: string,
                    fields?: Record<string, string[]>): ActionResult<never> =>
  ({ ok: false, error: { code, message, fields } })

export function fromPostgrest(e: { code?: string; message: string }) {
  switch (e.code) {
    case '23505':    return err('CONFLICT', 'That already exists.')
    case '23503':    return err('VALIDATION', 'Referenced record does not exist.')
    case '42501':    return err('FORBIDDEN', 'You do not have access to this.')
    case 'PGRST116': return err('NOT_FOUND', 'Not found.')
    default:
      console.error('[db]', e)                    // server log only
      return err('INTERNAL', 'Something went wrong.')
  }
}
```

Never return a raw Postgres message to the client.

## Server Actions

```ts
// apps/web/app/(app)/moves/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createMoveSchema, ok, err, fromPostgrest, type ActionResult } from '@moves/validation'
import { rateLimit } from '@/lib/rate-limit'

export async function createMove(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  // 1. Authenticate — never accept a userId from the form.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return err('UNAUTHORIZED', 'Sign in to continue.')

  // 2. Rate limit per user.
  const { success } = await rateLimit(`create-move:${user.id}`)
  if (!success) return err('RATE_LIMITED', 'Too many requests.')

  // 3. Validate.
  const parsed = createMoveSchema.safeParse({
    orgId: formData.get('orgId'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    tagIds: formData.getAll('tagIds'),
  })
  if (!parsed.success)
    return err('VALIDATION', 'Check the highlighted fields.',
               parsed.error.flatten().fieldErrors as Record<string, string[]>)

  // 4. Mutate. RLS enforces membership — do not reimplement it here.
  const { data, error } = await supabase.from('moves')
    .insert({ org_id: parsed.data.orgId, owner_id: user.id,
              title: parsed.data.title, status: parsed.data.status })
    .select('id').single()
  if (error) return fromPostgrest(error)

  revalidatePath(`/orgs/${parsed.data.orgId}/moves`)
  return ok({ id: data.id })
}
```

```tsx
'use client'
import { useActionState } from 'react'      // React 19

export function CreateMoveForm({ orgId }: { orgId: string }) {
  const [state, action, pending] = useActionState(createMove, null)
  return (
    <form action={action}>
      <input type="hidden" name="orgId" value={orgId} />
      <input name="title" required maxLength={200} />
      {state?.ok === false && <p role="alert">{state.error.message}</p>}
      <button disabled={pending}>{pending ? 'Saving…' : 'Create'}</button>
    </form>
  )
}
```

Every Server Action is a public HTTP endpoint. Auth-check inside the action, not
only in the page that renders the form.

## Route Handlers

```ts
// apps/web/app/api/moves/route.ts
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(
    { ok: false, error: { code: 'UNAUTHORIZED', message: 'Sign in.' } }, { status: 401 })

  const parsed = listMovesSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams))
  if (!parsed.success) return NextResponse.json(
    { ok: false, error: { code: 'VALIDATION', message: 'Bad query',
        fields: parsed.error.flatten().fieldErrors } }, { status: 422 })

  const { orgId, cursor, limit, status } = parsed.data
  let q = supabase.from('moves').select('id, title, status, created_at')
    .eq('org_id', orgId).order('created_at', { ascending: false })
    .limit(limit + 1)                    // one extra row detects the next page
  if (status) q = q.eq('status', status)
  if (cursor) q = q.lt('created_at', cursor)

  const { data, error } = await q
  if (error) return NextResponse.json(
    { ok: false, error: { code: 'INTERNAL', message: 'Query failed' } }, { status: 500 })

  const hasMore = data.length > limit
  const items = hasMore ? data.slice(0, limit) : data
  return NextResponse.json({ ok: true,
    data: { items, nextCursor: hasMore ? items.at(-1)!.created_at : null } })
}
```

`params` and `searchParams` are Promises in the App Router — always `await`:

```ts
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

Route handlers are uncached by default — do not add
`export const dynamic = 'force-dynamic'` reflexively.

## Idempotency

Prefer a unique constraint that makes the operation naturally idempotent
(`unique (org_id, lower(email)) where accepted_at is null`). When that does not
fit, use a key table:

```sql
create table public.idempotency_keys (
  key uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  response jsonb not null,
  created_at timestamptz not null default now()
);
```

```ts
const key = request.headers.get('Idempotency-Key')
if (!key) return badRequest('Idempotency-Key header required')

const { data: existing } = await admin.from('idempotency_keys')
  .select('response').eq('key', key).eq('user_id', user.id).maybeSingle()
if (existing) return NextResponse.json(existing.response)   // replay

const result = await doTheWrite()
await admin.from('idempotency_keys')
  .insert({ key, user_id: user.id, endpoint: 'POST /api/moves', response: result })
return NextResponse.json(result, { status: 201 })
```

Sweep keys older than 24h on a schedule.

## Pagination

```ts
// Composite cursor, because created_at can tie.
let q = supabase.from('moves').select('id, created_at')
  .order('created_at', { ascending: false })
  .order('id', { ascending: false })
  .limit(limit + 1)

if (cursor) {
  const [ts, id] = cursor.split('|')
  q = q.or(`created_at.lt.${ts},and(created_at.eq.${ts},id.lt.${id})`)
}
```

Return `{ items, nextCursor }`. Never `count: 'exact'` on a hot list — it forces
a full scan. Use `count: 'planned'` if an approximation is genuinely needed.

## Rate Limiting

```ts
// apps/web/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '60 s'),
  prefix: 'moves',
})
export const rateLimit = (id: string) => limiter.limit(id)
```

Key by `user.id` when authenticated, else by
`request.headers.get('x-forwarded-for')?.split(',')[0]`. Never key an
authenticated limit by IP alone — corporate NATs share one. Return `429` with
`Retry-After`.

## How Expo Calls the Backend

**Default: `supabase-js` directly.** RLS applies identically to the phone; a
route handler in front of a `select` buys latency and a second place to forget
`getUser()`.

```ts
export async function listMoves(orgId: string, cursor?: string) {
  let q = supabase.from('moves').select('id, title, status, created_at')
    .eq('org_id', orgId).order('created_at', { ascending: false }).limit(21)
  if (cursor) q = q.lt('created_at', cursor)
  const { data, error } = await q
  if (error) throw error
  return { items: data.slice(0, 20),
           nextCursor: data.length > 20 ? data[19].created_at : null }
}
```

Use a route handler or Edge Function from Expo only when the operation needs a
third-party secret, must run under the service role, spans external systems, or
is webhook-shaped.

```ts
const { data: { session } } = await supabase.auth.getSession()
await fetch(`${API_URL}/api/moves/checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json',
             Authorization: `Bearer ${session?.access_token}`,
             'Idempotency-Key': crypto.randomUUID() },
  body: JSON.stringify(payload),
})
```

Server side, build the client from the bearer token — mobile callers have no cookies:

```ts
const token = request.headers.get('Authorization')?.replace('Bearer ', '')
const supabase = createSupabaseClient(URL, ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${token}` } } })
const { data: { user } } = await supabase.auth.getUser()   // verifies the JWT
```

Share zod schemas and response types from `packages/validation` so web and
mobile cannot drift.

## Red Flags

- A route handler that only wraps a `select` the client could run under RLS.
- Any handler or action reading `userId` from the body, form, or query string.
- `formData.get('x') as string` with no zod parse.
- `throw new Error(...)` as the error channel in a Server Action.
- Raw Postgres `error.message` returned to the client.
- A Server Action with no `getUser()` because "the page is protected".
- `.range()` / offset pagination on an infinite list; `count: 'exact'` on a hot endpoint.
- No rate limit on signup, login, password reset, invite, or search.
- Creates with neither an idempotency key nor a unique constraint.
- `params` or `searchParams` used without `await`.
- Duplicated zod schemas in `apps/web` and `apps/mobile`.
- `revalidatePath` omitted after a mutation.
