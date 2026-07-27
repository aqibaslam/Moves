# Figma Structural Spec — "New Moves Dental X Convertt"

Source: Figma dump `mcp-figma-get_figma_data-1785140520195.txt` (2,167 lines).
Root design node: **"Home Page - Desktop - 2026, July 23" `#1465:27213`** (design container `#1465:1465-27213`, sometimes referenced as node `1465-27213`).
Designed width: **1440px**. All px values are Figma raw values.

> Note on this dump format: layout/style/fill definitions are stored once in `GLOBAL_VARS` and referenced by name; repeated subtrees are stored in `ELEMENTS` (template `EL-*`) and referenced via `template=`. In this spec those references are **resolved inline** so you don't have to cross-reference.

---

## 0. Resolved token dictionaries (reference)

### Text styles (fontFamily / weight / size / lineHeight / letterSpacing / align / case)
- **style_91d277a1**: Silka Medium 500, 14px, LH 1.4em, LS -0.02em, TITLE case, LEFT
- **style_3e8c3370**: Silka Medium 500, 16px, LS -0.02em, LEFT
- **style_cd362a30**: Aeonik Bold 700, 16px, LS -0.02em, LEFT
- **style_8774234f**: Silka Regular 400, 16px, LH 1.4em, LS -0.02em, LEFT
- **style_de1c2097**: Silka Medium 500, 12px, LH 1.2em, LS -0.02em, LEFT
- **sd**: Silka Medium 500, 12px, LS 0.0833em, LEFT (eyebrow style)
- **style_43809ed5**: Jost Medium 500, 48px, LH 1.1em, LS -0.0417em, TITLE, LEFT
- **style_0d31d491**: Silka Regular 400, 32px, LS -0.02em, LEFT, paragraphSpacing 61.6
- **style_3ba2687f**: Silka Regular 400, 14px, LS -0.02em, LEFT
- **style_e21a531c**: Silka Regular 400, 18px, LS -0.02em, CENTER
- **style_62c5115a**: Silka Medium 500, 16.77px, LS 0.1269em, LEFT (marquee)
- **style_ff7ec36a**: Silka Medium 500, 14px, LS -0.02em, LEFT
- **style_32c3c917**: Silka Medium 500, 20px, LS -0.02em, TITLE, LEFT, paragraphSpacing 61.6
- **style_97044151**: Silka Regular 400, 14px, LH 1.4em, LS -0.02em, LEFT
- **style_29c0caf0**: Silka Regular 400, 16px, LH 1.4em, LS -0.02em, CENTER
- **style_78c406a0**: Silka Medium 500, 12px, LH 12px, LEFT (Before/After chips)
- **style_d1341a70**: Silka Medium 500, 18px, LS -0.0212em, CENTER, paragraphSpacing 36.66
- **style_81f01871**: Silka Medium 500, 12px, LS -0.02em, LEFT
- **style_1f6ee531**: Silka Medium 500, 32px, LH 50px, LS -0.0625em, LEFT, paragraphSpacing 61.6
- **style_c85b33cc**: Silka Medium 500, 46px, LH 1em, LS -0.04em, CENTER/CENTER (price)
- **style_59e7cc35**: Jost Medium 500, 48px, LH 1.2em, LS -0.0417em, TITLE, CENTER
- **style_f44ef6e4**: Jost Regular 400, 16px, LH 1.2em, UPPER, CENTER (guarantee badge)
- **style_c575a19d**: Silka Medium 500, 16px, LH 1.4em, LS -0.02em, LEFT (FAQ question)
- **style_0a689a18**: Silka Regular 400, 16px, LH 1em, LS -0.02em, UPPER, LEFT (footer links)
- **style_2cb462b6**: Silka Medium 500, 16px, LS -0.02em, LEFT/CENTER (review body)

### Inline text-run overrides (used inside `{tsN}...{/tsN}` spans)
- **ts1**: Silka Medium 500
- **ts2**: Medium 500, color **#FC5257**
- **ts3**: Medium 500
- **ts4**: color **#FC5257**
- **ts5**: color **rgba(255,255,255,0.4)**
- **ts6**: color **#FC5257**, LH 1.1em
- **ts7**: LH 1.1em
- **ts8**: Regular 400
- **ts9**: color **#04143A**

### Layout tokens
- **layout_5c79c5b1**: column, alignSelf stretch, alignItems stretch, sizing fill/hug
- **layout_17ee8d69**: column, alignSelf stretch, alignItems center, fill/hug
- **layout_283e9b97**: column, alignItems center, hug/hug
- **layout_177c5efc**: none (no autolayout), hug/hug
- **layout_56d3c81c**: none, fill/hug
- **layout_3cdeda1d**: none, fill/fixed, height 0 (divider line)
- **layout_617da2ef**: none, fill/fill (image fill container)
- **layout_80948dc8**: column, alignSelf stretch, padding 80/60/80/60, alignItems stretch, gap 40, fill/hug
- **layout_b0852e43**: column, alignSelf stretch, fill/hug
- **layout_745e172c**: none, fixed/fill, width 81.89
- **layout_87207809**: none, fixed/hug, width 488
- **layout_c1b7d400**: none, fixed/hug, width 330
- **layout_fa142780**: none, x0 y0, 229.26×218
- **layout_20f4d523**: row, padding 4/9/4/9, justify center, align center, hug/hug, at x9.95 y9.8
- **layout_6437ab47**: column, padding 40, alignItems stretch, gap 24, fill/hug
- **layout_c6528a63**: row, alignSelf stretch, padding 16/32/16/32, justify center, align center, fill/hug
- **layout_a3503081**: none, fill/fixed, height 420
- **layout_c00e6bd6**: none, fixed/fixed, 26.68×26.68

---

## 1. Root frame

**`#1465:27213` "Home Page - Desktop - 2026, July 23"** — type FRAME
- layoutMode: **column (vertical)**
- alignItems: **center**
- itemSpacing (gap): **16px**
- sizing: horizontal contextual, vertical hug; **designedWidth 1440px**
- background fill: **#F2F6FE** (`fill_ad60ebce`)
- No padding declared.

Direct children (top → bottom), 14 blocks:
1. `#1465:27214` — Header + Hero wrapper
2. `#1465:27314` — Problem section ("THE MOVES YOU ALREADY MAKE")
3. `#1465:27321` — Brand manifesto ("WHY WE'RE CALLED MOVES")
4. `#1465:27372` — Marquee strip ("MAKING MOVES…")
5. `#1465:27414` — How it works (3 steps) "Desktop - 5361"
6. `#1465:27447` — Before & Afters slider "Desktop - 5360"
7. `#1465:27601` — Pricing
8. `#1465:27602` — Trustpilot reviews wall "Desktop - 5342"
9. `#1465:27635` — Our team
10. `#1465:27636` — Proof in motion (video grid) "Desktop - 5354"
11. `#1465:27678` — The Movers (4 tiers)
12. `#1465:27727` — "Your MOVE" CTA banner
13. `#1465:27742` — FAQs "Desktop - 5359"
14. `#1465:27820` — Footer with email signup

---

## 2. Sections (in order) with full nested trees

