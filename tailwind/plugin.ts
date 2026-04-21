/**
 * animix — Tailwind CSS v3/v4 Plugin
 *
 * Usage in tailwind.config.ts:
 *   import animix from 'animix/tailwind'
 *   export default { plugins: [animix()] }
 *
 * Then use Tailwind utilities directly:
 *   <div class="animate-animix-fade-in duration-300 delay-150 ease-spring" />
 */

import plugin from 'tailwindcss/plugin';

/* ── Shared keyframe definitions ───────────────────────────────── */
// Defined once; registered both in theme.extend.keyframes (so
// Tailwind's JIT can purge/tree-shake them) and in addBase (so
// pure-CSS users that import the stylesheet get them too).

const keyframes = {
  /* Entrance */
  'animix-fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'animix-slide-up-in': {
    from: { opacity: '0', transform: 'translateY(var(--animix-slide-distance,16px))' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'animix-slide-down-in': {
    from: { opacity: '0', transform: 'translateY(calc(-1 * var(--animix-slide-distance,16px)))' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'animix-slide-left-in': {
    from: { opacity: '0', transform: 'translateX(var(--animix-slide-distance,16px))' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'animix-slide-right-in': {
    from: { opacity: '0', transform: 'translateX(calc(-1 * var(--animix-slide-distance,16px)))' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'animix-scale-up-in': {
    from: { opacity: '0', transform: 'scale(var(--animix-scale-start,0.95))' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
  'animix-scale-down-in': {
    from: { opacity: '0', transform: 'scale(1.05)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
  'animix-flip-x-in': {
    from: { opacity: '0', transform: 'perspective(400px) rotateX(-90deg)' },
    to: { opacity: '1', transform: 'perspective(400px) rotateX(0deg)' },
  },
  'animix-flip-y-in': {
    from: { opacity: '0', transform: 'perspective(400px) rotateY(-90deg)' },
    to: { opacity: '1', transform: 'perspective(400px) rotateY(0deg)' },
  },
  'animix-rotate-in': {
    from: { opacity: '0', transform: 'rotate(-180deg) scale(0.8)' },
    to: { opacity: '1', transform: 'rotate(0deg) scale(1)' },
  },
  'animix-bounce-in': {
    '0%': { opacity: '0', transform: 'scale(0.3)' },
    '50%': { opacity: '1', transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '85%': { transform: 'scale(1.02)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  'animix-elastic-in': {
    '0%': { opacity: '0', transform: 'scale(0)' },
    '55%': { opacity: '1', transform: 'scale(1.1)' },
    '70%': { transform: 'scale(0.95)' },
    '85%': { transform: 'scale(1.025)' },
    '92%': { transform: 'scale(0.99)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  'animix-blur-in': {
    from: { opacity: '0', filter: 'blur(8px)', transform: 'scale(1.02)' },
    to: { opacity: '1', filter: 'blur(0px)', transform: 'scale(1)' },
  },

  /* Exit */
  'animix-fade-out': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  'animix-slide-up-out': {
    from: { opacity: '1', transform: 'translateY(0)' },
    to: { opacity: '0', transform: 'translateY(calc(-1 * var(--animix-slide-distance,16px)))' },
  },
  'animix-slide-down-out': {
    from: { opacity: '1', transform: 'translateY(0)' },
    to: { opacity: '0', transform: 'translateY(var(--animix-slide-distance,16px))' },
  },
  'animix-slide-left-out': {
    from: { opacity: '1', transform: 'translateX(0)' },
    to: { opacity: '0', transform: 'translateX(calc(-1 * var(--animix-slide-distance,16px)))' },
  },
  'animix-slide-right-out': {
    from: { opacity: '1', transform: 'translateX(0)' },
    to: { opacity: '0', transform: 'translateX(var(--animix-slide-distance,16px))' },
  },
  'animix-scale-up-out': {
    from: { opacity: '1', transform: 'scale(1)' },
    to: { opacity: '0', transform: 'scale(1.05)' },
  },
  'animix-scale-down-out': {
    from: { opacity: '1', transform: 'scale(1)' },
    to: { opacity: '0', transform: 'scale(var(--animix-scale-start,0.95))' },
  },
  'animix-flip-x-out': {
    from: { opacity: '1', transform: 'perspective(400px) rotateX(0deg)' },
    to: { opacity: '0', transform: 'perspective(400px) rotateX(90deg)' },
  },
  'animix-flip-y-out': {
    from: { opacity: '1', transform: 'perspective(400px) rotateY(0deg)' },
    to: { opacity: '0', transform: 'perspective(400px) rotateY(90deg)' },
  },
  'animix-rotate-out': {
    from: { opacity: '1', transform: 'rotate(0deg) scale(1)' },
    to: { opacity: '0', transform: 'rotate(180deg) scale(0.8)' },
  },
  'animix-blur-out': {
    from: { opacity: '1', filter: 'blur(0px)', transform: 'scale(1)' },
    to: { opacity: '0', filter: 'blur(8px)', transform: 'scale(0.98)' },
  },

  /* Attention */
  'animix-pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.45' },
  },
  'animix-bounce': {
    '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
    '50%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
  },
  'animix-shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-6px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(6px)' },
  },
  'animix-wiggle': {
    '0%, 100%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(-7deg)' },
    '75%': { transform: 'rotate(7deg)' },
  },
  'animix-ping': {
    '0%': { transform: 'scale(1)', opacity: '1' },
    '75%, 100%': { transform: 'scale(2)', opacity: '0' },
  },
  'animix-float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  'animix-heartbeat': {
    '0%': { transform: 'scale(1)' },
    '14%': { transform: 'scale(1.2)' },
    '28%': { transform: 'scale(1)' },
    '42%': { transform: 'scale(1.2)' },
    '70%, 100%': { transform: 'scale(1)' },
  },
  'animix-jello': {
    '0%, 11.1%, 100%': { transform: 'skewX(0deg) skewY(0deg)' },
    '22.2%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
    '33.3%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
    '44.4%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
    '55.5%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
    '66.6%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
    '77.7%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
    '88.8%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
  },
  'animix-rubber-band': {
    '0%': { transform: 'scale(1,1)' },
    '30%': { transform: 'scale(1.25,0.75)' },
    '40%': { transform: 'scale(0.75,1.25)' },
    '50%': { transform: 'scale(1.15,0.85)' },
    '65%': { transform: 'scale(0.95,1.05)' },
    '75%': { transform: 'scale(1.05,0.95)' },
    '100%': { transform: 'scale(1,1)' },
  },
  'animix-tada': {
    '0%': { transform: 'scale(1) rotate(0deg)' },
    '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
    '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
    '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
    '100%': { transform: 'scale(1) rotate(0deg)' },
  },
  'animix-swing': {
    '0%': { transform: 'rotate(0deg)' },
    '20%': { transform: 'rotate(15deg)' },
    '40%': { transform: 'rotate(-10deg)' },
    '60%': { transform: 'rotate(5deg)' },
    '80%': { transform: 'rotate(-5deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
  'animix-wobble': {
    '0%': { transform: 'translateX(0%)' },
    '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
    '30%': { transform: 'translateX(20%) rotate(3deg)' },
    '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
    '60%': { transform: 'translateX(10%) rotate(2deg)' },
    '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
    '100%': { transform: 'translateX(0%)' },
  },

  /* Loaders */
  'animix-spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  'animix-skeleton-shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },

  /* Page + overlay (parity with transitions.css / shadcn-presets) */
  'animix-page-fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'animix-page-fade-out': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  'animix-page-slide-in': {
    from: { opacity: '0', transform: 'translateX(var(--animix-slide-distance,16px))' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'animix-page-slide-out': {
    from: { opacity: '1', transform: 'translateX(0)' },
    to: { opacity: '0', transform: 'translateX(calc(-1 * var(--animix-slide-distance,16px)))' },
  },
  'animix-overlay-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'animix-overlay-out': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },

  /* Transitions */
  'animix-modal-in': {
    from: { opacity: '0', transform: 'scale(0.95) translateY(-8px)' },
    to: { opacity: '1', transform: 'scale(1) translateY(0)' },
  },
  'animix-modal-out': {
    from: { opacity: '1', transform: 'scale(1) translateY(0)' },
    to: { opacity: '0', transform: 'scale(0.95) translateY(-8px)' },
  },
  'animix-drawer-in-right': {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  'animix-drawer-out-right': {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(100%)' },
  },
  'animix-drawer-in-left': {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
  'animix-drawer-out-left': {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(-100%)' },
  },
  'animix-drawer-in-bottom': {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
  'animix-drawer-out-bottom': {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(100%)' },
  },
  'animix-drawer-in-top': {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  'animix-drawer-out-top': {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(-100%)' },
  },
  'animix-toast-in-right': {
    from: { opacity: '0', transform: 'translateX(calc(100% + 1.5rem))' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'animix-toast-out-right': {
    from: { opacity: '1', transform: 'translateX(0)' },
    to: { opacity: '0', transform: 'translateX(calc(100% + 1.5rem))' },
  },
  'animix-toast-in-bottom': {
    from: { opacity: '0', transform: 'translateY(calc(100% + 1.5rem))' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'animix-toast-out-bottom': {
    from: { opacity: '1', transform: 'translateY(0)' },
    to: { opacity: '0', transform: 'translateY(calc(100% + 1.5rem))' },
  },
  'animix-tooltip-in': {
    from: { opacity: '0', transform: 'scale(0.9)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
  'animix-tooltip-out': {
    from: { opacity: '1', transform: 'scale(1)' },
    to: { opacity: '0', transform: 'scale(0.9)' },
  },
} as const;

/* ── animation shorthand values ────────────────────────────────── */
// These map to Tailwind's animate-* utilities. Timing uses CSS
// vars so users can override them inline.

const animations = {
  /* Entrance */
  'fade-in':
    'animix-fade-in var(--animix-duration-base,300ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'slide-up':
    'animix-slide-up-in var(--animix-duration-base,300ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'slide-down':
    'animix-slide-down-in var(--animix-duration-base,300ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'slide-left':
    'animix-slide-left-in var(--animix-duration-base,300ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'slide-right':
    'animix-slide-right-in var(--animix-duration-base,300ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'scale-up':
    'animix-scale-up-in var(--animix-duration-base,300ms) var(--animix-ease-spring,cubic-bezier(0.34,1.56,0.64,1)) var(--animix-delay,0ms) both',
  'scale-down':
    'animix-scale-down-in var(--animix-duration-base,300ms) var(--animix-ease-spring,cubic-bezier(0.34,1.56,0.64,1)) var(--animix-delay,0ms) both',
  'flip-x':
    'animix-flip-x-in var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'flip-y':
    'animix-flip-y-in var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'rotate-in':
    'animix-rotate-in var(--animix-duration-slow,500ms) var(--animix-ease-spring,cubic-bezier(0.34,1.56,0.64,1)) var(--animix-delay,0ms) both',
  'bounce-in':
    'animix-bounce-in var(--animix-duration-slow,500ms) ease var(--animix-delay,0ms) both',
  'elastic-in':
    'animix-elastic-in var(--animix-duration-slow,500ms) ease var(--animix-delay,0ms) both',
  'blur-in':
    'animix-blur-in var(--animix-duration-base,300ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  /* Exit */
  'fade-out':
    'animix-fade-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'slide-up-out':
    'animix-slide-up-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'slide-down-out':
    'animix-slide-down-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'slide-left-out':
    'animix-slide-left-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'slide-right-out':
    'animix-slide-right-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'scale-up-out':
    'animix-scale-up-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'scale-down-out':
    'animix-scale-down-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'flip-x-out':
    'animix-flip-x-out var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'flip-y-out':
    'animix-flip-y-out var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'rotate-out':
    'animix-rotate-out var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'blur-out':
    'animix-blur-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  /* Attention */
  pulse:
    'animix-pulse var(--animix-duration-slower,800ms) var(--animix-ease-default,cubic-bezier(0.4,0,0.2,1)) var(--animix-delay,0ms) both infinite',
  'bounce-attention':
    'animix-bounce var(--animix-duration-slower,800ms) ease var(--animix-delay,0ms) both infinite',
  shake: 'animix-shake var(--animix-duration-slow,500ms) ease var(--animix-delay,0ms) both',
  wiggle: 'animix-wiggle 600ms ease var(--animix-delay,0ms) both infinite',
  ping: 'animix-ping 1s cubic-bezier(0,0,0.2,1) var(--animix-delay,0ms) both infinite',
  float: 'animix-float 3s ease var(--animix-delay,0ms) both infinite',
  heartbeat: 'animix-heartbeat 1.4s ease var(--animix-delay,0ms) both infinite',
  jello: 'animix-jello var(--animix-duration-slower,800ms) ease var(--animix-delay,0ms) both',
  'rubber-band':
    'animix-rubber-band var(--animix-duration-slower,800ms) ease var(--animix-delay,0ms) both',
  tada: 'animix-tada var(--animix-duration-slower,800ms) ease var(--animix-delay,0ms) both',
  swing: 'animix-swing var(--animix-duration-slower,800ms) ease var(--animix-delay,0ms) both',
  wobble: 'animix-wobble var(--animix-duration-slower,800ms) ease var(--animix-delay,0ms) both',
  /* Loaders */
  spin: 'animix-spin 600ms linear var(--animix-delay,0ms) infinite',
  skeleton: 'animix-skeleton-shimmer 1.6s ease-in-out infinite',
  /* Page + overlay */
  'page-fade-in':
    'animix-page-fade-in var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'page-fade-out':
    'animix-page-fade-out var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'page-slide-in':
    'animix-page-slide-in var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'page-slide-out':
    'animix-page-slide-out var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  'overlay-in':
    'animix-overlay-in var(--animix-duration-base,300ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) var(--animix-delay,0ms) both',
  'overlay-out':
    'animix-overlay-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) var(--animix-delay,0ms) both',
  /* Transitions */
  'modal-in':
    'animix-modal-in var(--animix-duration-base,300ms) var(--animix-ease-spring,cubic-bezier(0.34,1.56,0.64,1)) both',
  'modal-out':
    'animix-modal-out var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
  'drawer-in-right':
    'animix-drawer-in-right var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) both',
  'drawer-out-right':
    'animix-drawer-out-right var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
  'drawer-in-left':
    'animix-drawer-in-left var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) both',
  'drawer-out-left':
    'animix-drawer-out-left var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
  'drawer-in-bottom':
    'animix-drawer-in-bottom var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) both',
  'drawer-out-bottom':
    'animix-drawer-out-bottom var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
  'drawer-in-top':
    'animix-drawer-in-top var(--animix-duration-slow,500ms) var(--animix-ease-out,cubic-bezier(0,0,0.2,1)) both',
  'drawer-out-top':
    'animix-drawer-out-top var(--animix-duration-slow,500ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
  'toast-in':
    'animix-toast-in-right var(--animix-duration-base,300ms) var(--animix-ease-spring,cubic-bezier(0.34,1.56,0.64,1)) both',
  'toast-out':
    'animix-toast-out-right var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
  'toast-in-bottom':
    'animix-toast-in-bottom var(--animix-duration-base,300ms) var(--animix-ease-spring,cubic-bezier(0.34,1.56,0.64,1)) both',
  'toast-out-bottom':
    'animix-toast-out-bottom var(--animix-duration-base,300ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
  'tooltip-in':
    'animix-tooltip-in var(--animix-duration-fast,150ms) var(--animix-ease-spring,cubic-bezier(0.34,1.56,0.64,1)) both',
  'tooltip-out':
    'animix-tooltip-out var(--animix-duration-fast,150ms) var(--animix-ease-in,cubic-bezier(0.4,0,1,1)) both',
} as const;

/* ── Custom easing values ───────────────────────────────────────── */
const transitionTimingFunction = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
};

/* ── Plugin factory ─────────────────────────────────────────────── */

interface AnimixOptions {
  /** Prefix for generated animate-* utilities. Default: '' (no extra prefix) */
  prefix?: string;
}

const animixPlugin = plugin.withOptions<AnimixOptions>(
  (_options = {}) =>
    ({ addBase, addUtilities, matchUtilities, theme }) => {
      /* 1. CSS custom property tokens */
      addBase({
        ':root': {
          '--animix-duration-fast': '150ms',
          '--animix-duration-base': '300ms',
          '--animix-duration-slow': '500ms',
          '--animix-duration-slower': '800ms',
          '--animix-ease-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
          '--animix-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
          '--animix-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
          '--animix-ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          '--animix-ease-bounce': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          '--animix-slide-distance': '16px',
          '--animix-scale-start': '0.95',
          '--animix-delay': '0ms',
          '--animix-stagger-delay': '75ms',
          '--animix-stagger-index': '0',
          '--animix-fill-mode': 'both',
          '--animix-iteration': '1',
          '--animix-skeleton-base': 'hsl(0, 0%, 88%)',
          '--animix-skeleton-highlight': 'hsl(0, 0%, 96%)',
        },
        '@media (prefers-reduced-motion: reduce)': {
          ':root': {
            '--animix-duration-fast': '0ms',
            '--animix-duration-base': '0ms',
            '--animix-duration-slow': '0ms',
            '--animix-duration-slower': '0ms',
          },
        },
        '.dark, [data-theme="dark"]': {
          '--animix-skeleton-base': 'hsl(0, 0%, 18%)',
          '--animix-skeleton-highlight': 'hsl(0, 0%, 26%)',
        },
        '.animix-no-motion, .animix-no-motion *, .animix-no-motion *::before, .animix-no-motion *::after':
          {
            'animation-duration': '0ms !important',
            'animation-delay': '0ms !important',
            'transition-duration': '0ms !important',
            'transition-delay': '0ms !important',
          },
      });

      /* 2. Dynamic animate-* utilities driven by theme values */
      const themeAnimations = theme('animation') as Record<string, string>;
      const animateUtils: Record<string, Record<string, string>> = {};
      for (const [key, value] of Object.entries(themeAnimations)) {
        if (key.startsWith('animix-') || key in animations) {
          animateUtils[`.animate-${key}`] = { animation: value };
        }
      }
      addUtilities(animateUtils);

      /* 3. Delay utilities: delay-{n} */
      matchUtilities(
        { 'animix-delay': (value) => ({ 'animation-delay': value }) },
        { values: theme('transitionDelay') as Record<string, string> },
      );

      /* 4. Stagger utilities */
      addUtilities({
        '.animix-stagger > *': {
          'animation-delay':
            'calc(var(--animix-stagger-delay, 75ms) * var(--animix-stagger-index, 0))',
        },
        '.animix-stagger-25': { '--animix-stagger-delay': '25ms' },
        '.animix-stagger-50': { '--animix-stagger-delay': '50ms' },
        '.animix-stagger-75': { '--animix-stagger-delay': '75ms' },
        '.animix-stagger-100': { '--animix-stagger-delay': '100ms' },
        '.animix-stagger-150': { '--animix-stagger-delay': '150ms' },
      });

      /* 5. Play-state utilities */
      addUtilities({
        '.animix-paused': { 'animation-play-state': 'paused' },
        '.animix-running': { 'animation-play-state': 'running' },
      });

      /* 6. Hover / focus triggers */
      addUtilities({
        '.animix-on-hover [class*="animix-"], .animix-on-hover [class*="animate-"]': {
          'animation-play-state': 'paused',
        },
        '.animix-on-hover:hover [class*="animix-"], .animix-on-hover:hover [class*="animate-"]': {
          'animation-play-state': 'running',
        },
        '.animix-on-focus [class*="animix-"], .animix-on-focus [class*="animate-"]': {
          'animation-play-state': 'paused',
        },
        '.animix-on-focus:focus-visible [class*="animix-"], .animix-on-focus:focus-visible [class*="animate-"]':
          {
            'animation-play-state': 'running',
          },
      });
    },

  /* ── Theme extension ─────────────────────────────────────────── */
  (_options = {}) => ({
    theme: {
      extend: {
        keyframes,
        animation: Object.fromEntries(
          Object.entries(animations).map(([k, v]) => [`animix-${k}`, v]),
        ),
        transitionTimingFunction,
      },
    },
  }),
);

export default animixPlugin;
