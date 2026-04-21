/**
 * animix/react — React bindings entry point
 */

export { Animate, AnimateStagger } from './Animate';
export type {
  AnimateProps,
  AnimateStaggerProps,
  AnimationName,
  EntranceAnimation,
  ExitAnimation,
  AttentionAnimation,
  TransitionAnimation,
} from './Animate';

export { useAnimation, useInView } from './useAnimation';
export type {
  UseAnimationOptions,
  UseAnimationControls,
  UseInViewOptions,
  AnimationState,
} from './useAnimation';
