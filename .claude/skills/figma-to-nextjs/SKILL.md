---
name: figma-to-nextjs
description: >
  Turns a Figma frame into a production Next.js 16 App Router component in apps/web:
  cheap MCP tree walk, Figma variables mapped onto @moves/design-tokens, Server
  Component output, next/image for every fill, and a build + screenshot-diff loop.
  Activates when a Figma URL or node id is pasted, when asked to "build this
  screen/section/page in Next", or when a web route must match a Figma frame.
---

# Figma → Next.js 16

Complements [figma-to-code] (raw REST specs, image export, measurement discipline).
That skill gets you *numbers*. This one gets you a *shipped route*. Use the Figma MCP
here; drop to REST only when a tool errors twice.

## Core Rules

1. **`get_metadata` before anything else.** Map the frame tree first. Never call
   `get_design_context` on a root frame — it returns megabytes and blows context.
2. **`get_variable_defs` once per file, then map to `@moves/design-tokens`.** A Figma
   variable that has no token match is a bug in the design or a missing token — raise
   it, add it to `packages/design-tokens/src/index.ts`, never inline a hex.
3. **Server Component by default.** `"use client"` only for state, effects, event
   handlers, or browser APIs. Push it to the smallest leaf, never the page.
4. **Every Figma image fill becomes `next/image`** with explicit `width`/`height` or
   `fill` + `sizes`. Never a raw `<img>`, never a CSS `background-image` for content.
5. **Auto-layout maps to flex, never to absolute positioning.** Absolute only where
   Figma itself used absolute constraints inside a relative parent.
6. **Desktop-only frame → you still ship mobile-first.** Write the small-screen layout
   yourself and layer the Figma frame in at `breakpoint.lg`. Do not ship a fixed 1440.
7. **Not done until `pnpm --filter web build` passes and the screenshot diff is clean.**

## 1. MCP sequence

Run in this order. Each step is cheap because the previous one narrowed the scope.

```
1. get_metadata      { nodeId: "48:3708" }   → id/name/type/bbox tree, no styles
2. get_variable_defs { nodeId: "48:3708" }   → { "color/bg/subtle": "#fafafa", ... }
3. get_design_context{ nodeId: "<leaf>"  }   → per-node fills/type/layout, ONE node
4. get_screenshot    { nodeId: "48:3708" }   → the ground-truth image, keep it
```

- URL `…/design/<FILE_KEY>/…?node-id=48-3708` → nodeId `48:3708`. Always convert `-`→`:`.
- From `get_metadata`, pick the **section-level** children (hero, nav, card grid) and
  call `get_design_context` on each. One call per section, not per rectangle.
- Cache the `get_screenshot` output path — step 5 diffs against it.
- `get_code_connect_map` first if `packages/ui` components are mapped: a mapped node
  means *use the existing component*, do not regenerate it.

## 2. Auto-layout → CSS

| Figma | CSS |
|---|---|
| Auto-layout vertical | `display:flex; flex-direction:column` |
| Auto-layout horizontal | `display:flex; flex-direction:row` |
| Item spacing | `gap` (snap to `space` scale) |
| Padding L/R/T/B | `padding` (snap to `space` scale) |
| Align: packed + center | `align-items:center` |
| Align: space-between | `justify-content:space-between` |
| Fill container | `flex:1` (or `width:100%` on the cross axis) |
| Hug contents | default — write nothing |
| Fixed width | `width: Npx` → prefer `max-width` + `width:100%` |
| Clip content | `overflow:hidden` |
| Wrap enabled | `flex-wrap:wrap` |
| Grid layout / equal-width card rows | `display:grid; grid-template-columns:repeat(N,minmax(0,1fr))` |

Snap every measured value to the token scale. `itemSpacing: 22` is `space[6]` (24),
not `22px`. If it is more than 4px off a token, ask before inventing a value.

## 3. Variables → tokens

```ts
// apps/web/src/components/hero/hero.module.css.ts is NOT a thing — we use CSS Modules
// with the custom properties generated from the token package.
import '@moves/design-tokens/css'; // once, in apps/web/src/app/layout.tsx
```

Mapping is mechanical:

| Figma variable | Token | CSS custom property |
|---|---|---|
| `color/bg/*` | `lightTheme.bg` / `bgSubtle` / `bgMuted` | `--color-bg`, `--color-bg-subtle` |
| `color/text/*` | `lightTheme.text` / `textMuted` / `textInverse` | `--color-text`, `--color-text-muted` |
| `color/accent/*` | `lightTheme.accent` / `accentHover` / `accentSubtle` / `onAccent` | `--color-accent`, `--color-on-accent` |
| `color/border/*` | `lightTheme.border` / `borderStrong` | `--color-border` |
| `space/*` | `space[1…32]` | `--space-4` |
| `radius/*` | `radius.sm…['2xl']`, `radius.full` | `--radius-lg` |
| `type/size/*` | `fontSize.xs…['7xl']` | `--text-2xl` |
| `type/leading/*` | `lineHeight.tight/snug/normal/relaxed` | `--leading-snug` |
| `type/weight/*` | `fontWeight.regular…bold` | `--weight-semibold` |
| `effect/shadow/*` | `shadow.sm/md/lg` → `.css` | `--shadow-md` |
| motion | `duration.*`, `easing.standard/exit/spring` | `--duration-base`, `--ease-standard` |

