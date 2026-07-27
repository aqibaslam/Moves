'use client';

import type { ButtonProps } from './Button.types';
import { BUTTON_DEFAULTS } from './Button.types';
import styles from './Button.module.css';

/**
 * Web implementation. The native one lives in Button.native.tsx — Metro
 * resolves that automatically for Expo. Keep the two prop contracts identical;
 * both are typed against ButtonProps so a divergence is a compile error.
 */
export function Button({
  children,
  variant = BUTTON_DEFAULTS.variant,
  size = BUTTON_DEFAULTS.size,
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  accessibilityLabel,
}: ButtonProps) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || loading}
      onClick={onPress}
      aria-label={accessibilityLabel}
      aria-busy={loading || undefined}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}
