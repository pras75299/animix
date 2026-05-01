/**
 * P0 Item #4: useAnimation class-based fallback tests
 *
 * Tests for the getComputedStyle(...).animationName fallback path
 * when no explicit animation option is provided.
 */

import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, act } from '@testing-library/react';
import React, { useRef, type RefObject } from 'react';
import { render, screen } from '@testing-library/react';
import { useAnimation, type UseAnimationOptions } from '../useAnimation';

afterEach(cleanup);

/* ── Helper: render hook with a real DOM element and expose state ─ */

function TestHarness({ opts, id = 'target' }: { opts?: UseAnimationOptions; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation(ref as RefObject<HTMLElement>, opts);
  return (
    <div>
      <div ref={ref} data-testid={id} />
      <span data-testid="state">{controls.state}</span>
      <button data-testid="play" onClick={() => controls.play()}>
        play
      </button>
      <button data-testid="pause" onClick={() => controls.pause()}>
        pause
      </button>
      <button data-testid="resume" onClick={() => controls.resume()}>
        resume
      </button>
      <button data-testid="reverse" onClick={() => controls.reverse()}>
        reverse
      </button>
      <button data-testid="reset" onClick={() => controls.reset()}>
        reset
      </button>
    </div>
  );
}

function getState() {
  return screen.getByTestId('state').textContent;
}

describe('useAnimation class-based fallback', () => {
  it('resolves animation from explicit option first', () => {
    render(<TestHarness opts={{ animation: 'animix-in-fade' }} />);

    act(() => {
      screen.getByTestId('play').click();
    });

    expect(screen.getByTestId('target').style.animationName).toBe('animix-in-fade');
  });

  it('resolves animation from inline style.animationName', () => {
    function TestWithInline() {
      const ref = useRef<HTMLDivElement>(null);
      const controls = useAnimation(ref as RefObject<HTMLElement>);
      return (
        <div>
          <div ref={ref} style={{ animationName: 'my-custom-anim' }} data-testid="target" />
          <button data-testid="play" onClick={() => controls.play()}>
            play
          </button>
        </div>
      );
    }

    render(<TestWithInline />);
    act(() => {
      screen.getByTestId('play').click();
    });
    expect(screen.getByTestId('target').style.animationName).toBe('my-custom-anim');
  });

  it('falls back to getComputedStyle when no animation option or inline style', () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn((el: Element) => {
      const real = originalGetComputedStyle(el);
      return { ...real, animationName: 'animix-bounce' } as CSSStyleDeclaration;
    });

    render(<TestHarness />);
    act(() => {
      screen.getByTestId('play').click();
    });
    expect(screen.getByTestId('target').style.animationName).toBe('animix-bounce');

    window.getComputedStyle = originalGetComputedStyle;
  });

  it('handles multiple comma-separated animation names (uses first)', () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn(() => ({
      animationName: 'anim-first, anim-second, anim-third',
    })) as unknown as typeof window.getComputedStyle;

    render(<TestHarness />);
    act(() => {
      screen.getByTestId('play').click();
    });
    expect(screen.getByTestId('target').style.animationName).toBe('anim-first');

    window.getComputedStyle = originalGetComputedStyle;
  });

  it('warns and no-ops when no animation can be resolved', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn(() => ({
      animationName: 'none',
    })) as unknown as typeof window.getComputedStyle;

    render(<TestHarness />);
    act(() => {
      screen.getByTestId('play').click();
    });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('useAnimation.play()'));

    warnSpy.mockRestore();
    window.getComputedStyle = originalGetComputedStyle;
  });

  it('warns on reverse when no animation found', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn(() => ({
      animationName: '',
    })) as unknown as typeof window.getComputedStyle;

    render(<TestHarness />);
    act(() => {
      screen.getByTestId('reverse').click();
    });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('useAnimation.reverse()'));

    warnSpy.mockRestore();
    window.getComputedStyle = originalGetComputedStyle;
  });

  describe('play/pause/resume/reverse/reset lifecycle', () => {
    it('starts idle, transitions through states', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade' }} />);

      expect(getState()).toBe('idle');

      act(() => {
        screen.getByTestId('play').click();
      });
      expect(getState()).toBe('running');

      act(() => {
        screen.getByTestId('pause').click();
      });
      expect(getState()).toBe('paused');
      expect(screen.getByTestId('target').style.animationPlayState).toBe('paused');

      act(() => {
        screen.getByTestId('resume').click();
      });
      expect(getState()).toBe('running');
      expect(screen.getByTestId('target').style.animationPlayState).toBe('running');

      act(() => {
        screen.getByTestId('reset').click();
      });
      expect(getState()).toBe('idle');
      expect(screen.getByTestId('target').style.animationName).toBe('');
    });

    it('reverse sets direction to reverse', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade' }} />);

      act(() => {
        screen.getByTestId('reverse').click();
      });
      expect(getState()).toBe('reversed');
      expect(screen.getByTestId('target').style.animationDirection).toBe('reverse');
    });
  });

  describe('options application', () => {
    it('applies duration as inline style', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade', duration: 500 }} />);
      act(() => {
        screen.getByTestId('play').click();
      });
      expect(screen.getByTestId('target').style.animationDuration).toBe('500ms');
    });

    it('applies easing as inline style', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade', easing: 'ease-in-out' }} />);
      act(() => {
        screen.getByTestId('play').click();
      });
      expect(screen.getByTestId('target').style.animationTimingFunction).toBe('ease-in-out');
    });

    it('applies delay as inline style', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade', delay: 200 }} />);
      act(() => {
        screen.getByTestId('play').click();
      });
      expect(screen.getByTestId('target').style.animationDelay).toBe('200ms');
    });

    it('applies repeat count', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade', repeat: 3 }} />);
      act(() => {
        screen.getByTestId('play').click();
      });
      expect(screen.getByTestId('target').style.animationIterationCount).toBe('3');
    });

    it('applies infinite repeat', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade', repeat: 'infinite' }} />);
      act(() => {
        screen.getByTestId('play').click();
      });
      expect(screen.getByTestId('target').style.animationIterationCount).toBe('infinite');
    });

    it('applies fillMode', () => {
      render(<TestHarness opts={{ animation: 'animix-in-fade', fillMode: 'forwards' }} />);
      act(() => {
        screen.getByTestId('play').click();
      });
      expect(screen.getByTestId('target').style.animationFillMode).toBe('forwards');
    });
  });
});
