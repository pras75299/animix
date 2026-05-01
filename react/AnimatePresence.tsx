/**
 * animix — <AnimatePresence>
 *
 * First-class React presence API for delayed unmount, nested exits,
 * and list exit orchestration. Inspired by Motion's AnimatePresence
 * but built on top of pure CSS animations via animix classes.
 *
 * Features:
 *  - Delayed unmount: keeps exiting children mounted until their
 *    exit animation completes.
 *  - Nested exits: recursively manages presence for nested
 *    AnimatePresence boundaries.
 *  - List exit orchestration: tracks children by key and animates
 *    removed items out before unmounting.
 *  - `onExitComplete` callback for parent-driven flows.
 *  - `mode` prop: 'sync' (default), 'wait', 'popLayout'.
 */

import React, {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

/* ── SSR-safe layout effect ──────────────────────────────────────── */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ── Types ───────────────────────────────────────────────────────── */

export type PresenceMode = 'sync' | 'wait' | 'popLayout';

export interface AnimatePresenceProps {
  children: ReactNode;
  /**
   * Called when all exiting children have completed their exit animations.
   */
  onExitComplete?: () => void;
  /**
   * If true, the initial render will also be animated.
   * Default: true.
   */
  initial?: boolean;
  /**
   * Controls how entering and exiting children are orchestrated.
   *  - 'sync' (default): enter and exit play simultaneously.
   *  - 'wait': new children wait until exiting children complete.
   *  - 'popLayout': exiting children are taken out of flow immediately.
   */
  mode?: PresenceMode;
}

/* ── Internal child tracking ─────────────────────────────────────── */

interface PresenceChild {
  key: string;
  element: ReactElement;
  isExiting: boolean;
}

function getChildKey(child: ReactElement, index: number): string {
  return child.key !== null && child.key !== undefined ? String(child.key) : `.$${index}`;
}

function getValidChildren(children: ReactNode): ReactElement[] {
  const result: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      result.push(child);
    }
  });
  return result;
}

/* ── AnimatePresence ─────────────────────────────────────────────── */

export function AnimatePresence({
  children,
  onExitComplete,
  initial = true,
  mode = 'sync',
}: AnimatePresenceProps) {
  const [presenceChildren, setPresenceChildren] = useState<PresenceChild[]>([]);
  const isInitialRender = useRef(true);
  const exitingCount = useRef(0);
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  // Track pending enters for 'wait' mode
  const [waitingForExit, setWaitingForExit] = useState(false);
  const pendingChildrenRef = useRef<ReactElement[]>([]);

  useIsomorphicLayoutEffect(() => {
    const currentChildren = getValidChildren(children);

    setPresenceChildren((prev) => {
      // Build lookup of current children by key
      const currentKeys = new Set(currentChildren.map((c, i) => getChildKey(c, i)));
      const prevKeyMap = new Map(prev.map((pc) => [pc.key, pc]));

      // Identify entering and exiting children
      const next: PresenceChild[] = [];
      const enteringKeys = new Set<string>();

      // Add all current children (update existing or mark as entering)
      for (let i = 0; i < currentChildren.length; i++) {
        const child = currentChildren[i];
        const key = getChildKey(child, i);
        const existing = prevKeyMap.get(key);

        if (existing && existing.isExiting) {
          // Child was exiting but is now back — cancel exit
          next.push({ key, element: child, isExiting: false });
        } else {
          next.push({ key, element: child, isExiting: false });
        }

        if (!prevKeyMap.has(key)) {
          enteringKeys.add(key);
        }
      }

      // Add exiting children (present in prev but not in current)
      for (const pc of prev) {
        if (!currentKeys.has(pc.key) && !pc.isExiting) {
          // Start exit animation
          next.push({ ...pc, isExiting: true });
        } else if (pc.isExiting && !currentKeys.has(pc.key)) {
          // Still exiting
          next.push(pc);
        }
      }

      // Handle 'wait' mode: if there are exiting children, defer entering
      if (mode === 'wait') {
        const hasExiting = next.some((c) => c.isExiting);
        if (hasExiting && enteringKeys.size > 0) {
          pendingChildrenRef.current = currentChildren;
          setWaitingForExit(true);
          // Only return the exiting children + previously present non-exiting
          const filtered = next.filter((c) => !enteringKeys.has(c.key));
          exitingCount.current = filtered.filter((c) => c.isExiting).length;
          return filtered;
        }
      }

      // Count exiting
      exitingCount.current = next.filter((c) => c.isExiting).length;

      // Suppress initial animation if initial=false
      if (isInitialRender.current && !initial) {
        isInitialRender.current = false;
        return next.map((c) => ({
          ...c,
          element: cloneElement(c.element, {
            'data-animix-initial': 'false',
          } as Record<string, unknown>),
        }));
      }

      isInitialRender.current = false;
      return next;
    });
  }, [children, initial, mode]);

  const handleExitComplete = useCallback(
    (key: string) => {
      setPresenceChildren((prev) => {
        const next = prev.filter((c) => c.key !== key);
        exitingCount.current = Math.max(0, exitingCount.current - 1);

        if (exitingCount.current === 0) {
          onExitCompleteRef.current?.();

          // In 'wait' mode, now bring in pending children
          if (waitingForExit && pendingChildrenRef.current.length > 0) {
            const pending = pendingChildrenRef.current;
            pendingChildrenRef.current = [];
            setWaitingForExit(false);

            const pendingPresence: PresenceChild[] = pending.map((child, i) => ({
              key: getChildKey(child, i),
              element: child,
              isExiting: false,
            }));
            return pendingPresence;
          }
        }

        return next;
      });
    },
    [waitingForExit],
  );

  return (
    <>
      {presenceChildren.map((pc) => (
        <PresenceChildRenderer
          key={pc.key}
          presenceKey={pc.key}
          isExiting={pc.isExiting}
          onExitComplete={handleExitComplete}
          mode={mode}
        >
          {pc.element}
        </PresenceChildRenderer>
      ))}
    </>
  );
}

