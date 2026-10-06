import 'server-only';

import { connect } from 'node:http2';

import { decodeBase64Env } from './config';

function connectionOptions() {
  const signer = decodeBase64Env('APPLE_PASS_CERT_BASE64');
  const wwdr = decodeBase64Env('APPLE_WWDR_CERT_BASE64');
  return {
    cert: Buffer.concat([signer, Buffer.from('\n'), wwdr]),
    key: decodeBase64Env('APPLE_PASS_PRIVATE_KEY_BASE64'),
    passphrase: process.env.APPLE_PASS_PRIVATE_KEY_PASSWORD,
  };
}

function sendOne(
  client: ReturnType<typeof connect>,
  pushToken: string,
): Promise<{ ok: boolean; status: number; reason?: string }> {
  return new Promise((resolve) => {
    if (!/^[A-Fa-f0-9]{32,256}$/.test(pushToken)) {
      resolve({ ok: false, status: 0, reason: 'invalid push token' });
      return;
    }
    let body = '';
    let status = 0;
    const request = client.request({
      ':method': 'POST',
      ':path': `/3/device/${pushToken}`,
      'apns-topic': process.env.APPLE_PASS_TYPE_ID as string,
      'apns-push-type': 'background',
      'apns-priority': '5',
      'content-type': 'application/json',
    });
    request.setEncoding('utf8');
    request.on('response', (headers) => {
      status = Number(headers[':status'] ?? 0);
    });
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('error', (error) => resolve({ ok: false, status, reason: error.message }));
    request.on('end', () => {
      let reason = body || undefined;
      try {
        reason = (JSON.parse(body || '{}') as { reason?: string }).reason ?? reason;
      } catch {
        // Keep Apple's raw response when it is not JSON.
      }
      resolve({ ok: status === 200, status, reason });
    });
    request.end('{}');
  });
}

export async function pushApplePassUpdates(pushTokens: string[]) {
  const tokens = [...new Set(pushTokens.filter(Boolean))];
  if (!tokens.length) return [];
  const client = connect('https://api.push.apple.com', connectionOptions());
  try {
    await new Promise<void>((resolve, reject) => {
      client.once('connect', resolve);
      client.once('error', reject);
    });
    return await Promise.all(
      tokens.map(async (token) => ({ token, ...(await sendOne(client, token)) })),
    );
  } finally {
    client.close();
  }
}
