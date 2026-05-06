/* Static content for the docs site — preserved verbatim from the prior site
   so the rebuild changes only the visual layer, not the documented surface. */

export type InstallMode = 'npm' | 'pnpm' | 'yarn';
export type HeroMode = 'css' | 'tailwind' | 'react';
export type ReactMode = 'animate' | 'exit' | 'server' | 'stagger' | 'hooks';
export type MigrationMode = 'animate-css' | 'tailwindcss-animate' | 'motion' | 'gsap';
export type RecipeMode = 'dialog' | 'popover' | 'toast' | 'command' | 'list' | 'route';

export type SnippetTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  code: string;
};

export type SearchItem = {
  href: string;
  title: string;
  body: string;
  keywords: string[];
};

export type CatalogItem = {
  className: string;
  category: 'Entrance' | 'Exit' | 'Attention' | 'Loader / Transition';
  blurb: string;
};

export type PathwayCard = {
  title: string;
  href: string;
  body: string;
  snippet: string;
  stats: string[];
};

export type ShadcnExample = {
  id: 'dialog' | 'sheet' | 'popover' | 'toast' | 'command';
  name: string;
  summary: string;
  open: string;
  close: string;
  tabs: [SnippetTab, SnippetTab, SnippetTab];
};

export const repoLinks = {
  github: 'https://github.com/pras75299/animix',
  issues: 'https://github.com/pras75299/animix/issues',
  npm: 'https://www.npmjs.com/package/@pras75299/animix',
};

export type RepoMetrics = {
  stars: string;
  forks: string;
  issues: string;
  version: string;
  downloads: string;
};

export const fallbackMetrics: RepoMetrics = {
  stars: '—',
  forks: '—',
  issues: '—',
  version: 'v0.2.2',
  downloads: 'live',
};

export const heroValuePoints = [
  'Zero-runtime motion for CSS and Tailwind by default.',
  'Optional React helpers for exits, stagger, and view triggers.',
  'Reduced-motion safe from the first import.',
] as const;

export const heroTabs: Record<HeroMode, SnippetTab> = {
  css: {
    id: 'css',
    label: 'CSS',
    title: 'Start with pure CSS in one import',
    description:
      'Fastest adoption path: import the stylesheet and use the same classes shown in the live demo.',
    code: `import '@pras75299/animix/css';

<div class="animix-in-slide-up">Settings synced</div>
<div class="animix-toast-in-bottom">Profile updated</div>
<button class="animix-press-in animix-focus-soft">Open command menu</button>`,
  },
  tailwind: {
    id: 'tailwind',
    label: 'Tailwind',
    title: 'Keep authoring in utility classes',
    description:
      'Register the plugin once, then use named animix aliases for mount, exit, and component motion.',
    code: `import animix from '@pras75299/animix/tailwind';

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  plugins: [animix()],
};

<div class="animate-animix-slide-up">Settings synced</div>
<div class="animate-animix-toast-in-bottom">Profile updated</div>`,
  },
  react: {
    id: 'react',
    label: 'React',
    title: 'Add orchestration without adding a new motion system',
    description:
      'Use the React helpers when your UI already needs mount, exit, or stagger control in component code.',
    code: `import '@pras75299/animix/css';
import { Animate, AnimateStagger } from '@pras75299/animix/react';

<Animate animation="slide-up">
  <div>Settings synced</div>
</Animate>

<AnimateStagger animation="slide-up" delay={70}>
  {items.map((item) => <li key={item.id}>{item.label}</li>)}
</AnimateStagger>`,
  },
};

export const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'install', label: 'Install' },
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'react', label: 'React' },
  { id: 'view-transitions', label: 'View Transitions' },
  { id: 'shadcn', label: 'shadcn/ui' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'choose', label: 'Choose the Right Tool' },
  { id: 'pairing', label: 'Pairing Guide' },
  { id: 'migrations', label: 'Migrations' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'changelog', label: 'Changelog' },
] as const;

export const searchItems: SearchItem[] = [
  {
    href: '#install',
    title: 'Install animix',
    body: 'npm, pnpm, yarn, peer dependencies, and adoption paths.',
    keywords: ['install', 'setup', 'npm', 'pnpm', 'yarn', 'peer dependencies'],
  },
  {
    href: '#css',
    title: 'Pure CSS quick start',
    body: 'Import the full bundle, cherry-pick files, and use modifier classes.',
    keywords: ['css', 'bundle', 'tokens', 'utilities', 'modifiers', 'entrance'],
  },
  {
    href: '#tailwind',
    title: 'Tailwind plugin',
    body: 'Register animix/tailwind and use animate-animix-* aliases.',
    keywords: ['tailwind', 'plugin', 'animate-animix', 'utility', 'tokens'],
  },
  {
    href: '#react',
    title: 'React bindings',
    body: 'Animate, AnimateStagger, parent-managed exits, wrapper versus asChild behavior, App Router boundaries, and reduced-motion hooks.',
    keywords: [
      'react',
      'animate',
      'animatestagger',
      'useanimation',
      'useinview',
      'exit',
      'aschild',
      'wrapper',
      'next.js',
      'server components',
    ],
  },
  {
    href: '#view-transitions',
    title: 'View Transitions',
    body: 'Same-document and cross-document recipes built on the platform primitive.',
    keywords: [
      'view transitions',
      'view-transition',
      'document.startViewTransition',
      'navigation',
      'same-document',
    ],
  },
  {
    href: '#shadcn',
    title: 'shadcn/ui presets',
    body: 'Wire Radix data-state and data-side lifecycle motion with one import.',
    keywords: ['shadcn', 'radix', 'dialog', 'toast', 'popover', 'sheet'],
  },
  {
    href: '#tokens',
    title: 'Motion tokens',
    body: 'Override duration, easing, distance, intensity, and interaction values.',
    keywords: ['tokens', 'duration', 'easing', 'distance', 'scale', 'hover'],
  },
  {
    href: '#choose',
    title: 'Choose the right tool',
    body: 'Decide between animix, Motion, GSAP, Anime.js, and tailwindcss-animate by job shape.',
    keywords: [
      'choose',
      'compare',
      'tailwindcss-animate',
      'motion',
      'gsap',
      'anime.js',
      'comparison',
      'tooling',
    ],
  },
  {
    href: '#pairing',
    title: 'Pairing guide',
    body: 'Split responsibilities cleanly when animix ships alongside Motion, GSAP, or Anime.js.',
    keywords: ['pairing', 'motion', 'gsap', 'anime.js', 'hybrid', 'integration'],
  },
  {
    href: '#migrations',
    title: 'Migration guides',
    body: 'Move over from Animate.css, tailwindcss-animate, Motion, or GSAP without throwing away the pieces that still fit.',
    keywords: ['migration', 'animate.css', 'tailwindcss-animate', 'motion', 'gsap', 'adoption'],
  },
  {
    href: '#catalog',
    title: 'Animation catalog',
    body: 'Browse entrances, exits, attention seekers, loaders, and transitions.',
    keywords: ['catalog', 'entrance', 'exit', 'attention', 'loaders', 'transitions'],
  },
  {
    href: '#accessibility',
    title: 'Accessibility and reduced motion',
    body: 'prefers-reduced-motion, animix-no-motion, and accessible loader semantics.',
    keywords: ['accessibility', 'reduced motion', 'animix-no-motion', 'aria', 'loader'],
  },
  {
    href: '#recipes',
    title: 'Implementation recipes',
    body: 'Ship dialogs, sheets, popovers, toasts, command menus, list updates, and route shells correctly.',
    keywords: [
      'recipes',
      'dialog',
      'sheet',
      'drawer',
      'popover',
      'tooltip',
      'dropdown',
      'toast',
      'command palette',
      'route transitions',
      'list animation',
      'table animation',
    ],
  },
  {
    href: '#changelog',
    title: 'Changelog highlights',
    body: 'See the release scope the docs currently cover.',
    keywords: ['changelog', 'release', 'highlights', 'added'],
  },
];

