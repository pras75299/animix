/**
 * animix — <Animate> wrapper component
 *
 * Wraps any element or component with configurable CSS animations.
 * Zero runtime JS for mount/attention animations — just applies
 * the right CSS classes. JS is only needed for 'inView' and
 * 'manual' triggers, and exit animations on unmount.
 */

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

import { useComposedRefs } from './composeRefs';

/* ── Animation name catalog ─────────────────────────────────────── */

export type EntranceAnimation =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-up'
  | 'scale-down'
  | 'flip-x'
  | 'flip-y'
  | 'rotate'
  | 'bounce'
  | 'elastic'
  | 'blur';

export type ExitAnimation =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-up'
  | 'scale-down'
  | 'flip-x'
  | 'flip-y'
  | 'rotate'
  | 'blur';

export type AttentionAnimation =
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'wiggle'
  | 'ping'
  | 'float'
  | 'heartbeat'
  | 'jello'
  | 'rubber-band'
  | 'tada'
  | 'swing'
  | 'wobble';

export type TransitionAnimation =
  | 'modal-in'
  | 'modal-out'
  | 'drawer-in-right'
  | 'drawer-out-right'
  | 'drawer-in-left'
  | 'drawer-out-left'
  | 'drawer-in-bottom'
  | 'drawer-out-bottom'
  | 'toast-in'
  | 'toast-out'
  | 'tooltip-in'
  | 'tooltip-out';

export type AnimationName = EntranceAnimation | AttentionAnimation | TransitionAnimation;

/** Optional intent presets append subtle interaction utility classes. */
export type MotionIntent = 'button' | 'icon' | 'text' | 'image';

const INTENT_UTILITY_CLASSES: Record<MotionIntent, string> = {
  button: 'animix-hover-lift animix-focus-soft animix-press-in',
  icon: 'animix-origin-center',
  text: 'animix-intensity-quiet',
  image: 'animix-intensity-quiet animix-origin-center',
};

/* ── Class name helpers ─────────────────────────────────────────── */

function getAnimationClass(
  name: AnimationName,
  type: 'in' | 'out' | 'attention' | 'transition',
): string {
  // Attention animations
  const attentionNames: AttentionAnimation[] = [
    'pulse',
    'bounce',
    'shake',
    'wiggle',
    'ping',
    'float',
    'heartbeat',
    'jello',
    'rubber-band',
    'tada',
    'swing',
    'wobble',
  ];

  if (type === 'attention' || attentionNames.includes(name as AttentionAnimation)) {
    return `animix-${name}`;
  }

  const transitionPrefixes = ['modal', 'drawer', 'toast', 'tooltip'];
  if (transitionPrefixes.some((p) => name.startsWith(p))) {
    return `animix-${name}`;
  }

  if (type === 'out') {
    return `animix-out-${name}`;
  }

  return `animix-in-${name}`;
}

function getDurationClass(duration: 'fast' | 'base' | 'slow' | 'slower' | number): string {
  if (typeof duration === 'number') {
    return ''; // handled via inline style
  }
  if (duration === 'base') {
    return '';
  }
  return `animix-${duration}`;
}

function getEasingClass(easing: 'default' | 'spring' | 'bounce' | 'in' | 'out'): string {
  if (easing === 'default') {
    return '';
  }
  return `animix-ease-${easing}`;
}

function getChildElementRef(child: ReactElement): Ref<HTMLElement> | undefined | null {
  const withRef = child as ReactElement & { ref?: Ref<HTMLElement> | null };
  return withRef.ref ?? undefined;
}

/* ── Props ──────────────────────────────────────────────────────── */

export interface AnimateProps {
  children: ReactNode;
  /** The animation to apply on entrance / play */
  animation: AnimationName;
  /**
   * Appends subtle utility classes for common UI roles (hover lift, focus ring,
   * intensity). Does not replace `animation`.
   */
  intent?: MotionIntent;
  /** When to trigger the animation. Default: 'mount' */
  trigger?: 'mount' | 'hover' | 'focus' | 'inView' | 'manual';
  /** Duration preset or explicit millisecond value. Default: 'base' (300ms) */
  duration?: 'fast' | 'base' | 'slow' | 'slower' | number;
  /** Delay in milliseconds. Default: 0 */
  delay?: number;
  /** Easing function. Default: 'default' */
  easing?: 'default' | 'spring' | 'bounce' | 'in' | 'out';
  /** Repeat count or 'infinite'. Default: 1 */
  repeat?: number | 'infinite';
  /** Animation to play while `exiting` is true (parent-driven exit phase) */
  exitAnimation?: ExitAnimation;
  /**
   * When true (with `exitAnimation`), applies exit classes instead of entrance.
   * Parent sets this to start exit, then removes the tree on `onAnimationEnd` or `animix:exit-complete`.
   */
  exiting?: boolean;
  /** Called when the animation starts */
  onStart?: () => void;
  /** Called when the animation ends */
  onEnd?: () => void;
  className?: string;
  /**
   * Radix UI asChild pattern: merge animation props onto the
   * single child element instead of wrapping in a <div>.
   */
  asChild?: boolean;
  /** InView threshold (0–1). Only used with trigger='inView'. Default: 0.1 */
  inViewThreshold?: number;
}

/* ── useSSRSafeLayoutEffect ─────────────────────────────────────── */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ── <Animate> ──────────────────────────────────────────────────── */

