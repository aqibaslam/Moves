# Moves

A pnpm + Turborepo monorepo: Next.js web app, Expo mobile app, shared Supabase backend,
and one design system driving both platforms.

```
apps/web         Next.js 16 App Router
apps/mobile      Expo SDK 57 + expo-router
packages/design-tokens   single source of truth for every visual value
packages/ui              cross-platform components
packages/supabase-client typed Supabase clients
supabase/migrations      versioned SQL
```

## Setup

**1. Install dependencies**

```bash
pnpm install
```

**2. Create a Supabase project**

Go to [supabase.com/dashboard](https://supabase.com/dashboard) → New project.
Then Settings → API and copy the values into `.env.local`:

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the two
`EXPO_PUBLIC_*` duplicates. The service-role key is only needed if you add
server-side admin operations.

**3. Apply the schema**

```bash
pnpm dlx supabase link --project-ref <your-project-ref>
pnpm db:push
pnpm db:types
```

Or work locally instead (requires Docker):

```bash
pnpm db:start
pnpm db:types
```

**4. Run**

```bash
pnpm dev:web      # http://localhost:3000
pnpm dev:mobile   # Expo dev server
```

## Design system

`packages/design-tokens/src/index.ts` is the single source of truth. It is plain data with
no framework imports, so both bundlers can consume it:

- **Web** reads `tokens.css` — the same values as CSS custom properties
- **Native** imports the TS object directly into `StyleSheet.create`

These two files must stay in sync. They are the only place raw values may appear —
everywhere else uses `var(--token)` or `tokens.x.y`.

Cross-platform components use the platform-extension pattern: `Button.tsx` for web,
`Button.native.tsx` for native, both typed against a shared `Button.types.ts` so the
two APIs cannot drift.

## Working with agents

`AGENTS.md` (aliased as `CLAUDE.md`) holds the full agent configuration — critical rules,
a map of all 41 skills in `.claude/skills/`, and the MCP server setup. Read it first.
