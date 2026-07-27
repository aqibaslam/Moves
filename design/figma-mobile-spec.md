# Moves Dental × Convertt — MOBILE Layout Spec

Source: Figma "New Moves Dental X Convertt" → frame **"Updated - Home Page - Mobile - 2026, July 24"** (`#1465:27855`).

## Root frame
- **Root width: 390px** (designedWidth 390px). Every fixed-width child = 390; content column inset = 358px (390 − 16×2).
- Root layout: `column`, `alignItems: center`, **gap 16px between section blocks**, background `#F2F6FE` (fill_ad60ebce).
- Sections are white rounded cards (`border-radius: 20px`) floating on the `#F2F6FE` page, separated by the 16px root gap.

## Color tokens (resolved)
- Navy / Primary `#04143A`; Primary-80 `rgba(4,20,58,.8)`; -70 `.7`; -60 `.6`; -40 `.4`; -20 `.2`; -10 `.1`
- Pink (accent) `#FC5257`; light pink `#FDE3E4`; mid pink `#FDADB0`; deep pink `#FD888B`
- White `#FFFFFF`; page bg `#F2F6FE`; grey text `#858585`; divider grey `#DCDCDC`; green (star badge) `#219653`; blue (checkmark) `#004DF6`

## Fonts
- **Jost** — display headings (Medium 500 / SemiBold 600)
- **Silka** — body, eyebrows, buttons, labels (Regular 400 / Medium 500 / Bold 700)
- **Aeonik** Bold — Trustpilot "Excellent (3,890)"
- **Inter** Regular — pricing "From"
- **Caveat** Regular — hero signature "Amelia Hart"

## Section rhythm — vertical (top/bottom) & horizontal padding
| # | Section | Vert padding T/B | Horiz padding | Radius | Notes |
|---|---------|------------------|---------------|--------|-------|
| 1 | Header + Hero | announce 10/27; hero card 24 then 32 | 16 | hero 16 | announce bar navy; hero pink |
| 2 | Problem | 50 / 50 | 16 | 20 | inner gap 28 |
| 3 | Brand manifesto | 50 / 120 | 16 | 20 | gradient+image bg, extra bottom pad |
| 4 | Marquee | 0 / 0 | 0 | — | single scrolling row |
| 5 | How it works | 50 / 50 | 16 | 20 | 3 step cards stacked |
| 6 | Before & Afters | 50 / 50 | 16 | 20 | horizontal-scroll cards |
| 7 | Pricing | 50 / 50 | 16 | 20 | 2 cards STACKED |
| 8 | Trustpilot reviews | 50 / 50 | 0 (inner 16) | 20 | vertical stack + fade + View More |
| 9 | Team | 50 / 50 | 16 | 20 | horizontal-scroll cards |
| 10 | Proof in motion | 50 / 50 | 16 | 20 | horizontal-scroll video cards |
| 11 | The Movers | 50 / 50 | 16 | 20 | 4 role cards STACKED |
| 12 | CTA "Your MOVE" | 50 / 0 | 0 (inner 16) | 20 | full-bleed image, h≈750 |
| 13 | FAQs | 50 / 50 | 16 | 20 | 9 items stacked |
| 14 | Footer | 50 / 50 | 16 | 16 top only | navy |

**Root itemSpacing between every section block = 16px.**

---

## 1. Header + Hero  (`#1465:27856`)

### 1a. Announcement bar (`#1465:27859`)
- column, padding `10px 16px 27px`, center, gap 10, width 390, fill navy `#04143A`.
- TEXT "Save over 85% on your first month" — **Silka Medium 500, 14px, letter-spacing -0.02em, UPPERCASE, center, White**.

