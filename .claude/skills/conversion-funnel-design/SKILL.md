---
name: conversion-funnel-design
description: >
  Architects multi-step conversion funnels from cold traffic to closed deal.
  Maps awareness → consideration → conversion → activation with friction
  budgets at each step. Activates when designing any new flow (lead form,
  quiz, onboarding, checkout) or restructuring an existing one.
---

# Conversion Funnel Design — Multi-Step Flow Architecture

You are an expert funnel architect. You think in *steps*, *commitment ladders*,
and *friction budgets* — not pages.

## Core Principle: The Commitment Ladder

Every successful funnel asks for progressively larger commitments. Start with
a 3-second ask (URL input), end with a 30-minute call.

```
Step 1: Micro-commit  (3 sec)   → Get URL / email / niche
Step 2: Qualify       (30 sec)  → Multiple-choice quiz, 4–6 questions
Step 3: Contact       (60 sec)  → Name + email + phone
Step 4: Book          (15 sec)  → Calendar slot
Step 5: Pay/Confirm   (2 min)   → Deposit / confirmation
```

Each step earns the right to ask for the next. **Skip a rung and conversion collapses.**

## The Friction Budget

Every funnel has ~120 seconds of total user attention. Spend it deliberately:

| Step | Budget | Cost of overspending |
|---|---|---|
| Hero → first action | 5 sec | 90% bounce |
| Qualifying step | 30 sec | Quiz abandonment |
| Contact form | 60 sec | Form abandonment (>3 fields = 40% drop) |
| Booking | 15 sec | Calendar abandonment |
| Confirmation | 0 sec — should auto-progress to next action |

If a step costs more than its budget, either split it or kill it.

## Funnel Patterns by Intent

### High-intent (they searched "<service> agency")
- Skip the "why us" — they already chose you
- Hero → quiz → contact → calendar (4 steps, ~90 sec)
- Show price *before* the call if it filters cleanly

### Medium-intent (paid ads, content marketing)
- Need education before conversion
- Hero → social proof → problem → solution → quiz → contact → calendar (7 steps)
- Use scroll-depth tracking to identify where they bail

### Low-intent (cold outreach, awareness ads)
- Convert to email list first, not a call
- Lead magnet → email → 7-day nurture → booking link
- Don't try to close in one session

## Designing a New Funnel — The Process

1. **Define the goal end-state.** What's the single conversion event? (booked call,
   deposit paid, trial started). Everything else is upstream.
2. **Identify the intent level** of the traffic source.
3. **Sketch the commitment ladder** — what's the smallest ask you can start with?
4. **Build the friction budget** — write the time estimate for each step.
5. **Identify drop-off risk points** — where do users have to *think*? Each one is a leak.
6. **Add a parallel low-friction path** for users not ready to commit yet
   (e.g., "Not ready? Get our case study PDF instead.")
7. **Instrument with events** — every step transition is a tracked event.

## Anti-patterns

- **The mega-form**: 15 fields on step 1. Kills 60% of leads.
- **The dead-end confirmation**: "Thanks!" page with no next action.
- **The hidden CTA**: User has to figure out what to do next.
- **The premature pitch**: Asking for a 30-min call before showing 5 seconds of value.
- **The disqualifier ambush**: User completes the funnel, then learns they don't qualify.
  Disqualify *early* (step 2), not after the form.

## How to Apply in this Project

- The existing CRO Calendar funnel (in `/Users/syed/new-system/convertt-cro-calendar`)
  has three paths: Live store / New store / Growth retainer. Reference those
  patterns when designing new funnels in `Convert-Nextjs`.
- For agency landing pages, default to: Hero CTA → instant 5-question quiz →
  contact (3 fields) → calendar embed. Aim for <90 seconds total.
- Track step-completion events with PostHog (when installed) — name them
  `funnel_<name>_step_<n>_complete`.
