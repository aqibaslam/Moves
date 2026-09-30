import 'server-only';

export function appleWalletConfigured(): boolean {
  return Boolean(
    process.env.APPLE_TEAM_ID &&
      process.env.APPLE_PASS_TYPE_ID &&
      process.env.APPLE_WWDR_CERT_BASE64 &&
      process.env.APPLE_PASS_CERT_BASE64 &&
      process.env.APPLE_PASS_PRIVATE_KEY_BASE64,
  );
}

export function googleWalletConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_WALLET_ISSUER_ID &&
      process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64,
  );
}

export function walletAvailability() {
  return {
    apple: appleWalletConfigured(),
    google: googleWalletConfigured(),
  };
}

export function decodeBase64Env(name: string): Buffer {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return Buffer.from(value, 'base64');
}
