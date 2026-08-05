/* Trustpilot rating widget — built to the Figma: real text in the site font +
   the exact Trustpilot star images. Used in the hero on desktop and mobile. */

export function TrustpilotWidget() {
  return (
    <div className="tp" role="img" aria-label="Rated Excellent — 100+ reviews on Trustpilot">
      <span className="tp__label">Excellent</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tp__stars-img" src="/images/tp-stars.png" alt="" aria-hidden="true" />
      <span className="tp__count">
        <span className="tp__count-num">100+</span> review on
      </span>
      <span className="tp__brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tp__brand-star" src="/images/tp-star.png" alt="" aria-hidden="true" />
        <span className="tp__brand-name">Trustpilot</span>
      </span>
    </div>
  );
}
