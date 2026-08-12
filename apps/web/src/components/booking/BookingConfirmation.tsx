'use client';

import type { BookingConfirmation as Confirmation } from '@/lib/booking/types';

export function BookingConfirmation({
  confirmation,
  email,
}: {
  confirmation: Confirmation;
  email: string;
}) {
  return (
    <div className="bk-done">
      <span className="bk-done__tick" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12.5l5 5L20 6.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h2 className="bk-done__title">You’re booked in</h2>
      <p className="bk-done__when">{confirmation.when}</p>

      <p className="bk-done__body">
        We’ve sent a confirmation to <strong>{email}</strong> with everything you need, including
        your video-call link. Your dentist will meet you on the call — no software to install.
      </p>

      {confirmation.stub ? (
        <p className="bk-done__note">
          Demo mode — no CRM is connected yet, so this booking wasn’t saved. Add your GoHighLevel
          credentials to go live.
        </p>
      ) : null}
    </div>
  );
}