export const installTabs: Record<InstallMode, SnippetTab> = {
  npm: {
    id: 'npm',
    label: 'npm',
    title: 'Install with npm',
    description: 'Install the package first, then add only the peer for the mode you actually use.',
    code: `npm install @pras75299/animix

# Tailwind mode only
npm install tailwindcss

# React mode only
npm install react react-dom`,
  },
  pnpm: {
    id: 'pnpm',
    label: 'pnpm',
    title: 'Install with pnpm',
    description: 'Same package and same optional-by-mode peer setup, with pnpm commands instead.',
    code: `pnpm add @pras75299/animix

# Tailwind mode only
pnpm add tailwindcss

# React mode only
pnpm add react react-dom`,
  },
  yarn: {
    id: 'yarn',
    label: 'yarn',
    title: 'Install with yarn',
    description:
      'Use this when your app already ships through a Yarn workflow, with the same mode-specific peers.',
    code: `yarn add @pras75299/animix

# Tailwind mode only
yarn add tailwindcss

# React mode only
yarn add react react-dom`,
  },
};

export const pathwayCards: PathwayCard[] = [
  {
    title: 'Pure CSS',
    href: '#css',
    body: 'Import the stylesheet, add classes, and ship mount, exit, and feedback motion immediately.',
    snippet: "import '@pras75299/animix/css'",
    stats: ['zero runtime', 'css-first', 'fastest start'],
  },
  {
    title: 'Tailwind plugin',
    href: '#tailwind',
    body: 'Stay inside utilities with animate-animix-* aliases powered by the same underlying tokens.',
    snippet: 'plugins: [animix()]',
    stats: ['zero runtime', 'build-time only', 'utility-first'],
  },
  {
    title: 'React bindings',
    href: '#react',
    body: 'Use Animate and AnimateStagger when component state needs mount, exit, or stagger control.',
    snippet: "<Animate animation='slide-up' />",
    stats: ['optional helper runtime', 'react peer only', 'exit + stagger'],
  },
];

export const cssTabs: SnippetTab[] = [
  {
    id: 'bundle',
    label: 'Full bundle',
    title: 'Import the full CSS bundle',
    description:
      'Use this first. It gives you the complete motion vocabulary, utilities, and reduced-motion support immediately.',
    code: `import '@pras75299/animix/css';

<div class="animix-in-slide-up">Ship motion that feels intentional</div>
<button class="animix-press-in animix-focus-soft">Invite member</button>
<div class="animix-toast-in-bottom">Changes saved</div>`,
  },
  {
    id: 'partial',
    label: 'Cherry-pick',
    title: 'Import only the pieces you need',
    description: 'Once usage is clear, trim imports by category instead of guessing upfront.',
    code: `import '@pras75299/animix/css/tokens';
import '@pras75299/animix/css/entrance';
import '@pras75299/animix/css/exit';
import '@pras75299/animix/css/transitions';
import '@pras75299/animix/css/utilities';

<div class="animix-in-fade animix-delay-150">Visible after 150ms</div>`,
  },
  {
    id: 'modifiers',
    label: 'Modifiers',
    title: 'Layer modifiers on top of base animations',
    description:
      'Keep the animation class focused on what moves, then adjust timing and behavior with utility classes.',
    code: `<article class="animix-in-scale-up animix-slow animix-delay-150">
  <h3>Quarterly report</h3>
  <p>Scaled in with a longer entrance.</p>
</article>

<button class="animix-shake animix-on-hover animix-once">
  Retry sync
</button>`,
  },
];

export const tailwindTabs: SnippetTab[] = [
  {
    id: 'setup',
    label: 'Plugin setup',
    title: 'Register the Tailwind plugin',
    description:
      'The alias layer mirrors the core CSS timings and curves so utility examples stay truthful.',
    code: `import animix from '@pras75299/animix/tailwind';

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  plugins: [animix()],
};`,
  },
  {
    id: 'usage',
    label: 'Usage',
    title: 'Choose named presets first, then reach for parametric utilities',
    description:
      'Named presets keep teams aligned. Parametric utilities are for exact opacity, scale, and distance tuning once the motion family is already chosen.',
    code: `<div class="animate-animix-slide-up">Visible on mount</div>
<div class="animate-animix-toast-in-bottom">Profile updated</div>
<button class="animate-animix-focus-soft animate-animix-press-in">
  Open invite dialog
</button>

<div class="animate-animix-fade-in-0">Starts fully hidden</div>
<div class="animate-animix-fade-in-50">Starts at 50% opacity</div>
<div class="animate-animix-zoom-in-75">Scales from 0.75</div>
<div class="animate-animix-slide-in-from-top-4">Slides in from 1rem away</div>`,
  },
  {
    id: 'state',
    label: 'data-state',
    title: 'Compose enter and exit with Tailwind variants and data attributes',
    description:
      'This is the sweet spot for Radix-style surfaces: state attributes decide which animix alias runs, while Tailwind still owns layout and spacing.',
    code: `<div
  data-state={open ? 'open' : 'closed'}
  class="
    data-[state=open]:animate-animix-fade-in
    data-[state=open]:animate-animix-slide-in-from-top-4
    data-[state=closed]:animate-animix-fade-out-0
    data-[state=closed]:animate-animix-slide-out-to-top-4
  "
>
  Lifecycle-aware popover content
</div>`,
  },
  {
    id: 'sequence',
    label: 'Sequencing',
    title: 'Sequence timing with Tailwind modifiers and animix utility classes',
    description:
      'Use Tailwind modifiers for timing, then layer animix utility classes for iteration or direction without changing the base motion preset.',
    code: `<li
  class="
    animate-animix-slide-up
    duration-300
    delay-150
    ease-spring
    animix-once
  "
>
  First list item
</li>

<span
  class="
    animate-animix-pulse
    duration-[420ms]
    ease-linear
    animix-loop
    animix-alt
  "
>
  Live
</span>`,
  },
  {
    id: 'tokens',
    label: 'Token overrides',
    title: 'Override motion tokens inline or in theme layers',
    description:
      'Token overrides are the escape hatch when one component needs a distinct feel without forking keyframes.',
    code: `<div
  class="animate-animix-slide-up"
  style="--animix-slide-distance:24px; --animix-duration-base:320ms"
>
  Deeper entrance
</div>`,
  },
];

