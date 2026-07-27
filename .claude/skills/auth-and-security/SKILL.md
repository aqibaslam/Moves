---
name: auth-and-security
description: >
  End-to-end auth and security for the Moves monorepo — Supabase auth flows,
  Next.js middleware session refresh, protecting Server Actions, the service-role
  key rule, secret handling, CORS, sanitization, and a pre-ship checklist.
  Activates when touching middleware, login/signup/callback routes, env vars, any
  code referencing a service-role key, or when reviewing a change for security.
---

# Auth and Security

Two rules carry most of the weight: **RLS is the authorization boundary**, and
**the service-role key bypasses it completely**. Everything here protects those two.

## Core Rules

1. **`getUser()` for every server authorization decision.** `getSession()` reads
   an unverified cookie and can be forged.
2. **Middleware refreshes the session on every request** and must return the
   exact response object whose cookies were mutated.
3. **Every Server Action authenticates itself.** A protected page is not a
   protected action — actions are independently reachable HTTP endpoints.
4. **`SUPABASE_SERVICE_ROLE_KEY` never appears in `NEXT_PUBLIC_*`, in a
   `"use client"` file, or anywhere under `apps/mobile`.** It bypasses all RLS.
5. **Middleware is a redirect convenience, not a security control.**
6. **Validate and bound every input** before it reaches the database or a template.
7. **No wildcard CORS on authenticated endpoints.** Allowlist exact origins.
8. **Rotate any secret that has touched a client bundle, a log, or a commit.**

## Session Refresh Middleware

Access tokens are short-lived. Without middleware, Server Components see expired
tokens and users get logged out mid-session.

```ts
// apps/web/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Must be immediately after client creation. Put NOTHING between them.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isPublic = path.startsWith('/auth') || ['/', '/login', '/signup'].includes(path)

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // CRITICAL: return supabaseResponse itself. If you build a different response,
  // copy cookies across: res.cookies.setAll(supabaseResponse.cookies.getAll())
  // Otherwise the refreshed session is dropped and the user is logged out.
  return supabaseResponse
}
```

```ts
// apps/web/middleware.ts
export { updateSession as middleware } from '@/lib/supabase/middleware'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)'],
}
```

## Auth Flows

```ts
await supabase.auth.signUp({
  email, password,
  options: { emailRedirectTo: `${origin}/auth/confirm`,
             data: { full_name: fullName } },   // → raw_user_meta_data
})
```

`raw_user_meta_data` is **user-writable**. Never store roles, plans, or
entitlements there — put them in `memberships.role` guarded by RLS, or in
`app_metadata`, which only server-side admin calls can write.

```ts
// apps/web/app/auth/confirm/route.ts — token-hash OTP / magic link
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  // Open-redirect guard.
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`)
  }
  return NextResponse.redirect(`${origin}/login?error=expired_link`)
}
```

Sign out must run server-side so cookies are actually cleared:

```ts
'use server'
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

In Expo, `supabase.auth.signOut()` clears AsyncStorage — also clear cached query
state. Stale user data surviving a logout is a leak.

## Protecting Server Actions

```ts
// apps/web/lib/auth.ts
import 'server-only'          // build fails if a client component imports this
import { createClient } from '@/lib/supabase/server'

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new AuthError('UNAUTHORIZED')
  return { supabase, user }
}

export async function requireOrgRole(orgId: string, roles: string[]) {
  const { supabase, user } = await requireUser()
  const { data } = await supabase.from('memberships')
    .select('role').eq('org_id', orgId).eq('user_id', user.id).maybeSingle()
  if (!data || !roles.includes(data.role)) throw new AuthError('FORBIDDEN')
  return { supabase, user, role: data.role }
}
```

Put `import 'server-only'` at the top of every module that touches secrets or an
admin client. Use the helpers in every action:

```ts
'use server'
export async function deleteMove(orgId: string, moveId: string) {
  const { supabase } = await requireOrgRole(orgId, ['owner', 'admin'])
  await supabase.from('moves')
    .update({ deleted_at: new Date().toISOString() }).eq('id', moveId)
  // RLS is still the real gate; this check just produces a better error.
}
```

Never pass a role, permission flag, or `isAdmin` boolean from the client into an
action. Re-derive it server-side every time.

## The Service-Role Key Rule

The service role bypasses **all** RLS. Treat it as a root password.

```ts
// apps/web/lib/supabase/admin.ts
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
```

Legitimate uses, and nothing else: verified webhook handlers with no session,
cron jobs, staff-only admin tooling, and writes to tables clients must never
touch (`audit_log`, `idempotency_keys`).

Every admin call site does its own authorization, because the database will not:

```ts
const admin = createAdminClient()
// WRONG: admin.from('moves').delete().eq('id', id)   ← zero ownership check
const { data: move } = await admin.from('moves').select('org_id').eq('id', id).single()
if (!(await userIsOrgAdmin(user.id, move.org_id))) throw new AuthError('FORBIDDEN')
await admin.from('moves').delete().eq('id', id)
```

