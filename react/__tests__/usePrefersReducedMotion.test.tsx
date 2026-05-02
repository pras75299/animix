import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePrefersReducedMotion } from '../useAnimation';

function ReducedMotionProbe() {
  const prefersReducedMotion = usePrefersReducedMotion();
  return <div data-testid="probe" data-reduced={String(prefersReducedMotion)} />;
}

type AnimixTestUtils = {
  setMediaQueryMatch: (media: string, matches: boolean) => void;
};

const testUtils = (globalThis as typeof globalThis & { __animixTestUtils: AnimixTestUtils })
  .__animixTestUtils;
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

describe('usePrefersReducedMotion', () => {
  it('reads the current media query match on mount', () => {
    testUtils.setMediaQueryMatch(reducedMotionQuery, true);

    render(<ReducedMotionProbe />);

    expect(screen.getByTestId('probe')).toHaveAttribute('data-reduced', 'true');
  });

  it('updates when the media query changes', () => {
    testUtils.setMediaQueryMatch(reducedMotionQuery, false);

    render(<ReducedMotionProbe />);
    expect(screen.getByTestId('probe')).toHaveAttribute('data-reduced', 'false');

    act(() => {
      testUtils.setMediaQueryMatch(reducedMotionQuery, true);
    });

    expect(screen.getByTestId('probe')).toHaveAttribute('data-reduced', 'true');
  });
});
