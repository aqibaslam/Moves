'use client';

import { useState } from 'react';

import type { BookingDetails, SlotTime } from '@/lib/booking/types';

export function Step3Confirm({
  details,
  slot,
  whenLabel,
  submitting,
  error,
  onBack,
  onConfirm,
}: {
  details: BookingDetails;
  slot: SlotTime;
  whenLabel: string;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: (consent: boolean) => void;
}) {
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  function handleConfirm() {
    if (!consent) {
      setConsentError('Please accept the terms to continue.');
      return;
    }
    onConfirm(consent);
  }

  return (
    <div className="bk-review">
      <dl className="bk-summary">
        <div className="bk-summary__row bk-summary__row--slot">
          <dt>Your consultation</dt>
          <dd>{whenLabel}</dd>
        </div>
        <div className="bk-summary__row">
          <dt>Name</dt>
          <dd>
            {details.firstName} {details.lastName}
          </dd>
        </div>
        <div className="bk-summary__row">
          <dt>Email</dt>
          <dd>{details.email}</dd>
        </div>
        <div className="bk-summary__row">
          <dt>Phone</dt>
          <dd>{details.phone}</dd>
        </div>
      </dl>

      <label className="bk-consent">
        <input
          type="checkbox"
          checked={consent}
          aria-invalid={consentError ? true : undefined}
          aria-describedby={consentError ? 'consent-error' : undefined}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setConsentError(null);
          }}
        />
        <span>
          I agree to Moves’{' '}
          <a href="/terms" target="_blank" rel="noreferrer">
            Terms &amp; Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noreferrer">
            Privacy Notice
          </a>
          .
        </span>
      </label>
      {consentError ? (
        <p className="bk-error" id="consent-error" role="alert">
          {consentError}
        </p>
      ) : null}

      {error ? (
        <p className="bk-error bk-error--banner" role="alert">
          {error}
        </p>
      ) : null}

      <div className="bk-actions">
        <button className="bk-back" type="button" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
        <button className="btn btn--coral" type="button" onClick={handleConfirm} disabled={submitting}>
          {submitting ? 'Booking…' : 'Confirm booking'}
        </button>
      </div>
    </div>
  );
}
