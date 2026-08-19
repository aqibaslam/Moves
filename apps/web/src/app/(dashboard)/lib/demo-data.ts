/**
 * PLACEHOLDER DATA — not a data source.
 *
 * The repo has no `orders` or `consultations` table yet: bookings post straight
 * to GoHighLevel (see lib/booking/ghl.ts) and the only migration is
 * 20260727000000_init_profiles.sql. This module exists so the dashboard layout
 * is reviewable before that schema lands.
 *
 * The types below are deliberately the shape those tables should have, so
 * replacing this file with real Supabase queries is a one-file change.
 *
 * Values are fixed literals, never generated — random or now()-based data
 * would differ between server and client render and trip hydration errors.
 */

export type OrderStatus = 'placed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  reference: string;
  patientName: string;
  plan: string;
  /** Whole pounds. Money is never a float — store integer pence in Postgres. */
  amountGbp: number;
  status: OrderStatus;
  placedOn: string;
  dentist: string;
};

export type ConsultationStatus = 'upcoming' | 'completed' | 'no_show' | 'cancelled';

export type Consultation = {
  id: string;
  patientName: string;
  email: string;
  scheduledFor: string;
  clinic: string;
  dentist: string;
  status: ConsultationStatus;
  source: string;
};

export const ORDERS: readonly Order[] = [
  { id: '1', reference: 'MV-2841', patientName: 'Amelia Hart',    plan: 'Moves Full',    amountGbp: 2400, status: 'in_production', placedOn: '2026-08-14', dentist: 'Dr. Priya Nair' },
  { id: '2', reference: 'MV-2840', patientName: 'James Okonkwo',  plan: 'Moves Lite',    amountGbp: 1650, status: 'shipped',       placedOn: '2026-08-13', dentist: 'Dr. Sam Whitfield' },
  { id: '3', reference: 'MV-2839', patientName: 'Sofia Marchetti', plan: 'Moves Full',   amountGbp: 2400, status: 'delivered',     placedOn: '2026-08-11', dentist: 'Dr. Priya Nair' },
  { id: '4', reference: 'MV-2838', patientName: 'Daniel Osei',    plan: 'Moves Refine',  amountGbp: 890,  status: 'placed',        placedOn: '2026-08-11', dentist: 'Dr. Leila Mansour' },
  { id: '5', reference: 'MV-2837', patientName: 'Grace Bennett',  plan: 'Moves Lite',    amountGbp: 1650, status: 'delivered',     placedOn: '2026-08-09', dentist: 'Dr. Sam Whitfield' },
  { id: '6', reference: 'MV-2836', patientName: 'Tomas Nowak',    plan: 'Moves Full',    amountGbp: 2400, status: 'cancelled',     placedOn: '2026-08-08', dentist: 'Dr. Leila Mansour' },
  { id: '7', reference: 'MV-2835', patientName: 'Aisha Rahman',   plan: 'Moves Refine',  amountGbp: 890,  status: 'delivered',     placedOn: '2026-08-06', dentist: 'Dr. Priya Nair' },
  { id: '8', reference: 'MV-2834', patientName: 'Oliver Grant',   plan: 'Moves Full',    amountGbp: 2400, status: 'in_production', placedOn: '2026-08-05', dentist: 'Dr. Sam Whitfield' },
];

export const CONSULTATIONS: readonly Consultation[] = [
  { id: '1', patientName: 'Nadia Ellis',     email: 'nadia.ellis@example.com',   scheduledFor: '2026-08-20T09:30', clinic: 'London — Shoreditch', dentist: 'Dr. Priya Nair',     status: 'upcoming',  source: 'Website' },
  { id: '2', patientName: 'Marcus Webb',     email: 'm.webb@example.com',        scheduledFor: '2026-08-20T11:00', clinic: 'London — Shoreditch', dentist: 'Dr. Sam Whitfield',  status: 'upcoming',  source: 'Instagram' },
  { id: '3', patientName: 'Chloe Fairbanks', email: 'chloe.f@example.com',       scheduledFor: '2026-08-20T14:15', clinic: 'Manchester — Deansgate', dentist: 'Dr. Leila Mansour', status: 'upcoming', source: 'Referral' },
  { id: '4', patientName: 'Idris Karim',     email: 'idris.karim@example.com',   scheduledFor: '2026-08-19T10:00', clinic: 'London — Shoreditch', dentist: 'Dr. Priya Nair',     status: 'completed', source: 'Website' },
  { id: '5', patientName: 'Hannah Blake',    email: 'hannah.blake@example.com',  scheduledFor: '2026-08-19T13:30', clinic: 'Manchester — Deansgate', dentist: 'Dr. Sam Whitfield', status: 'completed', source: 'Google' },
  { id: '6', patientName: 'Peter Lindqvist', email: 'p.lindqvist@example.com',   scheduledFor: '2026-08-18T16:00', clinic: 'London — Shoreditch', dentist: 'Dr. Leila Mansour',  status: 'no_show',   source: 'Website' },
  { id: '7', patientName: 'Yasmin Cole',     email: 'yasmin.cole@example.com',   scheduledFor: '2026-08-18T09:00', clinic: 'Manchester — Deansgate', dentist: 'Dr. Priya Nair',   status: 'completed', source: 'Instagram' },
];

/** Bookings per weekday, for the analytics bar chart. */
export const BOOKINGS_BY_DAY: readonly { day: string; count: number }[] = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 18 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 27 },
  { day: 'Sat', count: 19 },
  { day: 'Sun', count: 8 },
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Placed',
  in_production: 'In production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const CONSULTATION_STATUS_LABEL: Record<ConsultationStatus, string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  no_show: 'No show',
  cancelled: 'Cancelled',
};

export const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});