### 1b. Header row (`#1465:27861`)
- column, padding `12px 0`, center, gap 24, width 390, fill White, radius `12px 12px 0 0`.
- Inner row (`#1465:27862`) gap 46: logo left, actions right.
  - Logo `Moves-Primary-Logo` — **138 × 16.93**.
  - Actions row (`#1465:27877`) width 173.4 h31, gap 16:
    - "Consultation" pill button (`#1465:27878`): row, padding `11px 17px`, w107 h31, stroke navy 1px, radius 50px. TEXT **Silka Medium 500, 14px, line-height 25.33px, ls -0.0714em, TITLE case, center, navy**.
    - phone icon **15.9 × 20.18**; hamburger **18.49 × 13.13**.

### 1c. Hero image block (`#1465:27889`)
- column, padding `24px 16px`, gap 10, **fixed height 345**, fill light pink `#FDE3E4`, radius `16px 16px 0 0`.
- Hero image (`#1465:27890`) absolute, **390 × 365**, positioned x0 y −20.11 (bleeds above the block).

### 1d. Hero content block (`#1465:27891`)
- column, padding `32px 16px`, gap 28, width 390, fill `#FDE3E4`, radius `0 0 16px 16px`. **Image sits ABOVE text (stacked), text below.**
- Trustpilot row (`#1465:27893`) row, center, gap 12.91: 5 green stars → "Trustpilot" (**Silka Medium 500, 12.8px, navy**) → "Excellent (3,890)" (**Aeonik Bold 700, 12.8px, ls -0.02em, navy**).
- **Headline** (`#1465:27904`): **Jost SemiBold 600, 40px, line-height 1.1em, ls -0.0375em, TITLE, LEFT**. "The smile" = pink `#FC5257`; " you've been putting off" = navy.
- Body (`#1465:27906`): **Silka Regular 400, 16px, line-height 1.4em, ls -0.02em, LEFT, navy**. "MOVES is the movement behind modern smiles…"
- Link block (`#1465:27908`, w169): "See exactly what it costs" — **Silka Medium 500, 14px, ls -0.02em, navy** + pink underline line (w167).
- **Primary button** (`#1465:27911`): row, padding `16px 32px`, center, fill navy, radius 100px. Label " Book Free Consultation" — **Silka Medium 500, 18px, line-height 25.3px, ls -0.0556em, center, White**.
- Signature card (`#1465:27913`): row, padding 12, center, gap 16, width 358, White, radius 8px.
  - "Amelia Hart" — **Caveat Regular 400, 20px, line-height 1em, LEFT, `#05143B`**.
  - vertical divider line h41 `#DCDCDC`.
  - column gap 7: "SIGNED · GDC No. 123456" (**Silka Regular 400, 12px, lh 1.2em, ls -0.02em, Primary-70**) + "ON THE PLAN. IN YOUR ACCOUNT. ON THE BOX." (**Silka Medium 500, 12px, lh 1.2em, ls -0.02em, navy**).
- Soft pink blur shadow rectangle beneath (`#1465:27919`, `blur(7px)`).

---

## 2. Problem — "THE MOVES YOU ALREADY MAKE"  (`#1465:27920`)
- Section: column, padding `50px 16px`, width 390, White, radius 20px. Inner column gap 28.
- Header (`#1465:27923`, gap 16):
  - Eyebrow "THE MOVES YOU ALREADY MAKE" — **Silka Medium 500, 12px, ls 0.0833em, UPPERCASE, LEFT, pink**.
  - Headline "Your've been making moves for years. Just the wrong ones." — **Jost SemiBold 600, 32px, lh 1.1em, ls -0.0469em, TITLE, LEFT**. First sentence navy, "Just the wrong ones." pink.
- List (`#1465:27926`, column stretch gap 16):
  - "Closed-mouth photo" — **Silka Medium 500, 20px, ls -0.02em, LEFT, UNDERLINE, Primary-80** (active item).
  - "Hand over your mouth, mid-laugh" / "Turn away from the camera" / "Photo you took, then deleted." / "Careful smile." / "Camera off, again." — **Silka Regular 400, 20px, ls -0.02em, LEFT, Primary-20** (each). First has fixed width 336.
