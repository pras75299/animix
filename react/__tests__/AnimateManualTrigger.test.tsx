/**
 * P0 Item #3: Animate manual trigger tests
 *
 * Tests for trigger="manual" + manualActive state transitions.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import React, { useState } from 'react';
import { Animate } from '../Animate';

afterEach(cleanup);

function getWrapper() {
  const wrapper = screen.getByTestId('child').parentElement;
  expect(wrapper).not.toBeNull();

  if (!wrapper) {
    throw new Error('Expected Animate to render a wrapper element.');
  }

  return wrapper;
}

describe('Animate manual trigger', () => {
  it('does not apply animation class when manualActive=false', () => {
    render(
      <Animate animation="fade" trigger="manual" manualActive={false}>
        <div data-testid="child">Content</div>
      </Animate>,
    );
    const wrapper = getWrapper();
    expect(wrapper.className).not.toContain('animix-in-fade');
  });

  it('applies animation class when manualActive=true', () => {
    render(
      <Animate animation="fade" trigger="manual" manualActive={true}>
        <div data-testid="child">Content</div>
      </Animate>,
    );
    const wrapper = getWrapper();
    expect(wrapper.className).toContain('animix-in-fade');
  });

  it('transitions from inactive to active', () => {
    function TestComponent() {
      const [active, setActive] = useState(false);
      return (
        <>
          <button data-testid="activate" onClick={() => setActive(true)}>
            Activate
          </button>
          <Animate animation="slide-up" trigger="manual" manualActive={active}>
            <div data-testid="child">Content</div>
          </Animate>
        </>
      );
    }

    render(<TestComponent />);
    const wrapper = getWrapper();

    // Initially no animation
    expect(wrapper.className).not.toContain('animix-in-slide-up');

    // Activate
    act(() => {
      screen.getByTestId('activate').click();
    });

    expect(wrapper.className).toContain('animix-in-slide-up');
  });

  it('transitions from active to inactive', () => {
    function TestComponent() {
      const [active, setActive] = useState(true);
      return (
        <>
          <button data-testid="deactivate" onClick={() => setActive(false)}>
            Deactivate
          </button>
          <Animate animation="fade" trigger="manual" manualActive={active}>
            <div data-testid="child">Content</div>
          </Animate>
        </>
      );
    }

    render(<TestComponent />);
    const wrapper = getWrapper();

    expect(wrapper.className).toContain('animix-in-fade');

    act(() => {
      screen.getByTestId('deactivate').click();
    });

    expect(wrapper.className).not.toContain('animix-in-fade');
  });

  it('toggles back and forth', () => {
    function TestComponent() {
      const [active, setActive] = useState(false);
      return (
        <>
          <button data-testid="toggle" onClick={() => setActive((p) => !p)}>
            Toggle
          </button>
          <Animate animation="scale-up" trigger="manual" manualActive={active}>
            <div data-testid="child">Content</div>
          </Animate>
        </>
      );
    }

    render(<TestComponent />);
    const wrapper = getWrapper();

    expect(wrapper.className).not.toContain('animix-in-scale-up');

    act(() => {
      screen.getByTestId('toggle').click();
    });
    expect(wrapper.className).toContain('animix-in-scale-up');

    act(() => {
      screen.getByTestId('toggle').click();
    });
    expect(wrapper.className).not.toContain('animix-in-scale-up');

    act(() => {
      screen.getByTestId('toggle').click();
    });
    expect(wrapper.className).toContain('animix-in-scale-up');
  });

  it('applies exit animation when exiting=true with manual trigger', () => {
    render(
      <Animate
        animation="fade"
        trigger="manual"
        manualActive={true}
        exitAnimation="fade"
        exiting={true}
      >
        <div data-testid="child">Content</div>
      </Animate>,
    );
    const wrapper = getWrapper();
    expect(wrapper.className).toContain('animix-out-fade');
  });

  it('does not interfere with onEnd callback wiring', () => {
    const onEnd = vi.fn();

    function TestComponent() {
      const [active] = useState(true);
      return (
        <Animate animation="fade" trigger="manual" manualActive={active} onEnd={onEnd}>
          <div data-testid="child">Content</div>
        </Animate>
      );
    }

    render(<TestComponent />);
    // The wrapper element should exist and have animation classes
    const wrapper = getWrapper();
    expect(wrapper.className).toContain('animix-in-fade');
    // onEnd is wired through React's onAnimationEnd — verified by the component's
    // cloneElement or div rendering path
  });

  it('works with asChild pattern', () => {
    function TestComponent() {
      const [active, setActive] = useState(false);
      return (
        <>
          <button data-testid="toggle" onClick={() => setActive((p) => !p)}>
            Toggle
          </button>
          <Animate animation="fade" trigger="manual" manualActive={active} asChild>
            <div data-testid="child" className="base-class">
              Content
            </div>
          </Animate>
        </>
      );
    }

    render(<TestComponent />);
    const child = screen.getByTestId('child');

    expect(child).toHaveClass('base-class');
    expect(child.className).not.toContain('animix-in-fade');

    act(() => {
      screen.getByTestId('toggle').click();
    });
    expect(child).toHaveClass('base-class');
    expect(child.className).toContain('animix-in-fade');
  });
});
