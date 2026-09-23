import 'server-only';

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const FROM = process.env.EMAIL_FROM || 'Moves <onboarding@resend.dev>';

/**
 * Sends a transactional email via Resend when RESEND_API_KEY is set.
 * Returns { sent } — false when no provider is configured (caller may then
 * surface the link another way in development).
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('[email] Resend error', res.status, body);
      return { sent: false, error: `Resend ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] send failed', err);
    return { sent: false, error: 'send failed' };
  }
}

export function magicLinkHtml(link: string): string {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h1 style="color:#04143a;font-size:22px">Welcome to Moves</h1>
      <p style="color:#3f3f46;font-size:15px;line-height:1.6">
        Tap the button below to confirm your email and finish signing up. This link works once and expires in 30 minutes.
      </p>
      <a href="${link}" style="display:inline-block;margin:16px 0;padding:14px 28px;background:#fc5257;color:#fff;
         font-weight:700;border-radius:999px;text-decoration:none">Confirm my email</a>
      <p style="color:#9aa1ad;font-size:12px">If you didn't request this, you can ignore this email.</p>
    </div>`;
}