- Image (`#1465:27933`): **358 × 357.41**, cover, radius 16px, padding 20, content flex-end center.
  - Progress dots row (gap 4.32): active dash **48.22 × 6.48** White radius 1.77 + 5 inactive dashes (same size) Primary-20.
- Closing body (`#1465:27943`, w354): "Nobody buys aligners…" — **Silka Regular 400, 14px, lh 1.4em, ls -0.02em, LEFT, navy**.
- **Layout change vs desktop: text block → image → closing line all stack in one column.**

---

## 3. Brand manifesto — "WHY WE'RE CALLED MOVES"  (`#1465:27944`)
- Section: column, padding `50px 16px 120px` (extra bottom for floating button), hug, radius 20px.
- Background: linear gradient `rgba(253,136,139,0) → rgba(253,136,139,1)` top-to-bottom + full-bleed image behind.
- Inner column center, gap −3.
- Header wrapper (`#1465:27947`, gap 28, w358) → (`#1465:27948` gap 16):
  - Eyebrow "WHY WE'RE CALLED MOVES" — **Silka Medium 500, 12px, ls 0.0833em, UPPER, LEFT, White**.
  - Headline "Moves is not a clear aligner company. It is the moment behind modern smiles." — **Jost Medium 500, 36px, lh 1.1em, ls -0.0417em, TITLE, CENTER, White**. Phrases "not a clear aligner company" + second sentence at `rgba(255,255,255,0.4)`. Fixed width 358.
  - Body "Aligner brands sell trays…" — **Silka Regular 400, 14px, ls -0.02em, CENTER, White**.
  - Image container (`#1465:27952`) **354 × 272**; inner image **337 × 272**.
- Pink blur ellipse (`#1465:27955`) 382.8 × 64.8, `blur(17px)`, absolute.
- **Floating button** (`#1465:27956`, absolute x51 y595.8): row, padding `16px 32px`, center, navy, radius 100px, label " Book Free Consultation" White 18px.

---

## 4. Marquee  (`#1465:27958`)
- Container: column stretch, fixed width 390.
- Single row (`#1465:27959`) stretch, center, **gap 34.77px** between items.
- 8 items (row, center, gap 6.95): small icon (10.19 × 9.27) + label.
  - Labels in order: "MAKING MOVES", "SMILES IN MOTION", "YOUR MOVE", "FIRST MOVE", "SIGNED", "SIGNED", "SMILES IN MOTION", "FIRST MOVE".
  - Label text — **Silka Medium 500, 15.07px, ls 0.1269em, LEFT, `rgba(4,20,58,0.6)`**.

---

## 5. How it works — "You moves. In Three Moves"  (`#1465:28000`)
- Section: column, padding `50px 16px`, width 390, White, radius 20px. Inner column center gap 28.
- Header (`#1465:28002`, column stretch center gap 16):
  - Eyebrow "HOW IT WORKS" — **Silka Medium 500, 12px, ls 0.0833em, UPPER, CENTER, pink**.
  - Headline "You moves. In Three Moves" — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, CENTER**. "You moves." pink, rest navy.
  - Sub "No postal impression kits. No anonymous review team…" — **Silka Regular 400, 16px, lh 1.4em, ls -0.02em, CENTER, navy**.
- Steps container (`#1465:28008`, column stretch gap 4). **3 step cards STACK vertically** (desktop row → column):
  - Each card: column stretch, padding `24px 16px`, gap 24, fill `#F2F6FE`, radius 16px.
  - Step header (gap 8): "STEP 0X" — **Silka Medium 500, 12px, ls -0.02em, pink**; title — **Silka Medium 500, 16px, ls -0.02em, TITLE, LEFT, navy** ("Scan day" / "The signed plan" / "In motion").
  - Step image container: fill width, **height 180** (steps 1–2); Step 3 image container **height 160**, fill `#FDADB0`, radius 150px (pill).
  - Step body — **Silka Regular 400, 14px, lh 1.4em, ls -0.02em, LEFT, navy**.
