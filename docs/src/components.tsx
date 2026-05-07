import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Animate } from '@pras75299/animix/react';
import { type SearchItem, type ShadcnExample, type SnippetTab } from './data';

/* -------------------------------------------------------------------------- */
/* Icons — minimal stroke set, no emoji                                        */
/* -------------------------------------------------------------------------- */

export function Icon({
  name,
  size = 16,
}: {
  name:
    | 'search'
    | 'sun'
    | 'moon'
    | 'arrow-up-right'
    | 'copy'
    | 'check'
    | 'play'
    | 'corner-down-left'
    | 'github'
    | 'npm'
    | 'sparkle';
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'search':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      );
    case 'arrow-up-right':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      );
    case 'copy':
      return (
        <svg {...common} aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common} aria-hidden="true">
          <path d="m4 12 5 5L20 6" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M6 4 20 12 6 20Z" />
        </svg>
      );
    case 'corner-down-left':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M9 10 5 14l4 4M5 14h11a4 4 0 0 0 4-4V4" />
        </svg>
      );
    case 'github':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
        </svg>
      );
    case 'npm':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M2 6h20v12h-10v-2H6v2H2zm2 10h4v-6h2v6h2V8H4zm10-8v8h4V10h2v6h2V8z" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
        </svg>
      );
  }
}

/* -------------------------------------------------------------------------- */
/* CodeBlock                                                                   */
/* -------------------------------------------------------------------------- */

