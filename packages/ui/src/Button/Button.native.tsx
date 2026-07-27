import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  darkTheme,
  fontSize,
  lightTheme,
  MIN_TOUCH_TARGET,
  radius,
  space,
  type Theme,
} from '@moves/design-tokens';
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';
import { BUTTON_DEFAULTS } from './Button.types';

/**
 * Native implementation. Same props as Button.tsx — Metro picks this file
 * automatically on iOS/Android via the .native extension.
 *
 * There is no CSS here: the same tokens that generate the web custom
 * properties are read directly as JS values.
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
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyle(theme, variant),
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isInactive && styles.disabled,
      ]}
    >
      <View style={styles.row}>
        {loading && (
          <ActivityIndicator size="small" color={labelColor(theme, variant)} />
        )}
        <Text
          style={[
            styles.label,
            { fontSize: fontSize[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'base'] },
            { color: labelColor(theme, variant) },
          ]}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

function variantStyle(theme: Theme, variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return { backgroundColor: theme.accent };
    case 'secondary':
      return {
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.borderStrong,
      };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    case 'danger':
      return { backgroundColor: theme.danger };
  }
}

function labelColor(theme: Theme, variant: ButtonVariant) {
  if (variant === 'primary') return theme.onAccent;
  if (variant === 'danger') return '#ffffff';
  return theme.text;
}

const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number }> = {
  sm: { paddingVertical: space[2], paddingHorizontal: space[4] },
  md: { paddingVertical: space[3], paddingHorizontal: space[6] },
  lg: { paddingVertical: space[4], paddingHorizontal: space[8] },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    // WCAG 2.5.5 — the whole reason MIN_TOUCH_TARGET is a token.
    minHeight: MIN_TOUCH_TARGET,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  label: {
    fontWeight: '600',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
