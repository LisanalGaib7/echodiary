/**
 * Motion tokens — single source of truth for animation timing and easing.
 *
 * These mirror the CSS custom properties defined in `src/styles.css`
 * (`--duration-*`, `--ease-*`). Change values here AND in styles.css together,
 * or read from `getComputedStyle(document.documentElement)` at runtime.
 *
 * Usage from JS/TS (Framer Motion, setTimeout, etc.):
 *   import { DURATION, EASE } from "@/lib/motion";
 *   transition={{ duration: DURATION.md / 1000, ease: EASE.out }}
 *
 * Usage from CSS/Tailwind:
 *   transition: opacity var(--duration-md) var(--ease-out);
 *   className="animate-reveal"   // uses tokens internally
 */

export const DURATION = {
  /** micro interactions: hover tints, focus ring */
  xs: 120,
  /** small state swaps: pill press, caret, small fades */
  sm: 200,
  /** default UI transitions: buttons, toasts, tabs */
  md: 320,
  /** page enter, section reveal */
  lg: 500,
  /** cinematic hero reveal, blur clear */
  xl: 900,
} as const;

export const EASE = {
  /** ease-out — default for entering elements */
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** ease-in — for exits */
  in: "cubic-bezier(0.55, 0, 0.68, 0.19)",
  /** ease-in-out — for shared-element moves */
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** subtle spring-like overshoot for playful states */
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** linear — for progress bars, loading */
  linear: "linear",
} as const;

/** Stagger delays for lists / table rows (ms). */
export const STAGGER = {
  tight: 30,
  base: 60,
  loose: 90,
} as const;

export type DurationKey = keyof typeof DURATION;
export type EaseKey = keyof typeof EASE;