export const reactTabs: Record<ReactMode, SnippetTab> = {
  animate: {
    id: 'animate',
    label: 'Animate',
    title: 'Mount, hover, focus, in-view, or exit with one component',
    description:
      'Use Animate when you want ergonomic composition while keeping the motion CSS-driven, and decide up front whether the default wrapper or `asChild` is the better fit.',
    code: `import { Animate } from '@pras75299/animix/react';

<Animate animation="slide-up">
  <Card />
</Animate>

<Animate animation="fade" trigger="inView" inViewThreshold={0.2}>
  <section>Reveals when 20% visible</section>
</Animate>

<Animate animation="fade" trigger="manual" manualActive={isOpen}>
  <aside>Controlled by parent state</aside>
</Animate>

<Animate animation="fade" exitAnimation="scale-down" exiting={isClosing}>
  <Toast />
</Animate>`,
  },
  exit: {
    id: 'exit',
    label: 'Exit flow',
    title: 'Animate unmounts by holding mount state outside the child',
    description:
      'This is animix’s clean answer to React unmount animation: the parent owns mount state, flips `exiting`, then removes the subtree only after the exit completes.',
    code: `import { useState } from 'react';
import { Animate } from '@pras75299/animix/react';

function ToastDemo() {
  const [open, setOpen] = useState(true);
  const [exiting, setExiting] = useState(false);

  function requestClose() {
    setExiting(true);
  }

  return (
    <>
      {open && (
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
          <div className="animix-toast-in-bottom">
            Saved
            <button onClick={requestClose}>Dismiss</button>
          </div>
        </Animate>
      )}
    </>
  );
}`,
  },
  server: {
    id: 'server',
    label: 'Next / SSR',
    title: 'Keep CSS server-rendered and isolate the React helpers to client islands',
    description:
      'The CSS path is server-safe. Only files importing the React bindings need `"use client"`.',
    code: `/* app/layout.tsx */
import '@pras75299/animix/css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

/* app/components/command-menu.tsx */
'use client';

import { Animate } from '@pras75299/animix/react';

export function CommandMenu({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <Animate animation="scale-up">
      <div className="animix-modal-in">Search commands</div>
    </Animate>
  );
}`,
  },
  stagger: {
    id: 'stagger',
    label: 'AnimateStagger',
    title: 'Stagger list items without hand-authored nth-child rules',
    description:
      'AnimateStagger handles the progressive delay and optional viewport trigger for you while still letting you preserve semantic markup with `as` or `asChild`.',
    code: `import { AnimateStagger } from '@pras75299/animix/react';

<AnimateStagger animation="slide-up" delay={80} inView inViewThreshold={0.1}>
  {items.map((item) => (
    <li key={item.id}>{item.label}</li>
  ))}
</AnimateStagger>`,
  },
  hooks: {
    id: 'hooks',
    label: 'Hooks',
    title: 'Use hooks when your component lifecycle is already custom',
    description:
      'The hooks layer gives you imperative control, viewport state, and reduced-motion awareness without another runtime.',
    code: `import { useRef } from 'react';
import { useAnimation, useInView, usePrefersReducedMotion } from '@pras75299/animix/react';

function Bell() {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { threshold: 0.4 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const { play, state } = useAnimation(ref, {
    animation: 'animix-wiggle',
    duration: prefersReducedMotion ? 0 : 420,
  });

  return (
    <button ref={ref} onClick={play} data-in-view={inView}>
      {state === 'running' ? 'Ringing…' : 'Ring bell'}
    </button>
  );
}`,
  },
};

export const reactNotes = [
  {
    title: 'Exit orchestration stays parent-controlled',
    body: 'The child only knows whether it is exiting. The parent decides when to finally remove the node after `onEnd` or `animix:exit-complete`, so keep `open` and `exiting` separate when the UI can dismiss itself.',
  },
  {
    title: 'Animate renders a wrapper unless you opt out',
    body: 'The default wrapper is useful when the motion container should own refs, observers, and event wiring. If an extra DOM node would break layout or semantics, reach for `asChild`.',
  },
  {
    title: '`asChild` only works when the child forwards the contract',
    body: 'Use `asChild` with a single DOM-bearing child that accepts forwarded `ref`, `className`, `style`, and event props. Fragments or components that swallow those props cannot host the animation correctly.',
  },
  {
    title: 'Server Components can own the CSS import',
    body: 'Keep `@pras75299/animix/css` in the layout or route segment. Put `"use client"` only on files that import `@pras75299/animix/react`.',
  },
  {
    title: 'Typed class exports close the autocomplete gap',
    body: 'Use `@pras75299/animix/classes` when you want string-safe class references in shared helpers, constants, or variant maps.',
  },
] as const;

export const reactCaveats = [
  {
    title: 'Parent-managed exits are still the contract',
    body: 'Plain `<Animate>` does not hold a disappearing subtree in the tree for you. Keep the parent mounted, flip `exiting`, then remove the child after the exit finishes.',
  },
  {
    title: 'Wrappers are the default behavior',
    body: '`<Animate>` and `<AnimateStagger>` render a wrapper unless you pass `as` or `asChild`. Keep that in mind for flex, grid, list, and semantic markup.',
  },
  {
    title: '`asChild` expects one real element',
    body: 'The child needs to accept `className`, `style`, refs, and composed event handlers. Fragments or components that swallow props will break the merge.',
  },
] as const;

