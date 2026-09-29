'use client';

import { useEffect } from 'react';

export function BookingBodyClass() {
  useEffect(() => {
    document.body.classList.add('is-light');
    return () => {
      document.body.classList.remove('is-light', 'is-done');
    };
  }, []);

  return null;
}
