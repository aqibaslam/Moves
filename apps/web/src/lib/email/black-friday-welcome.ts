/**
 * Black Friday welcome email — sent when someone enters their email in the
 * /bf-sale-pdp popup. Branded to match the landing page: MOVES wordmark on
 * ink, milk page background, coral button, Public Sans body text.
 *
 * Email clients can't load the site's display face (Glacial Indifference), so
 * the headline and the button are images rendered in it (public/images/
 * email-bf-headline.png, email-book-button.png) with real alt text. Body text
 * uses Public Sans where the client supports web fonts (Apple Mail, iOS) and
 * Helvetica/Arial elsewhere; only 400/500 weights are used so nothing renders
 * heavier than the site.
 *
 * Paste this into a GHL *code-editor* email template: GHL's "Quick compose"
 * editor rewrites pasted HTML (forces Verdana, drops heading styles).
 *
 * Table-first with inline styles for broad client support; the logo is an
 * absolute-URL PNG because SVG is unreliable in Gmail/Outlook.
 *
 * No server-only imports: this file is also rendered to a static preview
 * (docs/email/black-friday-welcome.html) for pasting into the GHL email
 * builder as a fallback.
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://movesuk.com').replace(/\/$/, '');
const FONT = "'Public Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

export const BLACK_FRIDAY_OFFER = 'black-friday-2026';
export const BLACK_FRIDAY_SUBJECT = 'Your £100 off MOVES is unlocked';

const PRICES = [
  { name: 'ONE', now: '£1,795', was: '£1,895', note: '' },
  { name: 'CORE', now: '£2,250', was: '£2,350', note: 'The signature Move' },
  { name: 'COMPLETE', now: '£3,100', was: '£3,200', note: '' },
] as const;

export function blackFridayBookUrl(): string {
  const q = new URLSearchParams({
    lp: 'bf-sale-pdp',
    offer: BLACK_FRIDAY_OFFER,
    from: '/bf-sale-pdp',
    utm_source: 'email',
    utm_medium: 'email',
    utm_campaign: 'bf-welcome',
  });
  return `${SITE_URL}/book?${q.toString()}`;
}

export function blackFridayWelcomeHtml(): string {
  const logo = `${SITE_URL}/images/f26-foot-logo.png`;
  const headline = `${SITE_URL}/images/email-bf-headline.png`;
  const button = `${SITE_URL}/images/email-book-button.png`;
  const url = blackFridayBookUrl();

  const rows = PRICES.map(
    (p, i) => `
              <tr>
                <td style="padding:16px 0;${i ? 'border-top:1px solid #dad5ce;' : ''}font-family:${FONT};">
                  <div style="font-size:18px;line-height:24px;font-weight:400;color:#091620;">MOVES <span style="color:#6b7379;">${p.name}</span></div>
                  ${p.note ? `<div style="margin-top:6px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#ed3b44;color:#ffffff;font-size:10px;line-height:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:500;">${p.note}</span></div>` : ''}
                </td>
                <td align="right" style="padding:16px 0;${i ? 'border-top:1px solid #dad5ce;' : ''}font-family:${FONT};white-space:nowrap;">
                  <div style="font-size:24px;line-height:28px;letter-spacing:-0.02em;color:#091620;font-weight:400;">${p.now}</div>
                  <div style="margin-top:2px;font-size:13px;line-height:16px;color:#6b7379;text-decoration:line-through;">${p.was}</div>
                </td>
              </tr>`,
  ).join('');

  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${BLACK_FRIDAY_SUBJECT}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500&display=swap');
    body { margin: 0; padding: 0; width: 100% !important; background: #edeae6; }
    a { color: #ed3b44; }
    @media (max-width: 560px) {
      .bf-pad { padding-left: 24px !important; padding-right: 24px !important; }
      .bf-h1 { width: 100% !important; height: auto !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#edeae6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#edeae6;">£100 off every Move until 30 Nov. Book your free video call to use it.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#edeae6;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;">
          <!-- header -->
          <tr>
            <td class="bf-pad" align="left" style="background:#091620;padding:26px 40px;">
              <img src="${logo}" width="118" height="26" alt="MOVES" style="display:block;width:118px;height:auto;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>
          <!-- hero -->
          <tr>
            <td class="bf-pad" style="padding:40px 40px 8px;font-family:${FONT};">
              <div style="font-size:11px;line-height:15px;letter-spacing:0.15em;text-transform:uppercase;color:#091620;font-weight:500;">Black Friday sale</div>
              <h1 style="margin:16px 0 0;padding:0;font-size:0;line-height:0;"><img class="bf-h1" src="${headline}" width="480" height="55" alt="£100 off every Move." style="display:block;width:480px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;color:#091620;font-family:${FONT};font-size:34px;line-height:40px;font-weight:500;" /></h1>
              <p style="margin:18px 0 0;font-family:${FONT};font-size:16px;line-height:25px;font-weight:400;color:#56606a;">You&rsquo;re in. Your &pound;100 off is saved until 30 Nov. Book your free video call to use it.</p>
            </td>
          </tr>
          <!-- prices -->
          <tr>
            <td class="bf-pad" style="padding:24px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#edeae6;border-radius:16px;">
                <tr>
                  <td style="padding:8px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;font-family:${FONT};font-size:13px;line-height:19px;color:#6b7379;">Full treatment. &pound;100 off until 30 Nov.</p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td class="bf-pad" align="left" style="padding:24px 40px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left">
                    <a href="${url}" target="_blank" style="display:inline-block;text-decoration:none;border:0;"><img src="${button}" width="270" height="52" alt="Book a free consultation" style="display:block;width:270px;height:auto;border:0;outline:none;text-decoration:none;background:#ed3b44;border-radius:26px;color:#ffffff;font-family:${FONT};font-size:16px;line-height:52px;text-align:center;" /></a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-family:${FONT};font-size:13px;line-height:19px;color:#6b7379;">Free, takes 2 minutes. No obligation.</p>
            </td>
          </tr>
          <!-- trust -->
          <tr>
            <td class="bf-pad" style="padding:28px 40px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e3e1de;">
                <tr>
                  <td style="padding-top:20px;font-family:${FONT};font-size:14px;line-height:22px;color:#56606a;">
                    Every plan is signed by <strong style="color:#091620;font-weight:500;">Dr Hamzah, GDC no. 277550</strong>. Free video consultation. Whitening and retainers included.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- footer -->
          <tr>
            <td class="bf-pad" style="background:#091620;padding:24px 40px;font-family:${FONT};">
              <p style="margin:0;font-size:12px;line-height:18px;color:#9aa6b0;">You&rsquo;re receiving this because you entered your email at <a href="${SITE_URL}" style="color:#ffffff;text-decoration:underline;">movesuk.com</a>. To stop emails from MOVES, reply with &ldquo;unsubscribe&rdquo;.</p>
              <p style="margin:8px 0 0;font-size:12px;line-height:18px;color:#6f7d88;">&copy; 2026 MOVES &middot; Make your Move.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function blackFridayWelcomeText(): string {
  return [
    'BLACK FRIDAY SALE',
    '',
    '£100 off every Move.',
    'You’re in. Your £100 off is saved until 30 Nov. Book your free video call to use it.',
    '',
    ...PRICES.map((p) => `MOVES ${p.name}: ${p.now} (was ${p.was})${p.note ? ` · ${p.note}` : ''}`),
    'Full treatment. £100 off until 30 Nov.',
    '',
    `Book a free consultation: ${blackFridayBookUrl()}`,
    'Free, takes 2 minutes. No obligation.',
    '',
    'Every plan is signed by Dr Hamzah, GDC no. 277550. Free video consultation. Whitening and retainers included.',
    '',
    'You’re receiving this because you entered your email at movesuk.com. To stop emails from MOVES, reply with "unsubscribe".',
    '© 2026 MOVES · Make your Move.',
  ].join('\n');
}
