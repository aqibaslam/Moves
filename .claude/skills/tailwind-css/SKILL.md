---
name: tailwind-css
description: Write clean, maintainable Tailwind CSS — utility ordering, extracting components, theming via tokens, responsive/state variants, avoiding class soup. Use when working in a Tailwind codebase or converting designs to Tailwind utilities.
---

# Tailwind CSS

Use when authoring or reviewing **Tailwind** utility classes.

> Note: **this project (convertt-site) uses vanilla CSS with design tokens in `globals.css`, not Tailwind.** Apply this skill only in Tailwind projects, or if the team decides to introduce it here. Don't sprinkle Tailwind into the existing vanilla-CSS pages.

## Principles
- **Theme through config, not arbitrary values.** Map brand colors, spacing, fonts, radii into `tailwind.config` so utilities read `bg-brand`, `p-section`, not `bg-[#6ee268]` / `p-[100px]`.
- **Order utilities consistently:** layout → box model → typography → visual → state. Use the Prettier Tailwind plugin to auto-sort.
- **Extract at the third repeat.** Repeated utility strings → a component (React) or `@apply` class. Don't build a design system out of copy-pasted class lists.
- **Responsive & state variants** stay legible: `md:` `lg:` for breakpoints, `hover:` `focus-visible:` `aria-[expanded=true]:` for state. Mobile-first (unprefixed = smallest).
- **Avoid class soup:** if a `className` has 20+ utilities, extract a component or move complex styling to a CSS module.
- Dark mode via `dark:` driven by `prefers-color-scheme` or a `data-theme` attribute.

## Anti-patterns
- Arbitrary values everywhere (`w-[327px]`) instead of scale tokens.
- Duplicating the same long utility string across files.
- Inline styles mixed with utilities for the same property.

Pair with [design-system-creation] (define the theme first) and [html-css-quality].
