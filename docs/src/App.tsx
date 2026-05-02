import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { Animate, AnimateStagger } from '@pras75299/animix/react';
import {
  CodeBlock,
  CommandPalette,
  Icon,
  ReducedMotionBadge,
  SectionHead,
  SnippetTabs,
  ThemeToggle,
} from './components';
import {
  type CatalogItem,
  type InstallMode,
  type RepoMetrics,
  accessibilityNotes,
  catalogItems,
  changelogHighlights,
  comparisonColumns,
  comparisonRows,
  cssSteps,
  cssTabs,
  fallbackMetrics,
  installTabs,
  navItems,
  pairingNotes,
  pairingTabs,
  proofItems,
  reactApiCards,
  reactCaveats,
  reactNotes,
  reactTabs,
  recipeTabs,
  repoLinks,
  searchItems,
  shadcnRows,
  tailwindNotes,
  tailwindTabs,
  tokenRows,
  toolChoiceCards,
  viewTransitionTabs,
} from './data';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function formatCompact(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

const popoverStyle = {
  '--transform-origin': '1.25rem top',
} as CSSProperties;

/* Real bundle metrics (measured from dist/ + src/ at build time).
   Update these only when measurements change. */
const pathwayCards = [
  {
    title: 'Pure CSS',
    href: '#css',
    body: 'Fastest adoption. Import once, ship classes.',
    snippet: '@pras75299/animix/css',
    stats: ['0 kB runtime', '8.8 kB css', 'from 1 kB cherry-picked'],
  },
  {
    title: 'Tailwind plugin',
    href: '#tailwind',
    body: 'Alias layer for utility-driven teams. Build-time only.',
    snippet: 'plugins: [animix()]',
    stats: ['0 kB runtime', 'build-time only', 'shared tokens'],
  },
  {
    title: 'React bindings',
    href: '#react',
    body: 'Composition, stagger, hooks — no separate runtime.',
    snippet: '@pras75299/animix/react',
    stats: ['3.0 kB js', 'react peer only', '3 hooks included'],
  },
];

/* -------------------------------------------------------------------------- */
/* useScrollSpy                                                                */
/* -------------------------------------------------------------------------- */

function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const seen = new Map<string, number>();

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const id = entry.target.id;
        seen.set(id, entry.intersectionRatio);
      }
      let bestId = ids[0] ?? '';
      let bestRatio = 0;
      for (const id of ids) {
        const ratio = seen.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (bestRatio > 0) setActive(bestId);
    };

    const io = new IntersectionObserver(onIntersect, {
      rootMargin: '-30% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    observers.push(io);

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

/* -------------------------------------------------------------------------- */
/* useRepoMetrics                                                              */
/* -------------------------------------------------------------------------- */

function useRepoMetrics() {
  const [metrics, setMetrics] = useState<RepoMetrics>(fallbackMetrics);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const [repoRes, versionRes, downloadsRes] = await Promise.all([
          fetch('https://api.github.com/repos/pras75299/animix', {
            signal: controller.signal,
          }),
          fetch('https://registry.npmjs.org/@pras75299%2Fanimix/latest', {
            signal: controller.signal,
          }),
          fetch('https://api.npmjs.org/downloads/point/last-month/@pras75299/animix', {
            signal: controller.signal,
          }),
        ]);

        const repo = repoRes.ok ? await repoRes.json() : null;
        const version = versionRes.ok ? await versionRes.json() : null;
        const downloads = downloadsRes.ok ? await downloadsRes.json() : null;

        setMetrics({
          stars:
            typeof repo?.stargazers_count === 'number'
              ? formatCompact(repo.stargazers_count)
              : fallbackMetrics.stars,
          forks:
            typeof repo?.forks_count === 'number'
              ? formatCompact(repo.forks_count)
              : fallbackMetrics.forks,
          issues:
            typeof repo?.open_issues_count === 'number'
              ? formatCompact(repo.open_issues_count)
              : fallbackMetrics.issues,
          version: version?.version ? `v${version.version}` : fallbackMetrics.version,
          downloads:
            typeof downloads?.downloads === 'number'
              ? formatCompact(downloads.downloads)
              : fallbackMetrics.downloads,
        });
      } catch {
        setMetrics(fallbackMetrics);
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  return metrics;
}

/* -------------------------------------------------------------------------- */
/* Hero — token playground                                                     */
/* -------------------------------------------------------------------------- */

const easeOptions = [
  { label: 'out (ui)', value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  { label: 'in (exit)', value: 'cubic-bezier(0.64, 0, 0.78, 0)' },
  { label: 'spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { label: 'linear', value: 'linear' },
] as const;

function Hero({ metrics }: { metrics: RepoMetrics }) {
  const [duration, setDuration] = useState(280);
  const [distance, setDistance] = useState(20);
  const [ease, setEase] = useState<string>(easeOptions[0].value);
  const [pulse, setPulse] = useState(0);

  const stageStyle = {
    '--animix-duration-base': `${duration}ms`,
    '--animix-slide-distance': `${distance}px`,
    '--animix-ease-out': ease,
    '--animix-ease-default': ease,
  } as CSSProperties;

  function replay() {
    setPulse((p) => p + 1);
  }

  return (
    <section id="overview" className="docs-hero">
      <div className="docs-hero-eyebrow">A motion language for product UI</div>
      <Animate animation="slide-up" trigger="mount">
        <h1 className="docs-hero-title">
          Motion that ships, <em>not motion that demos.</em>
        </h1>
      </Animate>

      <Animate animation="fade" trigger="mount">
        <p className="docs-hero-lede">
          animix is a CSS-first animation system spanning Tailwind, React, and shadcn/ui. Tune the
          motion below — every token here flows through to every consumption mode.
        </p>
      </Animate>

      <div className="docs-hero-actions">
        <a className="docs-btn docs-btn-primary" href="#install">
          Install animix
          <Icon name="arrow-up-right" size={14} />
        </a>
        <a className="docs-btn docs-btn-secondary" href="#catalog">
          Browse the catalog
        </a>
      </div>

      <AnimateStagger animation="fade" delay={50} className="docs-metrics">
        <a className="docs-metric" href={repoLinks.github} target="_blank" rel="noreferrer">
          <span className="docs-metric-label">Stars</span>
          <span className="docs-metric-value">{metrics.stars}</span>
        </a>
        <a className="docs-metric" href={repoLinks.github} target="_blank" rel="noreferrer">
          <span className="docs-metric-label">Forks</span>
          <span className="docs-metric-value">{metrics.forks}</span>
        </a>
        <a className="docs-metric" href={repoLinks.issues} target="_blank" rel="noreferrer">
          <span className="docs-metric-label">Issues</span>
          <span className="docs-metric-value">{metrics.issues}</span>
        </a>
        <a className="docs-metric" href={repoLinks.npm} target="_blank" rel="noreferrer">
          <span className="docs-metric-label">Version</span>
          <span className="docs-metric-value">{metrics.version}</span>
        </a>
        <a className="docs-metric" href={repoLinks.npm} target="_blank" rel="noreferrer">
          <span className="docs-metric-label">Downloads</span>
          <span className="docs-metric-value">{metrics.downloads}</span>
        </a>
      </AnimateStagger>

      <div className="docs-hero-grid" style={{ marginTop: 'var(--sp-7)' }}>
        <Animate animation="slide-up" trigger="mount">
          <div className="docs-playground" style={stageStyle}>
            <div className="docs-playground-head">
              <span>token playground · live</span>
              <span className="docs-playground-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>

            <div className="docs-playground-stage">
              <AnimateStagger
                key={pulse}
                animation="slide-up"
                delay={70}
                className="docs-playground-stack"
              >
                <div className="docs-playground-card">animix-in-slide-up</div>
                <div className="docs-playground-card">--animix-slide-distance · {distance}px</div>
                <div className="docs-playground-card">--animix-duration-base · {duration}ms</div>
              </AnimateStagger>
            </div>

            <div className="docs-playground-controls">
              <label className="docs-control">
                <span className="docs-control-label">
                  Duration <code>{duration}ms</code>
                </span>
                <input
                  type="range"
                  min={80}
                  max={600}
                  step={20}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  aria-label="Animation duration"
                />
              </label>
              <label className="docs-control">
                <span className="docs-control-label">
                  Distance <code>{distance}px</code>
                </span>
                <input
                  type="range"
                  min={4}
                  max={60}
                  step={2}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  aria-label="Slide distance"
                />
              </label>
              <label className="docs-control">
                <span className="docs-control-label">Ease</span>
                <select
                  value={ease}
                  onChange={(e) => setEase(e.target.value)}
                  aria-label="Easing curve"
                >
                  {easeOptions.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="button" className="docs-playground-replay" onClick={replay}>
              <Icon name="play" size={11} /> Replay
            </button>
          </div>
        </Animate>

        <Animate animation="fade" trigger="mount">
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--f-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-muted)',
              }}
            >
              what you change here
            </p>
            <h3
              style={{
                margin: '8px 0 16px',
                fontWeight: 600,
                fontSize: 'var(--fs-xl)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Works the same in every consumption mode.
            </h3>
            <CodeBlock
              title="Same tokens, three integrations"
              code={`/* CSS */
.card { animation: animix-slide-up-in var(--animix-duration-base) var(--animix-ease-out); }

/* Tailwind */
<div class="animate-animix-slide-up" />

/* React */
<Animate animation="slide-up">{children}</Animate>`}
            />
          </div>
        </Animate>
      </div>
    </section>
  );
}

function ExitPatternDemo() {
  const [open, setOpen] = useState(true);
  const [exiting, setExiting] = useState(false);

  function replay() {
    setOpen(true);
    setExiting(false);
  }

  function dismiss() {
    if (open && !exiting) {
      setExiting(true);
    }
  }

  return (
    <div
      className="docs-card"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--sp-2)',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <strong>Live exit flow</strong>
          <p style={{ marginTop: 6 }}>Parent holds mount state, child only receives `exiting`.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="docs-btn docs-btn-secondary" onClick={replay}>
            Replay
          </button>
          <button
            type="button"
            className="docs-btn docs-btn-primary"
            onClick={dismiss}
            disabled={!open || exiting}
          >
            {exiting ? 'Closing…' : 'Dismiss'}
          </button>
        </div>
      </div>

      <div
        style={{
          minHeight: 136,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--c-rule)',
          background: 'var(--c-panel-2)',
          padding: 'var(--sp-3)',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {open ? (
          <Animate
            animation="slide-up"
            exitAnimation="scale-down"
            exiting={exiting}
            onEnd={() => {
              if (exiting) {
                setOpen(false);
                setExiting(false);
              }
            }}
          >
            <div className="docs-motion-card" style={{ maxWidth: 360 }}>
              Saved. Remove me only after the exit completes.
            </div>
          </Animate>
        ) : (
          <div className="docs-motion-loader-row">
            The toast is fully unmounted. Replay to run it again.
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Catalog gallery                                                             */
/* -------------------------------------------------------------------------- */

const catalogCategories = ['All', 'Entrance', 'Exit', 'Attention', 'Loader / Transition'] as const;

function CatalogTile({ item }: { item: CatalogItem }) {
  const [pulse, setPulse] = useState(0);
  const [copied, setCopied] = useState(false);
  const shapeClass = useMemo(() => `${item.className} docs-tile-shape`, [item.className]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      if (!navigator.clipboard) return;
      await navigator.clipboard.writeText(`.${item.className}`);
      setCopied(true);
    } catch {
      /* no-op */
    }
  }

  return (
    <button
      type="button"
      className="docs-tile"
      onClick={() => setPulse((p) => p + 1)}
      onMouseEnter={() => setPulse((p) => p + 1)}
      aria-label={`Replay ${item.className}`}
    >
      <span
        className={`docs-tile-copy${copied ? ' is-copied' : ''}`}
        role="button"
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            void handleCopy(e as unknown as React.MouseEvent);
          }
        }}
        aria-label={`Copy class ${item.className}`}
      >
        <Icon name={copied ? 'check' : 'copy'} size={12} />
      </span>
      <div className="docs-tile-stage">
        <span key={pulse} className={shapeClass} aria-hidden="true" />
      </div>
      <div className="docs-tile-meta">
        <span className="docs-tile-cat">{item.category}</span>
        <span className="docs-tile-name">.{item.className}</span>
        <span
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--c-ink-3)',
            marginTop: 4,
          }}
        >
          {item.blurb}
        </span>
      </div>
    </button>
  );
}

function Catalog() {
  const [active, setActive] = useState<(typeof catalogCategories)[number]>('All');
  const items = useMemo(
    () =>
      active === 'All' ? catalogItems : catalogItems.filter((item) => item.category === active),
    [active],
  );

  return (
    <section id="catalog" className="docs-section">
      <SectionHead
        num="11 / 14"
        eyebrow="Animation Catalog"
        title={
          <>
            A small vocabulary, <em>each tied to a clear product purpose.</em>
          </>
        }
        body="Hover or tap to replay. Click the corner badge to copy the class name. Filter by family to find what fits the surface you're building."
      />

      <div className="docs-catalog-bar" role="tablist">
        {catalogCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`docs-chip${active === cat ? ' is-active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="docs-catalog-grid">
        {items.map((item) => (
          <CatalogTile key={item.className} item={item} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* App                                                                         */
/* -------------------------------------------------------------------------- */

export function App() {
  const [installMode, setInstallMode] = useState<InstallMode>('npm');
  const [motionMode, setMotionMode] = useState<'full' | 'reduced'>('full');
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const metrics = useRepoMetrics();
  const navIds = useMemo(() => navItems.map((n) => n.id), []);
  const activeId = useScrollSpy(navIds);

  const installTab = installTabs[installMode];

  // Global keyboard shortcuts.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen((o) => !o);
      } else if (e.key === '/' && !isEditable && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setCmdkOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="docs-app">
      <div className="docs-bg docs-bg-grain" aria-hidden="true" />
      <div className="docs-bg docs-bg-grid" aria-hidden="true" />

      <header className="docs-header">
        <a href="#overview" className="docs-brand" aria-label="animix docs home">
          <span className="docs-brand-mark">a</span>
          <span className="docs-brand-text">
            <em>animix</em>
            <small>docs</small>
          </span>
        </a>

        <nav className="docs-top-nav" aria-label="Primary">
          {navItems.slice(1, 7).map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="docs-header-actions">
          <ReducedMotionBadge />
          <button
            type="button"
            className="docs-search-trigger"
            onClick={() => setCmdkOpen(true)}
            aria-label="Open search"
          >
            <Icon name="search" size={14} />
            <span className="docs-search-trigger-label">Search docs</span>
            <span className="docs-kbd">⌘K</span>
          </button>
          <ThemeToggle />
          <a
            href={repoLinks.github}
            className="docs-icon-btn"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <Icon name="github" />
          </a>
          <a href={repoLinks.npm} className="docs-link-btn" target="_blank" rel="noreferrer">
            npm
            <Icon name="arrow-up-right" size={12} />
          </a>
        </div>
      </header>

      <main className="docs-shell">
        <aside className="docs-sidebar" aria-label="Documentation sections">
          <p className="docs-sidebar-label">Documentation · {navItems.length} sections</p>
          <ol className="docs-sidebar-list">
            {navItems.map((item, idx) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={activeId === item.id ? 'is-active' : ''}>
                  <span className="num">{String(idx + 1).padStart(2, '0')}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>

          <div className="docs-sidebar-aside">
            <strong>Heads up</strong>
            Live metrics, command-palette search, and the token playground are part of these docs.
            Press <span className="docs-kbd">⌘K</span> to jump anywhere.
          </div>
        </aside>

        <div className="docs-main">
          <Hero metrics={metrics} />

          {/* Proof strip */}
          <section className="docs-proof" aria-label="Library highlights">
            {proofItems.map((p) => (
              <div key={p.num} className="docs-proof-cell">
                <span className="docs-proof-num">{p.num}</span>
                <strong>{p.title}</strong>
                <p>{p.body}</p>
              </div>
            ))}
          </section>

          {/* 02 — Install */}
          <section id="install" className="docs-section">
            <SectionHead
              num="02 / 14"
              eyebrow="Getting Started"
              title={
                <>
                  Install once, then <em>choose the authoring model</em> that matches your stack.
                </>
              }
              body="animix is intentionally CSS-first. The other integrations build on the same primitives instead of inventing separate motion systems."
            />

            <div className="docs-tabs">
              <div className="docs-tab-list" role="tablist">
                {(Object.keys(installTabs) as InstallMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="tab"
                    aria-selected={mode === installMode}
                    onClick={() => setInstallMode(mode)}
                    className={mode === installMode ? 'is-active' : ''}
                  >
                    {installTabs[mode].label}
                  </button>
                ))}
              </div>

              <div className="docs-install-row">
                <div className="docs-install-copy">
                  <h3>{installTab.title}</h3>
                  <p>{installTab.description}</p>
                  <p className="docs-install-meta">
                    Same package, three authoring modes — pick whichever fits your stack and keep
                    them aligned through shared tokens.
                  </p>
                </div>
                <CodeBlock title={installTab.title} code={installTab.code} />
              </div>

              <AnimateStagger animation="slide-up" delay={80} inView className="docs-pathways">
                {pathwayCards.map((card, idx) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className="docs-pathway"
                    aria-label={`${card.title} — jump to section`}
                  >
                    <header className="docs-pathway-head">
                      <span className="docs-pathway-num">{String(idx + 1).padStart(2, '0')}</span>
                      <h4>{card.title}</h4>
                      <span className="docs-pathway-arrow" aria-hidden="true">
                        <Icon name="arrow-up-right" size={14} />
                      </span>
                    </header>
                    <p className="docs-pathway-body">{card.body}</p>
                    <code className="docs-pathway-snippet">{card.snippet}</code>
                    <ul className="docs-pathway-stats">
                      {card.stats.map((stat) => (
                        <li key={stat}>{stat}</li>
                      ))}
                    </ul>
                  </a>
                ))}
              </AnimateStagger>
            </div>
          </section>

          {/* 03 — Pure CSS */}
          <section id="css" className="docs-section">
            <SectionHead
              num="03 / 14"
              eyebrow="Pure CSS"
              title={
                <>
                  Class names first, <em>modifiers second.</em>
                </>
              }
              body="Use one semantic animation class per element, then layer timing, delay, repeat, and trigger modifiers only where they clarify behavior."
            />

            <AnimateStagger
              animation="slide-up"
              delay={70}
              inView
              className="docs-grid docs-grid-3 docs-mb-5"
            >
              {cssSteps.map((step, idx) => (
                <article key={step.title} className="docs-card">
                  <span
                    style={{
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      color: 'var(--c-muted)',
                    }}
                  >
                    STEP {String(idx + 1).padStart(2, '0')}
                  </span>
                  <strong style={{ marginTop: 8 }}>{step.title}</strong>
                  <p>{step.body}</p>
                </article>
              ))}
            </AnimateStagger>

            <div className="docs-split">
              <SnippetTabs tabs={cssTabs} initialId="bundle" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <div className="docs-card">
                  <strong>Common mistakes</strong>
                  <ul
                    style={{
                      margin: '8px 0 0',
                      paddingLeft: 20,
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--c-ink-3)',
                      lineHeight: 1.6,
                    }}
                  >
                    <li>Stacking multiple entrance classes on the same element.</li>
                    <li>Animating repeated keyboard flows like a command palette panel.</li>
                    <li>
                      Starting from <code>scale(0)</code> when scale and opacity already communicate
                      entry.
                    </li>
                  </ul>
                </div>
                <CodeBlock
                  title="Typed class exports"
                  code={`import { animix, animateAnimix } from '@pras75299/animix/classes';

const cardEnter = animix.entrance.slideUp;
const toastExit = animix.exit.scaleDown;
const tailwindAlias = animateAnimix.transitions.modalIn;`}
                />
              </div>
            </div>
          </section>

          {/* 04 — Tailwind */}
          <section id="tailwind" className="docs-section">
            <SectionHead
              num="04 / 14"
              eyebrow="Tailwind Plugin"
              title={
                <>
                  An alias layer for the <em>utility-driven half</em> of your codebase.
                </>
              }
              body="The plugin is most useful when motion should feel like part of the design system rather than a separate CSS carve-out."
            />

            <div className="docs-split docs-split-aside">
              <AnimateStagger animation="slide-up" delay={70} inView className="docs-grid">
                {tailwindNotes.map((note) => (
                  <article key={note.title} className="docs-card">
                    <strong>{note.title}</strong>
                    <p>{note.body}</p>
                  </article>
                ))}
              </AnimateStagger>
              <SnippetTabs tabs={tailwindTabs} initialId="setup" />
            </div>
          </section>

          {/* 05 — React */}
          <section id="react" className="docs-section">
            <SectionHead
              num="05 / 14"
              eyebrow="React Bindings"
              title={
                <>
                  Composition and orchestration <em>without a separate runtime.</em>
                </>
              }
              body="The React API stays intentionally thin. It helps with wiring, unmount exits, viewport triggers, and client boundaries. The motion itself still comes from the same CSS source."
            />

            <AnimateStagger
              animation="slide-up"
              delay={60}
              inView
              className="docs-grid docs-grid-2 docs-grid-4 docs-mb-5"
            >
              {reactApiCards.map((card) => (
                <article key={card.title} className="docs-card">
                  <strong>{card.title}</strong>
                  <p>{card.body}</p>
                </article>
              ))}
            </AnimateStagger>

            <SnippetTabs tabs={Object.values(reactTabs)} initialId="animate" />

            <div className="docs-grid docs-grid-3" style={{ marginTop: 'var(--sp-5)' }}>
              {reactCaveats.map((note) => (
                <article key={note.title} className="docs-card">
                  <strong>{note.title}</strong>
                  <p>{note.body}</p>
                </article>
              ))}
            </div>

            <div className="docs-split" style={{ marginTop: 'var(--sp-5)' }}>
              <ExitPatternDemo />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {reactNotes.map((note) => (
                  <article key={note.title} className="docs-card">
                    <strong>{note.title}</strong>
                    <p>{note.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 06 — View Transitions */}
          <section id="view-transitions" className="docs-section">
            <SectionHead
              num="06 / 14"
              eyebrow="View Transitions"
              title={
                <>
                  A platform primitive with <em>very little established competition.</em>
                </>
              }
              body="animix already ships view-transition recipes in CSS. The gap was discoverability, not capability. This section surfaces how to use them for both same-document and cross-document flows."
            />

            <div className="docs-split docs-split-aside">
              <SnippetTabs tabs={viewTransitionTabs} initialId="same-document" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <article className="docs-card">
                  <strong>When to reach for it</strong>
                  <p>
                    Use View Transitions when the browser can animate between whole-screen states
                    more cleanly than hand-authored enter/exit classes. Navigation, filters, and
                    tabbed surfaces are the obvious wins.
                  </p>
                </article>
                <article className="docs-card">
                  <strong>What animix is doing</strong>
                  <p>
                    The shipped stylesheet defines old/new root recipes and reduced-motion guards.
                    You still decide where to call <code>document.startViewTransition()</code> and
                    which elements deserve named transitions.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* 07 — shadcn */}
          <section id="shadcn" className="docs-section">
            <SectionHead
              num="07 / 14"
              eyebrow="shadcn/ui"
              title={
                <>
                  Radix lifecycle attributes, <em>wired to motion families.</em>
                </>
              }
              body="Import the preset once and the data-state and data-side selectors drive component motion — without rewriting any component code."
            />

            <div className="docs-split">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <CodeBlock
                  title="globals.css"
                  code={`@tailwind base;
@tailwind components;
@tailwind utilities;

@import '@pras75299/animix/css';
@import '@pras75299/animix/shadcn';`}
                />
                <div className="docs-card">
                  <strong>Implementation note</strong>
                  <p>
                    Import <code>animix/shadcn</code> after your shadcn styles so the preset can
                    attach the correct animation properties without fighting earlier rules.
                  </p>
                </div>
              </div>

              <div className="docs-table-wrap">
                <table className="docs-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Open</th>
                      <th>Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shadcnRows.map(([component, open, close]) => (
                      <tr key={component}>
                        <td>{component}</td>
                        <td>{open}</td>
                        <td>{close}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 08 — Tokens */}
          <section id="tokens" className="docs-section">
            <SectionHead
              num="08 / 14"
              eyebrow="Token System"
              title={
                <>
                  Tune <em>distance, easing, duration</em> with CSS variables — not forks of
                  keyframes.
                </>
              }
              body="Token overrides are what make the library feel product-ready. They let one interface feel tighter, softer, or calmer without drifting away from the shared animation language."
            />

            <div className="docs-split">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <CodeBlock
                  title="Scoped token override"
                  code={`.pricing-grid {
  --animix-duration-base: 320ms;
  --animix-slide-distance: 24px;
  --animix-hover-lift: -4px;
}

.feature-card {
  --animix-scale-start: 0.96;
}`}
                />
                <div className="docs-card">
                  <strong>Where to override</strong>
                  <p>
                    Prefer setting tokens on a section wrapper, card cluster, or component root so
                    related motion stays coherent across children.
                  </p>
                </div>
              </div>

              <div className="docs-table-wrap">
                <table className="docs-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Default</th>
                      <th>Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenRows.map(([token, value, use]) => (
                      <tr key={token}>
                        <td>{token}</td>
                        <td>{value}</td>
                        <td style={{ fontFamily: 'var(--f-sans)', color: 'var(--c-ink-3)' }}>
                          {use}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 09 — Choose */}
          <section id="choose" className="docs-section">
            <SectionHead
              num="09 / 14"
              eyebrow="Choose the Right Tool"
              title={
                <>
                  Pick the smallest tool that fits, <em>then be explicit about the boundary.</em>
                </>
              }
              body="animix does not need to beat every animation tool at everything. It needs to win the lifecycle-motion layer clearly, then say where Motion, GSAP, Anime.js, or tailwindcss-animate are still the better fit."
            />

            <AnimateStagger
              animation="slide-up"
              delay={70}
              inView
              className="docs-grid docs-grid-3 docs-mb-5"
            >
              {toolChoiceCards.map((card) => (
                <article key={card.title} className="docs-card">
                  <strong>{card.title}</strong>
                  <p>{card.body}</p>
                </article>
              ))}
            </AnimateStagger>

            <div className="docs-split docs-split-aside">
              <div className="docs-table-wrap">
                <table className="docs-table">
                  <thead>
                    <tr>
                      {comparisonColumns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, idx) => (
                          <td key={`${row[0]}-${idx}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <article className="docs-card">
                  <strong>Where animix wins</strong>
                  <p>
                    Shared motion language, zero-runtime CSS by default, Tailwind aliases,
                    React-aware exits, and shadcn-ready component motion from one package.
                  </p>
                </article>
                <article className="docs-card">
                  <strong>What to deliberately skip</strong>
                  <p>
                    Layout animation, FLIP, drag, scroll choreography, physics, and arbitrary
                    timelines still belong to Motion, GSAP, or Anime.js. That is a boundary, not a
                    bug.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* 10 — Pairing */}
          <section id="pairing" className="docs-section">
            <SectionHead
              num="10 / 14"
              eyebrow="Pairing Guide"
              title={
                <>
                  Keep ownership clean when animix <em>ships beside another motion runtime.</em>
                </>
              }
              body="The safest hybrid setup is simple: animix owns lifecycle shells and shared tokens, while Motion, GSAP, or Anime.js own the few surfaces that truly need runtime choreography."
            />

            <div className="docs-split docs-split-aside">
              <SnippetTabs tabs={pairingTabs} initialId="motion" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {pairingNotes.map((note) => (
                  <article key={note.title} className="docs-card">
                    <strong>{note.title}</strong>
                    <p>{note.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 11 — Catalog */}
          <Catalog />

          {/* 12 — Accessibility */}
          <section id="accessibility" className="docs-section">
            <SectionHead
              num="12 / 14"
              eyebrow="Accessibility"
              title={
                <>
                  Reduced motion is built in — <em>but you still decide what moves.</em>
                </>
              }
              body="The library handles the mechanics. The implementation still needs to decide what should move, what should be silent, and what should be announced."
            />

            <div className="docs-split">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {accessibilityNotes.map((note) => (
                  <article key={note.title} className="docs-card">
                    <strong>{note.title}</strong>
                    <p>{note.body}</p>
                  </article>
                ))}
                <CodeBlock
                  title="User preference toggle"
                  code={`const prefersNoMotion = localStorage.getItem('motion') === 'off';
document.documentElement.classList.toggle('animix-no-motion', prefersNoMotion);`}
                />
              </div>

              <div>
                <div className="docs-motion-toggle" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={motionMode === 'full'}
                    onClick={() => setMotionMode('full')}
                    className={motionMode === 'full' ? 'is-active' : ''}
                  >
                    Full motion
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={motionMode === 'reduced'}
                    onClick={() => setMotionMode('reduced')}
                    className={motionMode === 'reduced' ? 'is-active' : ''}
                  >
                    Reduced motion
                  </button>
                </div>
                <div
                  className={`docs-motion-stage${
                    motionMode === 'reduced' ? ' animix-no-motion' : ''
                  }`}
                >
                  <div key={motionMode + 'a'} className="docs-motion-card animix-in-slide-up">
                    Settings updated
                  </div>
                  <div key={motionMode + 'b'} className="docs-motion-card animix-toast-in-bottom">
                    Toast feedback synced
                  </div>
                  <div className="docs-motion-loader-row">
                    <span className="animix-loader-spin" aria-hidden="true" />
                    Decorative loaders stay outside the accessibility tree.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 13 — Recipes */}
          <section id="recipes" className="docs-section">
            <SectionHead
              num="13 / 14"
              eyebrow="Implementation Recipes"
              title={
                <>
                  Patterns that <em>make product UI feel grounded.</em>
                </>
              }
              body="These are the patterns most teams need immediately: command surfaces, anchored popovers, and feedback stacks that behave consistently."
            />

            <div className="docs-recipes" style={{ marginBottom: 'var(--sp-5)' }}>
              <div className="docs-recipe">
                <span className="docs-recipe-label">Command palette</span>
                <div className="docs-recipe-stage">
                  <div className="docs-recipe-overlay animix-overlay-in" />
                  <div className="docs-recipe-panel animix-modal-in">
                    <input value="Search commands…" readOnly aria-label="Demo input" />
                    <AnimateStagger
                      animation="slide-up"
                      delay={45}
                      inView
                      className="docs-recipe-list"
                    >
                      <button type="button">Go to Dashboard</button>
                      <button type="button">Invite teammate</button>
                      <button type="button">Toggle theme</button>
                    </AnimateStagger>
                  </div>
                </div>
              </div>

              <div className="docs-recipe">
                <span className="docs-recipe-label">Popover + toast</span>
                <div className="docs-recipe-stage">
                  <div className="docs-toast-demo animix-toast-in-bottom">Changes synced</div>
                  <div className="docs-anchor-demo">
                    <button type="button" className="animix-focus-soft animix-press-in">
                      Invite member
                    </button>
                    <div className="docs-anchor-popover animix-tooltip-in" style={popoverStyle}>
                      Scale from the trigger, not the center.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <SnippetTabs tabs={Object.values(recipeTabs)} initialId="command" />
          </section>

          {/* 14 — Changelog */}
          <section id="changelog" className="docs-section">
            <SectionHead
              num="14 / 14"
              eyebrow="Changelog Highlights"
              title={
                <>
                  Release scope, <em>documented at parity.</em>
                </>
              }
              body="These highlights are pulled from the unreleased work tracked in the repository and form the surface area this docs site now explains."
            />

            <AnimateStagger
              animation="slide-up"
              delay={60}
              inView
              className="docs-grid docs-grid-2 docs-grid-3"
            >
              {changelogHighlights.map((item) => (
                <article key={item} className="docs-card">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: 'var(--c-accent-soft)',
                      color: 'var(--c-accent-ink)',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    Added
                  </span>
                  <p>{item}</p>
                </article>
              ))}
            </AnimateStagger>
          </section>

          <footer className="docs-footer">
            <div className="docs-footer-mark">
              <em>animix</em>
              <span>
                One motion language across pure CSS, Tailwind, React, and shadcn/ui. Reduced-motion
                safe by default.
              </span>
            </div>
            <div className="docs-footer-col">
              <strong>Project</strong>
              <a href={repoLinks.github} target="_blank" rel="noreferrer">
                GitHub repository
              </a>
              <a href={repoLinks.npm} target="_blank" rel="noreferrer">
                npm package
              </a>
              <a href={repoLinks.issues} target="_blank" rel="noreferrer">
                Issues
              </a>
            </div>
            <div className="docs-footer-col">
              <strong>Sections</strong>
              {navItems.slice(0, 6).map((n) => (
                <a key={n.id} href={`#${n.id}`}>
                  {n.label}
                </a>
              ))}
            </div>
          </footer>
        </div>
      </main>

      <CommandPalette open={cmdkOpen} onOpenChange={setCmdkOpen} items={searchItems} />
    </div>
  );
}
