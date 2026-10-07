# MOVES Meta + GHL conversion architecture

Audit date: 7 October 2026

## Current launch verdict

**Tracking implementation is in progress; Meta campaign publishing is currently blocked by billing.** Meta reports that ad account `1724420638840884` has a balance that must be paid before ads can publish. The live dataset currently shows browser `PageView` and `ViewContent`, but no server activity and no custom conversions. Do not start spend until the controlled tests below are green.

## Measurement strategy

The campaign should start by optimizing for the standard Meta `Schedule` event because it is the earliest high-intent event with enough likely volume. Meta should still receive the deeper outcomes from GHL from day one so the account builds a clean quality history and can later optimize closer to revenue.

| Journey stage | Meta event | Source | Campaign use | GHL source of truth |
| --- | --- | --- | --- | --- |
| Paid lander viewed | `ViewContent` | Browser | Diagnostic | UTM and landing variant |
| Booking completed | `Schedule` | Browser + server, deduplicated | Initial primary optimization | Confirmed appointment |
| Consultation attended | `ConsultationAttended` | Server only | Custom conversion and quality signal | Attended pipeline stage/status |
| Clinically/commercially suitable | `QualifiedLead` | Server only | Custom conversion and later optimization candidate | Suitable stage/outcome |
| Treatment purchased | `Purchase` | Server only | Revenue reporting and mature optimization | Won/treatment-start state plus actual GBP value |

Cancelled, rescheduled, no-show and not-suitable states remain visible in GHL but are not sent as positive Meta conversions.

## Attribution contract

The first paid visit must persist these values through landing page, booking and contact creation:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- `fbclid`, Meta `_fbc`, Meta `_fbp`
- original paid landing URL and landing variant
- GHL contact id, appointment id and opportunity id

GHL is the operational source of truth. The browser never has access to CRM or Meta server credentials. Server events use hashed email, phone, first name, surname, country and GHL contact id, plus `_fbc`/`_fbp` where available. The original source URL may contain campaign attribution but must not contain health answers.

## Consent and data minimisation

Browser Meta tracking and the server event path use the same recorded marketing-consent decision. A contact must have the `meta-consented` tag before any downstream CRM event can be sent. The CAPI payload must never contain age, smile concern, dental answers, treatment notes or other clinical information.

## Deduplication and retry safety

- Browser and server `Schedule` use the same GHL appointment id as `event_id`.
- `ConsultationAttended` uses `moves:ConsultationAttended:{appointmentId}`.
- `QualifiedLead` uses `moves:QualifiedLead:{opportunityId}` where possible.
- `Purchase` uses `moves:Purchase:{opportunityId}` and also sends that identifier as `order_id`.
- Repeated GHL workflow delivery therefore retains a stable event id instead of producing a new conversion.

## GHL workflow wiring

1. **Booking confirmed:** the website already sends the deduplicated `Schedule`; GHL must not send a second independent booking conversion.
2. **Appointment marked attended:** call the restricted MOVES lifecycle endpoint with `ConsultationAttended`, contact id, appointment id and event time.
3. **Opportunity enters Suitable:** call the endpoint with `QualifiedLead`, contact id and opportunity id.
4. **Opportunity becomes a paid treatment:** call the endpoint with `Purchase`, contact id, opportunity id, actual collected/contracted GBP value and event time.
5. **Cancelled, rescheduled, no-show or not suitable:** update CRM reporting and stop inappropriate reminders; do not emit a positive Meta conversion.

Every lifecycle webhook must use the shared authentication secret and retry on a non-2xx response. The endpoint returns an accepted event count and Meta trace id without logging customer data.

## Meta configuration

Create two custom conversions on dataset `1777643969948852`:

- **MOVES — Attended consultation** where event name equals `ConsultationAttended`.
- **MOVES — Qualified consultation** where event name equals `QualifiedLead`.

Use the standard `Purchase` event for revenue. Keep `Schedule` as the initial campaign optimization event until attended or qualified volume is statistically sufficient. Do not create URL/button rules for events already implemented in code; that would double-count the same action.

## GHL reporting views

The launch dashboard must show leads, booked calls, attended calls, suitable leads, treatment starts, revenue, booking-to-attended rate and attended-to-sale rate by:

- campaign
- ad set and creative (`utm_content`)
- landing variant
- appointment date and booking date

Native GHL source attribution is not authoritative for API-created contacts. Reporting should use the verified custom attribution fields, appointment status, pipeline stage and opportunity value.

## Launch verification gates

1. Clear the Meta ad-account balance and confirm the account can publish.
2. Deploy the restricted lifecycle endpoint and production environment variables.
3. Create GHL `_fbc`, `_fbp` and original-source-URL fields and retain them on booking.
4. Wire and publish the three outcome webhooks in GHL.
5. Submit one consented test booking and confirm one deduplicated `Schedule` across browser and server.
6. Move that test record through Attended, Suitable and Paid; confirm each event appears once in Meta Test Events with the expected stable id.
7. Confirm the two custom conversions fire and `Purchase` carries the correct GBP value.
8. Confirm a non-consented contact is skipped and a cancelled/no-show contact sends no positive conversion.
9. Remove the Meta test-event code, repeat once in production diagnostics, and retain the event receipts.
10. Launch only after the GHL dashboard agrees with the controlled journey end to end.

## Implemented in the application

- A shared CAPI sender now supports the deduplicated `Schedule` and downstream lifecycle events.
- A restricted GHL webhook endpoint accepts only `ConsultationAttended`, `QualifiedLead` and `Purchase`.
- The endpoint verifies the shared secret, fetches the contact server-side, enforces recorded Meta consent, hashes match data and omits clinical fields.
- Optional GHL fields preserve `_fbc`, `_fbp` and the original source URL for later lifecycle matching.
- A temporary Meta Test Events code can be enabled for controlled verification and removed after validation.
