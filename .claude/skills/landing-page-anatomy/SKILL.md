---
name: landing-page-anatomy
description: >
  Section-by-section blueprint for high-converting agency landing pages.
  Specifies what each section accomplishes, what it must contain, and
  common failure modes. Activates when building any new landing page,
  case study page, or service detail page.
---

# Landing Page Anatomy — The 9-Section Blueprint

You design landing pages the way an architect designs houses: every room has
a purpose, sequence matters, and you can't move the kitchen after pouring
the foundation.

## The 9 Sections (in order)

```
1. Hero
2. Social proof bar
3. Problem
4. Solution / What we do
5. Proof (case studies)
6. Process / How it works
7. Pricing or qualification
8. Founder / Team / Trust
9. Final CTA
```

You don't always need all 9. Service-detail pages can skip 3/4/8. Lead-magnet
landers can collapse to 1+2+9. But the *order* should never change.

---

## 1. Hero (the only section that matters above the fold)

**Job:** Convert the 5-second scanner into a 30-second reader.

**Must contain:**
- **H1**: Outcome-led, not feature-led. "Same traffic. 3× more bookings." beats "Premium CRO Services for Dental Practices"
- **Subhead**: 1–2 sentences explaining *who* + *what* + *proof point*
- **Primary CTA**: Verb-led, outcome-specific. "Get my free audit" not "Submit"
- **Secondary CTA** (optional): "Learn more" for skeptics. Never as prominent as primary.
- **Hero visual**: Shows the *outcome*, not the product. Dashboard, store screenshot, before/after — not generic agency stock.
- **Trust micro-element**: "300+ stores trust us" / star rating / client logo strip — *immediately* below H1, not 3 sections down.

**Failure modes:**
- Vague claims ("World-class digital experiences")
- Two competing CTAs of equal weight
- Hero animation that delays content render (LCP killer)
- Background gradient with no actual product visible

## 2. Social Proof Bar

**Job:** Confirm to the skeptic that they're in good company before they read the pitch.

**Must contain:** 6–8 client logos. Grayscale, no animation, no captions.

**Failure modes:**
- Stock company names ("Microsoft, Google, Apple") that you never worked with
- Animated marquee that makes logos illegible
- Logos that are smaller than the surrounding whitespace suggests

## 3. Problem

**Job:** Make the reader feel that *you understand their specific pain*.

**Must contain:**
- A specific problem statement, not a generic one
  - ✅ "Your site converts at 1.8%. It should be 5%."
  - ❌ "Conversion rates are too low"
- Concrete consequence: what's the dollar cost of the problem?
- Industry/role specificity: "If you're a DTC founder spending $50K+/mo on ads…"

**Failure modes:**
- Trying to speak to everyone (then you speak to no one)
- Doomscroll messaging without a path forward
- Statistics without a source

## 4. Solution / What We Do

**Job:** Show the *deliverable*, not the process.

**Must contain:**
- 3–5 specific things you do (not "comprehensive" or "end-to-end")
- For each: one-line description + concrete deliverable
- Visual: thumbnail of actual work, not icons

**Failure modes:**
- Service list with no examples ("CRO Audits ✓ A/B Testing ✓ Strategy ✓")
- Process diagrams that no one will read
- Tech-stack lists nobody asked for

## 5. Proof (Case Studies)

**Job:** Convert "this sounds nice" into "they can actually do this."

**Must contain:**
- 3–5 case studies, each with: client name + logo + specific metric + 1-line context
- Mix of recognizable brands + relatable mid-market clients
- A single anchor stat per case ("+$148K/mo") — not 5 stats fighting for attention
- A "see more results" link to a full case studies page (don't bury all your wins here)

**Failure modes:**
- "We helped a brand grow" (no name = no credibility)
- Vanity metrics ("10M impressions") instead of revenue
- Case studies without context (47% lift… from what baseline?)

## 6. Process / How It Works

**Job:** Reduce uncertainty about what happens after they click "Get audit."

**Must contain:**
- 3–4 steps max. Numbered.
- Each step: 1-line description + timeframe
- "Day 1: We audit your funnel. Day 7: You get the report. Day 14: We start fixing."

**Failure modes:**
- 8-step process that overwhelms
- Vague timelines ("we'll get back to you soon")
- Sales-y step names ("Discovery → Engagement → Activation")

## 7. Pricing or Qualification

**Job:** Filter out unqualified leads *before* they waste your time.

**Two patterns:**
- **Pricing**: Show 3 tiers, anchor high, highlight middle. Be specific. "Starts at $5K/mo" beats "Contact for pricing."
- **Qualification**: Don't show pricing, but make the reader self-disqualify with: "We work with brands doing $500K+/mo. If that's not you yet, here's a free resource instead." (Reciprocity move for the unqualified.)

**Failure modes:**
- "Contact us for pricing" with no qualifying signal
- 7-tier pricing tables nobody can scan
- Hiding pricing entirely when competitors show it (lowers trust)

## 8. Founder / Team

**Job:** Add a human face. Trust spikes when people see who they're working with.

**Must contain:**
- Founder photo (real, not stock)
- 2–3 sentence bio with credentials + a specific origin story
- LinkedIn link

**Failure modes:**
- Generic team-photos with no individual identification
- Bios full of buzzwords ("passionate about growth")
- Skipping this section entirely (huge trust loss for agencies)

## 9. Final CTA

**Job:** Capture the now-warm reader before they leave.

**Must contain:**
- The *same* CTA verb as the hero (don't introduce a new ask)
- Risk reversal: "Free, 30 minutes, no pitch."
- Calendar embed *here* (not behind another form) — every extra click = 20% drop
- Sub-CTA for not-ready users: "Just want the case studies? Download the PDF"

**Failure modes:**
- A different ask than the hero
- "Schedule a discovery call" — vague and dread-inducing
- No calendar visible — "we'll get back to you" kills momentum

---

## How to Apply in this Project

- The current home page (verified live at localhost:3010) hits sections 1–5 + 9
  via the rotating industry hero. Strong start.
- Service-detail pages (treatment landing pages, Shopify development, etc.)
  should follow the full 9-section pattern but in compressed form.
- Use design tokens from `src/app/globals.css` for all spacing. Section vertical
  padding is the single biggest pattern-break I see — keep it consistent.
- Mobile: each section should fit in 1.5 phone screens or be split.
