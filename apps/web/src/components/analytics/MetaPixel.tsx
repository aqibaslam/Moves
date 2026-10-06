'use client';

import { useEffect, useState } from 'react';

import styles from './MetaPixel.module.css';

const CONSENT_COOKIE = 'moves_consent_v1';
const CONSENT_EVENT = 'moves:consent';
const ONE_YEAR_SECONDS = 31_536_000;

type ConsentChoice = 'allowed' | 'declined';
type MetaCall = [method: string, event: string, params?: Record<string, unknown>, options?: Record<string, unknown>];
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  push: (...args: unknown[]) => void;
  version: string;
};

type MetaWindow = Window & {
  fbq?: Fbq;
  _fbq?: Fbq;
  __movesMetaInitialized?: boolean;
  __movesMetaQueue?: MetaCall[];
};

function readConsent(): ConsentChoice | null {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
    ?.split('=')
    .slice(1)
    .join('=');
  return value === 'allowed' || value === 'declined' ? value : null;
}

function persistConsent(choice: ConsentChoice) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

function initialiseMeta(datasetId: string) {
  const win = window as MetaWindow;
  if (win.__movesMetaInitialized) return;

  if (!win.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    win.fbq = fbq;
    win._fbq = fbq;
  }

  const fbq = win.fbq;
  if (!fbq) return;
  win.__movesMetaInitialized = true;
  fbq('init', datasetId);
  fbq('track', 'PageView');
  for (const [method, event, params, options] of win.__movesMetaQueue ?? []) {
    if (options) fbq(method, event, params ?? {}, options);
    else fbq(method, event, params ?? {});
  }
  win.__movesMetaQueue = [];

  if (!document.querySelector('script[data-moves-meta-pixel]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.dataset.movesMetaPixel = 'true';
    document.head.appendChild(script);
  }
}

/** No Meta request leaves the browser before explicit optional-cookie consent. */
export function MetaPixel() {
  const datasetId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);

  useEffect(() => {
    const stored = readConsent();
    setChoice(stored);
    if (stored === 'allowed' && datasetId) initialiseMeta(datasetId);

    const onConsent = (event: Event) => {
      const next = (event as CustomEvent<ConsentChoice>).detail;
      setChoice(next);
      if (next === 'allowed' && datasetId) initialiseMeta(datasetId);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, [datasetId]);

  if (choice !== null) return null;

  const choose = (next: ConsentChoice) => {
    persistConsent(next);
    setChoice(next);
    if (next === 'allowed' && datasetId) initialiseMeta(datasetId);
  };

  return (
    <section className={styles.banner} aria-label="Cookie preferences">
      <div className={styles.copy}>
        <strong>Privacy, considered.</strong>
        <span>
          Optional cookies help us understand visits and measure our campaigns.{' '}
          <a href="/privacy-policy">Privacy policy</a>
        </span>
      </div>
      <div className={styles.actions}>
        <button className={styles.secondary} type="button" onClick={() => choose('declined')}>
          Decline
        </button>
        <button className={styles.primary} type="button" onClick={() => choose('allowed')}>
          Allow
        </button>
      </div>
    </section>
  );
}
