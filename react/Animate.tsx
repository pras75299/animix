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
  type ElementType,
  Fragment,
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

import { assignRef, useComposedRefs } from './composeRefs';

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
  | 'blur'
  | 'light-speed'
  | 'roll';

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
  | 'blur'
  | 'light-speed'
  | 'roll'
  | 'hinge';

export type AttentionAnimation =
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'head-shake'
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
  name: AnimationName | ExitAnimation,
  type: 'in' | 'out' | 'attention' | 'transition',
): string {
  const transitionAliases: Partial<Record<TransitionAnimation, string>> = {
    'toast-in': 'animix-toast-in-right',
    'toast-out': 'animix-toast-out-right',
  };

  // Attention animations
  const attentionNames: AttentionAnimation[] = [
    'pulse',
    'bounce',
    'shake',
    'head-shake',
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

  if (type === 'in' && name === 'bounce') {
    return 'animix-in-bounce';
  }

  if (type === 'attention' || attentionNames.includes(name as AttentionAnimation)) {
    return `animix-${name}`;
  }

  const transitionPrefixes = ['modal', 'drawer', 'toast', 'tooltip'];
  if (transitionPrefixes.some((p) => name.startsWith(p))) {
    const aliasedTransition = transitionAliases[name as TransitionAnimation];
    if (aliasedTransition) {
      return aliasedTransition;
    }

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

function getEasingClass(easing: 'default' | 'spring' | 'bounce' | 'in' | 'out' | 'in-out'): string {
  if (easing === 'default') {
    return '';
  }
  return `animix-ease-${easing}`;
}

function getChildElementRef(child: ReactElement): Ref<HTMLElement> | undefined | null {
  const withRef = child as ReactElement & { ref?: Ref<HTMLElement> | null };
  return withRef.ref ?? undefined;
}

function composeEventHandlers<E>(
  childHandler: ((event: E) => void) | undefined,
  animixHandler: ((event: E) => void) | undefined,
): (event: E) => void {
  return (event: E) => {
    childHandler?.(event);
    animixHandler?.(event);
  };
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
  /**
   * Controls visibility when `trigger="manual"`.
   * Set `true` to play/show the animation classes and `false` to clear them.
   */
  manualActive?: boolean;
  /** Duration preset or explicit millisecond value. Default: 'base' (240ms) */
  duration?: 'fast' | 'base' | 'slow' | 'slower' | number;
  /** Delay in milliseconds. Default: 0 */
  delay?: number;
  /** Easing function. Default: 'default' */
  easing?: 'default' | 'spring' | 'bounce' | 'in' | 'out' | 'in-out';
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
    manualActive = false,
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

  const [isVisible, setIsVisible] = useState(
    trigger === 'mount' || (trigger === 'manual' && manualActive),
  );
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

  useEffect(() => {
    if (trigger !== 'manual') {
      return;
    }
    setIsVisible(Boolean(manualActive));
    if (manualActive) {
      setHasEntered(true);
    }
  }, [trigger, manualActive]);

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

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setHasEntered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsVisible(false);
    setHasEntered(false);
  }, []);

  /* Merge props onto child for asChild pattern */
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    const existingClass = (child.props.className as string) ?? '';
    const childOnAnimationStart = child.props.onAnimationStart as
      | ((event: React.AnimationEvent<HTMLElement>) => void)
      | undefined;
    const childOnAnimationEnd = child.props.onAnimationEnd as
      | ((event: React.AnimationEvent<HTMLElement>) => void)
      | undefined;
    const childOnMouseEnter = child.props.onMouseEnter as
      | ((event: React.MouseEvent<HTMLElement>) => void)
      | undefined;
    const childOnMouseLeave = child.props.onMouseLeave as
      | ((event: React.MouseEvent<HTMLElement>) => void)
      | undefined;
    const childOnFocus = child.props.onFocus as
      | ((event: React.FocusEvent<HTMLElement>) => void)
      | undefined;
    const childOnBlur = child.props.onBlur as
      | ((event: React.FocusEvent<HTMLElement>) => void)
      | undefined;

    return cloneElement(child, {
      ...child.props,
      ref: setRef,
      className: [existingClass, composedClass].filter(Boolean).join(' '),
      style: { ...(child.props.style as CSSProperties), ...inlineStyle },
      onAnimationStart: composeEventHandlers(childOnAnimationStart, () => handleAnimationStart()),
      onAnimationEnd: composeEventHandlers(childOnAnimationEnd, () => handleAnimationEnd()),
      ...(trigger === 'hover'
        ? {
            onMouseEnter: composeEventHandlers(childOnMouseEnter, () => handleMouseEnter()),
            onMouseLeave: composeEventHandlers(childOnMouseLeave, () => handleMouseLeave()),
          }
        : {}),
      ...(trigger === 'focus'
        ? {
            onFocus: composeEventHandlers(childOnFocus, () => handleFocus()),
            onBlur: composeEventHandlers(childOnBlur, () => handleBlur()),
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
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
          }
        : {})}
      {...(trigger === 'focus'
        ? {
            onFocus: handleFocus,
            onBlur: handleBlur,
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
  /** Wrapper element when not using asChild. Default: 'div'. */
  as?: ElementType;
  /** Merge behavior into child instead of rendering a wrapper. */
  asChild?: boolean;
  className?: string;
}

type AnimixChildProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type AnimixChildElement = ReactElement<AnimixChildProps & { ref?: Ref<HTMLElement> }>;

function isAnimixChildElement(node: ReactNode): node is AnimixChildElement {
  return (
    isValidElement<AnimixChildProps & { ref?: Ref<HTMLElement> }>(node) && node.type !== Fragment
  );
}

export function AnimateStagger({
  children,
  animation = 'fade',
  delay = 75,
  inView = false,
  inViewThreshold = 0.1,
  as: Wrapper = 'div',
  asChild = false,
  className = '',
}: AnimateStaggerProps) {
  const containerRef = useRef<HTMLElement | null>(null);
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

  const animClass = getAnimationClass(animation, 'in');
  const childRefForMerge =
    asChild && isAnimixChildElement(children) ? getChildElementRef(children) : undefined;

  const mapStaggerChildren = useCallback(
    (nodes: ReactNode) =>
      Children.map(nodes, (node, index) => {
        if (!isValidElement<AnimixChildProps>(node)) {
          return node;
        }

        return cloneElement(node, {
          ...node.props,
          style: {
            ...node.props.style,
            '--animix-stagger-index': index,
            animationDelay: `calc(${delay}ms * ${index})`,
          } as CSSProperties,
          className: [node.props.className ?? '', triggered ? animClass : '']
            .filter(Boolean)
            .join(' '),
        });
      }),
    [animClass, delay, triggered],
  );

  if (asChild && isAnimixChildElement(children)) {
    const child = children;
    const existingClass = child.props.className ?? '';
    return cloneElement<AnimixChildProps & { ref?: Ref<HTMLElement> }>(child, {
      ...child.props,
      ref: (node: HTMLElement | null) => {
        containerRef.current = node;
        assignRef(childRefForMerge, node);
      },
      className: [existingClass, className].filter(Boolean).join(' '),
      style: {
        ...child.props.style,
        '--animix-stagger-delay': `${delay}ms`,
      } as CSSProperties,
      children: mapStaggerChildren(child.props.children),
    });
  }

  return (
    <Wrapper
      ref={containerRef}
      className={className}
      style={{ '--animix-stagger-delay': `${delay}ms` } as CSSProperties}
    >
      {mapStaggerChildren(children)}
    </Wrapper>
  );
}

AnimateStagger.displayName = 'AnimateStagger';
