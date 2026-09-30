import 'server-only';

import { createHash, createPrivateKey } from 'node:crypto';
import { importPKCS8, SignJWT } from 'jose';

import { googleWalletConfigured } from './config';
import type { WalletPayload } from './token';

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function serviceAccount(): ServiceAccount {
  const encoded = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64;
  if (!encoded) throw new Error('GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64 is not configured');
  const parsed = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as Partial<ServiceAccount>;
  if (!parsed.client_email || !parsed.private_key) throw new Error('Google Wallet service account JSON is invalid');
  return parsed as ServiceAccount;
}

function localised(value: string) {
  return { defaultValue: { language: 'en-GB', value } };
}

function objectSuffix(appointmentId: string): string {
  return `consultation_${createHash('sha256').update(appointmentId).digest('hex').slice(0, 24)}`;
}

export async function createGoogleSaveUrl(payload: WalletPayload): Promise<string> {
  if (!googleWalletConfigured()) throw new Error('Google Wallet is not configured');
  const account = serviceAccount();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID as string;
  const classSuffix = process.env.GOOGLE_WALLET_CLASS_SUFFIX || 'moves_consultation';
  const classId = `${issuerId}.${classSuffix}`;
  const objectId = `${issuerId}.${objectSuffix(payload.appointmentId)}`;
  const start = new Date(payload.startISO);
  const end = new Date(start.getTime() + 45 * 60_000);
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://movesuk.com').replace(/^https?:\/\//, '').replace(/\/$/, '');

  const genericObject = {
    id: objectId,
    classId,
    state: 'ACTIVE',
    genericType: 'GENERIC_OTHER',
    hexBackgroundColor: '#051922',
    cardTitle: localised('MOVES'),
    header: localised('Free video consultation'),
    subheader: localised(`${payload.firstName} ${payload.lastName}`.trim()),
    logo: {
      sourceUri: { uri: 'https://movesuk.com/images/moves-logo-2026.png' },
      contentDescription: localised('MOVES'),
    },
    heroImage: {
      sourceUri: { uri: 'https://movesuk.com/images/wallet/consultation-case-green.png' },
      contentDescription: localised('The MOVES aligner case against green leaves'),
    },
    validTimeInterval: { start: { date: start.toISOString() }, end: { date: end.toISOString() } },
    notifications: { upcomingNotification: { enableNotification: true } },
    textModulesData: [
      { id: 'time', header: 'YOUR CALL', body: new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', dateStyle: 'full', timeStyle: 'short' }).format(start) },
      { id: 'duration', header: 'DURATION', body: '45 minutes · Google Meet' },
      { id: 'reference', header: 'BOOKING REFERENCE', body: payload.appointmentId },
    ],
    linksModuleData: {
      uris: payload.meetingUrl ? [{ id: 'meeting', uri: payload.meetingUrl, description: 'Join Google Meet' }] : [],
    },
  };

  // Google currently exports PKCS#8 keys, but normalising through Node also
  // accepts an older PKCS#1 key if an existing service account uses one.
  const pkcs8 = createPrivateKey(account.private_key)
    .export({ format: 'pem', type: 'pkcs8' })
    .toString();
  const privateKey = await importPKCS8(pkcs8, 'RS256');
  const token = await new SignJWT({
    origins: [origin],
    typ: 'savetowallet',
    // The class is created once in Google Wallet Console. Issuing links only
    // include the appointment object so an existing class is never recreated.
    payload: { genericObjects: [genericObject] },
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(account.client_email)
    .setAudience('google')
    .setIssuedAt()
    .sign(privateKey);

  return `https://pay.google.com/gp/v/save/${token}`;
}
