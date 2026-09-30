import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PKPass } from 'passkit-generator';

import { appleWalletConfigured, decodeBase64Env } from './config';
import type { WalletPayload } from './token';

const PASS_BACKGROUND = 'rgb(5, 25, 34)';
const PASS_FOREGROUND = 'rgb(247, 244, 239)';
const PASS_LABEL = 'rgb(183, 193, 198)';

function serialNumber(appointmentId: string): string {
  return appointmentId.replace(/[^A-Za-z0-9]/g, '').slice(-32) || 'moves-consultation';
}

async function passImages(): Promise<Record<string, Buffer>> {
  const iconSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
      <rect width="180" height="180" rx="38" fill="#051922"/>
      <path d="M36 124V56h16l22 43 22-43h16v68H96V85l-17 33H69L52 85v39H36Z" fill="#F7F4EF"/>
      <circle cx="137" cy="58" r="8" fill="#F43D49"/>
    </svg>`);
  const officialWordmark = await fs.readFile(
    path.join(process.cwd(), 'public', 'images', 'f26-foot-logo.png'),
  );

  const [icon, icon2x, logo, logo2x] = await Promise.all([
    sharp(iconSvg).resize(29, 29).png().toBuffer(),
    sharp(iconSvg).resize(58, 58).png().toBuffer(),
    sharp(officialWordmark).resize(160, 50, { fit: 'contain' }).png().toBuffer(),
    sharp(officialWordmark).resize(320, 100, { fit: 'contain' }).png().toBuffer(),
  ]);
  return { 'icon.png': icon, 'icon@2x.png': icon2x, 'logo.png': logo, 'logo@2x.png': logo2x };
}

export async function buildApplePass(payload: WalletPayload): Promise<Buffer> {
  if (!appleWalletConfigured()) throw new Error('Apple Wallet is not configured');

  const start = new Date(payload.startISO);
  const end = new Date(start.getTime() + 45 * 60_000);
  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const passTypeIdentifier = process.env.APPLE_PASS_TYPE_ID as string;
  const teamIdentifier = process.env.APPLE_TEAM_ID as string;

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier,
    serialNumber: serialNumber(payload.appointmentId),
    teamIdentifier,
    organizationName: 'MOVES',
    description: 'MOVES consultation',
    logoText: 'MOVES',
    foregroundColor: PASS_FOREGROUND,
    backgroundColor: PASS_BACKGROUND,
    labelColor: PASS_LABEL,
    relevantDate: start.toISOString(),
    expirationDate: end.toISOString(),
    sharingProhibited: true,
    eventTicket: {
      primaryFields: [{ key: 'time', label: 'YOUR CONSULTATION', value: start.toISOString(), dateStyle: 'PKDateStyleNone', timeStyle: 'PKDateStyleShort' }],
      secondaryFields: [
        { key: 'date', label: 'DATE', value: start.toISOString(), dateStyle: 'PKDateStyleMedium', timeStyle: 'PKDateStyleNone' },
        { key: 'duration', label: 'DURATION', value: '45 minutes' },
      ],
      auxiliaryFields: [{ key: 'mover', label: 'MOVER', value: fullName }],
      backFields: [
        { key: 'appointment', label: 'Booking reference', value: payload.appointmentId },
        { key: 'format', label: 'Where', value: 'Google Meet — your joining link is in your confirmation email.' },
        { key: 'support', label: 'MOVES', value: 'Need another time? Use the reschedule link in your confirmation email.' },
      ],
    },
  };

  const pass = new PKPass(
    { ...(await passImages()), 'pass.json': Buffer.from(JSON.stringify(passJson)) },
    {
      wwdr: decodeBase64Env('APPLE_WWDR_CERT_BASE64'),
      signerCert: decodeBase64Env('APPLE_PASS_CERT_BASE64'),
      signerKey: decodeBase64Env('APPLE_PASS_PRIVATE_KEY_BASE64'),
      signerKeyPassphrase: process.env.APPLE_PASS_PRIVATE_KEY_PASSWORD,
    },
  );
  return pass.getAsBuffer();
}
