import 'server-only';

import { createHash } from 'node:crypto';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { z } from 'zod';

const walletPayloadSchema = z.object({
  appointmentId: z.string().min(1).max(200),
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  startISO: z.string().datetime({ offset: true }),
  meetingUrl: z.string().url().nullable(),
});

export type WalletPayload = z.infer<typeof walletPayloadSchema>;

function encryptionKey(): Uint8Array {
  const source = process.env.WALLET_LINK_SECRET || process.env.PAYLOAD_SECRET;
  if (!source) throw new Error('WALLET_LINK_SECRET is not configured');
  return createHash('sha256').update(source).digest();
}

export async function createWalletToken(payload: WalletPayload): Promise<string> {
  const valid = walletPayloadSchema.parse(payload);
  return new EncryptJWT(valid)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .encrypt(encryptionKey());
}

export async function readWalletToken(token: string): Promise<WalletPayload> {
  const { payload } = await jwtDecrypt(token, encryptionKey());
  return walletPayloadSchema.parse(payload);
}

export function walletTokenConfigured(): boolean {
  return Boolean(process.env.WALLET_LINK_SECRET || process.env.PAYLOAD_SECRET);
}
