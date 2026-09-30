import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
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
  const asset = (name: string) =>
    fs.readFile(path.join(process.cwd(), 'src', 'lib', 'wallet', 'assets', name));
  const [icon, icon2x, logo, logo2x] = await Promise.all([
    asset('icon.png'),
    asset('icon@2x.png'),
    asset('logo.png'),
    asset('logo@2x.png'),
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
