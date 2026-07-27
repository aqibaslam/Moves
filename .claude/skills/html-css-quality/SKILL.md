---
name: html-css-quality
description: Review and improve HTML/CSS for semantics, accessibility, responsiveness, and maintainability. Use before shipping markup/styles, when auditing a component, or when CSS is drifting (magic numbers, specificity fights, hardcoded values).
---

# HTML/CSS Quality

Use to **audit and tighten** markup and styles before they ship.

## Semantic HTML
- Use the right element: `button` for actions, `a` for navigation, `section`/`nav`/`header`/`footer`/`main`, headings in order (one `h1`, then `h2`→`h3`).
- Every interactive control is keyboard-reachable and has an accessible name (`aria-label` when there's no visible text).
- Images need meaningful `alt` (or `alt=""` if decorative). Icons that are decorative get `aria-hidden`.

## CSS quality
- **No magic numbers** — use the spacing/type scale and design tokens (this repo: tokens in `globals.css`). Zero hardcoded hex/font/radius when a token exists.
- Prefer fl/ grid over absolute positioning; avoid deep selector nesting and `!important` fights (reach for it only to override inline styles, and comment why).
- Keep specificity flat; one class = one concern.
- Responsive: mobile-first, test 320/390/768/1280. Use relative units and `max-width:100%` on media; wide content scrolls inside its own `overflow-x:auto`.
- Respect `prefers-reduced-motion` for animations.

## Review checklist
- [ ] Semantic elements + heading order correct
- [ ] Color contrast ≥ 4.5:1 (use the `accesslint` MCP / `accesslint-scan` skill)
- [ ] Focus states visible
- [ ] No layout shift; images have dimensions
- [ ] No horizontal page scroll at 320px
- [ ] Tokens used, no stray magic values

Pair with [design-system-creation] and the project's `.agents/skills/accessibility-auditor` + `design-system-enforcer`.
