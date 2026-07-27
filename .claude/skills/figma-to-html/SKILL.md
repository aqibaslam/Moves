---
name: figma-to-html
description: >
  Turns a Figma frame into one self-contained, semantic, accessible HTML file —
  real landmarks instead of div-soup, a custom-property block generated from
  @moves/design-tokens, fluid clamp() type, and grid/flex derived from auto-layout.
  Activates when asked for a standalone page, static export, email-safe mockup,
  prototype, or "just the HTML/CSS" from a Figma node — no React, no build step.
---

# Figma → semantic HTML/CSS

Output is **one `.html` file** that opens in a browser with no server, no bundler, no
CDN. Use [figma-to-code] for the measurement discipline and image export; use
[figma-to-nextjs] when the target is a React route instead.

## Core Rules

1. **Semantics first, styling second.** Choose the element from the content's meaning,
   then style it. A `div` is what you reach for when nothing else fits — which is rare.
2. **One `<h1>` per page, headings never skip a level.** `h1 → h2 → h3`. If the design
   wants small text at the top of a section, that is a `<p class="eyebrow">`, not an `h4`.
3. **All design values come from the `:root` custom-property block.** That block is
   transcribed from `packages/design-tokens/src/index.ts`. Never a stray hex below it.
4. **Every heading and display size is `clamp()`.** Body copy is fixed at 1rem.
5. **Auto-layout → flex; repeating equal-width children → grid.** Never absolute
   positioning, never a float, never a fixed page width.
6. **Accessibility is written first, not audited later.** Landmarks, alt text, visible
   focus, 4.5:1 contrast, `prefers-reduced-motion`. No `outline: none` — ever.
7. **Self-contained.** Inline `<style>`, inline SVG, `data:` URIs or same-folder images.
   Zero external requests apart from a font, and the font must have a system fallback.

## Element choice

| Figma frame named… | Element |
|---|---|
| Nav / Header | `<header><nav aria-label="Main">` + `<ul><li><a>` |
| Hero / Section / Feature block | `<section aria-labelledby="…">` |
| Card in a list of cards | `<li>` inside `<ul class="grid">` — cards are a list |
| Card that is a link target | `<article>` with one wrapping `<a>` on the title |
| Testimonial / Quote | `<figure><blockquote>…</blockquote><figcaption>` |
| Stat / Metric | `<dl><dt>Label</dt><dd>Value</dd></dl>` |
| Button that navigates | `<a class="btn">` |
| Button that acts | `<button type="button">` |
| Accordion / FAQ | `<details><summary>` — no JS |
| Icon (decorative) | inline `<svg aria-hidden="true" focusable="false">` |
| Footer | `<footer>` + `<nav aria-label="Footer">` |
| Main page body | exactly one `<main id="main">` |

Never: `<div class="button">`, `<span onclick>`, `<br>` for spacing, a heading used
because it was visually big.

## The token block

Transcribe from `@moves/design-tokens`. Values below are the real ones — copy verbatim.

```css
:root {
  color-scheme: light dark;

  /* palette → lightTheme */
  --color-bg: #ffffff;          --color-bg-subtle: #fafafa;   --color-bg-muted: #f4f4f5;
  --color-surface: #ffffff;     --color-border: #e4e4e7;      --color-border-strong: #d4d4d8;
  --color-text: #09090b;        --color-text-muted: #71717a;  --color-text-inverse: #ffffff;
  --color-accent: #4f46e5;      --color-accent-hover: #4338ca;
  --color-accent-subtle: #eef2ff; --color-on-accent: #ffffff;
  --color-success: #10b981;     --color-warning: #f59e0b;     --color-danger: #dc2626;

  /* space — 4pt grid */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px; --space-32: 128px;

  /* type — fontSize scale, px → rem */
  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-base: 1rem;   --text-lg: 1.125rem;
  --text-xl: 1.25rem;  --text-2xl: 1.5rem;  --text-3xl: 1.875rem;
  --text-4xl: 2.375rem; --text-5xl: 3rem;   --text-6xl: 3.75rem; --text-7xl: 4.75rem;
  --leading-tight: 1.1; --leading-snug: 1.25; --leading-normal: 1.5; --leading-relaxed: 1.7;
  --weight-regular: 400; --weight-medium: 500; --weight-semibold: 600; --weight-bold: 700;
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* radius */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px;
  --radius-xl: 20px; --radius-2xl: 28px; --radius-full: 9999px;

  /* shadow */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04);
  --shadow-lg: 0 12px 32px -8px rgb(0 0 0 / 0.12), 0 4px 8px -4px rgb(0 0 0 / 0.06);

  /* motion */
  --duration-instant: 80ms; --duration-fast: 140ms; --duration-base: 220ms;
  --duration-slow: 320ms;   --duration-slower: 480ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* layout — maxWidth */
  --w-prose: 680px; --w-content: 1120px; --w-wide: 1400px;
  --touch: 44px; /* MIN_TOUCH_TARGET, WCAG 2.5.5 */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #09090b;        --color-bg-subtle: #18181b;   --color-bg-muted: #27272a;
    --color-surface: #18181b;   --color-border: #27272a;      --color-border-strong: #3f3f46;
    --color-text: #fafafa;      --color-text-muted: #a1a1aa;  --color-text-inverse: #09090b;
    --color-accent: #6366f1;    --color-accent-hover: #a5b4fc;
    --color-accent-subtle: #27272a; --color-on-accent: #09090b;
    --color-danger: #ef4444;
  }
}
```

