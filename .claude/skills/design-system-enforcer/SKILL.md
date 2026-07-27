---
name: design-system-enforcer
description: >
  Guards the design system integrity across the entire codebase. Activates on
  every CSS and component change. Prevents design drift by ensuring all visual
  properties reference the established design tokens in globals.css. Zero
  tolerance for hardcoded values.
---

# Design System Enforcer — Token Compliance Skill

You are the design system guardian. Your job is to ensure 100% compliance with
the established design tokens. No hardcoded colors, no rogue font sizes,
no inconsistent spacing.

## The Token Inventory

### Colors — ONLY these values are allowed:

| Token | Value | Usage |
|-------|-------|-------|
| `--white` | #F7F7F7 | Light backgrounds, button text |
| `--bg` | #F0F0F0 | Secondary light backgrounds |
| `--bg2` | #E8E8E8 | Tertiary light, hover states |
| `--ink` | #111110 | Dark backgrounds, primary |
| `--ink-2` | #1A1A17 | Dark variant, buttons |
| `--ink-3` | #222220 | Dark variant, hover |
| `--t1` | #1A1A17 | Primary text (light bg) |
| `--t2` | #5C5C56 | Secondary text (light bg) |
| `--t3` | #9C9C96 | Muted text (light bg) |
| `--t-inv` | rgba(255,255,255,0.92) | Primary text (dark bg) |
| `--t-inv2` | rgba(255,255,255,0.50) | Secondary text (dark bg) |
| `--t-inv3` | rgba(255,255,255,0.28) | Muted text (dark bg) |
| `--accent` | #FF4D2D | CTAs, highlights, dots |
| `--accent-s` | rgba(255,77,45,0.08) | Accent subtle bg |
| `--accent-b` | rgba(255,77,45,0.18) | Accent border |
| `--green` | #2A9D5C | Success, active status |
| `--green-s` | rgba(42,157,92,0.08) | Green subtle bg |
| `--bl` | rgba(26,26,23,0.08) | Light border |
| `--bl2` | rgba(26,26,23,0.14) | Light border hover |
| `--bd` | rgba(255,255,255,0.08) | Dark border |
| `--bd2` | rgba(255,255,255,0.14) | Dark border hover |

### Typography — ONLY these fonts:
| Token | Font |
|-------|------|
| `--sans` | 'Plus Jakarta Sans', sans-serif |
| `--mono` | 'JetBrains Mono', monospace |

### Layout — ONLY these values:
| Token | Value | Usage |
|-------|-------|-------|
| `--max` | 1120px | Content max-width |
| `--r` | 14px | Standard border-radius |
| `--rs` | 8px | Small border-radius |
| `--ease` | cubic-bezier(0.16,1,0.3,1) | All transitions |

## Compliance Rules

### HARD VIOLATIONS (Must be fixed immediately)
```css
/* ❌ VIOLATION: Hardcoded color */
color: #333;
background: rgb(240, 240, 240);

/* ✅ CORRECT */
color: var(--t1);
background: var(--bg);
```

```css
/* ❌ VIOLATION: Hardcoded font */
font-family: 'Arial', sans-serif;
font-family: Inter, sans-serif;

/* ✅ CORRECT */
font-family: var(--sans);
font-family: var(--mono);
```

```css
/* ❌ VIOLATION: Hardcoded border-radius */
border-radius: 12px;

/* ✅ CORRECT */
border-radius: var(--r);   /* 14px */
border-radius: var(--rs);  /* 8px */
border-radius: 100px;      /* Only for pills/badges */
border-radius: 50%;        /* Only for circles */
```

```css
/* ❌ VIOLATION: Wrong transition easing */
transition: all 0.3s ease;
transition: background 0.5s linear;

/* ✅ CORRECT */
transition: all 0.22s var(--ease);
transition: background 0.18s var(--ease);
```

### SOFT VIOLATIONS (Flag for review)
- Inline styles in JSX (acceptable only for truly dynamic values like gradients)
- `!important` declarations
- Magic numbers that don't align to the 8px grid
- Transition durations outside the 0.15s-0.65s range

## Audit Checklist
Run this checklist on every CSS/component change:
- [ ] Zero hardcoded hex colors
- [ ] Zero hardcoded font-family declarations
- [ ] All spacing values on 8px grid (8, 16, 24, 32, 48, 64, 96, 128)
- [ ] All transitions use `var(--ease)`
- [ ] All border-radius uses `var(--r)`, `var(--rs)`, `100px`, or `50%`
- [ ] All container widths use `var(--max)`
- [ ] Responsive breakpoints at `960px` and `680px` only
- [ ] Section vertical padding minimum `96px` desktop, `64px` mobile
