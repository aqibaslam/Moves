/**
 * Dashboard data access. Reads through Payload's local API, which talks
 * straight to the database in-process — no HTTP hop, no REST layer.
 *
 * `overrideAccess: false` plus `user` makes Payload apply the same access
 * control the REST API would. Passing the user but leaving overrideAccess at
 * its default (true) would silently bypass every rule in the collections.
 */
import 'server-only';
import config from '@payload-config';
import { getPayload } from 'payload';
import type { Consultation, Order, Product } from '@/payload-types';
import { getPayloadUser } from './auth';

async function client() {
  return getPayload({ config });
}

/** Pence → "£2,400". Values are integers in the DB; format only at the edge. */
export const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

export function formatPence(pence: number): string {
  return gbp.format(pence / 100);
}

export async function listProducts(): Promise<Product[]> {
  const payload = await client();
  const user = await getPayloadUser();
  const res = await payload.find({
    collection: 'products',
    limit: 200,
    sort: 'sortOrder',
    user,
    overrideAccess: false,
  });
  return res.docs;
}

export async function listOrders(): Promise<Order[]> {
  const payload = await client();
  const user = await getPayloadUser();
  const res = await payload.find({
    collection: 'orders',
    limit: 200,
    sort: '-createdAt',
    depth: 1, // resolve the product relationship
    user,
    overrideAccess: false,
  });
  return res.docs;
}

export async function listConsultations(): Promise<Consultation[]> {
  const payload = await client();
  const user = await getPayloadUser();
  const res = await payload.find({
    collection: 'consultations',
    limit: 200,
    sort: '-scheduledFor',
    user,
    overrideAccess: false,
  });
  return res.docs;
}

export const ORDER_STATUS_LABEL: Record<NonNullable<Order['status']>, string> = {
  placed: 'Placed',
  in_production: 'In production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const CONSULTATION_STATUS_LABEL: Record<NonNullable<Consultation['status']>, string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  no_show: 'No show',
  cancelled: 'Cancelled',
};