export const viewTransitionTabs: SnippetTab[] = [
  {
    id: 'same-document',
    label: 'Same-document',
    title: 'Wrap state changes in `document.startViewTransition()`',
    description:
      'Use this for tab switches, route state changes, and in-app flows where the DOM updates inside the same document.',
    code: `import '@pras75299/animix/css/view-transitions';

function swapPanel(nextPanel: string) {
  if (!document.startViewTransition) {
    setPanel(nextPanel);
    return;
  }

  document.startViewTransition(() => {
    setPanel(nextPanel);
  });
}`,
  },
  {
    id: 'cross-document',
    label: 'Cross-document',
    title: 'Import the recipe on both pages and let same-origin navigation animate',
    description:
      'animix ships root-level old/new recipes already. Import the stylesheet in both routes and keep navigation same-origin.',
    code: `/* app/globals.css or site.css */
@import '@pras75299/animix/css';
@import '@pras75299/animix/css/view-transitions';

/* Optional: name shared elements for more specific transitions */
.docs-card-grid {
  view-transition-name: docs-card-grid;
}`,
  },
];

export const comparisonColumns = [
  'Feature',
  'animix',
  'tailwindcss-animate',
  'Motion',
  'GSAP',
  'Anime.js',
] as const;

export const toolChoiceCards = [
  {
    title: 'Choose animix',
    body: 'Use it when lifecycle motion, design-system tokens, Tailwind aliases, and shadcn-ready overlays need to stay aligned from one package.',
  },
  {
    title: 'Choose Motion',
    body: 'Reach for Motion when layout animation, gestures, shared-element transitions, or drag interactions are first-class requirements.',
  },
  {
    title: 'Choose GSAP or Anime.js',
    body: 'Use a runtime timeline engine when sequencing, scroll choreography, SVG work, or imperative orchestration matters more than zero-runtime CSS.',
  },
] as const;

export const tokenOverrideTabs: SnippetTab[] = [
  {
    id: 'before-after',
    label: 'Before / after',
    title: 'Replace one-off timing forks with scoped token overrides',
    description:
      'The goal is not to invent a new keyframe for every product area. Keep the preset, then tune the feel at the container boundary.',
    code: `.settings-modal {
  animation: animix-modal-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.settings-toast {
  animation: animix-toast-in-right 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.settings-surface {
  --animix-duration-base: 320ms;
  --animix-duration-fast: 200ms;
  --animix-slide-distance: 20px;
  --animix-scale-start: 0.97;
}


<div class="settings-surface">
  <div class="animix-modal-in">Preferences</div>
  <div class="animix-toast-in-right">Saved</div>
</div>`,
  },
  {
    id: 'component-scope',
    label: 'Component scope',
    title: 'Tune one surface family without changing the whole product',
    description:
      'Set tokens on the card cluster, panel shell, or route wrapper so related children inherit the same motion profile automatically.',
    code: `.billing-shell {
  --animix-duration-base: 280ms;
  --animix-duration-slow: 360ms;
  --animix-slide-distance: 12px;
}

.billing-shell .animix-stagger {
  --animix-stagger-delay: 45ms;
}

.billing-shell .upsell {
  --animix-scale-start: 0.98;
}`,
  },
  {
    id: 'tailwind-inline',
    label: 'Tailwind / inline',
    title: 'Keep the preset name, override the tokens next to the surface',
    description:
      'This works well when one product area needs a different feel but the team still wants the same named motion vocabulary in templates.',
    code: `<aside
  class="animate-animix-drawer-in-right"
  style="
    --animix-duration-slow: 340ms;
    --animix-slide-distance: 22px;
  "
>
  ...
</aside>

<ul
  class="animix-stagger"
  style="--animix-stagger-delay: 40ms"
>
  <li class="animate-animix-slide-up">Overview</li>
  <li class="animate-animix-slide-up">Invoices</li>
  <li class="animate-animix-slide-up">People</li>
</ul>`,
  },
];

export const comparisonRows = [
  [
    'Primary strength',
    'Lifecycle motion across CSS, Tailwind, React, and shadcn/ui',
    'Small Tailwind-friendly enter/exit utilities',
    'Gestures, layout animation, shared-element transitions, and React orchestration',
    'Timelines, scroll choreography, SVG, and imperative control',
    'Compact JS timelines with WAAPI-friendly sequencing',
  ],
  [
    'Runtime cost',
    '0 kB for CSS/Tailwind, small optional React helper layer',
    '0 kB',
    'React runtime orchestration and larger JS payload',
    'JS runtime orchestration',
    'JS runtime orchestration',
  ],
  [
    'Exit / unmount story',
    'Yes: parent-managed `exiting` on `<Animate>`',
    'Manual React orchestration',
    'Yes',
    'Manual unless you build the lifecycle shell',
    'Manual unless you build the lifecycle shell',
  ],
  [
    'Layout / FLIP / drag',
    'Deliberately no',
    'No',
    'Yes',
    'Possible, but not ergonomic by default',
    'Possible, but not ergonomic by default',
  ],
  ['Tailwind alias layer', 'Yes', 'Yes', 'No', 'No', 'No'],
  [
    'View Transitions recipes',
    'Yes',
    'No',
    'Possible, but not the core abstraction',
    'Possible, but not the core abstraction',
    'Possible, but not the core abstraction',
  ],
] as const;

export const pairingTabs: SnippetTab[] = [
  {
    id: 'motion',
    label: 'animix + Motion',
    title: 'Let animix own shells and Motion own layout',
    description:
      'This pairing works best when page shells, overlays, and tokens stay CSS-first, but one surface still needs layout or gesture choreography.',
    code: `import '@pras75299/animix/css';
import { motion } from 'motion/react';

<aside className="animix-drawer-in-right">
  <motion.ul layout>
    {items.map((item) => (
      <motion.li key={item.id} layout />
    ))}
  </motion.ul>
</aside>`,
  },
  {
    id: 'gsap',
    label: 'animix + GSAP',
    title: 'Keep product motion declarative, reserve GSAP for sequences',
    description:
      'Use animix for app-shell surfaces and GSAP only where scroll, timelines, or SVG choreography justify a runtime.',
    code: `import '@pras75299/animix/css';
import gsap from 'gsap';

<div className="animix-overlay-in" />
<section ref={heroRef} className="animix-in-fade">
  ...
</section>

gsap.timeline().from('.hero-word', { y: 32, opacity: 0, stagger: 0.05 });`,
  },
  {
    id: 'anime',
    label: 'animix + Anime.js',
    title: 'Use Anime.js for targeted imperative sequences',
    description:
      'Anime.js fits when you want a small timeline engine for one feature, while animix still covers the broader lifecycle language.',
    code: `import '@pras75299/animix/css';
import anime from 'animejs';

<div className="animix-modal-in">
  <svg className="chart-rings">...</svg>
</div>

anime({
  targets: '.chart-rings path',
  strokeDashoffset: [anime.setDashoffset, 0],
  duration: 900,
  easing: 'easeOutExpo',
});`,
  },
];