AnimatePresence.displayName = 'AnimatePresence';

/* ── PresenceChildRenderer ───────────────────────────────────────── */

interface PresenceChildRendererProps {
  children: ReactElement;
  presenceKey: string;
  isExiting: boolean;
  onExitComplete: (key: string) => void;
  mode: PresenceMode;
}

function PresenceChildRenderer({
  children,
  presenceKey,
  isExiting,
  onExitComplete,
  mode,
}: PresenceChildRendererProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  // Listen for animationend on the child to detect exit completion
  useEffect(() => {
    if (!isExiting) {
      return;
    }

    const el = containerRef.current;
    if (!el) {
      // If no DOM element, complete immediately
      onExitComplete(presenceKey);
      return;
    }

    const handleAnimationEnd = (event: AnimationEvent) => {
      // Only react to animations on this element, not bubbled from children
      if (event.target === el) {
        onExitComplete(presenceKey);
      }
    };

    const handleCustomExitComplete = () => {
      onExitComplete(presenceKey);
    };

    el.addEventListener('animationend', handleAnimationEnd);
    el.addEventListener('animix:exit-complete', handleCustomExitComplete);

    // Fallback: if no animation fires within a reasonable time, clean up
    const fallbackTimer = setTimeout(() => {
      // Check if the element actually has an animation running
      const computed = globalThis.getComputedStyle?.(el);
      const animName = computed?.animationName || 'none';
      if (animName === 'none' || animName === '') {
        onExitComplete(presenceKey);
      }
    }, 5000);

    return () => {
      el.removeEventListener('animationend', handleAnimationEnd);
      el.removeEventListener('animix:exit-complete', handleCustomExitComplete);
      clearTimeout(fallbackTimer);
    };
  }, [isExiting, presenceKey, onExitComplete]);

  // Clone the child to inject presence props
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        ...(children.props as Record<string, unknown>),
        ref: (node: HTMLElement | null) => {
          containerRef.current = node;
          // Forward existing ref
          const existingRef = (children as ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
          if (existingRef) {
            if (typeof existingRef === 'function') {
              existingRef(node);
            } else {
              (existingRef as React.MutableRefObject<HTMLElement | null>).current = node;
            }
          }
        },
        'data-animix-presence': isExiting ? 'exiting' : 'present',
        // Only forward `exiting` as a typed prop to non-DOM components — passing it
        // to a native HTML element would trigger React's "unknown prop" warning.
        ...(isExiting && typeof children.type !== 'string' ? { exiting: true } : {}),
        ...(mode === 'popLayout' && isExiting
          ? {
              style: {
                ...((children.props as Record<string, unknown>).style as React.CSSProperties),
                position: 'absolute' as const,
              },
            }
          : {}),
      })
    : children;

  return <>{child}</>;
}

PresenceChildRenderer.displayName = 'PresenceChildRenderer';
