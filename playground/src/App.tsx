import { useState, type CSSProperties } from 'react';
import { Animate, AnimateStagger, usePrefersReducedMotion } from 'animix/react';

const cssEntranceSamples = [
  'animix-in-fade',
  'animix-in-slide-up',
  'animix-in-scale-up',
  'animix-in-blur',
  'animix-in-bounce',
] as const;

const tailwindSamples = [
  'animate-animix-fade-in',
  'animate-animix-slide-up animix-delay-150',
  'animate-animix-icon-success-pop',
  'animate-animix-text-headline-rise',
  'animate-animix-toast-in-bottom',
] as const;

const modernCssSamples = [
  'animix-scroll-reveal-up',
  'animix-scroll-reveal-scale',
  'animix-enter-fade',
  'animix-enter-up',
  'animix-enter-scale',
] as const;

const launchStats = [
  { label: 'Conversion uplift', value: '+28%' },
  { label: 'Average interaction', value: '4.2m' },
  { label: 'Task completion', value: '91%' },
] as const;

const featureCards = [
  {
    title: 'Onboarding Checklist',
    body: 'Stage first-run guidance with quick reveals and no wasted motion.',
    badgeClass: 'animix-in-slide-up',
  },
  {
    title: 'Revenue Pulse',
    body: 'Use restrained attention loops so metrics feel active, not noisy.',
    badgeClass: 'animix-pulse',
  },
  {
    title: 'Command Menu',
    body: 'Keep keyboard-invoked panels instant and save motion for surrounding context.',
    badgeClass: 'animix-in-fade',
  },
] as const;

const anchoredPopoverStyle = {
  '--transform-origin': '1.5rem top',
  transformOrigin: 'var(--transform-origin)',
} as CSSProperties;

function DemoCard({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`rounded-lg border border-zinc-200 bg-white px-4 py-6 text-center text-sm font-medium text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 ${className}`}
    >
      {label}
    </div>
  );
}

