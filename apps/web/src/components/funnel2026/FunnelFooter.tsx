/* Minimal 2026 funnel footer (Figma node 451:1506) — used ONLY on the
   /funnel-2026 page. A centred white MOVES wordmark over the dark navy band,
   a single row of legal/contact links, and a copyright line. Distinct from the
   larger FooterDark (newsletter + link columns) still used on /landing-2026. */
export function FunnelFooter() {
  return (
    <footer className="f26-footer">
      <div className="f26-footer__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="f26-footer__logo"
          src="/images/f26-foot-logo.svg"
          alt="Moves"
          width={235}
          height={52}
        />

        <nav className="f26-footer__links" aria-label="Footer">
          <a href="/privacy">Privacy Policy</a>
          <span className="f26-footer__sep" aria-hidden="true">·</span>
          <a href="/terms">Terms</a>
          <span className="f26-footer__sep" aria-hidden="true">·</span>
          <a href="mailto:support@move.com">support@move.com</a>
        </nav>

        <p className="f26-footer__copy">&copy; Copyright 2026, Moves. All rights reserved.</p>
      </div>
    </footer>
  );
}
