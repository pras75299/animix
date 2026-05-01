/**
 * animix — useAnimation hook
 *
 * Provides imperative control over a CSS animation running on
 * a DOM element referenced by a React ref.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { play, pause, reverse, reset, state } = useAnimation(ref, {
 *     animation: 'animix-fade-in',
 *     duration: 300,
 *     easing: 'cubic-bezier(0,0,0.2,1)',
 *   });
 */

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/* ── Types ──────────────────────────────────────────────────────── */

export type AnimationState = 'idle' | 'running' | 'paused' | 'finished' | 'reversed';

export interface UseAnimationOptions {
  /**
   * CSS animation-name to apply (e.g. 'animix-fade-in').
   * If omitted, the hook controls whatever animation is already
   * defined on the element via its class list.
   */
  animation?: string;
  /** Duration in ms. Applied as inline style override. */
  duration?: number;
  /** CSS timing-function string. */
  easing?: string;
  /** Delay in ms. */
  delay?: number;
  /** iteration-count ('infinite' or a number). */
  repeat?: number | 'infinite';
  /** fill-mode. Default: 'both'. */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  /** Called when the animation starts. */
  onStart?: () => void;
  /** Called when the animation completes (not on cancel). */
  onEnd?: () => void;
}

export interface UseAnimationControls {
  /** Start (or restart) the animation from the beginning. */
  play: () => void;
  /** Pause the animation at its current position. */
  pause: () => void;
  /** Resume from the paused position. */
  resume: () => void;
  /** Play the animation in reverse. */
  reverse: () => void;
  /** Remove all animation state and return to idle. */
  reset: () => void;
  /** Current animation lifecycle state. */
  state: AnimationState;
}

/* ── Hook ───────────────────────────────────────────────────────── */

export function useAnimation(
  ref: RefObject<HTMLElement>,
  options: UseAnimationOptions = {},
): UseAnimationControls {
  const { animation, duration, easing, delay = 0, repeat = 1, fillMode = 'both' } = options;

  const [state, setState] = useState<AnimationState>('idle');
  const resolveAnimationName = useCallback(
    (el: HTMLElement): string => {
      if (animation) {
        return animation;
      }
      if (el.style.animationName) {
        return el.style.animationName;
      }
      const computed = getComputedStyle(el).animationName || '';
      if (!computed || computed === 'none') {
        return '';
      }
      // If multiple animation names are present, re-run the first one by default.
      return computed.split(',')[0]?.trim() ?? '';
    },
    [animation],
  );

  const cleanupRef = useRef<(() => void) | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /* Apply inline animation overrides to the element */
  const applyStyles = useCallback(
    (el: HTMLElement, animName: string, direction: 'normal' | 'reverse') => {
      el.style.animationName = animName;
      el.style.animationDuration = typeof duration === 'number' ? `${duration}ms` : '';
      el.style.animationTimingFunction = easing ?? '';
      el.style.animationDelay = delay ? `${delay}ms` : '';
      el.style.animationIterationCount = repeat === 'infinite' ? 'infinite' : String(repeat);
      el.style.animationFillMode = fillMode;
      el.style.animationDirection = direction;
      el.style.animationPlayState = 'running';
    },
    [duration, easing, delay, repeat, fillMode],
  );

  const clearStyles = useCallback((el: HTMLElement) => {
    el.style.animationName = '';
    el.style.animationDuration = '';
    el.style.animationTimingFunction = '';
    el.style.animationDelay = '';
    el.style.animationIterationCount = '';
    el.style.animationFillMode = '';
    el.style.animationDirection = '';
    el.style.animationPlayState = '';
  }, []);

  /* Shared listener attach */
  const attachListeners = useCallback((el: HTMLElement) => {
    const handleStart = () => {
      setState('running');
      optionsRef.current.onStart?.();
    };
    const handleEnd = () => {
      setState('finished');
      optionsRef.current.onEnd?.();
    };
    const handleCancel = () => {
      setState('idle');
    };

    el.addEventListener('animationstart', handleStart);
    el.addEventListener('animationend', handleEnd);
    el.addEventListener('animationcancel', handleCancel);

    return () => {
      el.removeEventListener('animationstart', handleStart);
      el.removeEventListener('animationend', handleEnd);
      el.removeEventListener('animationcancel', handleCancel);
    };
  }, []);

  /* play ──────────────────────────────────────────────────────── */
  const play = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    // Remove any leftover listeners
    cleanupRef.current?.();

    const animName = resolveAnimationName(el);
    if (!animName) {
      console.warn(
        '[animix] useAnimation.play(): no animation found. Pass options.animation or ensure the element has a CSS animation class applied.',
      );
      return;
    }

    // Reset animation by removing it momentarily (browser reflow trick)
    el.style.animationName = 'none';
    // Force reflow
    void el.offsetWidth;

    applyStyles(el, animName, 'normal');
    cleanupRef.current = attachListeners(el);
    setState('running');
  }, [ref, resolveAnimationName, applyStyles, attachListeners]);

  /* pause ─────────────────────────────────────────────────────── */
  const pause = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.animationPlayState = 'paused';
    setState('paused');
  }, [ref]);

  /* resume ────────────────────────────────────────────────────── */
  const resume = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.animationPlayState = 'running';
    setState('running');
  }, [ref]);

  /* reverse ───────────────────────────────────────────────────── */
  const reverse = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    cleanupRef.current?.();

    const animName = resolveAnimationName(el);
    if (!animName) {
      console.warn(
        '[animix] useAnimation.reverse(): no animation found. Pass options.animation or ensure the element has a CSS animation class applied.',
      );
      return;
    }

    el.style.animationName = 'none';
    void el.offsetWidth;

    applyStyles(el, animName, 'reverse');
    cleanupRef.current = attachListeners(el);
    setState('reversed');
  }, [ref, resolveAnimationName, applyStyles, attachListeners]);

  /* reset ─────────────────────────────────────────────────────── */
  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    cleanupRef.current?.();
    clearStyles(el);
    setState('idle');
  }, [ref, clearStyles]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return { play, pause, resume, reverse, reset, state };
}

/* ── useInView ──────────────────────────────────────────────────── */

export interface UseInViewOptions {
  /** Intersection threshold 0–1. Default: 0.1 */
  threshold?: number;
  /** Only trigger once. Default: true */
  once?: boolean;
  /** Root margin for the observer. Default: '0px' */
  rootMargin?: string;
}

/**
 * Returns true when the referenced element enters the viewport.
 *
 *   const ref = useRef<HTMLDivElement>(null);
 *   const inView = useInView(ref);
 *   // <div ref={ref} className={inView ? 'animix-in-fade' : ''} />
 */
export function useInView(ref: RefObject<HTMLElement>, options: UseInViewOptions = {}): boolean {
  const { threshold = 0.1, once = true, rootMargin = '0px' } = options;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true); // SSR / no observer: treat as in view
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once, rootMargin]);

  return inView;
}

/**
 * Tracks `prefers-reduced-motion` for conditional rendering or class toggles.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}
