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

export function googleWalletObjectId(appointmentId: string): string {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  if (!issuerId) throw new Error('GOOGLE_WALLET_ISSUER_ID is not configured');
  return `${issuerId}.${objectSuffix(appointmentId)}`;
}

let accessTokenCache: { token: string; expiresAt: number } | null = null;

async function googleAccessToken(): Promise<string> {
  if (accessTokenCache && accessTokenCache.expiresAt > Date.now() + 60_000) {
    return accessTokenCache.token;
  }
  const account = serviceAccount();
  const pkcs8 = createPrivateKey(account.private_key)
    .export({ format: 'pem', type: 'pkcs8' })
    .toString();
  const privateKey = await importPKCS8(pkcs8, 'RS256');
  const assertion = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/wallet_object.issuer',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(account.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });
  const body = (await response.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!response.ok || !body.access_token) {
    throw new Error(`Google Wallet OAuth failed: ${response.status} ${body.error ?? 'unknown error'}`);
  }
  accessTokenCache = {
    token: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return body.access_token;
}

export async function googleWalletRequest(
  path: string,
  init: RequestInit = {},
): Promise<{ response: Response; data: Record<string, unknown> }> {
  const response = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await googleAccessToken()}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });
  const text = await response.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = { raw: text.slice(0, 500) };
    }
  }
  return { response, data };
}

export async function createGoogleSaveUrl(payload: WalletPayload, requestOrigin?: string): Promise<string> {
  if (!googleWalletConfigured()) throw new Error('Google Wallet is not configured');
  const account = serviceAccount();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID as string;
  const classSuffix = process.env.GOOGLE_WALLET_CLASS_SUFFIX || 'moves_consultation';
  const classId = `${issuerId}.${classSuffix}`;
  const objectId = googleWalletObjectId(payload.appointmentId);
  const start = new Date(payload.startISO);
  const end = new Date(start.getTime() + 45 * 60_000);
  const assetOrigin = (requestOrigin || process.env.NEXT_PUBLIC_SITE_URL || 'https://movesuk.com').replace(/\/$/, '');
  const origin = assetOrigin.replace(/^https?:\/\//, '');

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
      sourceUri: { uri: `${assetOrigin}/images/moves-logo-2026.png` },
      contentDescription: localised('MOVES'),
    },
    heroImage: {
      sourceUri: { uri: `${assetOrigin}/images/wallet/consultation-case-green.png` },
      contentDescription: localised('The MOVES aligner case against green leaves'),
    },
    validTimeInterval: {
      start: { date: new Date(start.getTime() - 60 * 60_000).toISOString() },
      end: { date: new Date(end.getTime() + 2 * 60 * 60_000).toISOString() },
    },
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