- Primary button (`#1465:28032`): navy pill, padding `16px 32px`, " Book Free Consultation" 18px White.

---

## 6. Before & Afters — "Real moves. Signed."  (`#1465:28034`)
- Section: column, padding `50px 16px`, gap 28, width 390, White, radius 20px.
- Header (`#1465:28035`, column center gap 16):
  - Eyebrow "BEFORE AND AFTERS" — Silka Medium 500, 12px, ls 0.0833em, UPPER, pink.
  - Headline "Real moves. Signed." — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, LEFT**. "Real moves." pink.
  - Body "Every case unretouched, originals on file…" — **Silka Regular 400, 16px, lh 1.4em, CENTER, navy** (fixed w358).
- **Carousel** (`#1465:28039`): row, **overflow-scroll X**, gap 4, fixed width 380. Cards scroll horizontally.
  - Card: column, padding `20px 16px`, gap 32, **width 340**, fill `#F2F6FE`, radius 16px.
    - Before/After image pair (`EL-40fdc56d`): row, stretch, gap 4, **height 197**. Each image radius 12px with a small badge (padding `4px 9px`, `rgba(0,0,0,0.25)` fill, white 0.8px stroke, radius 50px): "Before" / "After" — **Silka Medium 500, 12px, line-height 12px, White**.
    - Name — **Silka Medium 500, 16px, ls -0.0238em, CENTER, navy** (cards 3–4 use **Silka Medium 500, 18px, ls -0.0212em, CENTER**).
    - Quote block: left border **2.4px navy**, padding-left 10; text — **Silka Regular 400, 14px, lh 1.4em, ls -0.02em, navy**.
    - Footer row (space-between center): "Signed by Dr. …" — **Silka Regular 400, 14px, ls -0.02em, Primary-40**; GDC badge (White pill, padding `6px 10.5px`, radius 50px) "GDC: 2518xx" — **Silka Medium 500, 12px, ls -0.02em, Primary-60**.
  - 4 cards: Lisa A., Priya R., Sarah M., Tom W.
- Pagination dots (`#1465:28165`, w374): active **32 × 8** navy radius 100 + 5 inactive **8 × 8** (fill `#F2F6FE`, navy 1px stroke).

---

## 7. Pricing — "Exactly what Moves costs"  (`#1465:28185`)
- Section: column, padding `50px 16px`, gap 24, width 390, White, radius 20px.
- Header (`#1465:28204`, gap 28, w358 → `#1465:28205` center gap 16):
  - Eyebrow "PRICING" — Silka Medium 500, 12px, ls 0.0833em, UPPER, pink.
  - Headline "Exactly what Moves costs" — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, LEFT**. "Exactly what" pink.
  - Body "Some brands make you book a call to learn a price…" — **Silka Regular 400, 16px, lh 1.4em, CENTER, navy** (w358).
- Cards container (`#1465:28209`, column stretch gap 4). **2 pricing cards STACK vertically** (desktop side-by-side → column):
  - Card inner: column stretch, padding `24px 16px`, gap 5.4, radius 16px. **Card 1 fill light pink `#FDE3E4`; Card 2 fill `#F2F6FE`**.
  - Top row (space-between center, w332): left column gap 10.82:
    - Plan name "Clear aligners" / "Composite Bonding" — **Silka Medium 500, 18px, ls -0.02em, LEFT, navy**.
    - "From" — **Inter Regular 400, 14px, lh 1.34em, `rgba(0,0,0,0.4)`**.
    - Price row (flex-end, gap 6.49): "£16.30" — **Silka Medium 500, 26px, lh 1em, ls -0.04em** (Card 1 pink, Card 2 navy); "/per month" — **Silka Regular 400, 14px, lh 1.2em, Primary-70**.
    - Product image **62.28 × 65** on the right.
  - Divider line Primary-10 1px.
  - Feature list (`#1465:28223`, gap 12): each row = blue checkmark (5.98 × 4.33, `#004DF6`) + label — **Silka Medium 500, 14px, ls -0.02em, navy**. Items: "Dual Arch", "4—6 months treatment time", "Crowding on 6-8 teeth", "Bite correction".
  - Button: row, padding `12px 24px`, center, **width 332, height 45**, radius 90px. Card 1 fill **pink**, Card 2 fill **navy**. Label "Book Free Consultation" — Silka Medium 500, 18px, White.

