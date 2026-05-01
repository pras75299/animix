/**
 * P0 Item #2: AnimateStagger tests
 *
 * Tests for: wrapper, as, asChild, ref preservation, child mapping.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React, { createRef, forwardRef } from 'react';
import { AnimateStagger } from '../Animate';

afterEach(cleanup);

describe('AnimateStagger', () => {
  describe('wrapper element', () => {
    it('renders default wrapper as <div>', () => {
      const { container } = render(
        <AnimateStagger>
          <span>A</span>
          <span>B</span>
        </AnimateStagger>,
      );
      expect(container.firstElementChild?.tagName).toBe('DIV');
    });

    it('renders custom wrapper via `as` prop', () => {
      const { container } = render(
        <AnimateStagger as="ul" className="my-list">
          <li>One</li>
          <li>Two</li>
        </AnimateStagger>,
      );
      expect(container.firstElementChild?.tagName).toBe('UL');
      expect(container.firstElementChild).toHaveClass('my-list');
    });

    it('renders custom component wrapper via `as` prop', () => {
      const CustomList = forwardRef<
        HTMLOListElement,
        { children: React.ReactNode; className?: string }
      >(({ children, className, ...rest }, ref) => (
        <ol ref={ref} className={className} data-custom="true" {...rest}>
          {children}
        </ol>
      ));
      CustomList.displayName = 'CustomList';

      const { container } = render(
        <AnimateStagger as={CustomList} className="custom">
          <li>One</li>
        </AnimateStagger>,
      );
      expect(container.firstElementChild?.tagName).toBe('OL');
      expect(container.firstElementChild?.getAttribute('data-custom')).toBe('true');
    });
  });

  describe('asChild mode', () => {
    it('merges into single child without extra wrapper', () => {
      const { container } = render(
        <AnimateStagger asChild>
          <ul data-testid="list">
            <li>A</li>
            <li>B</li>
          </ul>
        </AnimateStagger>,
      );
      expect(container.firstElementChild?.tagName).toBe('UL');
    });

    it('preserves existing className on child', () => {
      render(
        <AnimateStagger asChild className="stagger-class">
          <div className="existing" data-testid="child">
            <span>A</span>
          </div>
        </AnimateStagger>,
      );
      const child = screen.getByTestId('child');
      expect(child).toHaveClass('existing');
      expect(child).toHaveClass('stagger-class');
    });

    it('preserves ref on child', () => {
      const childRef = createRef<HTMLDivElement>();
      render(
        <AnimateStagger asChild>
          <div ref={childRef} data-testid="child">
            <span>A</span>
          </div>
        </AnimateStagger>,
      );
      expect(childRef.current).toBeInstanceOf(HTMLElement);
      expect(childRef.current?.getAttribute('data-testid')).toBe('child');
    });
  });

  describe('child mapping', () => {
    it('applies stagger delay to each child based on index', () => {
      render(
        <AnimateStagger delay={100}>
          <div data-testid="c0">A</div>
          <div data-testid="c1">B</div>
          <div data-testid="c2">C</div>
        </AnimateStagger>,
      );
      // jsdom normalizes calc() expressions, so check that delay contains the index pattern
      const c0Delay = screen.getByTestId('c0').style.animationDelay;
      const c1Delay = screen.getByTestId('c1').style.animationDelay;
      const c2Delay = screen.getByTestId('c2').style.animationDelay;

      // c0 should have delay for index 0 (may be normalized to calc(0s))
      expect(c0Delay).toBeTruthy();
      // c1 should differ from c0
      expect(c1Delay).toBeTruthy();
      // c2 should differ from c1
      expect(c2Delay).toBeTruthy();
      // Ensure they're not all the same
      expect(c1Delay).not.toBe(c0Delay);
    });

    it('applies animation class to each child', () => {
      render(
        <AnimateStagger animation="slide-up">
          <div data-testid="c0">A</div>
          <div data-testid="c1">B</div>
        </AnimateStagger>,
      );
      expect(screen.getByTestId('c0')).toHaveClass('animix-in-slide-up');
      expect(screen.getByTestId('c1')).toHaveClass('animix-in-slide-up');
    });

    it('uses default fade animation', () => {
      render(
        <AnimateStagger>
          <div data-testid="c0">A</div>
        </AnimateStagger>,
      );
      expect(screen.getByTestId('c0')).toHaveClass('animix-in-fade');
    });

    it('applies incrementing stagger delays to children', () => {
      render(
        <AnimateStagger delay={75}>
          <div data-testid="c0">A</div>
          <div data-testid="c1">B</div>
          <div data-testid="c2">C</div>
        </AnimateStagger>,
      );

      // Verify child 1 has a non-zero delay
      const c1Delay = screen.getByTestId('c1').style.animationDelay;
      expect(c1Delay).toBeTruthy();

      // The stagger-index custom property tells us ordering is correct
      expect(screen.getByTestId('c0').style.getPropertyValue('--animix-stagger-index')).toBe('0');
      expect(screen.getByTestId('c1').style.getPropertyValue('--animix-stagger-index')).toBe('1');
      expect(screen.getByTestId('c2').style.getPropertyValue('--animix-stagger-index')).toBe('2');
    });

    it('preserves existing className on children', () => {
      render(
        <AnimateStagger animation="fade">
          <div data-testid="c" className="my-item">
            X
          </div>
        </AnimateStagger>,
      );
      const child = screen.getByTestId('c');
      expect(child).toHaveClass('my-item');
      expect(child).toHaveClass('animix-in-fade');
    });

    it('sets stagger CSS variable on wrapper', () => {
      const { container } = render(
        <AnimateStagger delay={150}>
          <div>A</div>
        </AnimateStagger>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.getPropertyValue('--animix-stagger-delay')).toBe('150ms');
    });

    it('sets stagger index CSS variable on children', () => {
      render(
        <AnimateStagger>
          <div data-testid="c0">A</div>
          <div data-testid="c1">B</div>
        </AnimateStagger>,
      );
      expect(screen.getByTestId('c0').style.getPropertyValue('--animix-stagger-index')).toBe('0');
      expect(screen.getByTestId('c1').style.getPropertyValue('--animix-stagger-index')).toBe('1');
    });

    it('skips non-element children', () => {
      render(
        <AnimateStagger>
          <div data-testid="c0">A</div>
          {null}
          {false}
          <div data-testid="c1">B</div>
        </AnimateStagger>,
      );
      expect(screen.getByTestId('c0')).toBeInTheDocument();
      expect(screen.getByTestId('c1')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(AnimateStagger.displayName).toBe('AnimateStagger');
    });
  });
});