## Secret Handling

| Variable | Lives in | Client-exposed? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | web env | Yes — fine, RLS protects it |
| `EXPO_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | mobile env | Yes — fine |
| `SUPABASE_SERVICE_ROLE_KEY` | web server env | **Never** |
| `SUPABASE_DB_URL`, `STRIPE_SECRET_KEY`, webhook secrets | server env | **Never** |

`NEXT_PUBLIC_*` and `EXPO_PUBLIC_*` are inlined into the shipped bundle at build
time. An `.ipa`/`.apk` is trivially unpacked — treat every `EXPO_PUBLIC_*` value
as published.

```ts
// packages/config/src/env.ts — fail the build, not a request
import { z } from 'zod'
export const serverEnv = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
}).parse(process.env)
```

`.env*` in `.gitignore`; commit `.env.example` with empty values. Never
`console.log` a token, session, or full request headers. On a leak: rotate in the
Supabase dashboard, redeploy, then audit `auth.audit_log_entries` for the window.

## CORS

Server Components and Server Actions are same-origin — CORS only applies to route
handlers called cross-origin.

```ts
const ALLOWED = new Set([
  'https://moves.app', 'https://staging.moves.app',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:8081'] : []),
])

function corsHeaders(origin: string | null) {
  if (!origin || !ALLOWED.has(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,   // echo the exact origin, never '*'
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
    Vary: 'Origin',
  }
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) })
}
```

Never combine `Allow-Origin: *` with credentials. Native Expo `fetch` sends no
`Origin` header — CORS is not a substitute for auth.

## Input Sanitization

- **SQL injection**: PostgREST parameterizes everything. The exceptions are
  `.or()`/`.filter()` built from interpolated strings and `.rpc()` args fed into
  dynamic SQL. Whitelist column names; never string-build a filter.
- **XSS**: React escapes by default. `dangerouslySetInnerHTML` requires
  `isomorphic-dompurify` first — no exception for "trusted admin" content.
- **Uploads**: enforce `allowed_mime_types` and `file_size_limit` on the bucket,
  not just client-side. Generate the path as
  `${user.id}/${crypto.randomUUID()}.${ext}` — never trust a filename.
- **Bound everything**: `.max()` on strings and arrays, `limit` capped at 100,
  JSON body size limited. Unbounded input is a DoS vector.

```ts
// next.config.ts
headers: async () => [{ source: '/:path*', headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]}]
```

## Pre-Ship Security Checklist

- [ ] Every table in `public` has `enable row level security`.
- [ ] No `using (true)` policy unless the table is intentionally world-readable.
- [ ] Every `for update` policy has a `with check`. No `for all` policies.
- [ ] Every `security definer` function sets `search_path = ''`.
- [ ] Every view is `with (security_invoker = on)`.
- [ ] `grep -rn "SERVICE_ROLE" apps/` — nothing in `apps/mobile`, nothing in a
      `"use client"` file.
- [ ] `grep -rn "NEXT_PUBLIC_.*\(SERVICE\|SECRET\)" .` is empty.
- [ ] Every module using a secret or admin client starts with `import 'server-only'`.
- [ ] Every Server Action calls `requireUser()` / `requireOrgRole()`.
- [ ] No server code uses `getSession()` for an authorization decision.
- [ ] Middleware returns `supabaseResponse` (or copies its cookies forward).
- [ ] Redirect targets validated against open redirect.
- [ ] Rate limits on login, signup, password reset, OTP, invite, search.
- [ ] CORS allowlist has no `*` and no stale preview domains.
- [ ] Buckets private; user content via signed URLs; MIME + size limits set.
- [ ] Supabase Auth: email confirmation on, leaked-password protection on,
      redirect allowlist contains only real domains, OTP expiry ≤ 1 hour.
- [ ] `.env*` gitignored; `git log -p -S 'service_role'` clean.
- [ ] `pnpm audit` clean for high/critical; `supabase db lint` and Security
      Advisor show no errors.
- [ ] RLS policy tests pass (see `backend-testing`).

## Red Flags

- `getSession()` gating access on the server.
- Middleware building a fresh `NextResponse` without copying Supabase cookies.
- Any code between `createServerClient()` and `getUser()` in middleware.
- A Server Action with no auth check "because the page redirects".
- `createAdminClient()` in a user-reachable action with no permission re-check.
- Any `SERVICE_ROLE` reference in `apps/mobile` or a client component.
- Roles, plans, or entitlements read from `user_metadata`.
- `Access-Control-Allow-Origin: *` on an authenticated route.
- `dangerouslySetInnerHTML` without DOMPurify.
- A redirect target taken straight from a query param.
- Secrets logged, or `.env` committed.
- zod schemas with unbounded strings/arrays, or an uncapped `limit`.
- Storage paths built from a user-supplied filename.
