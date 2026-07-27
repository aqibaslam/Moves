/**
 * Shared Button contract. Platform-neutral — no DOM types, no RN types.
 * Both Button.tsx (web) and Button.native.tsx implement this.
 */
import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  /** Stretches to the width of its container. */
  fullWidth?: boolean;
  onPress?: () => void;
  /** Required when the button's label is not descriptive on its own. */
  accessibilityLabel?: string;
}

export const BUTTON_DEFAULTS = {
  variant: 'primary',
  size: 'md',
} as const satisfies Partial<ButtonProps>;