export function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [intensityBold, setIntensityBold] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [chevronOpen, setChevronOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [formError, setFormError] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  const intensityClass = intensityBold ? 'animix-intensity-bold' : 'animix-intensity-quiet';

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">animix playground</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Copy-paste recipes: micro-interactions, icons, text, images, Tailwind, and React{' '}
              <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">&lt;Animate&gt;</code>.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <span className="font-medium text-zinc-700 dark:text-zinc-200">Motion intensity</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIntensityBold(false)}
                className={`animix-press-in animix-focus-soft rounded-md px-3 py-1.5 text-xs font-medium ${
                  !intensityBold
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                }`}
              >
                Subtle
              </button>
              <button
                type="button"
                onClick={() => setIntensityBold(true)}
                className={`animix-press-in animix-focus-soft rounded-md px-3 py-1.5 text-xs font-medium ${
                  intensityBold
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                }`}
              >
                Expressive
              </button>
            </div>
            {prefersReducedMotion ? (
              <span className="text-xs text-amber-700 dark:text-amber-300">
                System: prefers-reduced-motion
              </span>
            ) : null}
          </div>
        </header>

        <div className={intensityClass}>
          <section className="space-y-5">
            <h2 className="text-lg font-semibold">Recipe: Product hero</h2>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-lg dark:border-zinc-700">
              <Animate animation="slide-up" trigger="mount" className="block">
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  240ms defaults · fast exits · origin-aware popovers
                </p>
              </Animate>
              <Animate animation="elastic" trigger="mount" intent="text" className="block">
                <h3 className="max-w-2xl text-3xl font-semibold leading-tight">
                  Ship interface motion that feels premium without heavy runtime.
                </h3>
              </Animate>
              <Animate animation="fade" trigger="mount" className="mt-4 block">
                <p className="max-w-2xl text-sm text-white/85">
                  The demo now mirrors the latest motion defaults: quicker UI timings, gentler scale starts, and hover behavior reserved for fine pointers.
                </p>
              </Animate>
              <div className="mt-6 flex flex-wrap gap-3">
                <Animate animation="bounce" trigger="mount" intent="button" className="inline-block">
                  <button
                    type="button"
                    className="animix-press-in animix-focus-soft rounded-md bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm"
                  >
                    Primary CTA
                  </button>
                </Animate>
                <Animate animation="fade" trigger="mount" className="inline-block">
                  <button
                    type="button"
                    className="animix-press-in animix-focus-soft rounded-md border border-white/40 px-4 py-2 text-sm font-medium text-white"
                  >
                    Secondary
                  </button>
                </Animate>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe: Auth field + inline status</h2>
            <div className="grid gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</label>
                <input
                  type="email"
                  defaultValue="hello@"
                  className={`animix-focus-soft w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-zinc-950 ${
                    formError ? 'animate-animix-icon-shake-soft border-red-400' : 'border-zinc-200 dark:border-zinc-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setFormError((v) => !v)}
                  className="animix-hover-lift animix-press-in animix-focus-soft rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Toggle validation shake
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Save status</p>
                <div className="animix-inline-swap min-h-[2rem] text-sm">
                  <span
                    className={
                      swapSuccess
                        ? 'animix-inline-swap-hidden text-zinc-500'
                        : 'animix-inline-swap-visible text-zinc-600 dark:text-zinc-300'
                    }
                  >
                    Unsaved changes
                  </span>
                  <span
                    className={
                      swapSuccess
                        ? 'animix-inline-swap-visible font-medium text-emerald-600 dark:text-emerald-400'
                        : 'animix-inline-swap-hidden text-emerald-600'
                    }
                  >
                    All changes saved
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSwapSuccess((s) => !s)}
                  className="animix-press-in animix-focus-soft rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-600"
                >
                  Toggle status
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe: Command palette</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Button-triggered demo with a fast overlay and staggered rows. Skip panel motion when this is keyboard-invoked in production.
            </p>
            <button
              type="button"
              onClick={() => setPaletteOpen((o) => !o)}
              className="animix-active-pop animix-focus-soft rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-900"
            >
              {paletteOpen ? 'Close palette' : 'Open palette'}
            </button>
            {paletteOpen ? (
              <div className="animate-animix-overlay-in rounded-xl border border-zinc-200 bg-zinc-950/40 p-4 dark:border-zinc-700">
                <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                  <input
                    type="search"
                    placeholder="Search commands…"
                    className="animix-focus-soft w-full rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
                    autoFocus
                  />
                  <AnimateStagger animation="slide-up" delay={50} className="mt-3 flex flex-col gap-1">
                    <button
                      type="button"
                      className="animix-focus-soft animix-press-in rounded-md bg-zinc-100 px-2 py-2 text-left text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      type="button"
                      className="animix-focus-soft animix-press-in rounded-md px-2 py-2 text-left text-sm text-zinc-600 dark:text-zinc-300"
                    >
                      Invite teammate
                    </button>
                    <button
                      type="button"
                      className="animix-focus-soft animix-press-in rounded-md px-2 py-2 text-left text-sm text-zinc-600 dark:text-zinc-300"
                    >
                      Toggle theme
                    </button>
                  </AnimateStagger>
                </div>
              </div>
            ) : null}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe: Notification stack</h2>
            <div className="relative mx-auto max-w-sm space-y-2">
              <div className="animate-animix-toast-in rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                Deploy started on <strong>preview</strong>
              </div>
              <div className="animate-animix-toast-in-bottom rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
                Build succeeded · 8 assets
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe: Media gallery (image pack)</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {['Photo A', 'Photo B', 'Photo C'].map((label) => (
                <div
                  key={label}
                  className="animix-img-zoom-wrap animix-scroll-reveal-up overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
                >
                  <img
                    src={`https://picsum.photos/seed/${label}/400/240`}
                    alt=""
                    className="aspect-[5/3] object-cover"
                    loading="lazy"
                  />
                  <p className="bg-white px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                    {label} · fine-pointer hover zoom
                  </p>
                </div>
              ))}
            </div>
            <div className="h-32 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              <div className="animix-img-shimmer h-full w-full" aria-hidden />
              <p className="-mt-8 px-2 text-xs text-zinc-500">Shimmer placeholder (loading)</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe: Icons + disclosure</h2>
            <div className="flex flex-wrap items-center gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setChevronOpen((c) => !c)}
                aria-expanded={chevronOpen}
                className="animix-focus-soft animix-press-in flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-600"
              >
                <span>Section</span>
                <svg
                  className="animix-icon-chevron size-4"
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <span className="animate-animix-icon-spin inline-block size-6 rounded-full border-2 border-violet-500 border-t-transparent" />
              <span className="animate-animix-icon-success-pop inline-flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                ✓
              </span>
              <button
                type="button"
                className="animate-animix-icon-bell-ring text-lg"
                aria-label="Demo bell ring"
              >
                🔔
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe: Kinetic headline (text pack)</h2>
            <h3 className="animix-text-stagger max-w-xl text-2xl font-semibold tracking-tight">
              <span>Ship</span> <span>motion</span> <span>that</span> <span>respects</span>{' '}
              <span>users.</span>
            </h3>
            <p className="animate-animix-text-headline-rise text-zinc-600 dark:text-zinc-400">
              Single-line headline rise via Tailwind utility.
            </p>
            <p>
              <span
                className="animix-text-underline-sweep cursor-pointer font-medium text-violet-600 dark:text-violet-400"
                tabIndex={0}
              >
                Hover on pointer devices or focus for underline sweep
              </span>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe: Tabs + accordion (state CSS)</h2>
            <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                className="animix-tab-underline animix-focus-soft animix-press-in pb-2 text-sm font-medium"
                aria-selected="true"
              >
                Overview
              </button>
              <button
                type="button"
                className="animix-tab-underline animix-focus-soft animix-press-in pb-2 text-sm text-zinc-500 dark:text-zinc-400"
              >
                Activity
              </button>
            </div>
            <button
              type="button"
              onClick={() => setAccordionOpen((a) => !a)}
              className="animix-focus-soft animix-press-in rounded-md text-sm font-medium text-violet-600 dark:text-violet-400"
            >
              {accordionOpen ? 'Collapse' : 'Expand'} panel
            </button>
            <div className="animix-accordion rounded-lg border border-zinc-200 dark:border-zinc-700" data-open={accordionOpen ? 'true' : 'false'}>
              <div className="animix-accordion-inner">
                <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                  Accordion body using <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">grid-template-rows</code> transition.
                  Pair with <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">data-open</code> from your framework state.
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Real example: KPI cards</h2>
            <AnimateStagger animation="slide-up" delay={60} inView className="grid gap-4 sm:grid-cols-3">
              {launchStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {stat.value}
                  </p>
                </div>
              ))}
            </AnimateStagger>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Real example: Feature grid</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <Animate key={card.title} animation="slide-up" trigger="inView" intent="image" className="block">
                  <article className="animix-hover-lift animix-active-pop rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                    <span
                      className={`mb-4 inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200 ${card.badgeClass}`}
                    >
                      live
                    </span>
                    <h3 className="text-base font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{card.body}</p>
                  </article>
                </Animate>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">CSS class catalog</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cssEntranceSamples.map((cls) => (
                <DemoCard key={cls} label={cls.replace(/^animix-in-/, '')} className={cls} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Tailwind animate-animix-* aliases</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tailwindSamples.map((cls) => (
                <DemoCard
                  key={cls}
                  label={cls.split(' ')[0].replace('animate-animix-', '')}
                  className={cls}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">React · intent + inView</h2>
            <div className="flex flex-wrap gap-4">
              <Animate animation="elastic" trigger="mount" intent="icon" className="inline-block">
                <div className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-md">
                  intent=&quot;icon&quot; · elastic
                </div>
              </Animate>
              <Animate animation="fade" trigger="mount" easing="in-out" className="inline-block">
                <div className="rounded-lg border-2 border-dashed border-violet-400 px-5 py-3 text-sm font-medium text-violet-800 dark:text-violet-200">
                  easing=&quot;in-out&quot; · fade
                </div>
              </Animate>
            </div>
            <div className="pt-16">
              <Animate animation="slide-up" trigger="inView" inViewThreshold={0.2} className="inline-block">
                <div className="rounded-lg bg-emerald-600 px-6 py-4 text-sm font-medium text-white shadow-md">
                  inView · slide-up
                </div>
              </Animate>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Toast + popover (utilities)</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="animate-animix-toast-in rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  Build finished successfully.
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="rounded-md bg-zinc-900/5 p-3 dark:bg-zinc-100/5">
                  <button
                    type="button"
                    className="animix-focus-soft animix-press-in rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium dark:border-zinc-600"
                  >
                    Invite member
                  </button>
                  <div
                    className="animate-animix-tooltip-in mt-3 inline-flex max-w-xs rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    style={anchoredPopoverStyle}
                  >
                    Popovers now scale from the trigger instead of the center.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Modern CSS (scroll + starting-style)</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modernCssSamples.map((cls) => (
                <DemoCard key={cls} label={cls.replace(/^animix-/, '')} className={cls} />
              ))}
            </div>
            <div className="h-24 rounded-lg border border-dashed border-zinc-300 bg-zinc-100 p-2 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              Scroll the page — reveal utilities use view timelines where supported.
            </div>
            <div className="space-y-3 pt-4">
              <div className="animix-scroll-reveal-up rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-md">
                scroll-reveal-up
              </div>
              <div className="animix-scroll-progress h-1 rounded bg-emerald-500" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">View transitions (MPA)</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Import <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">animix/css/view-transitions</code> for
              same-origin cross-document transitions with the updated fast-out timing pair.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">AnimateStagger</h2>
            <AnimateStagger animation="slide-up" delay={60} inView className="flex flex-col gap-3">
              <div className="rounded-md bg-zinc-200 px-4 py-3 text-sm dark:bg-zinc-800">First</div>
              <div className="rounded-md bg-zinc-200 px-4 py-3 text-sm dark:bg-zinc-800">Second</div>
              <div className="rounded-md bg-zinc-200 px-4 py-3 text-sm dark:bg-zinc-800">Third</div>
            </AnimateStagger>
          </section>
        </div>
      </div>
    </div>
  );
}
