---
name: modern-landing-pages
description: Build high-converting, visually distinctive marketing landing pages (hero → proof → offer → FAQ → CTA). Use when creating or overhauling a landing/funnel page, or when a page reads generic and needs a stronger conversion structure.
---

# Modern Landing Pages

Use when building or improving a **conversion-focused landing page**.

## Canonical section order (adapt, don't blindly follow)
1. **Hero** — one clear promise (outcome, not features) + sub-line + primary CTA + trust cue (rating/badges).
2. **Social proof band** — logos/badges marquee.
3. **Problem** — name the pain the visitor already feels; make it concrete (numbers, a funnel/leak visual).
4. **Solution / how it works** — the mechanism, in 2–4 steps.
5. **Proof** — case studies with real metrics + short quotes + attribution.
6. **Differentiation** — why you vs the alternatives (comparison or "the system").
7. **Offer / pricing** — what they get, tiers, guarantee.
8. **Objection handling** — "this isn't for you if…", FAQ.
9. **Final CTA** — restate the promise + single action.

## Conversion principles
- **One primary action** repeated down the page; secondary actions stay quiet.
- **Specificity converts:** "+60% booked, attended appointments" beats "grow your business".
- **Show, don't claim:** screenshots, real numbers, named attribution.
- **Sticky mobile CTA** so the action is always one tap away.
- **Reduce friction:** short forms, clear next step, no dead ends.

## This repo's conventions
- Next.js App Router, `"use client"` page, vanilla CSS with design tokens.
- Section pattern: hatch side-rails (`Railed`), grid-texture bands, green accent `#6ee268`, Aeonik display / Inter body.
- Hide global nav/footer for funnel routes (register in Navigation/Announcement/FooterWrapper).
- Verify in the preview at 390 / 768 / 1280 before shipping.

Pair with [uiux-layout-ideas] for structure and [figma-to-code] when working from a design file.
