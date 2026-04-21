import { Animate, AnimateStagger } from 'animix/react';

const cssEntranceSamples = [
  'animix-in-fade',
  'animix-in-slide-up',
  'animix-in-scale-up',
  'animix-in-blur',
  'animix-in-bounce animix-slow',
] as const;

const tailwindSamples = [
  'animate-animix-fade-in duration-500',
  'animate-animix-slide-up animix-delay-150 duration-500',
  'animate-animix-scale-up duration-700',
  'animate-animix-pulse',
] as const;

const modernCssSamples = [
  'animix-scroll-reveal-up',
  'animix-scroll-reveal-scale',
  'animix-enter-fade',
  'animix-enter-up',
  'animix-enter-scale',
] as const;

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
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">animix playground</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            CSS classes, Tailwind utilities, and React{' '}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">&lt;Animate&gt;</code> in
            one place.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">CSS classes</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Prefixed classes from{' '}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">animix/css</code>, loaded
            after Tailwind in{' '}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              playground/src/main.tsx
            </code>
            .
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cssEntranceSamples.map((cls) => (
              <DemoCard key={cls} label={cls.replace(/^animix-in-/, '')} className={cls} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Tailwind plugin</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Theme-driven{' '}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">animate-animix-*</code>{' '}
            utilities from{' '}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">tailwind/plugin.ts</code>.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <h2 className="text-lg font-semibold">React — mount & hover</h2>
          <div className="flex flex-wrap gap-4">
            <Animate animation="elastic" trigger="mount" className="inline-block">
              <div className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-md">
                trigger=&quot;mount&quot; · elastic
              </div>
            </Animate>
            <Animate animation="tada" trigger="hover" className="inline-block">
              <div className="cursor-pointer rounded-lg border-2 border-dashed border-violet-400 px-5 py-3 text-sm font-medium text-violet-800 dark:text-violet-200">
                Hover me · tada
              </div>
            </Animate>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">React — inView</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Scroll until the card enters the viewport.
          </p>
          <div className="pt-32">
            <Animate
              animation="slide-up"
              trigger="inView"
              inViewThreshold={0.2}
              className="inline-block"
            >
              <div className="rounded-lg bg-emerald-600 px-6 py-4 text-sm font-medium text-white shadow-md">
                trigger=&quot;inView&quot; · slide-up
              </div>
            </Animate>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Modern CSS layer</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Progressive enhancement utilities from{' '}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">animix/css/modern</code>.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modernCssSamples.map((cls) => (
              <DemoCard key={cls} label={cls.replace(/^animix-/, '')} className={cls} />
            ))}
          </div>
          <div className="h-8" />
          <div className="h-40 rounded-lg border border-dashed border-zinc-300 bg-zinc-100 p-3 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            Scroll down - cards animate as they enter view when timeline support is available.
          </div>
          <div className="space-y-3 pt-8">
            <div className="animix-scroll-reveal-up rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-md">
              scroll-reveal-up
            </div>
            <div className="animix-scroll-reveal-scale rounded-lg bg-fuchsia-600 px-4 py-3 text-sm font-medium text-white shadow-md">
              scroll-reveal-scale
            </div>
            <div className="animix-scroll-progress h-1 rounded bg-emerald-500" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">View transitions</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Import{' '}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              animix/css/view-transitions
            </code>{' '}
            in multi-page apps for same-origin page transitions.
          </p>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            In this SPA playground, cross-document navigation is not triggered, but the stylesheet is ready
            for MPA usage.
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">AnimateStagger</h2>
          <AnimateStagger animation="slide-up" delay={80} inView className="flex flex-col gap-3">
            <div className="rounded-md bg-zinc-200 px-4 py-3 text-sm dark:bg-zinc-800">First</div>
            <div className="rounded-md bg-zinc-200 px-4 py-3 text-sm dark:bg-zinc-800">Second</div>
            <div className="rounded-md bg-zinc-200 px-4 py-3 text-sm dark:bg-zinc-800">Third</div>
          </AnimateStagger>
        </section>
      </div>
    </div>
  );
}
