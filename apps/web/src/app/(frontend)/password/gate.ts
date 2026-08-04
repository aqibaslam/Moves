/** Shared constants/types for the launch gate. Kept in a plain module because a
 *  'use server' file (actions.ts) may only export async functions. */

/** Cookie the proxy checks to let a visitor through. Kept in sync with proxy.ts. */
export const GATE_COOKIE = 'moves_gate';
export const GATE_TOKEN = 'unlocked';

export type UnlockState = { error?: string };
