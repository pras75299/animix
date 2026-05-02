import '@testing-library/jest-dom/vitest';

/**
 * Mock IntersectionObserver for jsdom (which doesn't support it natively).
 */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  private callback: IntersectionObserverCallback;
  private elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
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

function clearIntersectionObservers() {
  MockIntersectionObserver.instances = [];
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

type MatchMediaListener = EventListenerOrEventListenerObject;

function callMediaListener(listener: MatchMediaListener, event: MediaQueryListEvent) {
  if (typeof listener === 'function') {
    listener(event);
    return;
  }
  listener.handleEvent(event);
}

class MockMediaQueryList implements MediaQueryList {
  readonly media: string;
  readonly onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null = null;

  private listeners = new Set<MatchMediaListener>();
  private legacyListeners = new Set<
    (this: MediaQueryList, ev: MediaQueryListEvent) => void | Promise<void>
  >();
  private _matches: boolean;

  constructor(media: string, matches: boolean) {
    this.media = media;
    this._matches = matches;
  }

  get matches(): boolean {
    return this._matches;
  }

  setMatches(next: boolean) {
    this._matches = next;
    const event = { matches: next, media: this.media } as MediaQueryListEvent;
    this.listeners.forEach((listener) => callMediaListener(listener, event));
    this.legacyListeners.forEach((listener) => listener.call(this, event));
  }

  addEventListener(_type: string, listener: MatchMediaListener): void {
    this.listeners.add(listener);
  }

  removeEventListener(_type: string, listener: MatchMediaListener): void {
    this.listeners.delete(listener);
  }

  addListener(
    listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => void | Promise<void>) | null,
  ): void {
    if (!listener) {
      return;
    }
    this.legacyListeners.add(listener);
  }

  removeListener(
    listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => void | Promise<void>) | null,
  ): void {
    if (!listener) {
      return;
    }
    this.legacyListeners.delete(listener);
  }

  dispatchEvent(): boolean {
    return true;
  }
}

const mediaQueries = new Map<string, MockMediaQueryList>();

function setMediaQueryMatch(media: string, matches: boolean) {
  const query = mediaQueries.get(media) ?? new MockMediaQueryList(media, matches);
  mediaQueries.set(media, query);
  query.setMatches(matches);
}

const matchMedia = (media: string) => {
  const query = mediaQueries.get(media) ?? new MockMediaQueryList(media, false);
  mediaQueries.set(media, query);
  return query;
};

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMedia,
  });
} else {
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMedia,
  });
}

Object.defineProperty(globalThis, '__animixTestUtils', {
  writable: true,
  configurable: true,
  value: {
    clearIntersectionObservers,
    getIntersectionObservers: () => MockIntersectionObserver.instances,
    setMediaQueryMatch,
  },
});

/**
 * Stub for CSS animation events — jsdom doesn't fire them natively.
 * We dispatch them manually in tests.
 */
