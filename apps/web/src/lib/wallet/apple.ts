import 'server-only';

import { createHmac } from 'node:crypto';
import { PKPass } from 'passkit-generator';

import { ICON, ICON_2X, LOGO, LOGO_2X, STRIP, STRIP_2X, STRIP_3X } from './assets';
import { appleWalletConfigured, decodeBase64Env } from './config';
import { walletSerialNumber, type WalletPayload } from './token';

const PASS_BACKGROUND = 'rgb(5, 25, 34)';
const PASS_FOREGROUND = 'rgb(247, 244, 239)';
const PASS_LABEL = 'rgb(183, 193, 198)';

export function applePassAuthenticationToken(serial: string): string {
  const secret = process.env.WALLET_LINK_SECRET || process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error('WALLET_LINK_SECRET is not configured');
  return createHmac('sha256', secret).update(`passkit:${serial}`).digest('base64url').slice(0, 40);
}

async function passImages(): Promise<Record<string, Buffer>> {
  return {
    'icon.png': Buffer.from(ICON, 'base64'),
    'icon@2x.png': Buffer.from(ICON_2X, 'base64'),
    'logo.png': Buffer.from(LOGO, 'base64'),
    'logo@2x.png': Buffer.from(LOGO_2X, 'base64'),
    'strip.png': Buffer.from(STRIP, 'base64'),
    'strip@2x.png': Buffer.from(STRIP_2X, 'base64'),
    'strip@3x.png': Buffer.from(STRIP_3X, 'base64'),
  };
}

export async function buildApplePass(
  payload: WalletPayload,
  options: { origin?: string; now?: number; status?: string } = {},
): Promise<Buffer> {
  if (!appleWalletConfigured()) throw new Error('Apple Wallet is not configured');

  const start = new Date(payload.startISO);
  const end = new Date(start.getTime() + 45 * 60_000);
  const reminderStart = new Date(start.getTime() - 60 * 60_000);
  const reminderEnd = new Date(start.getTime() + 15 * 60_000);
  const expires = new Date(end.getTime() + 2 * 60 * 60_000);
  const now = options.now ?? Date.now();
  const cancelled = ['cancelled', 'canceled', 'invalid'].includes(options.status?.toLowerCase() ?? '');
  const reminderActive = now >= reminderStart.getTime();
  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const passTypeIdentifier = process.env.APPLE_PASS_TYPE_ID as string;
  const teamIdentifier = process.env.APPLE_TEAM_ID as string;
  const serial = walletSerialNumber(payload.appointmentId);
  const origin = (options.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://movesuk.com').replace(/\/$/, '');

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier,
    serialNumber: serial,
    teamIdentifier,
    organizationName: 'MOVES',
    description: 'MOVES consultation',
    foregroundColor: PASS_FOREGROUND,
    backgroundColor: PASS_BACKGROUND,
    labelColor: PASS_LABEL,
    ...(cancelled ? {} : { relevantDate: reminderStart.toISOString() }),
    ...(cancelled
      ? {}
      : { relevantDates: [{ startDate: reminderStart.toISOString(), endDate: reminderEnd.toISOString() }] }),
    expirationDate: (cancelled ? new Date(now) : expires).toISOString(),
    ...(cancelled ? { voided: true } : {}),
    semantics: {
      eventType: 'PKEventTypeGeneric',
      eventName: 'MOVES clear aligner consultation',
      eventStartDate: start.toISOString(),
      eventEndDate: end.toISOString(),
      duration: 45 * 60,
    },
    sharingProhibited: true,
    webServiceURL: `${origin}/api/wallet/apple/ws`,
    authenticationToken: applePassAuthenticationToken(serial),
    eventTicket: {
      primaryFields: [{ key: 'time', label: 'YOUR CONSULTATION', value: start.toISOString(), dateStyle: 'PKDateStyleNone', timeStyle: 'PKDateStyleShort' }],
      secondaryFields: [
        { key: 'date', label: 'DATE', value: start.toISOString(), dateStyle: 'PKDateStyleMedium', timeStyle: 'PKDateStyleNone' },
        { key: 'duration', label: 'DURATION', value: '45 minutes' },
      ],
      auxiliaryFields: [{ key: 'mover', label: 'MOVER', value: fullName }],
      backFields: [
        {
          key: 'reminderStatus',
          label: cancelled ? 'STATUS' : 'CONSULTATION',
          value: cancelled ? 'Cancelled' : reminderActive ? 'Starts in one hour' : 'Confirmed',
          changeMessage: cancelled
            ? 'Your MOVES consultation has been cancelled.'
            : 'Your MOVES consultation starts in one hour at %@.',
        },
        { key: 'appointment', label: 'Booking reference', value: payload.appointmentId },
        payload.meetingUrl
          ? {
              key: 'join',
              label: 'Join your consultation',
              value: 'Open Google Meet',
              attributedValue: `<a href="${payload.meetingUrl}">Open Google Meet</a>`,
            }
          : { key: 'format', label: 'Where', value: 'Google Meet — your joining link is in your confirmation email.' },
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
