---
name: cross-platform-ui
description: >
  Build one component API that renders correctly in both the Next.js 16 web app
  and the Expo SDK 57+ mobile app, driven entirely by @moves/design-tokens.
  Activates when creating or editing anything in packages/ui, adding a `.native.tsx`
  file, wiring tokens into CSS variables or StyleSheet, or when a component must
  ship to apps/web and apps/mobile from a single source of truth.
---

# Cross-Platform UI

One API. Two renderers. Zero duplicated decisions.

## Core Rules

1. **Tokens are the only shared styling primitive.** Import from `@moves/design-tokens`. Never hardcode a colour, size, radius, or duration in a component — add it to the token package.
2. **Share the contract, split the render.** `Button.types.ts` + `useButton.ts` are shared. `Button.tsx` (web) and `Button.native.tsx` (native) are not.
3. **`@moves/design-tokens` must never import `react`, `react-native`, or `next`.** It is plain data. Breaking this breaks the Metro bundler.
4. **Never leak platform types across the boundary.** No `className`, `style: CSSProperties`, `onClick`, `React.MouseEvent`, or `ViewStyle` in a shared props type. Use semantic props: `variant`, `size`, `onPress`, `disabled`.
5. **Semantic theme keys only.** Components read `lightTheme`/`darkTheme` keys (`bg`, `text`, `accent`, `border`). Never reach into `palette` from a component.
6. **Every interactive native element is ≥ `MIN_TOUCH_TARGET` (44).** Enforce with `minHeight`/`minWidth` or `hitSlop`. Not optional — WCAG 2.5.5.
7. **Two implementations beat one bad abstraction.** If the shared layer is mostly `Platform.OS` branches, delete it and write both.
8. **Web owns the DOM; native owns the tree.** No `div`, `<a>`, or media queries in native files. No `View`/`Text`/`Pressable` in web files.

## What Can and Cannot Be Shared

| Share | Never share |
|---|---|
| Design tokens (`space`, `fontSize`, `radius`, `shadow`, `duration`) | CSS files, CSS Modules, `className` |
| Types and prop contracts (`ButtonProps`, `Variant`) | DOM nodes, refs to DOM elements |
| Pure logic and hooks (`useButton`, `useDisclosure`, `usePagination`) | Event objects (`MouseEvent` vs `GestureResponderEvent`) |
| Zod schemas, validation, formatters, i18n strings | Layout primitives (`display: grid`, `Flexbox` gap semantics differ) |
| Data fetching contracts, API clients, state stores | Navigation (`next/link` vs `expo-router`) |
| Accessibility *intent* (`label`, `role`, `expanded`) | Accessibility *props* (`aria-*` vs `accessibility*`) |

## The Platform-Extension Pattern

Metro resolves `.native.tsx` first on iOS/Android. Next.js/webpack resolves `.tsx`. Same import specifier, two files.

```
packages/ui/src/Button/
  index.ts            # export * from './Button.types'; export { Button } from './Button';
  Button.types.ts     # shared contract — no platform imports
  useButton.ts        # shared behaviour — no platform imports
  Button.tsx          # web
  Button.native.tsx   # native
```

```ts
// Button.types.ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  /** Semantic. Web maps to onClick, native to onPress. */
  onPress?: () => void;
  /** Accessibility intent — each platform maps it to its own attribute. */
  label?: string;
}
```

```ts
// useButton.ts — behaviour that is identical on both platforms
import { space, fontSize, radius, MIN_TOUCH_TARGET } from '@moves/design-tokens';
import type { ButtonProps, ButtonSize } from './Button.types';

const SIZES = {
  sm: { paddingV: space[2], paddingH: space[3], font: fontSize.sm, minH: MIN_TOUCH_TARGET },
  md: { paddingV: space[3], paddingH: space[4], font: fontSize.base, minH: MIN_TOUCH_TARGET },
  lg: { paddingV: space[4], paddingH: space[6], font: fontSize.lg, minH: space[12] },
} as const satisfies Record<ButtonSize, unknown>;

export function useButton({ size = 'md', disabled, loading, onPress }: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  return {
    isDisabled,
    metrics: SIZES[size],
    borderRadius: radius.md,
    handlePress: () => { if (!isDisabled) onPress?.(); },
  };
}
```

```tsx
// Button.tsx — web. Tokens reach CSS via custom properties; sizing via inline vars.
'use client';
import { fontWeight } from '@moves/design-tokens';
import { useButton } from './useButton';
import type { ButtonProps } from './Button.types';

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', fullWidth, label, loading } = props;
  const { isDisabled, metrics, borderRadius, handlePress } = useButton(props);

  return (
    <button
      type="button"
      data-variant={variant}
      disabled={isDisabled}
      aria-label={label}
      aria-busy={loading || undefined}
      onClick={handlePress}
      style={{
        // numbers → px; the theme colours come from tokens.css custom properties
        padding: `${metrics.paddingV}px ${metrics.paddingH}px`,
        fontSize: `${metrics.font / 16}rem`,
        fontWeight: fontWeight.semibold,
        minHeight: metrics.minH,
        borderRadius,
        width: fullWidth ? '100%' : undefined,
      }}
      className="mv-button"
    >
      {children}
    </button>
  );
}
```

