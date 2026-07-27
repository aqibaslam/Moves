# Moves — Agent Configuration

> **Read this before writing any code.**

## ⚠️ Version reality check

This repo runs **Next.js 16.2.2**, **React 19.2.4**, **Expo SDK 57**, **React Native 0.86**,
and **Reanimated 4**. These are newer than most training data. APIs, conventions, and file
structure differ from what you remember.

Before writing framework code, read the local docs:

- Next.js → `node_modules/next/dist/docs/`
- Expo / RN → check the installed version's own typings, not your memory

Heed deprecation notices. When unsure of an API, verify against `node_modules` or the
`context7` MCP server rather than guessing.

## Project overview

**Moves** is a pnpm + Turborepo monorepo: one Next.js web app, one Expo mobile app, one
Supabase backend, one shared design system.

```
Moves/
├── apps/
│   ├── web/                  Next.js 16 App Router
│   └── mobile/               Expo SDK 57 + expo-router
├── packages/
│   ├── design-tokens/        ← single source of truth for all visual values
│   ├── ui/                   cross-platform components (.tsx / .native.tsx)
│   └── supabase-client/      typed clients: browser / server / admin / native
├── supabase/migrations/      timestamped SQL, applied in order
└── .claude/skills/           41 skills — see table below
```

## Critical rules — always active

1. **Design tokens only.** Zero hardcoded colours, spacing, font sizes, radii, or durations
   anywhere in `apps/` or `packages/ui`. If a value isn't in `@moves/design-tokens`, add it
   there first. `packages/design-tokens/src/index.ts` and `tokens.css` are the *only* two
   files where raw values may appear — and they must stay in sync.
2. **Server Components by default.** `"use client"` only for actual interactivity, and push
   it to the smallest possible leaf component.
3. **The service-role key is server-only.** Never `NEXT_PUBLIC_*`, never `EXPO_PUBLIC_*`,
   never imported from `apps/mobile`. It bypasses Row Level Security entirely.
4. **RLS on every table. No exceptions.** A table without a policy is a public table.
   Write the policy in the same migration that creates the table.
5. **`getUser()`, never `getSession()`, on the server.** `getSession()` trusts the cookie
   without revalidating it and is trivially spoofable.
6. **Mobile-first.** Every web surface works at 320px. Every native touch target is ≥44pt.
7. **Animate transform and opacity only.** Never width, height, top, or left.
   `prefers-reduced-motion` is a hard requirement, not a nicety.
8. **Regenerate types after every migration.** `pnpm db:types`.
9. **Build must pass** before anything is called done: `pnpm typecheck && pnpm build`.
10. **Accessibility is not a phase.** Semantic elements, visible focus, real labels,
    4.5:1 contrast — while you write it, not after.

## Skills

All 41 live in `.claude/skills/`. Read the relevant one **before** starting related work.

### Design & UI
| Skill | When |
|---|---|
| `ui-ux-pro-max` / `uiux-promax` | Any component, layout, or styling work |
| `frontend-design` | Visual design decisions, aesthetic direction |
| `design-system-creation` | Extending the token layer or component library |
| `design-system-enforcer` | Reviewing CSS, catching token drift |
| `web-design-guidelines` | General web design standards |
| `uiux-layout-ideas` | Layout exploration and composition |
| `modern-landing-pages` | Marketing pages |
| `landing-page-anatomy` | Landing page structure |
| `brand-guidelines` | Brand colour, type, and token consistency |
| `canvas-design` | Posters, PDFs, PNGs, generated visual art |
| `motion-and-interaction` | Any animation, transition, or gesture |
| `image-gen` | Creating or replacing visual assets |

### Figma → code
| Skill | When |
|---|---|
| `figma-to-code` | General Figma extraction |
| `figma-to-nextjs` | Figma frame → Next.js App Router component |
| `figma-to-html` | Figma frame → semantic standalone HTML/CSS |
| `page-cloner` | Wireframe or reference → components |

### Frontend engineering
| Skill | When |
|---|---|
| `frontend-master` | Component and architecture decisions |
| `react-best-practices` | Any React code |
| `composition-patterns` | Component API design |
| `cross-platform-ui` | Anything shared between web and mobile |
| `react-native-skills` | Expo / React Native work |
| `tailwind-css` | Only if Tailwind is introduced — this repo uses vanilla CSS + tokens |
| `html-css-quality` | CSS review |
| `core-web-vitals-optimizer` | Performance work |
| `explaining-code` | Walking through existing code |

### Backend
| Skill | When |
|---|---|
| `supabase-architect` | Schema, RLS, auth, storage, realtime, edge functions |
| `database-schema-design` | Postgres modelling, indexes, migrations |
| `api-design` | Server Actions, Route Handlers, validation, pagination |
| `auth-and-security` | Auth flows, session handling, secrets, security review |
| `backend-testing` | Unit, integration, RLS policy tests, E2E |

### Conversion & copy
| Skill | When |
|---|---|
| `cro-copywriter` | Any user-facing text |
| `cro-audit` | Conversion review |
| `conversion-funnel-design` | Funnel structure |
| `persuasion-playbook` | Persuasion patterns |
| `mobile-conversion-patterns` | Mobile conversion |

### Accessibility & QA
| Skill | When |
|---|---|
| `accessibility-auditor` | Pre-deploy WCAG and SEO checks |
| `accesslint-audit` / `accesslint-scan` / `accesslint-diff` | Automated a11y auditing |
| `get-shit-done` | Breaking down and shipping work |

## MCP servers

Configured in `.mcp.json`:

| Server | Purpose | Setup |
|---|---|---|
| `figma` | Design context, variables, screenshots | needs `FIGMA_API_KEY` in env |
| `supabase` | Schema introspection, docs, migrations | hosted, OAuth on first use, **read-only** |
| `accesslint` | Accessibility auditing | none |
| `playwright` | Browser automation, E2E | none |
| `context7` | Up-to-date library docs — use it instead of guessing APIs | none |

The Supabase server is pinned `read_only=true`. To allow writes, remove that param from
`.mcp.json` deliberately — don't do it by accident.

## Commands

```bash
pnpm dev              # everything
pnpm dev:web          # Next.js only
pnpm dev:mobile       # Expo only
pnpm build
pnpm typecheck

pnpm db:start         # local Supabase (needs Docker)
pnpm db:diff <name>   # capture schema changes into a migration
pnpm db:push          # apply migrations to the hosted project
pnpm db:types         # regenerate database.types.ts — run after every migration
```

## Conventions

- **Files:** components `PascalCase.tsx`, everything else `kebab-case.ts`
- **Native variants:** `Button.tsx` + `Button.native.tsx` + shared `Button.types.ts`
- **Imports:** workspace packages by name (`@moves/ui`), never relative paths across packages
- **Migrations:** `supabase/migrations/<timestamp>_<verb>_<subject>.sql`, never edited once applied
- **Validation:** zod at every boundary — Server Actions, Route Handlers, form input
- **Env:** add every new variable to `.env.example` with a comment in the same commit