Dark mode is free: `darkTheme` drives the `[data-theme="dark"]` block in `tokens.css`.
Never write a second dark-mode hex in a component.

When you need a token in TS (a `style` prop, a motion value, a `sizes` calc):

```ts
import { space, radius, duration, easing, maxWidth, breakpoint } from '@moves/design-tokens';

export const CARD_RADIUS = radius.lg;                 // 14
export const REVEAL = `${duration.base}ms ${easing.standard}`;
export const CONTENT = maxWidth.content;              // 1120
export const LG = breakpoint.lg;                      // 1024
```

## 4. The component

Server Component, async params, React 19. This is the shape every generated route takes.

```tsx
// apps/web/src/app/(marketing)/[slug]/page.tsx
import type { Metadata } from 'next';
import { Hero } from '@/components/hero';

// Next.js 16: params and searchParams are Promises. Always await them.
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Moves — ${slug}` };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <Hero slug={slug} />;
}
```

```tsx
// apps/web/src/components/hero/index.tsx — Server Component. No "use client".
import Image from 'next/image';
import styles from './hero.module.css';
import { SubscribeForm } from './subscribe-form'; // the ONLY client leaf

export function Hero({ slug }: { slug: string }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Now in beta</p>
        <h1 id="hero-title" className={styles.title}>Move faster together</h1>
        <p className={styles.lede}>One shared plan for every trip you take.</p>
        <SubscribeForm source={slug} />
      </div>
      <Image
        src="/figma/hero-device.png"   // exported at scale=2 from the Figma fill
        alt=""                          // decorative — real alt when it carries meaning
        width={720}
        height={540}
        priority                        // above the fold only
        sizes="(max-width: 1024px) 100vw, 720px"
        className={styles.art}
      />
    </section>
  );
}
```

```css
/* hero.module.css — tokens only. Zero raw hex, zero raw px on the space axis. */
.hero {
  display: flex;
  flex-direction: column;      /* mobile-first: Figma's row layout is the ENHANCEMENT */
  gap: var(--space-8);
  padding: var(--space-12) var(--space-6);
  max-width: 1120px;           /* maxWidth.content */
  margin-inline: auto;
  background: var(--color-bg);
}
.title {
  font-size: clamp(2.375rem, 1.6rem + 3.4vw, 4.75rem); /* fontSize 4xl → 7xl */
  line-height: var(--leading-tight);
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;     /* letterSpacing.tighter */
  color: var(--color-text);
  text-wrap: balance;
}
.lede { font-size: var(--text-lg); line-height: var(--leading-normal); color: var(--color-text-muted); }
.art  { width: 100%; height: auto; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); }

@media (min-width: 1024px) {   /* breakpoint.lg — the Figma desktop frame lands here */
  .hero { flex-direction: row; align-items: center; gap: var(--space-16); padding-block: var(--space-24); }
  .copy { flex: 1; }
}
```

Client leaves stay tiny:

```tsx
'use client';
import { useState } from 'react';
export function SubscribeForm({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  /* ... */
}
```

## 5. Responsive from a desktop-only frame

The file has one 1440 frame. You are still responsible for 320px. Rules:

- **Type:** every heading gets `clamp(min, fluid, max)` where `max` is the Figma value
  and `min` is two steps down the `fontSize` scale. Body text does **not** get clamp —
  `fontSize.base` at every width.
- **Space:** section padding scales `space[12] → space[24]` at `lg`. Gaps step one or
  two rungs, never linearly.
- **Layout:** N-column desktop grids collapse to 1 column below `md` (768) and 2 below
  `lg` (1024). Horizontal card rows below `md` become a scroll-snap row, not a squeeze.
- **Images:** always `sizes`. `(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px`.
- **Touch:** any interactive element gets `min-height: 44px` (`MIN_TOUCH_TARGET`).

## 6. Verification loop

Repeat until the diff is boring:

```bash
pnpm --filter web build          # must pass — type errors are failures, not warnings
pnpm --filter web dev            # then screenshot the route at the Figma frame width
```

1. `get_screenshot` the Figma node → reference image.
2. Screenshot the running route at exactly the frame width (1440), then at 390.
3. Diff visually: title size, section padding, gap rhythm, image crop, border radius.
4. Inspect computed styles for the three largest text nodes — screenshots lie about
   `font-size` and `line-height`. Compare numbers, not vibes.
5. Fix, rebuild, re-shoot. Two clean passes in a row, then stop.

## Red Flags

Reject in review:

- `get_design_context` called on a whole page frame, or before `get_metadata`.
- Any hex, rgb, or hsl literal in `apps/web`. Any raw px in `padding`/`margin`/`gap`.
- A token name that does not exist in `packages/design-tokens/src/index.ts`
  (`spacing.md`, `colors.primary`, `fontSizes.large` — all invented, all wrong).
- `"use client"` at the top of a `page.tsx` or a section component.
- `params.slug` read without `await` — Next.js 16 params are Promises.
- `<img>`, or `next/image` without `sizes` when using `fill` / responsive widths.
- `priority` on more than one image per route.
- Absolute positioning reproducing an auto-layout stack.
- A fixed `width: 1440px` wrapper, or a component with no `@media` block at all.
- Hardcoded dark-mode colors instead of letting `darkTheme` custom properties flip.
- Shipping without running the build, or "it looks right" with no screenshot diff.