### SECTION 1 — Header + Hero  `#1465:27214`
FRAME, layout column stretch/stretch, fill/hug.
Child **`#1465:27215`** layout_17ee8d69 (column, stretch, center), fill **#FFFFFF**.

**1a. Announcement bar + Nav wrapper `#1465:27216`** — layout_5c79c5b1, fill **#05143B** (dark navy `fill_ddc03eee`)

- **Announcement bar `#1465:27217` "Container"** — row, alignSelf stretch, padding **11px 326px**, justify center, align center, gap 8px, fill/hug, bg **#05143B**
  - `#1465:27218` "Text" (layout_283e9b97, opacity 0.92)
    - `#1465:27219` TEXT — **"Every MOVES® smile is signed by a named, GDC-registered dentist."** — Silka Regular 400, 14px, LS -0.02em, CENTER, color **#FFFFFF**
  - `#1465:27220` "Link" (layout_283e9b97, bottom stroke rgba(255,232,232,0.4) weight 0.8px)
    - `#1465:27221` TEXT — **"Meet the dentists who sign →"** — Silka Medium 500, 14px, LS 0.0193em, CENTER, color **#FFFFFF**

- **Navigation `#1465:27222`** — row, alignSelf stretch, padding **10px 60px**, justify space-between, align center, fill/hug, fill **#FFFFFF**, borderRadius **16px 16px 0 0**
  - `#1465:27223` (row, center, gap 24, hug)
    - `#1465:27237` IMAGE-SVG **"Moves-Primary-Logo 2"** — 163×20 (vector logo, no fill token)
  - `#1465:27252` "Fill Button" — row, padding **14px 32px**, center/center, hug, fill none/transparent, stroke **#04143A** weight 1px, borderRadius **90px**
    - `#1465:27253` TEXT — **"Book A Consultation"** — Silka Medium 500, 16px, LH 25.33px, LS -0.0625em, TITLE, CENTER, color **#04143A**
  - `#1465:27254` "Container" — row, gap 36, hug, **position absolute** at x496.82 y19.5 (centered nav links)
    - `#1465:27256` TEXT **"Your Move"** — style_91d277a1, color **#04143A**
    - `#1465:27258` TEXT **"Signed"** — style_91d277a1, color **#04143A**
    - `#1465:27260` TEXT **"Pricing"** — style_91d277a1, color **#04143A**
    - `#1465:27262` TEXT **"In motion"** — style_91d277a1, color **#04143A**
    - `#1465:27264` TEXT **"The movers"** — style_91d277a1, color **#04143A**

**1b. Hero `#1465:27265`** — row, **1440×800**, fill **#FDE3E4** (light pinkish), borderRadius 16px

