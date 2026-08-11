'use client';

import { useState } from 'react';

import { bookingDetailsSchema, type BookingDetails } from '@/lib/booking/types';

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  referralCode: string;
};

const EMPTY: Values = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: '',
  referralCode: '',
};

type Errors = Partial<Record<keyof Values, string>>;

export function Step1Details({
  initial,
  onNext,
}: {
  initial: BookingDetails | null;
  onNext: (details: BookingDetails) => void;
}) {
  const [values, setValues] = useState<Values>(() =>
    initial
      ? {
          firstName: initial.firstName,
          lastName: initial.lastName,
          email: initial.email,
          phone: initial.phone,
          age: String(initial.age),
          referralCode: initial.referralCode ?? '',
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState<Errors>({});

  function set(key: keyof Values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = bookingDetailsSchema.safeParse({
      ...values,
      age: values.age,
      referralCode: values.referralCode,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    onNext(parsed.data);
  }

  return (
    <form className="bk-form" onSubmit={handleSubmit} noValidate>
      <div className="bk-grid">
        <Field
          id="firstName"
          label="First name"
          value={values.firstName}
          error={errors.firstName}
          autoComplete="given-name"
          onChange={(v) => set('firstName', v)}
        />
        <Field
          id="lastName"
          label="Last name"
          value={values.lastName}
          error={errors.lastName}
          autoComplete="family-name"
          onChange={(v) => set('lastName', v)}
        />
      </div>

      <Field
        id="email"
        label="Email"
        type="email"
        value={values.email}
        error={errors.email}
        autoComplete="email"
        onChange={(v) => set('email', v)}
      />

      <div className="bk-grid">
        <Field
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="07XXX XXXXXX"
          value={values.phone}
          error={errors.phone}
          autoComplete="tel"
          onChange={(v) => set('phone', v)}
        />
        <Field
          id="age"
          label="Age"
          type="text"
          inputMode="numeric"
          value={values.age}
          error={errors.age}
          hint="15–17 year olds must be accompanied by a legal guardian."
          onChange={(v) => set('age', v.replace(/[^\d]/g, '').slice(0, 3))}
        />
      </div>

      <Field
        id="referralCode"
        label="Referral code"
        optional
        value={values.referralCode}
        error={errors.referralCode}
        onChange={(v) => set('referralCode', v)}
      />

      <button className="btn btn--navy bk-submit" type="submit">
        Continue to time slots
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  hint,
  optional,
}: {
  id: keyof Values;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text' | 'tel' | 'email';
  hint?: string;
  optional?: boolean;
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div className="bk-field">
      <label className="bk-label" htmlFor={id}>
        {label}
        {optional ? <span className="bk-optional"> (optional)</span> : <span aria-hidden="true"> *</span>}
      </label>
      <input
        className="bk-input"
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <p className="bk-error" id={errorId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="bk-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
