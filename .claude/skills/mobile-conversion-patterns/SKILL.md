---
name: mobile-conversion-patterns
description: >
  Mobile-specific conversion patterns — touch targets, thumb zones,
  sticky bars, native form controls, gesture handling, and viewport
  edge cases. Activates whenever building or auditing any mobile view,
  responsive component, or form. Should be invoked alongside uiux-promax
  for any new component.
---

# Mobile Conversion Patterns — The 60% Surface

60–80% of agency leads land on mobile. Yet most agency sites are designed
desktop-first and audited desktop-first. This skill closes that gap.

## Non-Negotiable Mobile Rules

### Touch Targets
- **Minimum 44×44px** for any tappable element (Apple HIG, WCAG)
- **Spacing**: 8px gap between adjacent targets minimum
- **Hit areas** can be larger than visual element (use `padding` not `margin`)

### Thumb Zones (Right-Handed, Primary)
```
┌──────────────────┐
│   HARD (hard to  │  ← Top: nav, breadcrumbs only
│       reach)     │
├──────────────────┤
│      OK          │  ← Middle: content, secondary actions
│                  │
├──────────────────┤
│   NATURAL ✓      │  ← Bottom 1/3: primary CTAs, sticky bars
│  (thumb zone)    │
└──────────────────┘
```

- **Primary CTA** should live in the natural thumb zone (sticky bottom bar)
- **Avoid** primary actions in the top-left corner — hardest to reach
- **Multi-step forms**: "Next" button bottom-right (natural for right-thumbed users)

### Viewport & Layout
- Test at **375×667** (iPhone SE — the smallest modern phone) and **390×844** (iPhone 14)
- **No horizontal scroll**, ever. Use `overflow-x: clip` on body as a safety net.
- **No fixed-px font sizes below 14px**. 16px is the floor for body copy.
- **Account for the address bar** — use `100dvh` not `100vh` for full-height heroes
- **Safe-area insets**: `padding-bottom: env(safe-area-inset-bottom)` for sticky bottom CTAs (avoid the home-bar overlap)

## Sticky CTA Patterns

The single highest-ROI mobile move. Conversion lifts of 15–40% when implemented well.

```tsx
// Sticky bottom bar (appears after hero scrolls out of view)
<div className="
  fixed bottom-0 inset-x-0 z-50
  bg-background/95 backdrop-blur
  border-t border-border
  px-4 py-3
  pb-[calc(env(safe-area-inset-bottom)+12px)]
">
  <button className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold">
    Get Free Audit →
  </button>
</div>
```

**Rules:**
- Only one sticky bar at a time
- Hide it when a form is focused (keyboard up = bar would cover the input)
- Show it only *after* the hero scrolls out of view (intersection observer)
- Fade in, don't slap in

## Forms — Native Input Hygiene

Use the right input type and you save the user 5 seconds *per field*:

| Field | Type / Attributes | Why |
|---|---|---|
| Email | `type="email" autoComplete="email" inputMode="email"` | Triggers @ key, autofills |
| Phone | `type="tel" autoComplete="tel" inputMode="tel"` | Numeric keypad |
| Numeric (revenue, age) | `inputMode="numeric"` | Number pad without spinner |
| Name | `autoComplete="name"` | Suggests saved names |
| Website / URL | `type="url" inputMode="url"` | Adds `.com` key |
| OTP | `autoComplete="one-time-code"` | iOS autofill from SMS |

**Other mobile form rules:**
- **One field per row** below 600px width
- **Label position**: above the field, not floating-inside (breaks autofill)
- **Error messages**: inline, below the field, in red, with an icon
- **Submit button**: full-width, 48px+ tall, in the thumb zone

## Tap Feedback

Mobile users need *instant* feedback. The default 300ms tap delay is solved
by the meta viewport, but you still need visual response:

```css
button {
  transition: transform 0.06s, background 0.15s;
}
button:active {
  transform: scale(0.97);
}
@media (hover: hover) {
  button:hover { /* ... */ }
}
```

Always wrap `:hover` in `@media (hover: hover)` — on mobile, hover sticks to the last-tapped element and creates ghost states.

## Performance — Mobile-Specific

- **LCP target**: <2.5s on 4G (use Chrome DevTools throttling, "Slow 4G" profile)
- **Bundle size**: <150KB JS to first interactive (you're using Next 16 / RSC — most JS shouldn't ship)
- **Images**: Always `next/image` with explicit `sizes` attribute. AVIF first, WebP fallback.
- **Fonts**: Subset to Latin, use `font-display: swap`, preload only the hero font
- **No carousels above the fold** (they delay LCP)

## Common Mobile Failures (audit checklist)

When reviewing a mobile view:
- [ ] Hero CTA is reachable without scrolling on iPhone SE
- [ ] No element overflows the viewport horizontally
- [ ] All text is ≥14px (≥16px for body)
- [ ] Forms use proper input types
- [ ] Sticky CTAs don't overlap content (account for safe-area-inset)
- [ ] Tap targets meet 44×44 minimum
- [ ] No tooltips or hover-only content
- [ ] Modals are dismissible by tapping outside or with a clearly-visible close button
- [ ] Carousels have swipe + dots + are paused by default if auto-rotating
- [ ] Page is usable with one thumb at a stoplight (the actual test)

## Verification Workflow

After any mobile-relevant change:
1. `preview_resize` to 375×667
2. `preview_snapshot` — verify text + structure
3. `preview_screenshot` — visual check
4. `preview_inspect` on tap targets — confirm 44×44 minimum

Never trust desktop preview for mobile decisions.
