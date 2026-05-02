import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useInView } from '../useAnimation';

function InViewProbe({
  once = true,
  threshold = 0.1,
  rootMargin = '0px',
}: {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, threshold, rootMargin });

  return (
    <div
      ref={ref}
      data-testid="probe"
      data-in-view={String(inView)}
      data-threshold={threshold}
      data-root-margin={rootMargin}
    />
  );
}

type AnimixTestUtils = {
  clearIntersectionObservers: () => void;
  getIntersectionObservers: () => Array<{
    rootMargin: string;
    thresholds: readonly number[];
    simulateIntersection: (isIntersecting: boolean) => void;
  }>;
};

const testUtils = (globalThis as typeof globalThis & { __animixTestUtils: AnimixTestUtils })
  .__animixTestUtils;

describe('useInView', () => {
  beforeEach(() => {
    testUtils.clearIntersectionObservers();
  });

  it('starts false and flips true when the observer reports an intersection', () => {
    render(<InViewProbe />);

    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');

    const observer = testUtils.getIntersectionObservers()[0];
    act(() => observer.simulateIntersection(true));

    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');
  });

  it('resets to false when once is disabled and the element leaves the viewport', () => {
    render(<InViewProbe once={false} />);

    const observer = testUtils.getIntersectionObservers()[0];

    act(() => observer.simulateIntersection(true));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');

    act(() => observer.simulateIntersection(false));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');
  });

  it('passes threshold and rootMargin through to the observer', () => {
    render(<InViewProbe once={false} threshold={0.4} rootMargin="0px 0px -120px 0px" />);

    const observer = testUtils.getIntersectionObservers()[0];
    expect(observer.thresholds).toEqual([0.4]);
    expect(observer.rootMargin).toBe('0px 0px -120px 0px');
  });

  it('treats the element as visible when IntersectionObserver is unavailable', () => {
    const original = globalThis.IntersectionObserver;
    // @ts-expect-error test fallback path
    delete globalThis.IntersectionObserver;

    render(<InViewProbe />);
    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');

    globalThis.IntersectionObserver = original;
  });
});