```tsx
// Button.native.tsx — native. Same tokens, StyleSheet instead of CSS.
import { Pressable, Text, StyleSheet } from 'react-native';
import { fontWeight, fontFamily, lineHeight, shadow } from '@moves/design-tokens';
import { useTheme } from '../theme/useTheme';
import { useButton } from './useButton';
import type { ButtonProps } from './Button.types';

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', fullWidth, label, loading } = props;
  const t = useTheme();
  const { isDisabled, metrics, borderRadius, handlePress } = useButton(props);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        shadow.sm.native,
        {
          backgroundColor: variant === 'primary' ? t.accent : 'transparent',
          borderColor: variant === 'primary' ? 'transparent' : t.border,
          paddingVertical: metrics.paddingV,
          paddingHorizontal: metrics.paddingH,
          minHeight: metrics.minH,
          borderRadius,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: variant === 'primary' ? t.onAccent : t.text,
          fontSize: metrics.font,
          lineHeight: metrics.font * lineHeight.normal,
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semibold,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
```

## One Token Object, Two Runtimes

Tokens are numbers. Web adds units; native uses the number directly.

```ts
// packages/design-tokens/src/toCssVars.ts — generate at build time into tokens.css
import { lightTheme, darkTheme, space, radius, duration, easing, shadow } from '@moves/design-tokens';

const themeVars = (t: typeof lightTheme) =>
  Object.entries(t).map(([k, v]) => `  --mv-color-${kebab(k)}: ${v};`).join('\n');

export const css = `
:root {
${themeVars(lightTheme)}
${Object.entries(space).map(([k, v]) => `  --mv-space-${k}: ${v}px;`).join('\n')}
${Object.entries(radius).map(([k, v]) => `  --mv-radius-${k}: ${v}px;`).join('\n')}
${Object.entries(duration).map(([k, v]) => `  --mv-duration-${k}: ${v}ms;`).join('\n')}
${Object.entries(easing).map(([k, v]) => `  --mv-ease-${k}: ${v};`).join('\n')}
${Object.entries(shadow).map(([k, v]) => `  --mv-shadow-${k}: ${v.css};`).join('\n')}
}
[data-theme='dark'] {
${themeVars(darkTheme)}
}`;
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
```

```ts
// apps/mobile/src/theme/useTheme.ts — the native half of the same switch
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type Theme } from '@moves/design-tokens';

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? darkTheme : lightTheme;
}
```

Note the shapes: `shadow.md.css` is a CSS string, `shadow.md.native` is an RN style object with `elevation`. Never pass `.css` to `StyleSheet`. Never pass `.native` to a `style` prop on web.

## Scales That Hold on Both Platforms

- **Spacing:** `space` is a 4pt grid of raw numbers. Native: `padding: space[4]`. Web: `padding: var(--mv-space-4)` or `padding: space[4]` inline (React appends `px`). Never use a value not in the scale.
- **Type:** `fontSize` is px. Native uses px directly. Web divides by 16 for `rem` so browser zoom and user font settings work. `lineHeight` is a unitless ratio — web sets it as-is; **native requires an absolute number**, so always compute `fontSize.base * lineHeight.normal`.
- **`letterSpacing`** is in em. Web: `letterSpacing: '-0.02em'`. Native: multiply by font size — `fontSize['5xl'] * letterSpacing.tighter`.
- **`fontWeight`** is a string on both. Native additionally needs the correct `fontFamily` variant loaded via `expo-font`; a numeric weight alone will not synthesise on Android.
- **`breakpoint`/`maxWidth`** are web-first. On native use `useWindowDimensions()` compared against `breakpoint.md` for tablet layouts — never a CSS media query.

## Native-Only Obligations

```tsx
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { space, MIN_TOUCH_TARGET } from '@moves/design-tokens';

export function Screen({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      {children}
      {footer ? (
        // Pad the bottom by the inset, never a magic 34.
        <View style={{ paddingBottom: insets.bottom + space[3], paddingHorizontal: space[4], minHeight: MIN_TOUCH_TARGET }}>
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}
```

Rules: use `edges` on `SafeAreaView` rather than wrapping everything; a floating action bar pads by `insets.bottom`; icon-only buttons get `hitSlop` to reach 44 even when the glyph is 20; `KeyboardAvoidingView` uses `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`.

## When to STOP Abstracting

Write two separate components — no shared render — when any of these is true:

- The shared file has **more than one** `Platform.OS` branch.
- The platforms need different DOM/tree structures (web `<table>` vs native `FlatList`).
- The interaction models diverge: hover/focus-visible/keyboard vs long-press/swipe/haptics.
- One platform needs a native module (`expo-haptics`, `react-native-gesture-handler`) the other has no analogue for.
- Scroll, virtualisation, or overlay behaviour is involved — `FlatList`, `Modal`, and `BottomSheet` have no honest web equivalent.

In those cases still share `*.types.ts`, tokens, and any pure hook. Duplicated JSX is cheap. A component with six platform flags is not.

## Red Flags

- `className`, `style`, or `CSSProperties` appearing in a shared props type.
- `import { View } from 'react-native'` anywhere in `apps/web` or a non-`.native` file.
- A hex code, `px` literal, or magic `16` in a component instead of a token.
- Reading `palette.accent600` in a component rather than `theme.accent`.
- `shadow.md` passed whole to a style prop instead of `.css` / `.native`.
- `lineHeight: lineHeight.normal` on a native `Text` — 1.5px line height.
- `Platform.select` stacked more than once in a single file.
- `TouchableOpacity`/`Pressable` under 44pt with no `hitSlop`.
- Hardcoded `paddingBottom: 34` instead of `useSafeAreaInsets()`.
- `@moves/design-tokens` importing anything from `react`, `react-native`, or `next`.
- A shared component that renders `null` on one platform — that is two components wearing one name.
