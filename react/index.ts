/**
 * animix/react — React bindings entry point
 */

export { Animate, AnimateStagger } from './Animate';
export type {
  AnimateProps,
  AnimateStaggerProps,
  AnimationName,
  MotionIntent,
  EntranceAnimation,
  ExitAnimation,
  AttentionAnimation,
  TransitionAnimation,
} from './Animate';

export { AnimatePresence } from './AnimatePresence';
export type { AnimatePresenceProps, PresenceMode } from './AnimatePresence';

export { useAnimation, useInView, usePrefersReducedMotion } from './useAnimation';
export type {
  UseAnimationOptions,
  UseAnimationControls,
  UseInViewOptions,
  AnimationState,
} from './useAnimation';