export const pairingNotes = [
  {
    title: 'Keep ownership explicit',
    body: 'Pick one layer to own lifecycle shells, one layer to own choreography, and keep token overrides in animix so products still feel consistent.',
  },
  {
    title: 'Do not double-animate the same element',
    body: 'If Motion, GSAP, or Anime.js owns transform and opacity on a node, keep animix on the container or backdrop instead of stacking competing animation systems.',
  },
] as const;

export const migrationTabs: Record<MigrationMode, SnippetTab> = {
  'animate-css': {
    id: 'animate-css',
    label: 'Animate.css',
    title: 'Migrate from generic keyframes to named lifecycle surfaces',
    description:
      'Animate.css is broad and familiar, but it does not give you product-level tokens or surface conventions. Keep the simple wins, then remap by UI job.',
    code: `/* Before */
<div class="animate__animated animate__fadeInUp">Modal body</div>
<div class="animate__animated animate__fadeOut">Toast</div>

/* After */
<div class="animix-modal-in">Modal body</div>
<div class="animix-toast-out-right">Toast</div>

/* Migration rule of thumb
fadeInUp      -> animix-in-slide-up
fadeIn        -> animix-in-fade
fadeOut       -> animix-out-fade
bounceIn      -> animix-in-bounce
heartBeat     -> animix-heartbeat
 */

/* Then tune the feel with tokens, not copied keyframes */
.marketing-shell {
  --animix-duration-base: 280ms;
  --animix-slide-distance: 20px;
}`,
  },
  'tailwindcss-animate': {
    id: 'tailwindcss-animate',
    label: 'tailwindcss-animate',
    title: 'Swap low-level enter/exit combinations for shared animix aliases',
    description:
      'Keep Tailwind as the authoring surface, but move repeated combinations like modal, drawer, or toast motion into named animix presets first.',
    code: `<!-- Before -->
<div class="animate-in fade-in zoom-in-95 duration-200">Dialog</div>
<div class="slide-in-from-right-full fade-in duration-300">Sheet</div>

<!-- After -->
<div class="animate-animix-modal-in">Dialog</div>
<div class="animate-animix-drawer-in-right">Sheet</div>

<!-- Keep parametric utilities when the surface truly needs them -->
<div class="animate-animix-fade-in-50 animate-animix-slide-in-from-top-4">
  Lightweight popover
</div>`,
  },
  motion: {
    id: 'motion',
    label: 'Motion',
    title: 'Remove runtime orchestration only where CSS lifecycle motion is enough',
    description:
      'Do not rip Motion out of places where layout, drag, or shared-element work matters. Migrate only the surfaces that are really just overlays, entrances, exits, and staggered lists.',
    code: `/* Before */
import { AnimatePresence, motion } from 'motion/react';

<AnimatePresence>
  {open ? (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
    />
  ) : null}
</AnimatePresence>

/* After */
import { Animate } from '@pras75299/animix/react';

function Drawer({ open, closing }: { open: boolean; closing: boolean }) {
  if (!open) return null;

  return (
    <Animate animation="drawer-in-right" exitAnimation="drawer-out-right" exiting={closing}>
      <aside className="animix-drawer-in-right" />
    </Animate>
  );
}

/* Keep Motion for layout-driven children inside the shell */
<motion.ul layout>{/* rows */}</motion.ul>`,
  },
  gsap: {
    id: 'gsap',
    label: 'GSAP',
    title: 'Keep GSAP where sequencing matters, move shells and overlays to animix',
    description:
      'The clean migration is not GSAP versus animix. It is GSAP for bespoke timelines, animix for repeatable product surfaces and token ownership.',
    code: `/* Before: GSAP owns both shell and content */
gsap.from('.drawer', { xPercent: 100, opacity: 0, duration: 0.32 });
gsap.from('.drawer-item', { y: 20, opacity: 0, stagger: 0.05 });

/* After: animix owns the shell, GSAP keeps the inner sequence */
<aside class="animix-drawer-in-right">
  <ul class="drawer-items">...</ul>
</aside>

gsap.from('.drawer-items > *', {
  y: 16,
  opacity: 0,
  stagger: 0.05,
  duration: 0.24,
});

/* Product feel now lives in tokens */
.drawer-surface {
  --animix-duration-slow: 320ms;
}`,
  },
};

export const migrationNotes = [
  {
    title: 'Migrate by surface, not by library logo',
    body: 'Start with dialogs, sheets, toasts, menus, and route shells. Those are where animix reduces code fastest without giving up expressive control elsewhere.',
  },
  {
    title: 'Keep named presets stable, customize with tokens second',
    body: 'The preset name should describe the motion family. The product-specific feel should come from scoped duration, easing, distance, and stagger tokens.',
  },
  {
    title: 'Do not delete the runtime where it still earns its cost',
    body: 'Motion and GSAP should remain in place for layout animation, gestures, scroll choreography, SVG work, and timeline-heavy hero sequences.',
  },
] as const;

