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

/**
 * Newsletter-style confirmation. Deliberately contains NO link or button back
 * to the site — it just confirms the subscription. Subscribers land on the
 * "You're subscribed" screen in the browser instead.
 */
export function subscribedHtml(): string {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;text-align:center">
      <h1 style="color:#091620;font-size:24px;font-weight:600;margin:0 0 12px">You're subscribed</h1>
      <p style="color:#3f3f46;font-size:15px;line-height:1.65;margin:0 0 20px">
        Thanks for subscribing to MOVES. Look out for launch news, smile tips and member-only offers landing in your inbox soon.
      </p>
      <p style="color:#9aa1ad;font-size:12px;line-height:1.6;margin:0">
        You're receiving this because you subscribed at movesuk.com. Unsubscribe anytime.
      </p>
    </div>`;
}