## Fluid type

`clamp(min, preferred, max)`. `max` is the Figma value; `min` is two rungs down the
scale; the fluid middle interpolates across `breakpoint.sm` (480) → `breakpoint.xl` (1280).

```css
h1 { font-size: clamp(2.375rem, 1.6rem + 3.4vw, 4.75rem); line-height: var(--leading-tight);
     letter-spacing: -0.02em; font-weight: var(--weight-bold); text-wrap: balance; }
h2 { font-size: clamp(1.875rem, 1.4rem + 1.9vw, 3rem);      line-height: var(--leading-snug);
     letter-spacing: -0.01em; text-wrap: balance; }
h3 { font-size: clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem);     line-height: var(--leading-snug); }
p  { font-size: var(--text-base); line-height: var(--leading-normal); max-width: var(--w-prose);
     text-wrap: pretty; }
```

Never clamp body copy. Never set a `font-size` in `px`.

## Layout from auto-layout

```css
.section  { padding: clamp(var(--space-12), 8vw, var(--space-24)) var(--space-6);
            max-width: var(--w-content); margin-inline: auto; }
.stack    { display: flex; flex-direction: column; gap: var(--space-6); }      /* vertical A-L */
.row      { display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; } /* horizontal A-L */
.split    { display: flex; justify-content: space-between; align-items: center; } /* space-between */
.grid     { display: grid; gap: var(--space-6);
            grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); }
.fill     { flex: 1; }                                                          /* "fill container" */
```

`auto-fit` + `minmax` removes the need for most breakpoints. Add an explicit
`@media (min-width: 1024px)` only when the desktop frame differs *structurally*.

## Accessibility baseline

```html
<a class="skip" href="#main">Skip to content</a>
<header>…</header>
<main id="main" tabindex="-1">…</main>
<footer>…</footer>
```

```css
.skip { position: absolute; left: -9999px; }
.skip:focus { left: var(--space-4); top: var(--space-4); position: fixed;
              background: var(--color-surface); padding: var(--space-3) var(--space-4);
              border-radius: var(--radius-md); z-index: 50; }

:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px;
                 border-radius: var(--radius-sm); }

.btn { display: inline-flex; align-items: center; justify-content: center;
       min-height: var(--touch); padding: 0 var(--space-6);
       background: var(--color-accent); color: var(--color-on-accent);
       border: 0; border-radius: var(--radius-full); font: inherit;
       font-weight: var(--weight-semibold); cursor: pointer; text-decoration: none;
       transition: background var(--duration-fast) var(--ease-standard); }
.btn:hover { background: var(--color-accent-hover); }

img, svg, video { max-width: 100%; height: auto; display: block; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

- `alt=""` for decoration, a real sentence for content images. Never `alt="image"`.
- Contrast: `--color-text-muted` (#71717a) on `--color-bg` is 4.9:1 — safe for body.
  It is **not** safe on `--color-bg-muted` at small sizes. Check before using.
- Icon-only controls get `aria-label`. The icon `<svg>` gets `aria-hidden="true"`.
- Form fields get a real `<label for>`. Placeholder is not a label.
- `<html lang="en">` and a `<title>` are mandatory.

## File skeleton

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moves — Plan trips together</title>
  <meta name="description" content="One shared plan for every trip you take.">
  <style>
    /* 1. reset  2. :root tokens  3. elements  4. layout utilities  5. components  6. media */
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: var(--font-sans); background: var(--color-bg);
           color: var(--color-text); -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header>…</header>
  <main id="main" tabindex="-1">…</main>
  <footer>…</footer>
</body>
</html>
```

Verify before handing over: open at 320 / 768 / 1440, tab the whole page with the
keyboard, and run the accessibility audit on the file.

## Red Flags

Reject in review:

- Div-soup: `<div class="header">`, `<div class="card-title">`, clickable `<div>`.
- A hex, `rgb()`, or `hsl()` anywhere below the `:root` block.
- `px` on any `font-size`, or a heading without `clamp()`.
- `outline: none`, or a focus style with no visible indicator.
- Missing `alt`, `alt="image"`, `alt="icon"`, or alt text on a decorative graphic.
- Skipped heading levels, or more than one `<h1>`.
- Any external `<link>`/`<script>` to a CDN — the file must open offline.
- Absolute positioning, floats, or a fixed `width: 1440px` page wrapper.
- Interactive targets under 44px tall.
- Animation without a `prefers-reduced-motion` escape hatch.
- Token names invented instead of transcribed (`--color-primary`, `--spacing-md`).