export const recipeTabs: Record<RecipeMode, SnippetTab> = {
  dialog: {
    id: 'dialog',
    label: 'Dialog / sheet',
    title: 'Treat dialog and sheet motion as shell choreography, not content choreography',
    description:
      'The overlay should fade quickly, the panel should land cleanly, and the content inside should only stagger if the density justifies it.',
    code: `<div class="animix-overlay-in"></div>
<div class="animix-modal-in">Centered dialog</div>
<aside class="animix-drawer-in-right">Right sheet</aside>

<!-- For denser content -->
<ul class="animix-stagger" style="--animix-stagger-delay:45ms">
  <li class="animix-in-fade">Profile</li>
  <li class="animix-in-fade">Notifications</li>
  <li class="animix-in-fade">Billing</li>
</ul>`,
  },
  command: {
    id: 'command',
    label: 'Command UI',
    title: 'Keep keyboard-first flows on the overlay, not the panel',
    description:
      'Repeated command surfaces should feel immediate. Animate the backdrop softly and keep the panel nearly instant.',
    code: `<div class="animix-overlay-in"></div>
<div class="animix-in-fade">
  <input aria-label="Search commands" />
  <ul class="animix-stagger" style="--animix-stagger-delay:45ms">
    <li class="animix-in-slide-up">Go to Dashboard</li>
    <li class="animix-in-slide-up">Invite teammate</li>
    <li class="animix-in-slide-up">Toggle theme</li>
  </ul>
</div>`,
  },
  route: {
    id: 'route',
    label: 'Route transitions',
    title: 'Animate the route shell, not every child on the page',
    description:
      'Route transitions should stabilize the app shell first. Keep the page container consistent, then stagger only the first meaningful cluster if needed.',
    code: `<main class="animix-page-slide-in">
  <header class="animix-in-fade">People</header>
  <section class="animix-stagger" style="--animix-stagger-delay:50ms">
    <article class="animix-in-slide-up">Owner</article>
    <article class="animix-in-slide-up">Admin</article>
    <article class="animix-in-slide-up">Member</article>
  </section>
</main>`,
  },
  toast: {
    id: 'toast',
    label: 'Toast stack',
    title: 'Use the same direction for enter and exit',
    description:
      'Spatial consistency matters more than flair. A toast should dismiss in the same direction it arrived.',
    code: `<div class="animix-toast-in-right">Project published</div>
<div class="animix-toast-out-right">Project published</div>`,
  },
  popover: {
    id: 'popover',
    label: 'Popover',
    title: 'Scale anchored surfaces from the trigger',
    description: 'Popover motion should feel attached to the button or menu item that caused it.',
    code: `<button class="animix-focus-soft animix-press-in">Invite member</button>
<div
  class="animix-tooltip-in"
  style="transform-origin: var(--radix-popover-content-transform-origin, left top)"
>
  Roles, permissions, and invite options
</div>`,
  },
  list: {
    id: 'list',
    label: 'List / table',
    title: 'Use stagger for inserts, quiet fades for remove paths',
    description:
      'Dense collections should not bounce. Favor short slide or fade entrances on insert and short fade or directional exits on remove.',
    code: `<tbody class="animix-stagger" style="--animix-stagger-delay:35ms">
  <tr class="animix-in-fade">
    <td>Invoice #1042</td>
    <td>Paid</td>
  </tr>
  <tr class="animix-in-fade">
    <td>Invoice #1043</td>
    <td>Pending</td>
  </tr>
</tbody>

<!-- Remove path -->
<tr class="animix-out-fade">
  <td>Invite revoked</td>
  <td>Archived</td>
</tr>`,
  },
};

export const integrationCards = [
  {
    title: 'Pure CSS',
    body: 'Fastest adoption path. Import the bundle and ship classes immediately.',
  },
  {
    title: 'Tailwind plugin',
    body: 'Alias layer for utility-driven teams that want consistent names and token parity.',
  },
  {
    title: 'React bindings',
    body: 'Composition, stagger orchestration, and hooks without introducing a separate animation runtime.',
  },
];

export const cssSteps = [
  {
    title: 'Import first, optimize second',
    body: 'Start with animix/css so the whole motion system is available. Cherry-pick only after the usage pattern stabilizes.',
  },
  {
    title: 'Choose a single base class',
    body: 'Pick one entrance, exit, transition, or attention class per element. Add modifiers for timing instead of stacking competing keyframes.',
  },
  {
    title: 'Scope tokens on the container',
    body: 'Override distance, easing, or duration on a parent so every child shares the same motion language.',
  },
];

export const tailwindNotes = [
  {
    title: 'Named presets are the default',
    body: 'Use animate-animix-slide-up or animate-animix-toast-in-bottom when you want a shared product language. Reach for fade/zoom/slide parametrics only when a surface needs finer calibration.',
  },
  {
    title: 'State attributes beat ad-hoc booleans',
    body: 'Pair data-[state=*] and data-[side=*] variants with animix aliases so enter and exit decisions stay readable in markup.',
  },
  {
    title: 'Sequence with Tailwind, customize with tokens',
    body: 'Use duration-*, delay-*, and ease-* for timing, then add animix utility classes such as animix-once, animix-loop, or animix-alt when a motion pattern needs explicit iteration or direction.',
  },
];

export const reactApiCards = [
  {
    title: '<Animate>',
    body: 'Declarative motion wrapper for mount, hover, focus, in-view, controlled manual, and exit flows.',
  },
  {
    title: '<AnimateStagger>',
    body: 'Progressive child delay without manual nth-child rules or duplicated markup.',
  },
  {
    title: 'useAnimation',
    body: 'Imperative play, pause, resume, reverse, and reset for one-off interactions.',
  },
  {
    title: 'useInView + usePrefersReducedMotion',
    body: 'Viewport gating and preference-aware motion branching for product surfaces that need both.',
  },
];

