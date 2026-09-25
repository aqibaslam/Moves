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

/** Canonical public site — used for absolute asset URLs in emails. */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://movesuk.com').replace(/\/$/, '');

/** Jost-first stack; degrades to a geometric sans where the web font can't load. */
const FONT_STACK = "'Jost','Century Gothic','Helvetica Neue',Helvetica,Arial,sans-serif";

/**
 * Branded newsletter confirmation. MOVES wordmark at the top, coral success
 * badge, ink/coral palette and Jost typography to match the site. Deliberately
 * contains NO link or button back to the site — it just confirms the
 * subscription. Subscribers land on the "You're subscribed" screen in the
 * browser instead.
 *
 * Built table-first with inline styles for broad email-client support; the
 * logo is an absolute-URL PNG (SVG is unreliable in Gmail/Outlook).
 */
export function subscribedHtml(): string {
  const logo = `${SITE_URL}/images/moves-logo-2026.png`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>You're subscribed · MOVES</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap');
    body { margin: 0; padding: 0; width: 100% !important; background: #f4f4f6; }
    a { color: #ef3e42; }
    @media (max-width: 520px) {
      .su-card { padding: 32px 24px 26px !important; }
      .su-title { font-size: 25px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f4f6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f4f4f6;">You're subscribed to MOVES — launch news, smile tips and member-only offers are on the way.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="width:480px;max-width:480px;">
          <!-- logo -->
          <tr>
            <td align="center" style="padding:0 0 24px;">
              <img src="${logo}" width="140" height="32" alt="MOVES" style="display:block;width:140px;height:auto;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>
          <!-- card -->
          <tr>
            <td class="su-card" style="background:#ffffff;border:1px solid #ececf0;border-radius:20px;padding:40px 44px 34px;text-align:center;box-shadow:0 12px 34px rgba(9,22,32,0.06);">
              <!-- coral success badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 20px;">
                <tr>
                  <td align="center" valign="middle" width="64" height="64" style="width:64px;height:64px;background:#ef3e42;border-radius:64px;color:#ffffff;font-family:${FONT_STACK};font-size:30px;line-height:64px;font-weight:600;">&#10003;</td>
                </tr>
              </table>
              <h1 class="su-title" style="margin:0 0 12px;font-family:${FONT_STACK};font-size:28px;line-height:1.15;font-weight:500;letter-spacing:-0.01em;color:#091620;">You're subscribed</h1>
              <p style="margin:0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#5a6470;">
                Thanks for subscribing to MOVES. Look out for launch news, smile tips and member-only offers landing in your inbox soon.
              </p>
            </td>
          </tr>
          <!-- footer -->
          <tr>
            <td align="center" style="padding:22px 24px 0;">
              <p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:#9aa1ad;">
                You're receiving this because you subscribed at <a href="${SITE_URL}" style="color:#9aa1ad;text-decoration:underline;">movesuk.com</a>. Unsubscribe anytime.
              </p>
              <p style="margin:8px 0 0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:#c2c7cf;">&copy; 2026 MOVES</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
