import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function MotionSurfaceFixture({
  reduced = false,
  lightweight = false,
}: {
  reduced?: boolean;
  lightweight?: boolean;
}) {
  const modalClass = reduced
    ? 'animate-animix-fade-in'
    : lightweight
      ? 'animix-enter-up'
      : 'animix-enter-scale motion-demo-glass';
  const drawerClass = reduced
    ? ''
    : lightweight
      ? 'animate-motion-demo-drawer-lite'
      : 'animate-motion-demo-drawer-in motion-demo-glass';
  const tooltipClass = reduced
    ? ''
    : lightweight
      ? 'animate-animix-fade-in'
      : 'animate-animix-tooltip-in';
  const toastClass = reduced
    ? ''
    : lightweight
      ? 'animate-animix-toast-in-bottom'
      : 'animate-animix-toast-in motion-demo-glass';

  return (
    <section data-mode={reduced ? 'reduced' : lightweight ? 'lightweight' : 'default'}>
      <div className="motion-demo-backdrop motion-demo-backdrop-blur animate-animix-overlay-in" />
      <div className={`motion-demo-panel ${modalClass}`}>Modal</div>
      <aside className={`motion-demo-drawer ${drawerClass}`}>Drawer</aside>
      <div className={`motion-demo-tooltip ${tooltipClass}`}>Tooltip</div>
      <div className={`motion-demo-toast ${toastClass}`}>Toast</div>
      <ul data-stagger-delay={reduced ? '0' : lightweight ? '45' : '90'}>
        <li>Alpha</li>
        <li>Beta</li>
        <li>Gamma</li>
      </ul>
    </section>
  );
}

describe('motion surface snapshots', () => {
  it('matches the default motion profile for key surfaces', () => {
    const { asFragment } = render(<MotionSurfaceFixture />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the reduced-motion fallback profile for key surfaces', () => {
    const { asFragment } = render(<MotionSurfaceFixture reduced />);
    expect(asFragment()).toMatchSnapshot();
  });
});