export const shadcnExamples: ShadcnExample[] = [
  {
    id: 'dialog',
    name: 'Dialog / AlertDialog',
    summary:
      'Use the overlay for atmosphere and keep the panel motion direct. This is the baseline pattern most teams paste first.',
    open: 'animix-overlay-in + animix-modal-in',
    close: 'animix-overlay-out + animix-modal-out',
    tabs: [
      {
        id: 'css',
        label: 'CSS',
        title: 'Pure CSS dialog lifecycle',
        description:
          'Use the preset stylesheet and let Radix data-state decide which overlay and panel classes run.',
        code: `<DialogOverlay className="animix-overlay-in data-[state=closed]:animix-overlay-out" />
<DialogContent className="animix-modal-in data-[state=closed]:animix-modal-out">
  Invite member
</DialogContent>`,
      },
      {
        id: 'tailwind',
        label: 'Tailwind',
        title: 'Tailwind dialog lifecycle',
        description:
          'Keep the component in utility space while reusing the same overlay and panel motion families.',
        code: `<DialogOverlay
  className="
    data-[state=open]:animate-animix-overlay-in
    data-[state=closed]:animate-animix-overlay-out
  "
/>
<DialogContent
  className="
    data-[state=open]:animate-animix-modal-in
    data-[state=closed]:animate-animix-modal-out
  "
/>`,
      },
      {
        id: 'react',
        label: 'React',
        title: 'React dialog with a staged body',
        description:
          'Use the CSS preset for the shell, then add AnimateStagger only when the dialog body is dense enough to justify sequencing.',
        code: `import '@pras75299/animix/shadcn';
import { AnimateStagger } from '@pras75299/animix/react';

<DialogContent className="animix-modal-in data-[state=closed]:animix-modal-out">
  <AnimateStagger animation="slide-up" delay={45} as="ul">
    <li>Profile</li>
    <li>Permissions</li>
    <li>Billing</li>
  </AnimateStagger>
</DialogContent>`,
      },
    ],
  },
  {
    id: 'sheet',
    name: 'Sheet',
    summary:
      'Directional drawers should enter and leave in the same direction. Tokens tune the feel; the preset owns the movement.',
    open: 'animix-drawer-in-right',
    close: 'animix-drawer-out-right',
    tabs: [
      {
        id: 'css',
        label: 'CSS',
        title: 'Pure CSS sheet lifecycle',
        description:
          'Pick the direction once and keep it consistent for both open and close states.',
        code: `<SheetContent side="right" className="animix-drawer-in-right data-[state=closed]:animix-drawer-out-right">
  Filters
</SheetContent>`,
      },
      {
        id: 'tailwind',
        label: 'Tailwind',
        title: 'Tailwind sheet lifecycle',
        description:
          'The Tailwind alias keeps the direction explicit and co-locates lifecycle motion with side-specific layout utilities.',
        code: `<SheetContent
  side="right"
  className="
    data-[state=open]:animate-animix-drawer-in-right
    data-[state=closed]:animate-animix-drawer-out-right
  "
/>`,
      },
      {
        id: 'react',
        label: 'React',
        title: 'React sheet with token tuning',
        description:
          'Leave the sheet shell in CSS and scope tokens on the content when one surface needs slower travel.',
        code: `<SheetContent
  side="right"
  className="animix-drawer-in-right data-[state=closed]:animix-drawer-out-right"
  style={{ '--animix-duration-slow': '340ms', '--animix-slide-distance': '22px' }}
>
  <SheetHeader>Filters</SheetHeader>
</SheetContent>`,
      },
    ],
  },
  {
    id: 'popover',
    name: 'Popover / DropdownMenu',
    summary:
      'Anchored surfaces should feel attached to the trigger. Let data-side pick the direction and keep the scale subtle.',
    open: 'animix-tooltip-in',
    close: 'animix-tooltip-out',
    tabs: [
      {
        id: 'css',
        label: 'CSS',
        title: 'Pure CSS popover lifecycle',
        description:
          'Use the shared preset and preserve Radix transform-origin so the surface grows from the trigger instead of the viewport.',
        code: `<PopoverContent
  className="animix-tooltip-in data-[state=closed]:animix-tooltip-out"
  style="transform-origin: var(--radix-popover-content-transform-origin, left top)"
>
  Invite member
</PopoverContent>`,
      },
      {
        id: 'tailwind',
        label: 'Tailwind',
        title: 'Tailwind popover lifecycle',
        description:
          'Compose side-aware motion with the alias layer and leave spacing, width, and theme styles to your normal utilities.',
        code: `<PopoverContent
  className="
    data-[state=open]:animate-animix-tooltip-in
    data-[state=closed]:animate-animix-tooltip-out
  "
/>`,
      },
      {
        id: 'react',
        label: 'React',
        title: 'React popover with a staged menu',
        description:
          'Keep the anchored shell in CSS and use AnimateStagger only for the menu rows if the list needs a softer arrival.',
        code: `import { AnimateStagger } from '@pras75299/animix/react';

<PopoverContent className="animix-tooltip-in data-[state=closed]:animix-tooltip-out">
  <AnimateStagger animation="slide-up" delay={35} as="ul">
    <li>Viewer</li>
    <li>Editor</li>
    <li>Admin</li>
  </AnimateStagger>
</PopoverContent>`,
      },
    ],
  },
  {
    id: 'toast',
    name: 'Toast / Sonner',
    summary:
      'Pick one direction and keep it for both entry and dismissal. Spatial consistency matters more than flair in repeated feedback.',
    open: 'animix-toast-in-right',
    close: 'animix-toast-out-right',
    tabs: [
      {
        id: 'css',
        label: 'CSS',
        title: 'Pure CSS toast lifecycle',
        description:
          'This is the lightest path: one class for entry, one class for dismissal, both moving the same way.',
        code: `<div class="animix-toast-in-right">Project published</div>
<div class="animix-toast-out-right">Project published</div>`,
      },
      {
        id: 'tailwind',
        label: 'Tailwind',
        title: 'Tailwind toast lifecycle',
        description:
          'Keep the alias on the toast node and use the surrounding stack layout however your app already prefers.',
        code: `<div
  className="
    data-[state=open]:animate-animix-toast-in
    data-[state=closed]:animate-animix-toast-out
  "
>
  Project published
</div>`,
      },
      {
        id: 'react',
        label: 'React',
        title: 'React toast exit handoff',
        description:
          'Use Animate when the parent controls the mount lifecycle and the toast should stay mounted until the exit ends.',
        code: `import { Animate } from '@pras75299/animix/react';

{open && (
  <Animate animation="toast-in" exitAnimation="toast-out" exiting={exiting} onEnd={handleDone}>
    <div>Project published</div>
  </Animate>
)}`,
      },
    ],
  },
  {
    id: 'command',
    name: 'Command / CMDK',
    summary:
      'Command surfaces should feel immediate. Fade the overlay softly and keep the panel itself almost instant so repeated keyboard use stays crisp.',
    open: 'animix-overlay-in + animix-scale-up-in',
    close: 'animix-overlay-out + animix-scale-down-out',
    tabs: [
      {
        id: 'css',
        label: 'CSS',
        title: 'Pure CSS command lifecycle',
        description:
          'Treat the overlay and panel as separate surfaces so the shortcut shell feels calm without making the palette sluggish.',
        code: `<div class="animix-overlay-in data-[state=closed]:animix-overlay-out"></div>
<div class="animix-scale-up-in data-[state=closed]:animix-scale-down-out">
  <input aria-label="Search commands" />
</div>`,
      },
      {
        id: 'tailwind',
        label: 'Tailwind',
        title: 'Tailwind command lifecycle',
        description:
          'Pair the overlay alias with a scale-up panel and keep list-item staging separate so keyboard-first flows stay fast.',
        code: `<CommandDialogOverlay
  className="
    data-[state=open]:animate-animix-overlay-in
    data-[state=closed]:animate-animix-overlay-out
  "
/>
<CommandDialogContent
  className="
    data-[state=open]:animate-animix-scale-up
    data-[state=closed]:animate-animix-scale-down-out
  "
/>`,
      },
      {
        id: 'react',
        label: 'React',
        title: 'React command palette with staggered results',
        description:
          'Use AnimateStagger for the result rows only. The panel shell should still feel close to instant when the user presses the shortcut repeatedly.',
        code: `import { AnimateStagger } from '@pras75299/animix/react';

<CommandDialogContent className="animix-scale-up-in data-[state=closed]:animix-scale-down-out">
  <AnimateStagger animation="slide-up" delay={35} as="ul">
    <li>Go to Dashboard</li>
    <li>Invite teammate</li>
    <li>Toggle theme</li>
  </AnimateStagger>
</CommandDialogContent>`,
      },
    ],
  },
];