- **Left column `#1465:27266`** — column, alignSelf stretch, padding **40px 40px 40px 60px**, justify center, gap 40, width **707**, fill/fill, bg **#FDE3E4**
  - `#1465:27267` (column, stretch, gap 24)
    - `#1465:27268` (row, align center, gap 16.14) — rating row
      - `#1465:27269` "Stars" (row, gap 2.46) → 5× Star instances `#1465:27270–27274`, each padding 3.69, fill **#219653** (green), each contains "Shape" SVG 17.22×17.22 fill **#FFFFFF**
      - `#1465:27275` (row, center, gap 4.97, height 25)
        - `#1465:27276` "Shape" SVG 22.34×22.34, fill **#219653**
        - `#1465:27277` TEXT **"Trustpilot"** — style_3e8c3370, color **#04143A**
      - `#1465:27278` TEXT — **"Excellent (3,890)"** (`{ts1}Excellent \(3,890\){/ts1}`) — style_cd362a30 (Aeonik Bold 700, 16px), color **#04143A**
    - `#1465:27281` TEXT (headline, layout_56d3c81c) — **"The smile you've been putting off"** (`{ts2}The smile{/ts2}{ts3} you've been putting off{/ts3}`; "The smile" in **#FC5257**) — Jost **SemiBold 600**, **72px**, LH 1.1em, LS -0.0278em, TITLE, LEFT, color **#04143A**
    - `#1465:27282` TEXT (subhead) — **"MOVES is the movement behind modern smiles. Planned in person, signed by a named GDC-registered dentist, at a price we publish. The smile is yours, the signature means you never move alone."** — style_8774234f (Silka Regular 400 16px), color **#04143A**
  - `#1465:27283` (row, align center, gap 24, width 462) — CTA row
    - `#1465:27284` "Fill Button" — row, padding 16px 32px, center, width **250**, fill **#04143A**, borderRadius 90px → TEXT **"Book Free Consultation"** (Silka Medium 500, 18px, LH 25.33px, LS -0.0556em, CENTER, color **#FFFFFF**)
    - `#1465:27285` (column, align flex-end, gap 2)
      - `#1465:27286` TEXT **"See exactly what it costs"** — Silka Medium 500, 14px, LH 1.2em, LS -0.02em, LEFT, color **#04143A**
      - `#1465:27287` LINE — stroke **#FC5257** weight 1px (underline)
  - `#1465:27288` (row, padding 16, align center, gap 22, fill **#FFFFFF**, borderRadius 8px) — signature card
    - `#1465:27289` TEXT **"Amelia Hart"** — **Caveat** Regular 400, 28px, LH 28px, LEFT, color **#05143B**
    - `#1465:27290` LINE — vertical, 0×41, stroke **#DCDCDC** weight 1px
    - `#1465:27291` (column, stretch, gap 7, 271×35)
      - `#1465:27292` TEXT **"SIGNED · GDC No. 123456"** — style_de1c2097, color **rgba(4,20,58,0.7)**
      - `#1465:27293` TEXT **"ON THE PLAN. IN YOUR ACCOUNT. ON THE BOX."** — style_de1c2097, color **#04143A**

- **Right image panel `#1465:27294`** — column, padding 32, justify flex-end, gap 32, **733×800**, fill = **IMAGE** `imageRef 9fda3e717c342c2aa9bf7853180554c75c923acf` (STRETCH 100%×100%, needsCropping, suffix **5747ca**)

---

### SECTION 2 — Problem section  `#1465:27314` (INSTANCE "Section", componentId 1213:1630)
layout_80948dc8 (column, stretch, **padding 80px 60px**, alignItems stretch, **gap 40**), fill **#FFFFFF**, borderRadius **24px**.

- `#I…;1213:1597` (column, stretch, gap 20)
  - `#…;1213:1598` "Container" (column, hug)
    - `#…;1213:1599` TEXT eyebrow — **"THE MOVES YOU ALREADY MAKE"** — style `sd`, color **#FC5257**
  - `#…;1213:1600` "Heading 2" (column, stretch)
    - `#…;1213:1601` TEXT (width 804) — **"Your've been making moves for years. Just the wrong ones."** ("Just the wrong ones." in **#FC5257** via ts4) — style_43809ed5 (Jost Medium 48px), base color **#04143A**
- `#…;1213:1602` (row, stretch, justify space-between)
  - **Left list `#…;1213:1603`** — column, stretch, padding **40px 0 0**, justify space-between, width **665**, fill/fill
    - `#…;1213:1604` "Container"
      - `#…;1213:1605` TEXT — **"Closed-mouth photo"** — Silka Medium 500, **32px**, LS -0.02em, LEFT, **underline**, color **#04143A**
      - `#…;1213:1606` TEXT — **"Hand over your mouth, mid-laugh"** — style_0d31d491 (Silka Reg 32px), color **rgba(4,20,58,0.2)**
      - `#…;1213:1607` TEXT — **"Turn away from the camera"** — style_0d31d491, color rgba(4,20,58,0.2)
      - `#…;1213:1608` TEXT — **"Photo you took,  then deleted."** — style_0d31d491, color rgba(4,20,58,0.2)
      - `#…;1213:1609` TEXT — **""Careful" smile."** — style_0d31d491, color rgba(4,20,58,0.2)
      - `#…;1213:1610` TEXT — **"Camera off, again."** — style_0d31d491, color rgba(4,20,58,0.2)
    - `#…;1213:1611` (column, gap 24)
      - `#…;1213:1612` (column, gap 32, width 480)
        - `#…;1213:1613` TEXT — **"Nobody buys aligners. People buy the moment they stop hiding. If you recognise more than two of these, you already know which moment we mean."** — style_3ba2687f (Silka Reg 14px), color **#04143A**
  - **Right image `#…;1213:1616`** — column, padding 20, justify flex-end, align center, gap 10, **608×607**, fill = **IMAGE** `imageRef 0c24609beafdea0fe23062fa77b5ce88d2261064` (FILL cover), borderRadius **24px**
    - `#…;1213:1617` (row, gap 6, height 6) — progress bar: 6 rects
      - `#…;1213:1618` RECT 81.89-wide, fill **#FFFFFF**, borderRadius 3px (active)
      - `#…;1213:1619`–`1623` RECT ×5 — fill **rgba(255,255,255,0.2)**, borderRadius 3px (inactive)

---

### SECTION 3 — Brand manifesto  `#1465:27321` "Section"
FRAME, column, **padding 120px 60px**, alignItems stretch, **1440×1165**.
Background = **linear-gradient(180deg, rgba(253,136,139,0) 0%, rgba(253,136,139,1) 100%)** OVER **IMAGE** `imageRef 2260aca52362ddff6466097c9ea4b257650540e4` (STRETCH 100%×100%, needsCropping, suffix **60cb9e**). borderRadius **24px**.

- `#1465:27322` "Container" (none, fill, height 977.15)
  - `#1465:27323` RECTANGLE **"image 2795"** — at x346.9 y353.6, **626.92×537.15**, fill **IMAGE** `imageRef 627e0ef7638c192493d8ae39c7d1e1d59229c24f` (STRETCH, needsCropping, suffix **2d4610**)
  - `#1465:27324` RECTANGLE — at x346.82 y821.2, **656×173**, fill **#FD888B**, effect **blur(32px)**, borderRadius 9999px (glow)
  - `#1465:27325` TEXT eyebrow — **"WHY WE'RE CALLED MOVES"** — at x554.82 y5.6, 183×14, style `sd`, color **#FFFFFF**
  - `#1465:27326` (column, align center, gap 42, at x48.36 y75.6)
    - `#1465:27327` TEXT (width 1224) — **"Moves is not a clear aligner company. \n It is the moment behind modern smiles."** (both "not a clear aligner company." and "It is the moment behind modern smiles." wrapped in ts5 = rgba(255,255,255,0.4); note explicit newline `\n`) — Jost Medium 500, **68px**, LH 1.1em, LS -0.0294em, TITLE, CENTER, base color **#FFFFFF**
    - `#1465:27328` TEXT (width 894.9) — **"Aligner brands sell trays. Trays are the mechanism, the move is the product: from still to moving, from hiding to shown. Everything on this page is just how we get you there."** — style_e21a531c (Silka Reg 18px, CENTER), color **#FFFFFF**
  - `#1465:27329` "Fill Button" — row, padding 16px 32px, center, at x535.18 y890.8, width **250**, fill **#04143A**, borderRadius 90px → TEXT **"Book Free Consultation"** (Silka Medium 500, 18px, CENTER, **#FFFFFF**)

---

### SECTION 4 — Marquee strip  `#1465:27372` "Container"
FRAME, layout_b0852e43 (column, stretch), fill none/transparent (`fill_97d170e1`).
- `#1465:27373` (row, align center, gap **38.71**, width 1393.38)
  Repeating "icon + label" units (each = row, align center, gap 7.74; icon = SVG 11.34×10.32 no-fill):
  - `#1465:27378` **"MAKING MOVES"** — style_62c5115a, color **rgba(4,20,58,0.6)**
  - `#1465:27383` **"SMILES IN MOTION"** — style_62c5115a, rgba(4,20,58,0.6)
  - `#1465:27388` **"YOUR MOVE"** — style_62c5115a, rgba(4,20,58,0.6)
  - `#1465:27393` **"FIRST MOVE"** — style_62c5115a, rgba(4,20,58,0.6)
  - `#1465:27398` **"SIGNED"** — style_62c5115a, rgba(4,20,58,0.6)
  - `#1465:27403` **"SIGNED"** — rgba(4,20,58,0.6)
  - `#1465:27408` **"SMILES IN MOTION"** — rgba(4,20,58,0.6)
  - `#1465:27413` **"FIRST MOVE"** — rgba(4,20,58,0.6)

---

### SECTION 5 — How it works  `#1465:27414` "Desktop - 5361"
FRAME, column, **padding 80px 60px**, alignItems stretch, **gap 40**, width **1440**, fill **#FFFFFF**, borderRadius 24px.

- **Header row `#1465:27415`** (row, stretch, justify space-between, align flex-end)
  - `#1465:27416` (column, gap 20)
    - `#1465:27417` TEXT eyebrow **"HOW IT WORKS"** — `sd`, **#FC5257**
    - `#1465:27418` TEXT — **"You move, in Three moves"** ("You move," in **#FC5257** via ts4) — style_43809ed5 (Jost 48px), base **#04143A**
    - `#1465:27419` TEXT (width 488) — **"No postal impression kits. No anonymous review team. A dentist, a scanner, a signature then motion."** — style_8774234f, **#04143A**
  - `#1465:27420` "Fill Button" (width 250, fill #04143A, r90) → **"Book Free Consultation"** (#FFFFFF)
- **Steps row `#1465:27421`** (row, stretch, align center, gap 4)
  - **Step 01 `#1465:27422`** — column, stretch, padding 24, gap 36, fill **#F2F6FE**, borderRadius 24px
    - `#1465:27423` (column, stretch, gap 8)
      - `#1465:27424` TEXT **"STEP 01"** — style_ff7ec36a, **#FC5257**
      - `#1465:27425` TEXT (width 330) **"Scan day"** — style_32c3c917, **#04143A**
    - `#1465:27426` (none, fill, height 218) image group
      - `#1465:27427` (at x79.37, 229.26×218)
        - `#1465:27428` RECT — fill **IMAGE** `imageRef 94a8d82c413806e6ef5a2d0d639dfda3550f31ca` (needsCropping, suffix **5eeba6**)
        - `#1465:27429` RECT — at x87.99 y16.95, 70.3×151.57, fill **IMAGE** `imageRef d0c021a51840b143db23abc20a0da74eb6b82f00` (needsCropping, suffix **26f648**)
    - `#1465:27430` TEXT — **"Twenty minutes, in person, with a dentist. A 3D scan — and if aligners won't work for you, we say so, and you pay nothing."** — style_97044151, **#04143A**
  - **Step 02 `#1465:27431`** — column, padding 24, gap 36, fill **#F2F6FE**, r24
    - `#1465:27433` **"STEP 02"** (#FC5257), `#1465:27434` (width 330) **"The signed plan"** (#04143A, style_32c3c917)
    - `#1465:27436` (none, at x69.37, 229.26×218)
      - `#1465:27437` RECT — fill **IMAGE** `imageRef 3296cda43c4eecb70cd9fa6c2c3be9bbabd431e1` (FILL cover)
    - `#1465:27438` TEXT — **"Every stage of the move, on screen, before you pay a pound. Signed by name, with a GDC number you can look up in eight seconds."** — style_97044151, #04143A
  - **Step 03 `#1465:27439`** — column, padding 24, gap 36, fill **#F2F6FE**, r24
    - `#1465:27441` **"STEP 03"** (#FC5257), `#1465:27442` (width 330) **"In motion"** (#04143A)
    - `#1465:27444` (none, at x69.37)
      - `#1465:27445` RECT — at x-10.07 y6.74, 249.41×218, fill **IMAGE** `imageRef 985e8e07415ae448346ae06f6e7b54f8bd3f1ba5` (needsCropping, suffix **4bb8f7**)
    - `#1465:27446` TEXT — **"Aligners made in Germany, finished by hand, delivered to your door. Check-ins reach you before you have to ask, stage by stage."** — style_97044151, #04143A

---

### SECTION 6 — Before & Afters  `#1465:27447` "Desktop - 5360"
FRAME, column, **padding 80px 0**, justify center, align center, **gap 40**, width **1440**, fill **#FFFFFF**, borderRadius 24px.

- **Header `#1465:27448`** (column, align center, gap 32)
  - `#1465:27449` (column, align center, gap 20, width 782)
    - `#1465:27450` TEXT eyebrow **"BEFORE AND AFTERS"** — `sd`, **#FC5257**
    - `#1465:27451` TEXT — **"Real moves. Signed."** ("Real moves." in **#FC5257** via ts4) — style_43809ed5 (Jost 48px), base **#04143A**
    - `#1465:27452` TEXT (width 373.44) — **"Every case unretouched, originals on file, signed by the dentist responsible."** — style_29c0caf0 (Silka Reg 16px CENTER), **#04143A**
- **Cards `#1465:27453`** (column, stretch, gap 32)
  - `#1465:27454` (row, stretch, **padding 0 60px**, gap 4) — 4 article cards. Each **"Article"** = column, padding **20px 16px**, gap 32, fill **#F2F6FE**, borderRadius 24px. Card image row = row, gap 4, height **197**; each half is an image fill with borderRadius 12px, and a rounded **"Before"/"After"** chip (row padding 4px 9px, fill **rgba(0,0,0,0.25)**, stroke **rgba(255,255,255,0.25)** 0.8px, r16/50px; label style_78c406a0, **#FFFFFF**). Quote block has left border **#04143A** weight **2.4px** (padding-left 10). Footer row = "Signed by …" (style_3ba2687f, **rgba(4,20,58,0.4)**) + white GDC pill "GDC: 251837" (style_81f01871, **rgba(4,20,58,0.6)**, fill #FFFFFF, r50).

    **Card 1 `#1465:27455` (Lisa A.)**
      - before image `#1465:27458` fill **IMAGE** `imageRef a1bc1d588fddb895c8316a6cd00d0583b6fe6778` (r12); after image `#1465:27462` fill **IMAGE** `imageRef 520cc109b069ace68a88c3bfb7b108f7b9574f86` (r12)
      - `#1465:27468` name **"Lisa A."** — style_d1341a70, **#04143A**
      - `#1465:27471` quote — **""I started eight months before my wedding so I wouldn't spend the photos doing my careful smile. Best line in the whole planning spreadsheet.""** — style_97044151, **#04143A**
      - `#1465:27473` **"Signed by Dr. Amelia Hart"**; `#1465:27475` **"GDC: 251837"**

    **Card 2 `#1465:27476` (Priya R.)**
      - image `#1465:27479` (EL-e3db9ea4) fill **IMAGE** `imageRef 59660204d9ea8a672385c7bc9dc5c7ce7ee047af` (r12); second image container `#1465:27483` (EL-b3955fc1) fills **IMAGE** `imageRef f0ab4e57df9d7c79b5ee2aca97b2dd3066c684f5` + **IMAGE** `imageRef 520cc109b069ace68a88c3bfb7b108f7b9574f86` (r12)
      - `#1465:27489` name **"Priya R."**
      - `#1465:27492` quote — **""I used to talk with my hand near my mouth without noticing. Now I catch myself grinning in meetings. Nobody warned me about that part.""**
      - `#1465:27494` **"Signed by Dr. Amir Hussain"**; `#1465:27496` **"GDC: 251837"**

    **Card 3 `#1465:27497` (Sarah M.)**
      - image `#1465:27500` (EL-e3db9ea4) imageRef `59660204d9ea8a672385c7bc9dc5c7ce7ee047af`; `#1465:27504` (EL-b3955fc1) imageRefs `f0ab4e57…` + `520cc109…`
      - `#1465:27510` name **"Sarah M. "**
      - `#1465:27513` quote — **""Fourteen weeks. The plan on my screen said fourteen weeks, and it was fourteen weeks. I've had sofas take longer to arrive.""**
      - `#1465:27515` **"Signed by Dr. Amelia Hart"**; `#1465:27517` **"GDC: 251837"**

    **Card 4 `#1465:27518` (Tom W.)** — column, padding 20px 16px, gap 32, fill #F2F6FE, r24
      - before `#1465:27521` fill **IMAGE** `imageRef e5fb9715132e1115811b1ef7993326cefc9cbc84` (r12); after `#1465:27525` fill **IMAGE** `imageRef 474522dd457c12cdae0c8d1c3babdcc51ce742ac` (r12)
      - `#1465:27532` name **"Tom W."**
      - `#1465:27535` quote — **""I stopped editing my smile out of photos, then noticed I'd started smiling in them. That's the whole review, really.""**
      - `#1465:27537` **"Signed by Dr. Amir Hussain "**; `#1465:27539` **"GDC: 251837"**
  - **Dots `#1465:27580`** (column, stretch, center, gap 10) → `#1465:27581` (row, gap 8): active dot `#1465:27582` **32×8** fill **#04143A** r100; 5 inactive dots `#1465:27583–27587` 8×8, fill **#F2F6FE**, stroke **#04143A** 1px, r100.

---

### SECTION 7 — Pricing  `#1465:27601` (INSTANCE, componentId 1281:2974)
FRAME, row, alignSelf stretch, **padding 80px 220px**, justify space-between, align center, fill **#FFFFFF**, borderRadius 24px.

- `#…;1281:2908` (column, stretch, gap 40, width **1000**)
  - Header `#…;1314:2921` (column, stretch, center, gap 20)
    - `#…;1324:3727` TEXT eyebrow **"PRICING"** — `sd`, **#FC5257**
    - `#…;1281:2910` TEXT — **"Exactly what Moves costs"** ("Exactly what" in **#FC5257** via ts4) — style_43809ed5 (Jost 48px), **#04143A**
    - `#…;1314:2916` TEXT (width 800) — **"Some brands make you book a call to learn a price. Ours are published. Every package, in full, before you've given us so much as an email address. That's it. That's the section."** — style_29c0caf0, **#04143A**
  - Cards row `#…;1281:2911` (row, stretch, align center, gap 4)
    - **Card A `#…;1281:2932`** — column, **padding 40**, alignItems stretch, gap 24, fill **#FDE3E4** (light pinkish), borderRadius 24px
      - `#…;1281:2937` title **"Clear aligners"** — style_1f6ee531 (Silka Med 32px/LH50), **#04143A**
      - `#…;1281:2939` **"From"** — Silka Reg 400, 12px, LH 1.34em, color **rgba(0,0,0,0.4)**, width 218
      - `#…;1281:2941` price **"£16.30"** — style_c85b33cc (Silka 46px), color **#FC5257**
      - `#…;1281:2942` **"/per month"** — Silka Reg 16px, LH 1.2em, color **rgba(4,20,58,0.7)**
      - `#…;1281:2943` RECT product image — 97×101, fill **IMAGE** `imageRef a326a98079a39f05bb1d5b949414700d485666c0` (needsCropping, suffix **bd8016**)
      - `#…;1281:2944` LINE divider — stroke **rgba(4,20,58,0.1)** 1px
      - feature rows (each row gap 10, width 226.8; check SVG 11.06×8 fill **#004DF6**; text style_3e8c3370 **#04143A**):
        - **"Dual Arch "**, **"4—6 months treatment time"**, **"Crowding on 6-8 teeth"**, **"Bite correction"**
      - `#…;1281:2952` "Fill Button" (layout_c6528a63, fill **#FC5257**, r90) → **"Book Free Consultation"** (#FFFFFF)
    - **Card B `#…;1281:2912`** — column, padding 40, gap 24, fill **#F2F6FE**, borderRadius 24px
      - `#…;1281:2916` title **"Composite Bonding"** — style_1f6ee531, **#04143A**
      - `#…;1281:2918` **"From"**; `#…;1281:2920` price **"£16.30"** — style_c85b33cc, color **#04143A** (note: navy not pink); `#…;1281:2921` **"/per month"**
      - `#…;1281:2922` RECT product image — same imageRef `a326a98079a39f05bb1d5b949414700d485666c0`
      - `#…;1281:2923` LINE divider rgba(4,20,58,0.1)
      - feature rows: **"Dual Arch "**, **"4—6 months treatment time"**, **"Crowding on 6-8 teeth"**, **"Bite correction"**
      - `#…;1281:2931` "Fill Button" fill **#04143A**, r90 → **"Book Free Consultation"** (#FFFFFF)

---

### SECTION 8 — Trustpilot reviews wall  `#1465:27602` "Desktop - 5342"
FRAME, column, **padding 80px 60px**, justify center, align center, **gap 42**, width 1440, fill **#FFFFFF**, r24.
- Inner `#1465:27603` (column, center, gap 40, width 1440, fill none, borderRadius **60px**)
  - Header `#1465:27604` (layout_17ee8d69)
    - `#1465:27605` (column, center, gap 20)
      - `#1465:27606` (row, align center, gap 16.14)
        - `#1465:27607` TEXT — **"Excellent (3,890)"** — style_cd362a30 (Aeonik Bold 16px), color **#000000**
        - `#1465:27608` "Stars" → 5× Star (green **#219653**, Shape SVG 17.22 **#FFFFFF**)
        - `#1465:27614` (row, gap 4.97) → Shape SVG 22.34 **#219653** + `#1465:27616` **"Trustpilot"** (style_3e8c3370, **#000000**)
      - `#1465:27617` TEXT — **"Don't take our word for it"** ("Don't take" in **#FC5257** via ts6) — Jost Medium 500, **48px**, LH 1.1em, LS -0.0417em, TITLE, CENTER, base color **#04143A**
  - Reviews grid `#1465:27618` (row, gap 4, width **1320**) — **3 columns** (`#1465:27619`, `#1465:27624`, `#1465:27629`), each column = column gap 4 with **4 review cards** (12 cards total, nodes `#1465:27620`–`27633`).
    Each **review card** (INSTANCE, componentId 1314:1932): column, stretch, padding **32**, gap 19, fill **#F2F6FE**, borderRadius 24px. Contents:
      - Stars row (5× Star, green **#219653**, Shape SVG 12.6×12.6 **#FFFFFF**) + **"Verified"** (Silka Medium 500, 16px, **underline**, color **#858585**)
      - `EL-7209a2bd` **"Pauline, 5 hours ago"** ("5 hours ago" Regular via ts8) — style_2cb462b6, **#858585**
      - `EL-824d5093` **"Moves is genius"** — Silka **Bold 700**, 16px, color **#000000**
      - `EL-90a5dca4` **"With Capable, I've expanded my network and found genuine connections. The seamless interface makes socializing so much easier."** — style_2cb462b6, **#858585**
    (All 12 cards carry identical copy in this dump.)
- `#1465:27634` "Fill Button" — padding 16px 32px, fill **#FFFFFF**, stroke **#04143A** 1px, r90 → TEXT **"View more"** (Silka Medium 500, 18px, LH 25.33px, LS -0.0556em, TITLE, CENTER, color **#04143A**)

---

### SECTION 9 — Our team  `#1465:27635` (INSTANCE, componentId 1324:12221)
layout_80948dc8 (column, stretch, **padding 80px 60px**, gap 40), fill **#FFFFFF**, r24.
- Header `#…;1324:12222` (row, stretch, justify space-between, align flex-end)
  - `#…;1324:12223` (column, gap 20, width 873)
    - `#…;1324:12224` eyebrow **"OUR TEAM"** — `sd`, **#FC5257**
    - `#…;1324:12225` TEXT — **"The names behind the smiles."** ("The names" in **#FC5257** via ts4) — style_43809ed5 (Jost 48px), **#04143A**
    - `#…;1324:12226` TEXT (width 591) — **"Every MOVES plan is signed by one of these dentists. Every one of them is on the GDC register, check for yourself."** — style_8774234f, **#04143A**
  - `#…;1324:12227` "Fill Button" (width 250, fill **#04143A**, r90) → **"Book Free Consultation"** (#FFFFFF)
- Cards `#…;1324:12228` (row, stretch, gap 4) — **5 team cards** (`#…;1324:12613`, `12600`, `12574`, `12587`, and the template instance). Each card (INSTANCE, componentId 1324:12573): row, padding **24px 20px 0**, justify space-between, **392×180**, fill **#F2F6FE**, borderRadius **16px**. Contents:
  - "Mask group" photo — **196×159**, fill **IMAGE** `imageRef 326ec04513f2ce1847999e75e92dbc38a14fa342` (needsCropping, suffix **2130d1**)
  - right column (padding-bottom 24, justify space-between, align flex-end): a 22×20 SVG icon (no fill) + info block gap 16:
    - **"Dr. Amir Hussain"** — style_d1341a70, **#04143A**
    - **"Moves Verified Dentist"** — style_81f01871, **rgba(4,20,58,0.7)**
    - **"GDC No. 12345"** — style_81f01871, **rgba(4,20,58,0.7)**
  (All 5 cards carry the same placeholder name/photo in this dump.)

---

### SECTION 10 — Proof in motion  `#1465:27636` "Desktop - 5354"
FRAME, column, **padding 80px 60px**, justify center, align center, **gap 40**, width 1440, fill **#FFFFFF**, r24.
- Header `#1465:27637` (column, align center, gap 20)
  - `#1465:27638` eyebrow **"PROOF IN MOTION"** — `sd`, **#FC5257**
  - `#1465:27639` TEXT — **"Real Smiles, real Stories"** ("real Stories" in **#04143A** via ts9) — style_59e7cc35 (Jost Medium 48px, CENTER), base color **#FC5257**
  - `#1465:27640` TEXT (width 666) — **"MOVES isn't a box in the post. Every patient is examined, scanned and fitted in person by a GDC-registered dentist, and every treatment plan carries that dentist's signature. "** — style_29c0caf0, **#04143A**
- Video grid `#1465:27641` (row, stretch, align center, gap 4) — **5 video tiles**. Each tile = column, gap 47, borderRadius 16px, with a portrait image (height **420**, r16) and an absolutely-positioned play-overlay pill `EL-9ecf3a7d` (padding 12px 20px, fill **rgba(255,255,255,0.8)**, backdropFilter **blur(5px)**, r100, at x105 y186) holding a 10×24 play SVG.
  - Tile 1 `#1465:27643` image `#1465:27644` — **IMAGE** `imageRef 117a58ac2fbe578b8880594b80a51788845a844b`
  - Tile 2 `#1465:27650` image `#1465:27651` — **IMAGE** `imageRef 6667935eb389a50ddca8b931335d895dc37b8158`
  - Tile 3 `#1465:27657` image `#1465:27658` (EL-8ce0e122) — **IMAGE** `imageRef 316efaf5c6e4ead56e202bb5c175388c7351ae6a` + **IMAGE** `imageRef 117a58ac2fbe578b8880594b80a51788845a844b`
  - Tile 4 `#1465:27664` image `#1465:27665` — **IMAGE** `imageRef 412b3ac98e26393f0fb7add8e88280c95f659520`
  - Tile 5 `#1465:27671` image `#1465:27672` (EL-8ce0e122) — same imageRefs `316efaf5…` + `117a58ac…`

---

### SECTION 11 — The Movers  `#1465:27678`
FRAME, column, **padding 80px 60px**, gap 16, width 1440, fill **#FFFFFF**, r24.
- `#1465:27679` (column, stretch, gap 40)
  - `#1465:27680` (row, center, gap 228, width 1320) → `#1465:27681` (row, justify space-between, align flex-end, width 1315)
    - `#1465:27682` (column, gap 20, width 780)
      - `#1465:27683` eyebrow **"THE MOVERS"** — `sd`, **#FC5257**
      - `#1465:27684` TEXT (width 488) — **"You don't buy moves. You join it."** ("You don't buy moves." in **#FC5257** via ts4) — style_43809ed5 (Jost 48px), **#04143A**
      - `#1465:27685` TEXT — **"Every patient becomes a Mover on scan day: a code of your own, rewards when a friend makes their move, first look at whatever we do next. The best Movers end up making the brand with us."** — style_8774234f, **#04143A**
    - `#1465:27686` "Fill Button" (width 250, fill **#04143A**, r90) → **"Book Free Consultation"** (#FFFFFF)
  - Tiers `#1465:27687` (row, stretch, align center, gap 2) — **4 cards** (EL-4664cb85: column, padding 24, gap 10, fill **#F2F6FE**, borderRadius 16px). Each has a 51×51 pink (**#FDADB0**) icon chip (r25.5, padding 14) with a 24×24 SVG, then title (style_32c3c917 **#04143A**) + body (style_97044151 **#04143A**):
    - `#1465:27688` icon **"target-01"** — **"Mover"** — **"You make the first move: scan day, your own code, your smile in motion."**
    - `#1465:27698` icon **"megaphone-01"** (23×23) — **"Advocate"** — **"A friend moves on your code. You both get rewarded, every time."**
    - `#1465:27708` icon **"folder-edit"** — **"Creator"** — **"Your story becomes the brand: shoots, features, your move on our channels."**
    - `#1465:27717` icon **"shield-half"** — **"Insider"** — **"First look at everything next. New products, new cities, before anyone."**

---

### SECTION 12 — "Your MOVE" CTA banner  `#1465:27727`
FRAME, column, justify center, alignItems stretch, gap 10, width 1440.
- `#1465:27728` "Container" — column, stretch, **padding 0 24px**, justify center, align center, gap 32, height **519**, fill **IMAGE** `imageRef 5ba866331ea1466527f694cb4713a106ba9c22ab` (STRETCH, needsCropping, suffix **348ec1**), stroke **#DEDEDE** 0.5px, borderRadius **20px**
  - `#1465:27729` (column, center, gap 32, width 560)
    - `#1465:27730` (column, stretch, center, gap 20)
      - `#1465:27731` TEXT — **"Your MOVE"** — Jost Medium 500, **68px**, LH 1.2em, LS -0.0294em, TITLE, CENTER, color **#FFFFFF**
      - `#1465:27732` TEXT (width 346) — **"A free consultation, an honest answer, and a plan with a name on it."** — style_e21a531c, **#FFFFFF**
    - `#1465:27733` "Fill Button" (width 250, fill **#04143A**, r90) → **"Book Free Consultation"** (#FFFFFF)
  - Guarantee badge `#1465:27734` GROUP — absolute at x1067.82 y32, **311.85×305.14**
    - `#1465:27735` STAR — at x2.47 y2.57, 306.92×300, fill **#FC5257**, borderRadius 30px
    - `#1465:27736` (column, gap 2, at x81.27 y74.46, width 153.36)
      - `#1465:27738` **"Money back"** — style_f44ef6e4 (Jost Reg 16px UPPER CENTER), **#FFFFFF**
      - `#1465:27739` **"Guarantee"** — style_f44ef6e4, **#FFFFFF**
      - `#1465:27740` **"30"** — Jost Medium 500, **60px**, LH 1.1em, LS -0.0333em, TITLE, CENTER, **#FFFFFF**
      - `#1465:27741` **"days"** — style_f44ef6e4, **#FFFFFF**

---

### SECTION 13 — FAQs  `#1465:27742` "Desktop - 5359"
FRAME, column, **padding 80px 60px**, justify center, alignItems stretch, gap 40, width 1440, fill **#FFFFFF**, r24.
- `#1465:27743` (column, stretch, align center, gap 42)
  - Header `#1465:27744` (column, center, gap 20)
    - `#1465:27745` eyebrow **"FAQS"** — `sd`, **#FC5257**
    - `#1465:27746` TEXT — **"Frequently asked questions "** ("asked questions " in **#04143A** via ts9) — style_59e7cc35 (Jost 48px CENTER), base **#FC5257**
  - List `#1465:27747` (column, stretch, gap 4, width **800**) — **9 items**. Each "Listitem" (EL-878a9e58): row, stretch, **padding 24px 32px**, justify space-between, fill **#F2F6FE**, borderRadius 16px; question text style_c575a19d (Silka Med 16px) color **#04143A**; trailing 20×20 plus/expand SVG icon (no fill):
    - `#1465:27749` **"What is MOVES?"**
    - `#1465:27757` **"Who signs my treatment plan?"**
    - `#1465:27765` **"How do I know if aligners are right for me?"**
    - `#1465:27773` **"How much does MOVES cost?"**
    - `#1465:27781` **"How long does treatment take?"**
    - `#1465:27789` **"Do I need clinic appointments?"**
    - `#1465:27797` **"Are MOVES aligners painful?"**
    - `#1465:27805` **"What happens while I'm wearing aligners?"**
    - `#1465:27813` **"How do I start?"**

---

### SECTION 14 — Footer with email signup  `#1465:27820` "Desktop - Footer with Email Signup"
FRAME, column, **padding 100px 60px**, gap 10, width 1440, fill **#04143A** (Primary), borderRadius **24px 24px 0 0**.
- `#1465:27821` (column, stretch, gap 100, width **1320**)
  - `#1465:27822` (row, stretch, justify space-between)
    - `#1465:27823` (column, gap 30)
      - `#1465:27824` nav row (row, justify space-between, width 479) — all Silka Reg 400, 16px, LH 1em, UPPER, color **#FFFFFF** (`style_0a689a18`):
        - **"Shop"**, **"About"**, **"Science"**, **"FAQs"**, **"Contact"**
      - `#1465:27830` social row (row, align center, gap 22.07, height 30)
        - `#1465:27831` SVG **"Social Icons"** Instagram (26.68×26.68, componentId 1214:1446, no fill)
        - `#1465:27832` SVG **"Social Icons"** TikTok (26.68×26.68, componentId 1214:1410, no fill)
        - `#1465:27833` SVG **"EnvelopeSimple"** (30×30, no fill)
    - `#1465:27837` (column, align flex-end, gap 20, width 309) — mailing list
      - `#1465:27838` **"join our mailing list"** — Silka Regular 400, 20px, LH 1em, LS -0.02em, TITLE, color **#FFFFFF**
      - `#1465:27839` input pill (row, padding **10px 10px 10px 30px**, justify space-between, align center, width 309, fill **#FFFFFF**, borderRadius 100px)
        - `#1465:27840` **"YOUR EMAIL"** — style_0a689a18, color **#04143A**
        - `#1465:27841` submit button (row, padding 8, center, gap 10, fill **#FC5257**, borderRadius 1000px) → `#1465:27842` SVG **"ArrowDownLeft"** (20×20)
  - `#1465:27846` (column, stretch, gap 14)
    - `#1465:27847` IMAGE-SVG — big footer wordmark/logo, fill-width, height **207** (no fill token — vector)
    - `#1465:27854` TEXT — **"© Copyright 2026 Moves"** — Silka Regular 400, 16px, LH 1em, LS -0.02em, LEFT, color **rgba(255,255,255,0.8)** (`White Color/White Color -80`)

---

## 3. Full color palette

| Hex / value | Token name | Used for |
|---|---|---|
| **#F2F6FE** | fill_ad60ebce | Page background; step/FAQ/testimonial/team card fills; small dot fills |
| **#FFFFFF** | fill_658ab2fa / White Color -100 | Nav bar, section fills, buttons, star-shape SVG, GDC pills, email input |
| **#05143B** | fill_ddc03eee | Announcement bar background; Caveat signature text |
| **#04143A** | Primary - Color/Primary Color / fill_61964729 | Primary text, dark buttons, footer bg, strokes, active dots |
| **#000000** | fill_34dc0314 | Trustpilot "Excellent" text; review "Moves is genius" heading |
| **#FC5257** | pink | Eyebrows, accent words, pink CTA, underline, guarantee star, submit btn, ts2/ts4/ts6 |
| **#FDE3E4** | light pinkish | Hero background; pricing Card A background |
| **#FDADB0** | fill_79b4eebf | Movers icon chips (51×51) |
| **#FD888B** | (inline) | Section 3 blur glow rectangle; also gradient stop rgba(253,136,139,·) |
| **#219653** | fill_0b4c8d4b | Trustpilot star chips (green) |
| **#004DF6** | Secondry Color/Secondry -100 | Pricing feature check icons |
| **#858585** | fill_ebf50d8c | Review card meta/body + "Verified" |
| **#DCDCDC** | Dark Grey | Hero signature-card vertical divider |
| **#DEDEDE** | adssdsa | CTA banner border (0.5px) |
| **rgba(4,20,58,0.8)** | Primary -80 | Problem "underline" line item base |
| **rgba(4,20,58,0.7)** | Primary -70 | "SIGNED · GDC", "/per month", team meta |
| **rgba(4,20,58,0.6)** | Primary -60 / fill_fc711bac | Marquee labels; GDC pill text |
| **rgba(4,20,58,0.4)** | Primary -40 | "Signed by Dr. …" captions |
| **rgba(4,20,58,0.2)** | Primary -20 | Problem list inactive items |
| **rgba(4,20,58,0.1)** | Primary -10 | Pricing divider line |
| **rgba(0,0,0,0.4)** | Black Color -40 | Pricing "From" label |
| **rgba(0,0,0,0.25)** | fill_11d02a25 | Before/After chip fills |
| **rgba(255,255,255,0.25)** | fill_556c5aa7 | Before/After chip strokes |
| **rgba(255,255,255,0.2)** | (inline) | Before-and-after inactive progress bars |
| **rgba(255,255,255,0.4)** | ts5 | Section 3 manifesto de-emphasized runs |
| **rgba(255,255,255,0.8)** | White -80 | Footer copyright; video overlay pill bg |
| **rgba(255,232,232,0.4)** | (inline) | Announcement "Link" bottom stroke |
| (transparent / none) | fill_97d170e1 | Marquee/logo/icon vector containers with no solid fill |

**Gradient:** Section 3 background — `linear-gradient(180deg, rgba(253,136,139,0) 0%, rgba(253,136,139,1) 100%)` layered over its image.

---

## 4. Image & icon inventory (download list)

### Raster photos (imageRef fills — MUST download)
| # | imageRef | Where used (nodeId) | Dimensions | Crop suffix |
|---|---|---|---|---|
| 1 | `9fda3e717c342c2aa9bf7853180554c75c923acf` | Hero right panel `#1465:27294` | 733×800 | 5747ca (crop) |
| 2 | `0c24609beafdea0fe23062fa77b5ce88d2261064` | Problem section image `#…;1213:1616` | 608×607 | — (FILL) |
| 3 | `2260aca52362ddff6466097c9ea4b257650540e4` | Section 3 bg image `#1465:27321` | 1440×1165 | 60cb9e (crop) |
| 4 | `627e0ef7638c192493d8ae39c7d1e1d59229c24f` | "image 2795" `#1465:27323` | 626.92×537.15 | 2d4610 (crop) |
| 5 | `94a8d82c413806e6ef5a2d0d639dfda3550f31ca` | Step 01 img A `#1465:27428` | 229.26×218 | 5eeba6 (crop) |
| 6 | `d0c021a51840b143db23abc20a0da74eb6b82f00` | Step 01 img B `#1465:27429` | 70.3×151.57 | 26f648 (crop) |
| 7 | `3296cda43c4eecb70cd9fa6c2c3be9bbabd431e1` | Step 02 img `#1465:27437` | 229.26×218 | — (FILL) |
| 8 | `985e8e07415ae448346ae06f6e7b54f8bd3f1ba5` | Step 03 img `#1465:27445` | 249.41×218 | 4bb8f7 (crop) |
| 9 | `a1bc1d588fddb895c8316a6cd00d0583b6fe6778` | B&A Card 1 before `#1465:27458` | ~half of 197h row | — |
| 10 | `520cc109b069ace68a88c3bfb7b108f7b9574f86` | B&A after (Cards 1 & 2) `#1465:27462`, `#1465:27484` | — | — |
| 11 | `59660204d9ea8a672385c7bc9dc5c7ce7ee047af` | B&A Card 2/3 image `#1465:27479`, `#1465:27500` | — | — |
| 12 | `f0ab4e57df9d7c79b5ee2aca97b2dd3066c684f5` | B&A Card 2/3 image `#1465:27483`, `#1465:27504` | — | — |
| 13 | `e5fb9715132e1115811b1ef7993326cefc9cbc84` | B&A Card 4 before `#1465:27521` | — | — |
| 14 | `474522dd457c12cdae0c8d1c3babdcc51ce742ac` | B&A Card 4 after `#1465:27525` | — | — |
| 15 | `a326a98079a39f05bb1d5b949414700d485666c0` | Pricing product img `#…;1281:2943`, `#…;1281:2922` | 97×101 | bd8016 (crop) |
| 16 | `326ec04513f2ce1847999e75e92dbc38a14fa342` | Team card photo (all 5) `#…;1324:12562` | 196×159 | 2130d1 (crop) |
| 17 | `316efaf5c6e4ead56e202bb5c175388c7351ae6a` | Proof-in-motion tiles 3 & 5 `#1465:27658/27672` | 420h | — (FILL) |
| 18 | `117a58ac2fbe578b8880594b80a51788845a844b` | Proof tiles 1,3,5 `#1465:27644/27658/27672` | 420h | — |
| 19 | `6667935eb389a50ddca8b931335d895dc37b8158` | Proof tile 2 `#1465:27651` | 420h | — |
| 20 | `412b3ac98e26393f0fb7add8e88280c95f659520` | Proof tile 4 `#1465:27665` | 420h | — |
| 21 | `5ba866331ea1466527f694cb4713a106ba9c22ab` | CTA banner bg `#1465:27728` | 519h | 348ec1 (crop) |

### Vector / SVG icons (render as SVG, no raster imageRef)
| nodeId | Name | Dimensions | Fill |
|---|---|---|---|
| `#1465:27237` | Moves-Primary-Logo 2 (nav) | 163×20 | vector |
| Star "Shape" (many) | rating stars (hero, reviews) | 17.22 / 12.6 / 22.34 | #FFFFFF on #219653 chip |
| `EL-009b1c1d` (marquee) | separator icons | 11.34×10.32 | none |
| `EL-4ab152cc` "Vector" | pricing feature checks | 11.06×8 | #004DF6 |
| `EL-cd8cabc4` | video play glyph | 10×24 | vector |
| `#1465:27691` "target-01" | Movers: Mover | 24×24 | vector |
| `#1465:27701` "megaphone-01" | Movers: Advocate | 23×23 | vector |
| `#1465:27711` "folder-edit" | Movers: Creator | 24×24 | vector |
| `#1465:27720` "shield-half" | Movers: Insider | 24×24 | vector |
| `EL-eade9af0` (FAQ) "Layer_2" | FAQ expand/plus | 20×20 | none |
| team card icon `EL-4917ac8d` | verified glyph | 22×20 | none |
| `#1465:27831` "Social Icons" | Instagram | 26.68×26.68 | none (componentId 1214:1446) |
| `#1465:27832` "Social Icons" | TikTok | 26.68×26.68 | none (componentId 1214:1410) |
| `#1465:27833` "EnvelopeSimple" | email icon | 30×30 | none |
| `#1465:27842` "ArrowDownLeft" | email submit arrow | 20×20 | vector |
| `#1465:27847` | big footer wordmark/logo | fill-width × 207 | vector |
| proof overlay `#1465:27646` etc. | "…_Vector (12).svg" play | 10×24 | vector |

---

## 5. Border radius / strokes / shadows summary

**Corner radius:** root sections 24px; nav 16px 16px 0 0; hero 16px; hero signature card 8px; footer 24px 24px 0 0; buttons (Fill Button) 90px; testimonial/step/pricing cards 24px; team/FAQ/movers cards 16px; B&A image halves 12px; Before/After chips 16px (inner pill 50px); GDC pill 50px; dots/star-outline 100px; icon chip 25.5px; email pill 100px; submit btn 1000px; CTA banner 20px; guarantee star 30px; Section-3 glow 9999px; progress bars 3px.

**Strokes:**
- Nav "Book A Consultation" button: **#04143A**, 1px
- Announcement "Link" underline: **rgba(255,232,232,0.4)**, bottom 0.8px
- Hero "See exactly what it costs" underline LINE: **#FC5257**, 1px
- Hero signature vertical divider LINE: **#DCDCDC**, 1px
- Before/After chips: stroke **rgba(255,255,255,0.25)**, 0.8px
- B&A quote left border (EL-d2fa5c6e): **#04143A**, **2.4px** (left only)
- Pricing divider LINE (EL-123570d0): **rgba(4,20,58,0.1)**, 1px, align CENTER
- Inactive B&A dots + `EL-1a987b3b`: **#04143A**, 1px
- "View more" button: **#04143A**, 1px
- CTA banner container: **#DEDEDE**, 0.5px

**Effects / shadows:**
- Section 3 glow rect `#1465:27324`: filter **blur(32px)**, fill #FD888B
- Proof-in-motion overlay pill `EL-9ecf3a7d`: **backdropFilter blur(5px)**, fill rgba(255,255,255,0.8)
- (No drop-shadow effects present in this dump.)

---

## 6. Components referenced
- `3:85` Star (set "Star" 3:84) · `638:8752` Fill Button · `275:6973` "Frame 8891" (pricing feature row) · `1314:1932` testimonial card · `1324:12573` team card · `1213:1630` Section (Default) · `1281:2974` Pricing (Component 278 / V1) · `1324:12221` Team (Component 277 / Variant4) · `1214:1446` Social Icons Instagram · `1214:1410` Social Icons TikTok.

---

*End of spec. 14 top-level sections documented.*