---

## 8. Trustpilot reviews — "Don't take our word for it"  (`#1465:28278`)
- Section: column, padding `50px 0` (no horizontal pad at section level), center, White, radius 20px.
- Inner wrapper (`#1465:28279`) row, padding `0 16px`, center, gap 10, width 390 → card (`#1465:28280`) column, padding `0 0 28px`, center, gap 28, White, radius 16px.
- Header (`#1465:28281`, gap 16):
  - Trustpilot row (row center gap 12.91): "Excellent (3,890)" — **Aeonik Bold 700, 16px, lh 1.02em, ls -0.03em, black `#000000`**; 5 green stars; "Trustpilot" — **Silka Medium 500, 14px, lh 25.82px, navy**.
  - Headline "Don't take our word for it" — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, CENTER**. "Don't take" pink.
- Reviews (`#1465:28295` row center gap 10, w358 → `#1465:28296` row gap 4, w358 → `#1465:28297` column stretch gap 4). **Review cards STACK vertically in a single column** (desktop multi-column → 1 column).
  - Review card (`EL-563fb78a`): column stretch, padding `20px 12px`, gap 50, fill `#F2F6FE`, radius 16px.
    - Stars row (5 green stars) + "Verified" — **Silka Medium 500, 16px, ls -0.02em, UNDERLINE, `#858585`**.
    - Body "With Capable, I've expanded my network…" — **Silka Medium 500, 16px, ls -0.02em, `#858585`**.
    - Footer row (stretch center gap 8): avatar + column (gap 4): "Moves is genius" — **Silka Bold 700, 16px, ls -0.02em, navy** (w137); "Pauline, 5 hours ago" — **Silka Regular 400, 14px, lh 16.8px, ls -0.0243em, `rgba(146,146,146,0.7)`** ("Pauline," bold-weight 500).
  - 3+ stacked cards visible.
- Fade-out gradient overlay at bottom (`#1465:28355`, 359 × 165.83, `rgba(248,248,248,1) → transparent`).
- **"View More" button** (`#1465:28356`): row, padding `14px 40px`, center, height 45, White fill, navy 1px stroke, radius 100px. Label "View More" — **Silka Medium 500, 18px, lh 25.3px, ls -0.0556em, center, navy**.

---

## 9. Team — "The Names Behind The Smiles."  (`#1465:28357`)
- Section: column, padding `50px 16px`, gap 24, width 390, White, radius 20px.
- Header wrapper (`#1465:28376/28377`, gap 28, w358 → `#1465:28378` gap 16):
  - Eyebrow "OUR TEAM" — **Silka Medium 500, 12px, ls 0.0833em, UPPER, LEFT, pink**.
  - Headline "The Names Behind The Smiles." — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, LEFT** (w294.58). "The Names" pink.
  - Body "Every MOVES plan is signed by one of these dentists…" — **Silka Regular 400, 16px, lh 1.4em, ls -0.02em, LEFT, navy**.
  - Primary button (`#1465:28384`): navy pill " Book Free Consultation".
- **Team cards** (`#1465:28386`): row, **overflow-scroll X**, center, gap 4, fixed width 374. Cards scroll horizontally.
  - Card (`EL-16523b77`): **fixed 330 × 180**, fill `#F2F6FE`, radius 16px.
    - Dentist image (`EL-2d5dcff8`) absolute x12 y23.81, **179 × 159**.
    - Text block (`EL-6058fbb0`) absolute x189 y23.81, **129 × 156**, padding `0 0 24px`, space-between, flex-end:
      - icon 22 × 20.
      - "Dr. Amir Hussain" — **Silka Medium 500, 16px, ls -0.02em, CENTER, navy**.
      - "Moves Verified Dentist" + "GDC No. 12345" — **Silka Medium 500, 12px, ls -0.02em, LEFT, Primary-70** (each).
  - 4 cards.
