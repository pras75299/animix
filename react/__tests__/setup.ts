import '@testing-library/jest-dom/vitest';

/**
 * Mock IntersectionObserver for jsdom (which doesn't support it natively).
 */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  private callback: IntersectionObserverCallback;
  private elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
    if (_options?.threshold) {
      this.thresholds = Array.isArray(_options.threshold)
        ? _options.threshold
        : [_options.threshold];
    }
    if (_options?.rootMargin) {
      this.rootMargin = _options.rootMargin;
    }
  }

  observe(target: Element): void {
    this.elements.add(target);
  }

  unobserve(target: Element): void {
    this.elements.delete(target);
  }

  disconnect(): void {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Test helper: simulate an element entering the viewport */
  simulateIntersection(isIntersecting: boolean): void {
    const entries: IntersectionObserverEntry[] = Array.from(this.elements).map((target) => ({
      target,
      isIntersecting,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now(),
    }));
    this.callback(entries, this);
  }
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

/**
 * Stub for CSS animation events — jsdom doesn't fire them natively.
 * We dispatch them manually in tests.
 */