export function CodeBlock({ code, title }: { code: string; title: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function handleCopy() {
    try {
      if (!navigator.clipboard) return;
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="docs-code">
      <div className="docs-code-head">
        <span className="docs-code-head-title">{title}</span>
        <button
          type="button"
          className={`docs-copy${copied ? ' is-copied' : ''}`}
          onClick={handleCopy}
          aria-label={`Copy code: ${title}`}
        >
          <Icon name={copied ? 'check' : 'copy'} size={12} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SnippetTabs                                                                 */
/* -------------------------------------------------------------------------- */

export function SnippetTabs({ tabs, initialId }: { tabs: SnippetTab[]; initialId?: string }) {
  const [activeId, setActiveId] = useState(initialId ?? tabs[0]?.id ?? '');
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!activeTab) return null;

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, tabId: string) {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (currentIndex === -1) {
      return;
    }

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveId(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  }

  return (
    <div className="docs-tabs">
      <div className="docs-tab-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            tabIndex={tab.id === activeTab.id ? 0 : -1}
            aria-selected={tab.id === activeTab.id}
            aria-controls={`${baseId}-panel-${tab.id}`}
            onClick={() => setActiveId(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, tab.id)}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            className={tab.id === activeTab.id ? 'is-active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`${baseId}-panel-${activeTab.id}`}
        className="docs-tab-panel"
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeTab.id}`}
      >
        <div className="docs-tab-copy">
          <h3>{activeTab.title}</h3>
          <p>{activeTab.description}</p>
        </div>
        <CodeBlock title={activeTab.title} code={activeTab.code} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shadcn example cards                                                       */
/* -------------------------------------------------------------------------- */

const previewPopoverStyle = {
  '--transform-origin': '1rem top',
} as CSSProperties;

function renderShadcnPreview(example: ShadcnExample, pulse: number) {
  switch (example.id) {
    case 'dialog':
      return (
        <div key={pulse} className="docs-shadcn-preview-stack">
          <div className="docs-recipe-overlay animix-overlay-in" />
          <div className="docs-recipe-panel docs-shadcn-dialog animix-modal-in">
            <strong>Invite teammate</strong>
            <p>Pick a role before sending the invite.</p>
            <button type="button" tabIndex={-1} className="docs-shadcn-inline-btn">
              Send invite
            </button>
          </div>
        </div>
      );
    case 'sheet':
      return (
        <div key={pulse} className="docs-shadcn-preview-stack docs-shadcn-preview-end">
          <div className="docs-recipe-overlay animix-overlay-in" />
          <aside className="docs-shadcn-sheet animix-drawer-in-right">
            <strong>Filters</strong>
            <span>Status, owner, and billing state</span>
            <div className="docs-shadcn-chip-row">
              <span>Active</span>
              <span>Owner</span>
              <span>Overdue</span>
            </div>
          </aside>
        </div>
      );
    case 'popover':
      return (
        <div key={pulse} className="docs-shadcn-preview-stack docs-shadcn-preview-start">
          <div className="docs-anchor-demo">
            <button type="button" tabIndex={-1}>
              Role
            </button>
            <div className="docs-anchor-popover animix-tooltip-in" style={previewPopoverStyle}>
              Viewer, editor, and admin access
            </div>
          </div>
        </div>
      );
    case 'toast':
      return (
        <div key={pulse} className="docs-shadcn-preview-stack docs-shadcn-preview-end">
          <div className="docs-shadcn-toast-column">
            <div className="docs-toast-demo animix-toast-in-right">Changes synced</div>
            <div className="docs-toast-demo animix-toast-in-right">Billing owner invited</div>
          </div>
        </div>
      );
    case 'command':
      return (
        <div key={pulse} className="docs-shadcn-preview-stack">
          <div className="docs-recipe-overlay animix-overlay-in" />
          <div className="docs-recipe-panel docs-shadcn-command animix-scale-up-in">
            <input aria-label="Search commands" defaultValue="inv" readOnly tabIndex={-1} />
            <div className="docs-recipe-list">
              <button type="button" tabIndex={-1} className="animix-in-slide-up">
                Invite teammate
              </button>
              <button type="button" tabIndex={-1} className="animix-in-slide-up">
                Invoices
              </button>
              <button type="button" tabIndex={-1} className="animix-in-slide-up">
                Integrations
              </button>
            </div>
          </div>
        </div>
      );
    default: {
      const _exhaustive: never = example.id;
      return _exhaustive;
    }
  }
}

export function ShadcnExampleCard({ example }: { example: ShadcnExample }) {
  const [pulse, setPulse] = useState(0);

  return (
    <article className="docs-shadcn-card">
      <div className="docs-shadcn-card-head">
        <div className="docs-shadcn-card-copy">
          <p className="docs-shadcn-card-kicker">shadcn/ui recipe</p>
          <h3>{example.name}</h3>
          <p>{example.summary}</p>
        </div>

        <button
          type="button"
          className="docs-shadcn-replay"
          onClick={() => setPulse((value) => value + 1)}
          aria-label={`Replay ${example.name} preview`}
        >
          <Icon name="play" size={11} />
          Replay
        </button>
      </div>

      <div className={`docs-shadcn-stage docs-shadcn-stage-${example.id}`} aria-hidden="true">
        {renderShadcnPreview(example, pulse)}
      </div>

      <dl className="docs-shadcn-lifecycle">
        <div>
          <dt>Open</dt>
          <dd>{example.open}</dd>
        </div>
        <div>
          <dt>Close</dt>
          <dd>{example.close}</dd>
        </div>
      </dl>

      <SnippetTabs tabs={example.tabs} initialId="css" />
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* SectionHead                                                                 */
/* -------------------------------------------------------------------------- */

export function SectionHead({
  num,
  eyebrow,
  title,
  body,
}: {
  num: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
}) {
  return (
    <div className="docs-section-head">
      <div className="docs-section-num">{num}</div>
      <div className="docs-section-copy">
        <p className="docs-eyebrow">{eyebrow}</p>
        <Animate animation="slide-up" trigger="inView" inViewThreshold={0.2}>
          <h2>{title}</h2>
        </Animate>
        <p>{body}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ThemeToggle                                                                 */
/* -------------------------------------------------------------------------- */

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('animix-theme', theme);
    } catch {
      /* no-op */
    }
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
  };
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      className="docs-icon-btn"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="docs-theme-icon is-moon">
        <Icon name="moon" />
      </span>
      <span className="docs-theme-icon is-sun">
        <Icon name="sun" />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Reduced-motion banner                                                       */
/* -------------------------------------------------------------------------- */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function ReducedMotionBadge() {
  const reduced = useReducedMotion();
  if (!reduced) return null;
  return (
    <span className="docs-rm-banner is-active" role="status">
      Motion paused — system reduced motion is on
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Command Palette (⌘K)                                                        */
/* -------------------------------------------------------------------------- */

export function CommandPalette({
  open,
  onOpenChange,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItem[];
}) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? items.filter((item) =>
        `${item.title} ${item.body} ${item.keywords.join(' ')}`.toLowerCase().includes(normalized),
      )
    : items;

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
    setQuery('');
    setActiveIdx(0);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [normalized]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(results.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        const item = results[activeIdx];
        if (item) {
          window.location.hash = item.href;
          onOpenChange(false);
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIdx, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="docs-cmdk-backdrop animix-overlay-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
    >
      <div className="docs-cmdk animix-modal-in">
        <div className="docs-cmdk-input-wrap">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search docs, APIs, recipes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documentation"
          />
          <span className="docs-kbd">esc</span>
        </div>
        <div className="docs-cmdk-results">
          {results.length === 0 ? (
            <div className="docs-cmdk-empty">
              <strong>No matches for "{query}"</strong>
              <span>Try CSS, Tailwind, React, reduced motion, or shadcn.</span>
            </div>
          ) : (
            results.map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                className="docs-cmdk-item"
                data-active={idx === activeIdx}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => onOpenChange(false)}
              >
                <span className="docs-cmdk-item-icon" aria-hidden="true">
                  <Icon name="sparkle" size={14} />
                </span>
                <span className="docs-cmdk-item-text">
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </span>
                <span className="docs-cmdk-item-arrow" aria-hidden="true">
                  <Icon name="corner-down-left" size={14} />
                </span>
              </a>
            ))
          )}
        </div>
        <div className="docs-cmdk-foot">
          <span className="docs-cmdk-foot-group">
            <span>
              <span className="docs-kbd">↑</span>
              <span className="docs-kbd">↓</span>
              Navigate
            </span>
            <span>
              <span className="docs-kbd">↵</span>
              Open
            </span>
          </span>
          <span className="docs-cmdk-foot-group">
            <span>
              <span className="docs-kbd">esc</span>
              Close
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