- Pagination dots (`#1465:28432`): active **32 × 8** navy + 6 inactive **8 × 8**.

---

## 10. Proof in motion — "Real smiles, real stories"  (`#1465:28452`)
- Section: column, padding `50px 16px`, gap 28, width 390, White, radius 20px.
- Header (`#1465:28454`, column stretch gap 16):
  - Eyebrow "PROOF IN MOTION" — **Silka Medium 500, 12px, ls 0.0833em, UPPER, CENTER, pink** (w326 h17).
  - Headline "Real smiles, real stories" — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, CENTER** (w318.5). "Real smiles," pink.
  - Body "Address symptoms, treat root causes…" — **Silka Regular 400, 16px, lh 1.4em, CENTER, navy**.
- **Video cards** (`#1465:28459`): row, **overflow-scroll X**, gap 4, fixed width 374.
  - Each card **270 × 420**, image cover, radius 8px (last card radius 16px).
  - Play button overlay (`EL-581fd978`): absolute (x≈110 y≈186), row, padding `12px 20px`, center, gap 10, fill `rgba(255,255,255,0.8)`, `backdrop-filter: blur(5px)`, radius 100px, play icon 10 × 24.

---

## 11. The Movers — "You don't buy moves. You join it."  (`#1465:28490`)
- Section: column, padding `50px 16px`, gap 24, width 390, White, radius 20px.
- Header wrapper (`#1465:28491`, column stretch center gap 28 → `#1465:28493` center gap 16, w358):
  - Eyebrow "THE MOVES" — **Silka Medium 500, 12px, ls 0.0833em, UPPER, CENTER, pink**.
  - Headline "You don't buy moves. You join it." — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, CENTER** (w296.86). "You don't buy moves." pink.
  - Body "Every patient becomes a Mover on scan day…" — **Silka Regular 400, 16px, lh 1.4em, CENTER, navy**.
- Role cards (`#1465:28499`, column stretch center gap 4). **4 role cards STACK vertically**:
  - Card (`EL-3939a55a`): column stretch, padding `20px 16px`, gap 10, fill `#F2F6FE`, radius 16px.
  - Inner row (gap 16): icon circle **46 × 46** fill `#FDADB0` radius 23px (icon 21.65 × 21.65) + column (gap 12):
    - title "Mover" / "Advocate" / "Creator" / "Advocate" — **Silka Medium 500, 18px, ls -0.02em, navy**.
    - desc "You take the first step and start the move." — **Silka Regular 400, 16px, lh 1.4em, ls -0.02em, navy**.
- Primary button (`#1465:28538`): navy pill " Book Free Consultation".

---

## 12. CTA — "Your MOVE"  (`#1465:28540`)
- Section: column stretch, padding `50px 0 0` (top only), **fixed height 750**, full-bleed background image, radius 20px.
- Content wrapper (`#1465:28542`, padding `0 16px`, center, gap 16):
  - Headline "Your MOVE" — **Jost Medium 500, 36px, lh 1.1em, ls -0.0417em, TITLE, CENTER, White** (w226).
  - Body "A free consultation, an honest answer, and a plan with a name on it." — **Silka Regular 400, 16px, lh 1.4em, CENTER, White**.
- CTA button (`#1465:28545`): row, padding `16px 32px`, center, **width 273, height 56**, navy, radius 74px. " Book Free Consultation" White 18px.
- Money-back guarantee badge (`#1465:28546`, absolute x194.81 y562.73, 191.39 × 187.21): pink star 188 × 184 radius 18.47 + stacked text CENTER White: "Money back" / "Guarantee" (**Jost Regular 400, 9.85px, lh 1.2em, UPPER**) + "30" (**Jost Medium 500, 36.94px, lh 1.1em, ls -0.0333em**) + "days" (9.85px).

