---
name: design-system-creation
description: Create or extend a design system — tokens (color, type, spacing, radius, shadow), component primitives, and usage rules. Use when starting a system, harmonizing an inconsistent codebase, or defining tokens/components before building UI.
---

# Design System Creation

Use to **define the reusable foundation** UI is built from.

## 1. Tokens first
Define, then reference everywhere (never hardcode):
- **Color:** brand, neutrals (a 50→900 grey ramp), semantic (success/warn/error/info), surface/text/border. This repo: green accent `#6ee268`, tokens in `globals.css`.
- **Typography:** font families (this repo: Aeonik display, Inter body), a type scale (e.g. 12/14/16/20/24/36/48/62), weights, line-heights, letter-spacing per size.
- **Spacing scale:** 4/8/12/16/24/32/40/60/80/100 — one scale, used for gaps and padding.
- **Radius, shadow, border, z-index, breakpoints** (320/768/1024/1280).

Store as CSS custom properties (`:root`) or a config (Tailwind theme / TS tokens). One source of truth.

## 2. Primitives / components
Build from tokens up: Button (variants + sizes + states), Input, Card, Pill/Badge, Section wrapper, Heading/Text. Document each component's props, variants, and when to use it. Prefer **composition over boolean-prop explosion** (see composition-patterns).

## 3. Usage rules
- Zero hardcoded colors/fonts/radii — tokens only (enforce it; see `.agents/skills/design-system-enforcer`).
- Accessible by default: contrast ≥ 4.5:1, visible focus, hit targets ≥ 44px.
- Light + dark handled at the token layer.
- Document do/don't examples so the system is followed, not drifted from.

## Extracting from an existing site/brand
Pull the real colors, fonts, spacing, and recurring components out of the current code/brand assets, name them as tokens, replace hardcoded values, then build the component library on top.

Pair with [html-css-quality], [tailwind-css], and the project's `.agents/skills/brand-guidelines`.
