---
name: motion-and-interaction
description: >
  Motion as a system for the Moves monorepo — the duration/easing token scale,
  what may animate, entrance/exit patterns, accessible scroll reveals, View
  Transitions on web and Reanimated 4 on native, and the 60fps rules.
  Activates when adding any transition, animation, hover/press state, scroll
  reveal, page transition, modal, toast, skeleton, or gesture in apps/web,
  apps/mobile, or packages/ui.
---

# Motion and Interaction

Motion is a system with five durations and three curves. If your animation needs a sixth value, it is wrong.

## Core Rules

1. **Only `transform` and `opacity` animate.** Never `width`, `height`, `top`, `left`, `margin`, `padding`, `background-color` on a large surface, `box-shadow`, or `filter` in a loop. Those hit layout and paint; transform and opacity are composited.
2. **Duration comes from `duration`, easing from `easing`.** No literal `300ms`, no `ease-in-out`. `duration` values are numbers in ms — web needs `${duration.base}ms`, Reanimated takes the number directly.
3. **Entrances use `easing.standard`. Exits use `easing.exit` at one step faster.** In-out is a bug, not a taste.
4. **`prefers-reduced-motion` is a hard requirement, not a nicety.** Every animation ships with a reduced path in the same commit. Reduce to an opacity fade or nothing — never leave motion running.
5. **Nothing interactive exceeds `duration.slow` (320ms).** Only one-off page/hero choreography may reach `duration.slower` (480ms).
6. **Animate on the compositor.** Reanimated 4 worklets on the UI thread; CSS transitions/`@keyframes` on web. Never drive layout from `requestAnimationFrame` or `setState` per frame.
7. **`easing.spring` is rationed.** Never on anything a user triggers more than a few times per session — no list-item presses, no menu toggles.
8. **Motion must be interruptible.** A user action mid-animation retargets it; it never queues or blocks input.

## The Token Scale

```ts
import { duration, easing } from '@moves/design-tokens';

duration.instant // 80  — press feedback, checkbox tick, hover colour
duration.fast    // 140 — tooltips, dropdown open, small state change
duration.base    // 220 — DEFAULT. Cards, modals, most entrances
duration.slow    // 320 — full-screen sheets, large surfaces, page sections
duration.slower  // 480 — hero choreography only. Never on interaction.

easing.standard  // cubic-bezier(0.2, 0, 0, 1)     — decelerate in. Default.
easing.exit      // cubic-bezier(0.4, 0, 1, 1)     — accelerate away.
easing.spring    // cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot. Sparingly.
```

Pairing table — memorise it:

| Intent | Duration | Easing |
|---|---|---|
| Press / hover feedback | `instant` | `standard` |
| Tooltip, dropdown, toast in | `fast` | `standard` |
| Card, modal, sheet in | `base` | `standard` |
| Anything out | one step faster than its in | `exit` |
| Full-screen route transition | `slow` | `standard` |
| Hero / first-paint reveal | `slower` | `standard` |

## Web: CSS Custom Properties

Tokens are emitted as `--mv-duration-*` and `--mv-ease-*`. Use them.

```css
/* packages/ui/src/styles/motion.css */
.mv-button {
  transition:
    transform var(--mv-duration-instant) var(--mv-ease-standard),
    opacity   var(--mv-duration-instant) var(--mv-ease-standard),
    background-color var(--mv-duration-fast) var(--mv-ease-standard);
}
.mv-button:active { transform: scale(0.97); }

@keyframes mv-enter {
  from { opacity: 0; transform: translate3d(0, 8px, 0) scale(0.98); }
  to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes mv-exit {
  from { opacity: 1; transform: translate3d(0, 0, 0); }
  to   { opacity: 0; transform: translate3d(0, 4px, 0); }
}

[data-state='open']   { animation: mv-enter var(--mv-duration-base) var(--mv-ease-standard) both; }
[data-state='closed'] { animation: mv-exit  var(--mv-duration-fast) var(--mv-ease-exit) both; }

/* Hard requirement. Last rule in the file so it always wins. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Web: Reduced Motion in JS

```ts
// packages/ui/src/motion/useReducedMotion.ts
'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // SSR: assume motion allowed, CSS media query still guards
  );
}
```

## Web: Accessible Scroll Reveal

`IntersectionObserver` only. Never a scroll listener. Reveal once, then unobserve. Content is visible in the DOM from the first paint — opacity is the only thing withheld, so it never blocks SSR, crawlers, or find-in-page.

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { duration, easing, space } from '@moves/design-tokens';
import { useReducedMotion } from './useReducedMotion';

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.unobserve(entry.target); // one-shot. Never re-hide on scroll up.
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translate3d(0, ${space[3]}px, 0)`,
        transition: reduced
          ? 'none'
          : `opacity ${duration.base}ms ${easing.standard} ${delay}ms, transform ${duration.base}ms ${easing.standard} ${delay}ms`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
