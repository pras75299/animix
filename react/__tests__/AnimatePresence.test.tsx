/**
 * P0 Item #1: AnimatePresence tests
 *
 * Tests for first-class React presence API:
 *  - Delayed unmount (keeps exiting children until animation completes)
 *  - Nested exits
 *  - List exit orchestration (key-based child tracking)
 *  - onExitComplete callback
 *  - mode: 'sync', 'wait', 'popLayout'
 *  - initial prop suppression
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import React, { useState } from 'react';
import { AnimatePresence } from '../AnimatePresence';
import { Animate } from '../Animate';

afterEach(cleanup);

/* ── Helpers ────────────────────────────────────────────────────── */

function fireAnimationEnd(el: HTMLElement) {
  act(() => {
    el.dispatchEvent(new Event('animationend', { bubbles: false }));
  });
}

function fireCustomExitComplete(el: HTMLElement) {
  act(() => {
    el.dispatchEvent(new CustomEvent('animix:exit-complete'));
  });
}

/* ── Tests ──────────────────────────────────────────────────────── */

describe('AnimatePresence', () => {
  describe('basic rendering', () => {
    it('renders children when present', () => {
      render(
        <AnimatePresence>
          <div data-testid="child">Hello</div>
        </AnimatePresence>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Hello');
    });

    it('renders multiple children by key', () => {
      render(
        <AnimatePresence>
          <div key="a" data-testid="a">
            A
          </div>
          <div key="b" data-testid="b">
            B
          </div>
          <div key="c" data-testid="c">
            C
          </div>
        </AnimatePresence>,
      );

      expect(screen.getByTestId('a')).toBeInTheDocument();
      expect(screen.getByTestId('b')).toBeInTheDocument();
      expect(screen.getByTestId('c')).toBeInTheDocument();
    });

    it('maps toast-in to a shipped transition class', () => {
      render(
        <AnimatePresence>
          <Animate animation="toast-in">
            <div data-testid="toast">Toast</div>
          </Animate>
        </AnimatePresence>,
      );

      const wrapper = screen.getByTestId('toast').parentElement;
      expect(wrapper).toHaveClass('animix-toast-in-right');
      expect(wrapper).not.toHaveClass('animix-toast-in');
    });
  });

  describe('delayed unmount', () => {
    it('keeps exiting child mounted until animationend fires', () => {
      function TestComponent() {
        const [show, setShow] = useState(true);
        return (
          <>
            <button data-testid="toggle" onClick={() => setShow(false)}>
              Toggle
            </button>
            <AnimatePresence>
              {show && (
                <Animate key="item" animation="fade" exitAnimation="fade">
                  <div data-testid="child">Content</div>
                </Animate>
              )}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<TestComponent />);

      // Child is present initially
      expect(getByTestId('child')).toBeInTheDocument();

      // Remove the child
      act(() => {
        getByTestId('toggle').click();
      });

      // Child should still be in the DOM (delayed unmount)
      const exitingEl = queryByTestId('child');
      expect(exitingEl).toBeInTheDocument();

      // The presence wrapper should mark it as exiting
      const presenceEl = exitingEl?.closest('[data-animix-presence]');
      if (presenceEl) {
        expect(presenceEl.getAttribute('data-animix-presence')).toBe('exiting');
      }
    });

    it('removes child after animationend event', () => {
      function TestComponent() {
        const [show, setShow] = useState(true);
        return (
          <>
            <button data-testid="toggle" onClick={() => setShow(false)}>
              Toggle
            </button>
            <AnimatePresence>
              {show && (
                <div key="item" data-testid="child">
                  Content
                </div>
              )}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<TestComponent />);

      act(() => {
        getByTestId('toggle').click();
      });

      // Child is still present (exiting)
      const exitingEl = queryByTestId('child');
      expect(exitingEl).toBeInTheDocument();

      // Fire animationend
      if (exitingEl) {
        fireAnimationEnd(exitingEl);
      }

      // Child should now be removed
      expect(queryByTestId('child')).not.toBeInTheDocument();
    });

    it('removes child after custom animix:exit-complete event', () => {
      function TestComponent() {
        const [show, setShow] = useState(true);
        return (
          <>
            <button data-testid="toggle" onClick={() => setShow(false)}>
              Toggle
            </button>
            <AnimatePresence>
              {show && (
                <div key="item" data-testid="child">
                  Content
                </div>
              )}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<TestComponent />);

      act(() => {
        getByTestId('toggle').click();
      });

      const exitingEl = queryByTestId('child');
      expect(exitingEl).toBeInTheDocument();

      if (exitingEl) {
        fireCustomExitComplete(exitingEl);
      }

      expect(queryByTestId('child')).not.toBeInTheDocument();
    });
  });

  describe('list exit orchestration', () => {
    it('tracks children by key and animates removed items', () => {
      function ListComponent() {
        const [items, setItems] = useState(['a', 'b', 'c']);
        return (
          <>
            <button data-testid="remove-b" onClick={() => setItems(items.filter((i) => i !== 'b'))}>
              Remove B
            </button>
            <AnimatePresence>
              {items.map((item) => (
                <div key={item} data-testid={`item-${item}`}>
                  {item}
                </div>
              ))}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<ListComponent />);

      expect(getByTestId('item-a')).toBeInTheDocument();
      expect(getByTestId('item-b')).toBeInTheDocument();
      expect(getByTestId('item-c')).toBeInTheDocument();

      act(() => {
        getByTestId('remove-b').click();
      });

      // b should still be mounted (exiting)
      expect(queryByTestId('item-b')).toBeInTheDocument();
      // a and c should still be present
      expect(getByTestId('item-a')).toBeInTheDocument();
      expect(getByTestId('item-c')).toBeInTheDocument();
    });

    it('handles adding new items while others exit', () => {
      function ListComponent() {
        const [items, setItems] = useState(['a', 'b']);
        return (
          <>
            <button data-testid="swap" onClick={() => setItems(['a', 'c'])}>
              Swap B→C
            </button>
            <AnimatePresence>
              {items.map((item) => (
                <div key={item} data-testid={`item-${item}`}>
                  {item}
                </div>
              ))}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<ListComponent />);

      act(() => {
        getByTestId('swap').click();
      });

      // a should remain
      expect(getByTestId('item-a')).toBeInTheDocument();
      // c should enter
      expect(queryByTestId('item-c')).toBeInTheDocument();
      // b should still be mounted (exiting)
      expect(queryByTestId('item-b')).toBeInTheDocument();
    });

    it('handles re-entering a key that was exiting', () => {
      function ListComponent() {
        const [items, setItems] = useState(['a', 'b']);
        return (
          <>
            <button data-testid="remove-b" onClick={() => setItems(['a'])}>
              Remove B
            </button>
            <button data-testid="add-b" onClick={() => setItems(['a', 'b'])}>
              Add B
            </button>
            <AnimatePresence>
              {items.map((item) => (
                <div key={item} data-testid={`item-${item}`}>
                  {item}
                </div>
              ))}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<ListComponent />);

      // Remove b
      act(() => {
        getByTestId('remove-b').click();
      });

      // b is exiting
      expect(queryByTestId('item-b')).toBeInTheDocument();

      // Re-add b before exit completes
      act(() => {
        getByTestId('add-b').click();
      });

      // b should be present (not exiting)
      const el = queryByTestId('item-b');
      expect(el).toBeInTheDocument();
      const presenceAttr = el
        ?.closest('[data-animix-presence]')
        ?.getAttribute('data-animix-presence');
      if (presenceAttr) {
        expect(presenceAttr).toBe('present');
      }
    });
  });

  describe('onExitComplete', () => {
    it('fires onExitComplete when all exiting children have completed', () => {
      const onExitComplete = vi.fn();

      function TestComponent() {
        const [show, setShow] = useState(true);
        return (
          <>
            <button data-testid="toggle" onClick={() => setShow(false)}>
              Toggle
            </button>
            <AnimatePresence onExitComplete={onExitComplete}>
              {show && (
                <div key="item" data-testid="child">
                  Content
                </div>
              )}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<TestComponent />);

      act(() => {
        getByTestId('toggle').click();
      });

      expect(onExitComplete).not.toHaveBeenCalled();

      const exitingEl = queryByTestId('child');
      if (exitingEl) {
        fireAnimationEnd(exitingEl);
      }

      expect(onExitComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('initial prop', () => {
    it('suppresses initial animation when initial=false', () => {
      render(
        <AnimatePresence initial={false}>
          <div key="item" data-testid="child">
            Content
          </div>
        </AnimatePresence>,
      );

      const child = screen.getByTestId('child');
      expect(child).toBeInTheDocument();

      // Check that data-animix-initial="false" is set
      const initialAttr = child.getAttribute('data-animix-initial');
      expect(initialAttr).toBe('false');
    });

    it('allows initial animation when initial=true (default)', () => {
      render(
        <AnimatePresence>
          <div key="item" data-testid="child">
            Content
          </div>
        </AnimatePresence>,
      );

      const child = screen.getByTestId('child');
      expect(child).toBeInTheDocument();
      // Should NOT have initial suppression attribute
      expect(child.getAttribute('data-animix-initial')).toBeNull();
    });
  });

  describe('mode: popLayout', () => {
    it('sets position absolute on exiting children in popLayout mode', () => {
      function TestComponent() {
        const [show, setShow] = useState(true);
        return (
          <>
            <button data-testid="toggle" onClick={() => setShow(false)}>
              Toggle
            </button>
            <AnimatePresence mode="popLayout">
              {show && (
                <div key="item" data-testid="child">
                  Content
                </div>
              )}
            </AnimatePresence>
          </>
        );
      }

      const { getByTestId, queryByTestId } = render(<TestComponent />);

      act(() => {
        getByTestId('toggle').click();
      });

      const exitingEl = queryByTestId('child');
      expect(exitingEl).toBeInTheDocument();
      if (exitingEl) {
        expect(exitingEl.style.position).toBe('absolute');
      }
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(AnimatePresence.displayName).toBe('AnimatePresence');
    });
  });
});
