/**
 * Black Friday welcome email — sent when someone enters their email in the
 * /aligner-lander popup. Branded to match the landing page: MOVES wordmark on
 * ink, milk page background, coral pill button, Jost-first type (the site's
 * Glacial Indifference can't be loaded by email clients).
 *
 * Table-first with inline styles for broad client support; the logo is an
 * absolute-URL PNG because SVG is unreliable in Gmail/Outlook.
 *
 * No server-only imports: this file is also rendered to a static preview
 * (docs/email/black-friday-welcome.html) for pasting into the GHL email
 * builder as a fallback.
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://movesuk.com').replace(/\/$/, '');
const FONT = "'Jost','Century Gothic','Helvetica Neue',Helvetica,Arial,sans-serif";

export const BLACK_FRIDAY_OFFER = 'black-friday-2026';
export const BLACK_FRIDAY_SUBJECT = 'Your £100 off MOVES is unlocked';

const PRICES = [
  { name: 'ONE', now: '£1,795', was: '£1,895', note: '' },
  { name: 'CORE', now: '£2,250', was: '£2,350', note: 'The signature Move' },
  { name: 'COMPLETE', now: '£3,100', was: '£3,200', note: '' },
] as const;

export function blackFridayBookUrl(): string {
  const q = new URLSearchParams({
    lp: 'aligner-lander',
    offer: BLACK_FRIDAY_OFFER,
    from: '/aligner-lander',
    utm_source: 'email',
    utm_medium: 'email',
    utm_campaign: 'bf-welcome',
  });
  return `${SITE_URL}/book?${q.toString()}`;
}

export function blackFridayWelcomeHtml(): string {
  const logo = `${SITE_URL}/images/f26-foot-logo.png`;
  const url = blackFridayBookUrl();

  const rows = PRICES.map(
    (p, i) => `
              <tr>
                <td style="padding:16px 0;${i ? 'border-top:1px solid #dad5ce;' : ''}font-family:${FONT};">
                  <div style="font-size:19px;line-height:24px;letter-spacing:-0.01em;color:#091620;">MOVES <span style="color:#6b7379;">${p.name}</span></div>
                  ${p.note ? `<div style="margin-top:4px;font-size:11px;line-height:14px;letter-spacing:0.12em;text-transform:uppercase;color:#ed3b44;font-weight:600;">${p.note}</div>` : ''}
                </td>
                <td align="right" style="padding:16px 0;${i ? 'border-top:1px solid #dad5ce;' : ''}font-family:${FONT};white-space:nowrap;">
                  <div style="font-size:24px;line-height:28px;letter-spacing:-0.02em;color:#091620;font-weight:500;">${p.now}</div>
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
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap');
    body { margin: 0; padding: 0; width: 100% !important; background: #edeae6; }
    a { color: #ed3b44; }
    @media (max-width: 560px) {
      .bf-pad { padding-left: 24px !important; padding-right: 24px !important; }
      .bf-h1 { font-size: 30px !important; line-height: 34px !important; }
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
              <h1 class="bf-h1" style="margin:14px 0 0;font-family:${FONT};font-size:38px;line-height:42px;font-weight:500;letter-spacing:-0.03em;color:#091620;"><span style="font-weight:600;">£100 off</span> every Move.</h1>
              <p style="margin:16px 0 0;font-family:${FONT};font-size:16px;line-height:25px;color:#56606a;">You&rsquo;re in. Your &pound;100 off is saved until 30 Nov. Book your free video call to use it.</p>
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
                  <td align="center" bgcolor="#ed3b44" style="border-radius:26px;">
                    <a href="${url}" target="_blank" style="display:inline-block;padding:16px 30px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:26px;">Book a free consultation</a>
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
                    Every plan is signed by <strong style="color:#091620;font-weight:600;">Dr Hamzah, GDC no. 277550</strong>. Free video consultation. Whitening and retainers included.
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