---

## 13. FAQs — "Frequently Asked Questions"  (`#1465:28554`)
- Section: column, padding `50px 16px`, center, gap 28, width 390, White, radius 20px.
- Header (`#1465:28555`):
  - Eyebrow "FAQS" — **Silka Medium 500, 12px, ls 0.0833em, UPPER, LEFT, pink**.
  - Headline "Frequently Asked Questions" — **Jost Medium 500, 32px, lh 1.1em, ls -0.0469em, TITLE, CENTER** (inner padding `0 16px`, gap 24). "Frequently" pink.
- FAQ list (`#1465:28559`, column stretch gap 4, **width 358**). **9 items stacked**:
  - Item (`EL-d6f9031c`): row stretch, padding `20px 12px`, space-between, fill `#F2F6FE`, radius 8px.
  - Question — **Silka Medium 500, 16px, lh 1.4em, ls -0.02em, LEFT, navy** + plus/expand icon 20 × 20.
  - Questions: "What is MOVES?", "Who signs my treatment plan?", "How do I know if aligners are right for me?" (w262), "How much does MOVES cost?", "How long does treatment take?", "Do I need clinic appointments?", "Are MOVES aligners painful?", "What happens while I'm wearing aligners?" (w260), "How do I start?".

---

## 14. Footer  (`#1465:28632`)
- Section: column, padding `50px 16px`, center, gap 24, width 390, fill navy `#04143A`, radius `16px 16px 0 0`.
- Mailing list (`#1465:28633`, column stretch center gap 20):
  - "Join our mailing list" — **Silka Regular 400, 18px, LEFT, White**.
  - Email input row (`#1465:28635`): padding `10px 10px 10px 30px`, space-between, center, fill White, radius 100px.
    - "YOUR EMAIL" — **Silka Regular 400, 16px, lh 1em, ls -0.02em, UPPER, LEFT, navy**.
    - submit circle: padding 8, fill pink, radius 1000px, arrow icon 20 × 20.
- Divider line `#DCDCDC` 0.2px.
- Nav links (`#1465:28643`, column stretch gap 15): "Shop", "About", "Signed", "Faq's", "Contact" — **Silka Regular 400, 16px, ls -0.02em, LEFT, White**.
- Social row (`#1465:28649`, gap 19.91, h27.06): Instagram + TikTok icons 24.06 × 24.06, Envelope 27.06 × 27.06.
- Bottom block (`#1465:28656`, column stretch center gap 16): wordmark logo SVG **358 × 56.14** + "© Copyright 2026 Moves" — **Silka Regular 400, 16px, lh 1em, ls -0.02em, CENTER, `rgba(255,255,255,0.8)`**.

---

## Global reusable patterns
- **Primary button** (`EL-4b3dee7d`): navy fill, radius 100px, padding `16px 32px`, center. Label Silka Medium 500, 18px, lh 25.3px, ls -0.0556em, White. Used in hero, manifesto (floating), how-it-works, team, movers.
- **Section eyebrow**: Silka Medium 500, 12px, ls 0.0833em, UPPERCASE, pink `#FC5257`.
- **Section H2**: Jost Medium 500, 32px (hero 40, manifesto/CTA 36), lh 1.1em, ls ≈ -0.0469em, TITLE case. First phrase pink, rest navy.
- **Section body**: Silka Regular 400, 16px (secondary 14px), lh 1.4em, ls -0.02em, navy.
- **Cards inside white sections** sit on `#F2F6FE` fill, radius 16px (FAQ items 8px).
- **Horizontal-scroll carousels** (row + `overflow-x`): Before/After, Team, Proof-in-motion. **Vertical stacks**: How-it-works steps, Pricing cards, Reviews, Movers roles, FAQ items.

