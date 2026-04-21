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

export { useAnimation, useInView, usePrefersReducedMotion } from './useAnimation';
export type {
  UseAnimationOptions,
  UseAnimationControls,
  UseInViewOptions,
  AnimationState,
} from './useAnimation';
