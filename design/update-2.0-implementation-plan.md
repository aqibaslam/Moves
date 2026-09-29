# MOVES Update 2.0 — implementation plan

## Source of truth

Visual and interaction fidelity comes from these approved prototypes:

- `Update 2.0/design_handoff_moves_lander/source/landers/clear-aligners/index.html`
- `Update 2.0/design_handoff_moves_lander/source/landers/clear-aligners/book.html`

The README and NOTES explain intent and integration requirements. Where their older section list differs from the current HTML, the current HTML wins. Application data, validation, availability and booking submission continue to come from the existing Next.js implementation.

## Paid lander structure

1. Sticky campaign header
2. Hero — promise, proof facts, consultation action and signed-dentist cue
3. First Movers — concern selector and recommended Move
4. How it works — six-stage treatment model
5. Aftercare comparison
6. Published prices — ONE, CORE and COMPLETE
7. Why MOVES — campaign photography and principles
8. FAQ
9. Final consultation action
10. Footer and mobile booking dock

## Booking structure

1. Availability — next three open days and grouped times
2. Details — held time, contact details, age, referral and note
3. Confirmation — MOVES pass, calendar/wallet actions and optional smile photos

The current application already owns availability, GHL submission, consultation persistence and SMS. The client flow will be reordered around those services instead of importing the prototype's generated slots.

## Shared system

- Ink `#091620`, Milk `#FFFFFF`, Stone `#EDEAE6`, Pulse `#ED3B44`
- Glacial Indifference for display type and Public Sans for copy/UI
- 1320px content frame with the approved fluid side gutter
- Sharp 56px primary buttons, 11px tracked labels and 1px hairlines
- Approved section reveal, booking transition and pass motion with reduced-motion fallbacks
- Approved photography only; no repeated image within the lander

## Delivery sequence

### Phase 1 — lander foundation

- Namespace and install the supplied fonts, logos and imagery.
- Reproduce the approved header and hero exactly.
- Verify at 1440, 1024, 390 and 360 before continuing.

### Phase 2 — lander body

- Build First Movers and preserve `mv-fx` through local storage and the booking URL.
- Build How it works, Aftercare, Prices and Why MOVES.
- Build FAQ, final action, footer and mobile dock.
- Verify section heights, snap rails, sticky behaviour and both results variants.

### Phase 3 — booking shell and steps

- Replace the current card UI with the approved Stone split layout.
- Reorder the state machine to availability → details → confirmed.
- Preserve real availability and submission server actions.
- Add session restore, concern context, slot-taken recovery and the approved validation language.

### Phase 4 — confirmation utilities

- Build the pass, countdown, flip interaction and calendar download.
- Keep Wallet and photo actions visibly unavailable until their server integrations are real; never report a successful external action from a prototype handler.
- Add secure photo storage only with explicit consent, retention and access rules.

### Phase 5 — release QA

- Side-by-side visual checks at 1440, 1024, 390 and 360.
- Keyboard, focus, screen-reader and reduced-motion checks.
- `pnpm typecheck` and `pnpm build`.
- Verify the password-gated paid route and the public signup route independently.

## Integration status at start

| Capability | Current state | Update 2.0 action |
| --- | --- | --- |
| Availability | Wired to GHL with deterministic local fallback | Reuse; filter and present as approved |
| Booking submission | Wired to GHL and mirrored into Consultations | Reuse; add concern and note fields |
| SMS | Best-effort confirmation is present | Reuse and verify copy |
| Email/Meet link | Provider-dependent | Verify live calendar behaviour |
| Wallet passes | Not implemented | Blocked until signed Apple/Google pass services exist |
| Calendar | Prototype-only | Implement Google URL and ICS from confirmed booking |
| Smile photos | Not implemented | Blocked pending secure health-data storage and consent |
| Analytics | Not implemented | Add named funnel events when analytics provider is confirmed |

## Implemented locally

- The paid lander now uses the approved Update 2.0 source and passes the selected concern into `/book`.
- `/book` now matches the approved availability → details → confirmation sequence and responsive layout.
- Availability, validation, GHL booking, consultation persistence and SMS remain connected through server routes.
- The provider rules now enforce three open days, Monday–Saturday, 45-minute calls, 09:00–20:00 and 90 minutes’ notice.
- Google Calendar and ICS use the confirmed appointment; slot conflicts return the visitor to refreshed availability.
- Wallet buttons and smile-photo preparation remain visibly honest until signed pass services and secure health-data storage are configured.
