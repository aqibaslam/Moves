---
name: uiux-layout-ideas
description: Generate distinctive layout concepts for a page or section — hero structures, section rhythm, grid systems, whitespace, and visual hierarchy. Use when starting a new page/section, when a layout feels generic or cramped, or when the user asks for layout options/ideas.
---

# UI/UX Layout Ideas

Use when you need to decide **how a page or section is arranged** before writing code.

## Process
1. **Name the job of the section.** One sentence: what should the visitor do/feel here? Layout serves that, not decoration.
2. **Offer 2–3 distinct directions**, not one. e.g. for a hero: (a) centered stacked, (b) split copy/visual, (c) copy over full-bleed media. Say the trade-off of each in a line.
3. **Pick a grid.** 12-col for marketing, or a simple max-width column (this repo: content columns ~750–1100px, centered, with 48px section padding and the hatch side-rails). Keep one grid per page.
4. **Set vertical rhythm.** Consistent section padding (this repo: 100px desktop / 60px mobile) and a small spacing scale (8/16/24/40/60). Don't hand-pick random gaps.
5. **Establish hierarchy** with size + weight + space, not color alone: eyebrow pill → H2 → lead → body → CTA.

## Layout patterns worth reaching for
- **Bento grid** for feature/proof clusters.
- **Split 50/50** copy + product shot for "how it works".
- **Full-bleed band** (dark section) to break rhythm and spotlight one idea.
- **Card-in-panel** (grey card, white inner panel) for diagrams/screenshots — as used in this project's "How we fix it" section.
- **Marquee row** framed by texture rails for logos/badges.

## Guardrails
- Max ~60–75 chars per line for body copy.
- Mobile first: every layout must collapse cleanly at 390px (single column, tighter spacing).
- Don't center long paragraphs; center only short display copy.
- Leave generous whitespace — cramped premium never reads as premium.

Cross-reference [modern-landing-pages], [design-system-creation], and the project's `.agents/skills/uiux-promax`.