export const Animate = forwardRef<HTMLElement, AnimateProps>(function Animate(
  {
    children,
    animation,
    intent,
    trigger = 'mount',
    duration = 'base',
    delay = 0,
    easing = 'default',
    repeat = 1,
    exitAnimation,
    exiting = false,
    onStart,
    onEnd,
    className = '',
    asChild = false,
    inViewThreshold = 0.1,
  },
  forwardedRef,
) {
  const internalRef = useRef<HTMLElement | null>(null);

  const childRefForMerge =
    asChild && isValidElement(children) ? getChildElementRef(children as ReactElement) : undefined;

  const setRef = useComposedRefs<HTMLElement>({
    forwardedRef,
    internalRef,
    childRef: childRefForMerge,
  });

  const [isVisible, setIsVisible] = useState(trigger === 'mount');
  const [hasEntered, setHasEntered] = useState(false);

  /* Build CSS class list */
  const animClass =
    exiting && exitAnimation
      ? getAnimationClass(exitAnimation, 'out')
      : isVisible
        ? getAnimationClass(animation, 'in')
        : '';

  const durationClass = getDurationClass(duration);
  const easingClass = getEasingClass(easing);

  const intentClass = intent ? INTENT_UTILITY_CLASSES[intent] : '';

  const composedClass = [animClass, durationClass, easingClass, intentClass, className]
    .filter(Boolean)
    .join(' ');

  /* Inline style overrides for numeric values */
  const inlineStyle: Record<string, string | number> = {};
  if (typeof duration === 'number') {
    inlineStyle['--animix-duration-base'] = `${duration}ms`;
  }
  if (delay) {
    inlineStyle['--animix-delay'] = `${delay}ms`;
  }
  if (repeat !== 1) {
    inlineStyle['animationIterationCount'] = repeat === 'infinite' ? 'infinite' : repeat;
  }

  /* InView trigger via IntersectionObserver */
  useIsomorphicLayoutEffect(() => {
    if (trigger !== 'inView') {
      return;
    }
    const el = internalRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) {
          setIsVisible(true);
          setHasEntered(true);
        }
      },
      { threshold: inViewThreshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, inViewThreshold, hasEntered]);

  /* Event handlers */
  const handleAnimationStart = useCallback(() => {
    onStart?.();
  }, [onStart]);

  const handleAnimationEnd = useCallback(() => {
    onEnd?.();
    if (exiting && exitAnimation) {
      internalRef.current?.dispatchEvent(new CustomEvent('animix:exit-complete'));
    }
  }, [onEnd, exiting, exitAnimation]);

  /* Merge props onto child for asChild pattern */
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    const existingClass = (child.props.className as string) ?? '';
    return cloneElement(child, {
      ...child.props,
      ref: setRef,
      className: [existingClass, composedClass].filter(Boolean).join(' '),
      style: { ...(child.props.style as CSSProperties), ...inlineStyle },
      onAnimationStart: handleAnimationStart,
      onAnimationEnd: handleAnimationEnd,
      ...(trigger === 'hover'
        ? {
            onMouseEnter: () => setIsVisible(true),
            onMouseLeave: () => {
              setIsVisible(false);
              setHasEntered(false);
            },
          }
        : {}),
      ...(trigger === 'focus'
        ? {
            onFocus: () => setIsVisible(true),
            onBlur: () => {
              setIsVisible(false);
              setHasEntered(false);
            },
          }
        : {}),
    });
  }

  return (
    <div
      ref={setRef as React.Ref<HTMLDivElement>}
      className={composedClass}
      style={inlineStyle}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
      {...(trigger === 'hover'
        ? {
            onMouseEnter: () => setIsVisible(true),
            onMouseLeave: () => {
              setIsVisible(false);
              setHasEntered(false);
            },
          }
        : {})}
      {...(trigger === 'focus'
        ? {
            onFocus: () => setIsVisible(true),
            onBlur: () => {
              setIsVisible(false);
              setHasEntered(false);
            },
          }
        : {})}
    >
      {children}
    </div>
  );
});

Animate.displayName = 'Animate';

/* ── <AnimateStagger> ───────────────────────────────────────────── */

export interface AnimateStaggerProps {
  children: ReactNode;
  /** Animation applied to each child. Default: 'fade' */
  animation?: AnimationName;
  /** Delay in ms between each child. Default: 75 */
  delay?: number;
  /** Whether to use IntersectionObserver to trigger on scroll */
  inView?: boolean;
  /** InView threshold */
  inViewThreshold?: number;
  className?: string;
}

export function AnimateStagger({
  children,
  animation = 'fade',
  delay = 75,
  inView = false,
  inViewThreshold = 0.1,
  className = '',
}: AnimateStaggerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(!inView);

  useIsomorphicLayoutEffect(() => {
    if (!inView) {
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: inViewThreshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, inViewThreshold]);

  const childArray = Children.toArray(children);
  const animClass = getAnimationClass(animation, 'in');

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ '--animix-stagger-delay': `${delay}ms` } as CSSProperties}
    >
      {childArray.map((child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<Record<string, unknown>>, {
              ...child.props,
              style: {
                ...(child.props.style as CSSProperties),
                '--animix-stagger-index': index,
                animationDelay: `calc(${delay}ms * ${index})`,
              } as CSSProperties,
              className: [child.props.className as string, triggered ? animClass : '']
                .filter(Boolean)
                .join(' '),
            })
          : child,
      )}
    </div>
  );
}

AnimateStagger.displayName = 'AnimateStagger';
