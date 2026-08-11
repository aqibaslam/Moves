'use client';

import { useCallback, useEffect, useState } from 'react';

import { createBookingAction, fetchSlotsAction } from '@/app/(frontend)/book/actions';
import type {
  AvailabilityDay,
  BookingConfirmation as Confirmation,
  BookingDetails,
  SlotTime,
} from '@/lib/booking/types';

import { BookingConfirmation } from './BookingConfirmation';
import { Step1Details } from './Step1Details';
import { Step2Slots } from './Step2Slots';
import { Step3Confirm } from './Step3Confirm';

type Step = 1 | 2 | 3;
type SlotsStatus = 'idle' | 'loading' | 'error' | 'ready';

const STEP_LABELS = ['Your details', 'Pick a time', 'Confirm'];

export function BookingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [details, setDetails] = useState<BookingDetails | null>(null);

  const [days, setDays] = useState<AvailabilityDay[]>([]);
  const [slotsStatus, setSlotsStatus] = useState<SlotsStatus>('idle');
  const [selected, setSelected] = useState<SlotTime | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const loadSlots = useCallback(async () => {
    setSlotsStatus('loading');
    const result = await fetchSlotsAction();
    if (result.ok) {
      setDays(result.days);
      setSlotsStatus('ready');
    } else {
      setSlotsStatus('error');
    }
  }, []);

  // Load availability the first time we land on Step 2.
  useEffect(() => {
    if (step === 2 && slotsStatus === 'idle') void loadSlots();
  }, [step, slotsStatus, loadSlots]);

  function handleDetails(next: BookingDetails) {
    setDetails(next);
    setStep(2);
  }

  async function handleConfirm(consent: boolean) {
    if (!details || !selected) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await createBookingAction({
      ...details,
      slotStart: selected.startISO,
      timezone: 'Europe/London',
      consent,
    });
    setSubmitting(false);
    if (result.ok) {
      setConfirmation(result.confirmation);
    } else {
      setSubmitError(result.error);
    }
  }

  if (confirmation && details) {
    return (
      <section className="bk-card" aria-label="Booking confirmed">
        <BookingConfirmation confirmation={confirmation} email={details.email} />
      </section>
    );
  }

  return (
    <section className="bk-card" aria-labelledby="bk-step-heading">
      <header className="bk-head">
        <div className="bk-head__row">
          <p className="bk-step" id="bk-step-heading">
            Step {step} of 3: {STEP_LABELS[step - 1]}
          </p>
          <span className="bk-secure">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Secure form
          </span>
        </div>
        <div className="bk-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Booking progress: step ${step} of 3`}>
          <span className="bk-progress__fill" style={{ transform: `scaleX(${step / 3})` }} />
        </div>
      </header>

      {step === 1 ? <Step1Details initial={details} onNext={handleDetails} /> : null}

      {step === 2 ? (
        <Step2Slots
          status={slotsStatus === 'idle' ? 'loading' : slotsStatus}
          days={days}
          selected={selected}
          onSelect={setSelected}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          onRetry={loadSlots}
        />
      ) : null}

      {step === 3 && details && selected ? (
        <Step3Confirm
          details={details}
          slot={selected}
          whenLabel={whenLabel(days, selected)}
          submitting={submitting}
          error={submitError}
          onBack={() => setStep(2)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </section>
  );
}

/** Compose a friendly "Wed 12 Aug at 9:00 am" from the loaded day + slot. */
function whenLabel(days: AvailabilityDay[], slot: SlotTime): string {
  const day = days.find((d) => d.times.some((t) => t.startISO === slot.startISO));
  return day ? `${day.weekdayLabel} ${day.dayLabel} at ${slot.label}` : slot.label;
}
