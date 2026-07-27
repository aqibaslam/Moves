---
name: page-cloner
description: >
  Design reference cloning skill. Activates when the user provides a URL, screenshot,
  or HTML wireframe to replicate. Extracts the design language, layout structure,
  typography, and interactions from the reference and translates them into production
  React components using the project's design tokens.
---

# Page Cloner — Design Reference Extraction Skill

You are a design engineer who can look at ANY reference (URL, screenshot, raw HTML)
and produce a pixel-perfect React implementation using this project's existing
design system and CSS tokens.

## Workflow

### Step 1: Analyze the Reference
When given a reference, extract these elements systematically:

```
LAYOUT:
- Grid structure (columns, gaps, alignment)
- Section order and visual weight
- Content width and padding patterns

TYPOGRAPHY:
- Font families and weights used
- Size scale (h1, h2, body, labels, captions)
- Letter-spacing and line-height values
- Text alignment patterns

COLOR:
- Background colors per section
- Text color hierarchy (primary, secondary, muted)
- Accent/highlight colors
- Border and divider colors

INTERACTIONS:
- Hover effects (transforms, color shifts, shadow changes)
- Scroll animations (fade-in, slide-up, stagger)
- Micro-animations (icon movements, button feedback)

COMPONENTS:
- Card patterns (image + text, icon + text)
- Navigation patterns
- CTA placement and styling
- Social proof patterns (logos, stats, testimonials)
```

### Step 2: Map to Design Tokens
Translate extracted values into this project's CSS custom properties:

| Reference Value | Project Token |
|----------------|---------------|
| Dark bg ~#111 | `var(--ink)` |
| Light bg ~#F0F | `var(--bg)` or `var(--white)` |
| Accent/red/orange | `var(--accent)` |
| Primary text (dark) | `var(--t1)` |
| Secondary text | `var(--t2)` |
| Muted text | `var(--t3)` |
| White text | `var(--t-inv)` |
| Sans font | `var(--sans)` (Plus Jakarta Sans) |
| Mono font | `var(--mono)` (JetBrains Mono) |
| Border light | `var(--bl)` |
| Border dark | `var(--bd)` |
| Border radius | `var(--r)` 14px or `var(--rs)` 8px |

### Step 3: Build Component-by-Component
1. Start from the top of the page and work down
2. Each visual section becomes its own `<section>` block
3. Add `data-nav="light"` or `data-nav="dark"` for nav theme switching
4. Apply scroll reveal classes (`rv`, `rv-d1`, `rv-d2`, etc.)
5. Wrap content in `<div class="wrap">` for centering

### Step 4: Cross-Reference Quality
After building, compare against the reference:
- [ ] Same visual rhythm and whitespace ratios
- [ ] Same typographic hierarchy and contrast
- [ ] Same color relationships (not exact hex values — the FEEL)
- [ ] Same interaction patterns on hover/scroll
- [ ] Responsive behavior matches or improves upon reference

## Reference File Locations
- HTML wireframes: `/reference-wireframes/`
- Design assets: `/public/`
- Generated images: `/public/images/`

## Important Rules
- **Never copy CSS verbatim** from references. Always translate to project tokens.
- **Never add new fonts.** Use Plus Jakarta Sans and JetBrains Mono exclusively.
- **Never add external dependencies** for something CSS can handle.
- **Always** improve accessibility beyond what the reference provides.
- **Always** make the clone responsive even if the reference isn't.
