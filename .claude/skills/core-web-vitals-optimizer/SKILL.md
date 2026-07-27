---
name: core-web-vitals-optimizer
description: >
  LCP, INP, CLS optimization playbook tied to Next.js 16 (App Router,
  Turbopack, RSC) and Payload CMS specifics. Activates when investigating
  performance issues, before any production deploy, and when adding
  anything that touches the critical render path (fonts, images, JS bundles).
---

# Core Web Vitals Optimizer — Next.js 16 Edition

You are obsessed with the three numbers: **LCP < 2.5s · INP < 200ms · CLS < 0.1**.
You know exactly where time goes in a Next.js 16 / RSC render, and you fix
the cause, not the symptom.

## Target Numbers (production, 75th percentile, mobile)

| Metric | Good | Needs work | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | <2.5s | 2.5–4s | >4s |
| **INP** (Interaction to Next Paint) | <200ms | 200–500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.1–0.25 | >0.25 |
| **TTFB** (Time to First Byte) | <800ms | 800–1800ms | >1800ms |
| **FCP** (First Contentful Paint) | <1.8s | 1.8–3s | >3s |

For the "world's fastest agency site" claim (per [AGENTS.md](AGENTS.md)),
you should target the *Good* column with margin: LCP <2.0s, INP <150ms, CLS <0.05.

## LCP Optimization — The 4 Causes

### Cause 1: Slow Server Response (TTFB)
- Use Server Components (default in App Router) for above-the-fold content
- For Payload globals (`EcomPdpHero`, etc.), **cache the fetch** — don't re-fetch on every render
- Use `force-static` route segment config where possible
- Avoid `await` chains in the root layout

### Cause 2: Resource Blocking (CSS / JS)
- **No render-blocking JS** above the fold. RSC handles this — keep `"use client"` minimal.
- **Critical CSS** inlined in `<head>` (Next.js does this for the styles it knows about)
- **Defer non-critical CSS** with `media="print" onload="this.media='all'"`

### Cause 3: Slow Resource Load (Image / Font)
- **Hero image**: `priority` prop on `next/image`, AVIF format, explicit `sizes`
- **Fonts**: `next/font/google` with `display: 'swap'` and `preload: true` only for the *hero* font weight (you use Plus Jakarta Sans + JetBrains Mono — preload just the H1 weight)
- **Preconnect** to external domains in the root layout (`<link rel="preconnect" href="https://images.refero.design" />`)

### Cause 4: Client-Side Rendering Above the Fold
- The hero should be a Server Component. **Period.**
- GSAP animations are client-only — gate them behind an `IntersectionObserver` so they don't block LCP

## INP Optimization

INP measures the worst interaction delay. Common causes in Next 16:

- **Hydration cost**: Too much client JS. Audit `"use client"` boundaries — push them as deep as possible.
- **Heavy event handlers**: Debounce scroll/resize handlers. Use `requestIdleCallback` for non-urgent work.
- **Third-party scripts**: GTM, Clarity, Meta Pixel. Load with `next/script strategy="lazyOnload"` or, better, only after first interaction.
- **Long tasks**: Anything >50ms on the main thread. Use the Performance panel in Chrome DevTools to find them.

```tsx
// GOOD — analytics loaded after first interaction
<Script
  src="https://clarity.com/tag"
  strategy="lazyOnload"
/>
```

## CLS Optimization

CLS is fixable with **discipline, not magic**. The rules:

1. **Always specify `width` and `height` on images** (or use `fill` with a sized parent)
2. **Reserve space for fonts**: `next/font` handles this if you use it correctly. Avoid swapping between web font and fallback — match metrics with `adjustFontFallback`.
3. **Ad / embed placeholders**: Pre-allocate the slot height before the embed loads
4. **Don't inject above-the-fold content after page load** — banners, cookie notices, etc. should be in the initial HTML
5. **Use `transform` for animations**, not `top/left/margin` — transform doesn't trigger layout

## The Optimization Process

When investigating a perf issue:

1. **Measure first.** Run Lighthouse (or `lighthouse-mcp` when installed) on the production URL, mobile profile, 3 runs, take median.
2. **Identify the bottleneck metric.** Don't optimize INP if LCP is the killer.
3. **Open Chrome DevTools Performance tab.** Throttle to "Slow 4G + 4× CPU slowdown."
4. **Find the longest task** in the LCP critical path.
5. **Form a hypothesis**, make ONE change, re-measure.
6. **Reject changes that don't move the number** by ≥10%.

## Next.js 16 + Payload CMS Specifics

- **Turbopack dev** is fast but doesn't represent prod bundling. **Always measure prod builds** (`npm run build && npm start`).
- **Payload SQLite** queries are fast locally but slow over Turso HTTP — measure DB time separately
- **`outputFileTracingIncludes`** in `next.config.ts` already includes libsql binaries — don't shrink this or admin routes break
- **`next-view-transitions`** is enabled — keep transitions <300ms to feel snappy
- **Image optimization**: Next 16 auto-converts to AVIF. Just use `next/image`.

## Quick Wins (try these first)

In rough order of ROI for a typical Next 16 + Payload landing page:

1. **Add `priority` to the hero image** — 200–500ms LCP improvement
2. **Convert client components to Server Components** above the fold — 100–400ms LCP
3. **Preload the H1 font weight only** — 100–200ms LCP
4. **Lazy-load analytics with `strategy="lazyOnload"`** — 50–200ms INP
5. **Add explicit `sizes` attribute to all images** — fixes CLS + reduces bandwidth
6. **Remove unused fonts** (one sans + one mono only) — 50–150ms LCP
7. **Defer GSAP animations until in viewport** — reduces main-thread blocking
8. **Use `font-display: swap` + `adjustFontFallback`** — fixes font CLS

## What NOT to do

- Don't add a service worker / PWA caching layer "to make it faster" — it adds complexity, hurts development, and rarely moves the 75th-percentile number
- Don't lazy-load images above the fold (every image above the fold should be `priority`)
- Don't use `loading="lazy"` on the LCP image — that's a guaranteed regression
- Don't ship a generic perf audit. Tie every recommendation to a specific number.

## How to Apply in this Project

- The hero currently uses GSAP animations and has multiple rotating industry sections. Verify each animation defers until in viewport.
- Audit the bundle size for the homepage after build: `npm run build` → look at the "First Load JS" column. Target <100KB for `/`.
- When the lighthouse-mcp comes online (post-restart), run it on `localhost:3010` and on the production URL. Use those numbers as the baseline.
