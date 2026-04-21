/**
 * Merge multiple React refs (object, callback, or null) onto one callback ref.
 * Used by <Animate> for forwardRef + internal ref + optional child ref (asChild).
 */

import { useCallback, useRef, type Ref } from 'react';

export function assignRef<T>(ref: Ref<T> | undefined | null, value: T | null): void {
  if (ref === null || ref === undefined) {
    return;
  }
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  (ref as { current: T | null }).current = value;
}

export function composeRefs<T>(
  ...refs: Array<Ref<T> | undefined | null>
): (value: T | null) => void {
  return (value) => {
    for (const ref of refs) {
      assignRef(ref, value);
    }
  };
}

export interface ComposedRefBundle<T> {
  forwardedRef: Ref<T> | null;
  internalRef: Ref<T | null>;
  childRef: Ref<T> | undefined | null;
}

/**
 * Stable callback ref that always assigns to the latest bundle (forwarded, internal, optional child).
 */
export function useComposedRefs<T>(bundle: ComposedRefBundle<T>): (value: T | null) => void {
  const bundleRef = useRef(bundle);
  bundleRef.current = bundle;
  return useCallback((node: T | null) => {
    const b = bundleRef.current;
    assignRef(b.internalRef, node);
    assignRef(b.forwardedRef, node);
    assignRef(b.childRef, node);
  }, []);
}
