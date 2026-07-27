---
name: brand-guidelines
description: Enforces Convertt's official brand identity — colors, typography, spacing, and design tokens. Use when brand colors, style guidelines, visual formatting, or design consistency needs to be checked or applied.
---

# Convertt Brand Guidelines

## Overview

Convertt's brand identity is premium, conversion-focused, and modern. Every visual element must feel intentional, clean, and high-performance — reflecting the agency's CRO expertise.

**Keywords**: branding, visual identity, design tokens, colors, typography, styling, brand consistency, visual formatting

## Brand Colors

### Primary Palette

- **Ink (Dark):** `#303030` — Dark backgrounds (hero, testimonials, final CTA, nav)
- **White:** `#F7F7F7` — Light backgrounds, card surfaces
- **Background:** `#F0F0F0` — Section backgrounds, muted surfaces
- **Background 2:** `#E8E8E8` — Hover states, deeper muted surfaces

### Accent Colors

- **Accent (Bright):** `#C8EF24` — Primary brand green, used on dark backgrounds (hero, dark sections, buttons, stars)
- **Accent Light:** `#94CE24` — Darker green for light backgrounds (labels, dots, chips, announcement bar)
- **AI Cyan:** `#00E5FF` — Secondary accent for AI-related elements only (ConverttAI icon gradient)

### Text Colors

- **Primary Text:** `#1A1A17` — Headings, body text on light backgrounds
- **Secondary Text:** `#5C5C56` — Descriptions, supporting copy
- **Tertiary Text:** `#9C9C96` — Labels, captions, muted elements
- **Inverse Text:** `rgba(255,255,255,0.92)` — Text on dark backgrounds
- **Inverse Muted:** `rgba(255,255,255,0.50)` — Secondary text on dark
- **Inverse Subtle:** `rgba(255,255,255,0.28)` — Labels on dark

### Border Colors

- **Light border:** `rgba(26,26,23,0.08)` — Borders on light backgrounds
- **Dark border:** `rgba(255,255,255,0.08)` — Borders on dark backgrounds

## Typography

### Font Families

- **Sans (Primary):** `'Plus Jakarta Sans', sans-serif` — All headings, body text, buttons
- **Mono (Secondary):** `'JetBrains Mono', monospace` — Labels, tags, badges, meta text
- **No other fonts allowed.** Ever.

### Type Scale

- **H2 Headings:** `clamp(1.85rem, 4.2vw, 2.9rem)`, weight 800, letter-spacing -0.04em, line-height 1.06
- **H2 `em` tag:** Used for muted/dimmed portion of heading (color: `#9C9C96` on light, `rgba(255,255,255,0.35)` on dark)
- **Labels:** Mono, 0.62-0.68rem, weight 600-700, uppercase, letter-spacing 0.08-0.09em, with accent dot before
- **Body text:** 0.82-0.95rem, weight 400-500, line-height 1.55-1.75
- **Buttons:** 0.87rem, weight 700, letter-spacing -0.01em

### Label Pattern

Labels always follow this pattern:
```
.label {
  font-family: var(--mono);
  font-size: 0.67rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--t3);
}
.label::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-light);  /* or var(--accent) on dark backgrounds */
}
```

## Spacing & Layout

- **Max width:** `1120px` (--max)
- **Section padding:** `96px 0` (standard), `120px 0` (hero-adjacent)
- **Border radius:** `14px` (--r, cards), `8px` (--rs, buttons, smaller elements)
- **Wrap padding:** `0 28px`

## Button Styles

- **Primary (dark):** Dark ink background, white text
- **Primary (neon):** Accent gradient background, dark text, animated shimmer
- **Ghost (light):** Transparent with border, muted text
- **Ghost (dark):** Transparent with subtle white border, muted white text

## Design Rules

1. **Server Components first.** Only `"use client"` for interactivity.
2. **Design tokens only.** Zero hardcoded colors — always use CSS variables.
3. **Plus Jakarta Sans + JetBrains Mono only.** No other fonts, ever.
4. **Mobile-first responsive.** Every component must work at 320px+.
5. **Accent on dark = `#C8EF24`**, Accent on light = `#94CE24`.
6. **Borders are subtle.** Use `var(--bl)` on light, `var(--bd)` on dark.
7. **Sections alternate backgrounds.** White → light gray → dark, never two of the same in a row.

## ConverttAI Icon

The custom AI icon (`src/components/ConverttAI.tsx`) uses a green-to-cyan gradient neural network design. It should be used wherever AI capabilities are referenced. The icon continuously revolves and has pulsing node animations.