```

Stagger with `delay = index * 60` and cap the sequence at ~5 items. A twelve-item stagger is a loading screen.

## Web: View Transitions API

Use it for route and shared-element transitions. Progressive enhancement — if `startViewTransition` is missing, the navigation just happens.

```css
::view-transition-old(root) { animation: mv-exit  var(--mv-duration-fast) var(--mv-ease-exit) both; }
::view-transition-new(root) { animation: mv-enter var(--mv-duration-base) var(--mv-ease-standard) both; }

/* Shared element: same view-transition-name on both pages. Names must be unique per page. */
.mv-card-hero { view-transition-name: card-hero; contain: layout; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```

```ts
export function withViewTransition(update: () => void) {
  if (typeof document === 'undefined' || !('startViewTransition' in document)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return update();
  }
  document.startViewTransition(update);
}
```

Never assign the same `view-transition-name` to two elements in one document — the transition silently aborts.

## Native: Reanimated 4

`useSharedValue` + `useAnimatedStyle` + `withTiming`. Never `Animated` from `react-native` core, never `useState` per frame, never `LayoutAnimation` for anything you can express as a transform.

```tsx
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  Easing, useReducedMotion, FadeIn, FadeOut,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { duration, space } from '@moves/design-tokens';

// The token strings are CSS beziers; mirror the same control points for Reanimated.
export const ease = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  exit: Easing.bezier(0.4, 0, 1, 1),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

export function PressableScale({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  const reduced = useReducedMotion(); // Reanimated 4 reads the OS setting for you
  const scale = useSharedValue(1);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const set = (to: number) => {
    if (reduced) return;
    scale.value = withTiming(to, { duration: duration.instant, easing: ease.standard });
  };

  return (
    <Pressable onPressIn={() => set(0.97)} onPressOut={() => set(1)} onPress={onPress} hitSlop={8}>
      <Animated.View style={animated}>{children}</Animated.View>
    </Pressable>
  );
}

export function Card({ index = 0, children }: { index?: number; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (reduced) { progress.value = 1; return; }
    progress.value = withDelay(index * 60, withTiming(1, { duration: duration.base, easing: ease.standard }));
  }, [index, reduced, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * space[3] }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

// Layout animations: entering/exiting only, and always duration-tokened.
export const enter = FadeIn.duration(duration.base);
export const exit = FadeOut.duration(duration.fast);
```

Native rules: worklets must not close over React state — read from shared values. Never `runOnJS` inside a per-frame `useAnimatedStyle`. Gestures use `react-native-gesture-handler` v2 (`Gesture.Pan()`), never `PanResponder`. Prefer `withTiming` with a token duration over `withSpring` — springs have no duration token and will drift from web.

## 60fps Rules

- Transform and opacity only. If you must "resize", animate `scaleX/scaleY` on a wrapper.
- No animation on an element that also triggers reflow (`offsetHeight` reads, `getBoundingClientRect` in a scroll handler).
- `will-change` set only while animating, then removed. Permanent `will-change` is a permanent GPU layer leak.
- No shadow or blur animation — animate the opacity of a pre-rendered shadow layer instead.
- Native: no `console.log` in a worklet, no JS-thread state per frame, images sized before animating.
- Max one hero animation per viewport. Concurrent independent animations are noise.
- Web: profile with the Performance panel. Native: Perf Monitor must hold UI at 60 and JS above 55.

## Red Flags

- A literal duration (`300ms`, `0.3s`) or easing (`ease-in-out`, `linear`) instead of a token.
- `transition: all`. Enumerate the properties.
- Animating `width`, `height`, `top`, `left`, `margin`, `box-shadow`, or `filter`.
- Any animation shipped without a `prefers-reduced-motion` path.
- A `scroll` event listener driving reveals instead of `IntersectionObserver`.
- Reveal that re-hides content on scroll-up, or content that is `display: none` until revealed.
- `Animated` from `react-native` core, `PanResponder`, or `LayoutAnimation` in new code.
- `useState`/`setState` inside an animation frame loop.
- `withSpring` with hand-tuned damping constants scattered across files.
- `easing.spring` on a button, list row, or anything pressed repeatedly.
- Two elements sharing one `view-transition-name`.
- `will-change` left on an element after the animation ends.
- Anything interactive over 320ms, or a "delightful" 800ms hero on every route change.
