/* Small inline SVG icons used across the landing page.
   Branded logos/photos come from /public/images; these are the
   generic UI glyphs (stars, checks, arrows) that are cleaner inline. */

export function StarChip({ size = 17.22, pad = 3.69 }: { size?: number; pad?: number }) {
  return (
    <span className="star" style={{ padding: pad }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M12 2l2.9 6.26L21.5 9l-5 4.6L18 20.5 12 17l-6 3.5 1.5-6.9-5-4.6 6.6-.74L12 2z" />
      </svg>
    </span>
  );
}

export function TrustpilotStar({ size = 22.34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#219653" aria-hidden="true">
      <path d="M12 2l2.9 6.26L21.5 9l-5 4.6L18 20.5 12 17l-6 3.5 1.5-6.9-5-4.6 6.6-.74L12 2z" />
    </svg>
  );
}

export function Check() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
      <path
        d="M1 5.8L4.8 9.5L13 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Play() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden="true">
      <path d="M0 1.2v11.6c0 .9 1 1.5 1.8 1L9.4 7.8a1.2 1.2 0 000-2L1.8.2C1 .3 0 .3 0 1.2z" />
    </svg>
  );
}

export function Plus() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6 14L14 6M7 6h7v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Envelope() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="4" y="7" width="22" height="16" rx="3" stroke="#fff" strokeWidth="1.6" />
      <path d="M5 9l10 7 10-7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** The rounded starburst behind the "30 days" guarantee badge. */
export function Starburst() {
  return (
    <svg viewBox="0 0 307 300" fill="currentColor" aria-hidden="true">
      <path d="M153.5 0l28 34 42-18 12 44 44 6-16 42 34 30-34 30 16 42-44 6-12 44-42-18-28 34-28-34-42 18-12-44-44-6 16-42L20 210l34-30-16-42 44-6 12-44 42 18 28-34z" />
    </svg>
  );
}