export const tokenRows = [
  ['--animix-duration-micro', '140ms', 'Press feedback and tiny state changes'],
  ['--animix-duration-fast', '180ms', 'Tooltips, popovers, and exits'],
  ['--animix-duration-base', '240ms', 'Default entry timing'],
  ['--animix-duration-slow', '280ms', 'Bigger overlays and drawers'],
  ['--animix-duration-slower', '420ms', 'Attention or decorative motion'],
  ['--animix-ease-default', 'cubic-bezier(0.23, 1, 0.32, 1)', 'Primary UI easing'],
  ['--animix-ease-in', 'cubic-bezier(0.64, 0, 0.78, 0)', 'Fast exits'],
  ['--animix-ease-out', 'cubic-bezier(0.23, 1, 0.32, 1)', 'Responsive entrances'],
  ['--animix-ease-spring', 'cubic-bezier(0.34, 1.56, 0.64, 1)', 'Overshoot entrances'],
  ['--animix-slide-distance', '16px', 'Directional movement distance'],
  ['--animix-scale-start', '0.95', 'Natural scale-in starting point'],
  ['--animix-hover-lift', '-2px', 'Hover elevation amount'],
  ['--animix-press-scale', '0.97', 'Press feedback scale'],
  ['--animix-motion-intensity', '1', 'Reduced-motion aware intensity control'],
] as const;

export const catalogItems: CatalogItem[] = [
  { className: 'animix-in-fade', category: 'Entrance', blurb: 'Soft opacity reveal' },
  { className: 'animix-in-slide-up', category: 'Entrance', blurb: 'Vertical entry from below' },
  { className: 'animix-in-slide-left', category: 'Entrance', blurb: 'Horizontal entry from right' },
  { className: 'animix-in-scale-up', category: 'Entrance', blurb: 'Natural scale-in (0.95→1)' },
  { className: 'animix-in-elastic', category: 'Entrance', blurb: 'Spring overshoot entrance' },
  { className: 'animix-in-blur', category: 'Entrance', blurb: 'Defocus reveal for hero copy' },
  {
    className: 'animix-in-light-speed',
    category: 'Entrance',
    blurb: 'Fast skewed arrival for emphatic UI',
  },
  {
    className: 'animix-in-roll',
    category: 'Entrance',
    blurb: 'Rotational sweep for celebratory entry',
  },
  { className: 'animix-out-fade', category: 'Exit', blurb: 'Quiet opacity exit' },
  { className: 'animix-out-slide-up', category: 'Exit', blurb: 'Dismiss to top' },
  { className: 'animix-out-slide-right', category: 'Exit', blurb: 'Toast-style sweep right' },
  { className: 'animix-out-scale-down', category: 'Exit', blurb: 'Anchored shrink exit' },
  { className: 'animix-out-rotate', category: 'Exit', blurb: 'Tilt exit for emphasis' },
  { className: 'animix-out-blur', category: 'Exit', blurb: 'Defocus dismiss' },
  {
    className: 'animix-out-hinge',
    category: 'Exit',
    blurb: 'Dramatic hinge drop for destructive teardown',
  },
  { className: 'animix-pulse', category: 'Attention', blurb: 'Soft repeating heartbeat' },
  { className: 'animix-bounce', category: 'Attention', blurb: 'Vertical attention seeker' },
  { className: 'animix-shake', category: 'Attention', blurb: 'Error or invalid state' },
  {
    className: 'animix-head-shake',
    category: 'Attention',
    blurb: 'Directional no / reject feedback',
  },
  { className: 'animix-rubber-band', category: 'Attention', blurb: 'Elastic stretch celebration' },
  { className: 'animix-tada', category: 'Attention', blurb: 'Festive multi-axis flourish' },
  { className: 'animix-float', category: 'Attention', blurb: 'Idle hover for cards' },
  { className: 'animix-loader-spin', category: 'Loader / Transition', blurb: 'Standard spinner' },
  { className: 'animix-loader-dots', category: 'Loader / Transition', blurb: 'Three-dot pulse' },
  { className: 'animix-modal-in', category: 'Loader / Transition', blurb: 'Dialog enter pattern' },
  {
    className: 'animix-drawer-in-right',
    category: 'Loader / Transition',
    blurb: 'Side sheet enter',
  },
  {
    className: 'animix-toast-in-bottom',
    category: 'Loader / Transition',
    blurb: 'Bottom toast slide',
  },
  {
    className: 'animix-tooltip-in',
    category: 'Loader / Transition',
    blurb: 'Anchored tooltip enter',
  },
];

export const accessibilityNotes = [
  {
    title: 'Reduced motion is token-based',
    body: 'animix zeroes durations under prefers-reduced-motion so end states still apply and layout does not jump.',
  },
  {
    title: '.animix-no-motion is the manual kill switch',
    body: 'Apply it to html or any subtree when the product exposes its own user preference toggle.',
  },
  {
    title: 'Decorative motion stays decorative',
    body: 'Keep loaders and ambient attention hidden from assistive tech unless they represent real status.',
  },
];

export const changelogHighlights = [
  '15 entrance animations and 14 exit animations for mount, teardown, and emphatic UI flows.',
  '13 attention seekers plus loader components for feedback and status surfaces.',
  '14 transition patterns for modal, drawer, tooltip, toast, overlay, and page UI.',
  'Tailwind v3 and v4 plugin support with animate-animix-* aliases.',
  'React Animate, AnimateStagger, useAnimation, useInView, and reduced-motion hooks.',
  'Typed class-name exports for autocomplete-friendly string composition.',
  'Documented View Transitions and Next.js App Router adoption patterns.',
  'shadcn/ui presets for Dialog, Sheet, Dropdown, Tooltip, Accordion, Toast, and Command.',
  'Migration guides from Animate.css, tailwindcss-animate, Motion, and GSAP.',
  'Surface-first recipe docs for dialogs, popovers, toasts, command palettes, list updates, and route shells.',
  'Token-first customization examples that show when to scope variables instead of forking keyframes.',
];

export const proofItems = [
  {
    num: '01',
    title: '0 kB runtime for CSS + Tailwind',
    body: 'The base library is CSS-first, so common product motion stays off the main thread.',
  },
  {
    num: '02',
    title: 'One install, three usage modes',
    body: 'Start with npm, then choose pure CSS, Tailwind aliases, or React helpers as needed.',
  },
  {
    num: '03',
    title: 'Live docs use the shipped package',
    body: 'The hero demo and motion examples on this page run on the same classes and bindings you install.',
  },
  {
    num: '04',
    title: 'shadcn/ui and reduced motion ready',
    body: 'Radix data-state presets and motion-safe defaults are already part of the package story.',
  },
];
