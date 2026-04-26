/* Static content for the docs site — preserved verbatim from the prior site
   so the rebuild changes only the visual layer, not the documented surface. */

export type InstallMode = 'npm' | 'pnpm' | 'yarn';
export type ReactMode = 'animate' | 'stagger' | 'hooks';
export type RecipeMode = 'command' | 'toast' | 'popover';

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

export const repoLinks = {
  github: 'https://github.com/animix-js/animix',
  issues: 'https://github.com/animix-js/animix/issues',
  npm: 'https://www.npmjs.com/package/animix',
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
  version: 'v0.2.0',
  downloads: 'live',
};

export const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'install', label: 'Install' },
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'react', label: 'React' },
  { id: 'shadcn', label: 'shadcn/ui' },
  { id: 'tokens', label: 'Tokens' },
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
    body: 'Animate, AnimateStagger, useAnimation, useInView, and reduced-motion hooks.',
    keywords: ['react', 'animate', 'animatestagger', 'useanimation', 'useinview'],
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
    body: 'Ship command menus, toast stacks, and trigger-aware popovers correctly.',
    keywords: ['recipes', 'command palette', 'toast', 'popover', 'overlay'],
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
    description: 'Start with the package, then add the optional integrations you actually use.',
    code: `npm install animix
npm install tailwindcss react react-dom`,
  },
  pnpm: {
    id: 'pnpm',
    label: 'pnpm',
    title: 'Install with pnpm',
    description:
      'The docs app itself uses pnpm-style workspace wiring, but the package works the same either way.',
    code: `pnpm add animix
pnpm add tailwindcss react react-dom`,
  },
  yarn: {
    id: 'yarn',
    label: 'yarn',
    title: 'Install with yarn',
    description: 'Use this when your app already ships through a Yarn workflow.',
    code: `yarn add animix
yarn add tailwindcss react react-dom`,
  },
};

export const cssTabs: SnippetTab[] = [
  {
    id: 'bundle',
    label: 'Full bundle',
    title: 'Import the full CSS bundle',
    description:
      'Use this first. It gives you the complete motion vocabulary, utilities, and reduced-motion support immediately.',
    code: `import '@animix-js/animix/css';

<div class="animix-in-slide-up">Ship motion that feels intentional</div>
<button class="animix-press-in animix-focus-soft">Invite member</button>
<div class="animix-toast-in-bottom">Changes saved</div>`,
  },
  {
    id: 'partial',
    label: 'Cherry-pick',
    title: 'Import only the pieces you need',
    description: 'Once usage is clear, trim imports by category instead of guessing upfront.',
    code: `import '@animix-js/animix/css/tokens';
import '@animix-js/animix/css/entrance';
import '@animix-js/animix/css/exit';
import '@animix-js/animix/css/transitions';
import '@animix-js/animix/css/utilities';

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

<button class="animix-shake animix-on-hover animix-loop-1">
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
    code: `import animix from '@animix-js/animix/tailwind';

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  plugins: [animix()],
};`,
  },
  {
    id: 'usage',
    label: 'Usage',
    title: 'Use animate-animix-* utilities in markup',
    description:
      'Reach for aliases when the rest of your UI is already authored through Tailwind utilities.',
    code: `<div class="animate-animix-slide-up">Visible on mount</div>
<div class="animate-animix-toast-in-bottom">Profile updated</div>
<button class="animate-animix-focus-soft animate-animix-press-in">
  Open invite dialog
</button>`,
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
      'Use Animate when you want ergonomic composition while keeping the motion CSS-driven.',
    code: `import { Animate } from '@animix-js/animix/react';

<Animate animation="slide-up">
  <Card />
</Animate>

<Animate animation="fade" trigger="inView" inViewThreshold={0.2}>
  <section>Reveals when 20% visible</section>
</Animate>

<Animate animation="fade" exitAnimation="scale-down" exiting={isClosing}>
  <Toast />
</Animate>`,
  },
  stagger: {
    id: 'stagger',
    label: 'AnimateStagger',
    title: 'Stagger list items without hand-authored nth-child rules',
    description:
      'AnimateStagger handles the progressive delay and optional viewport trigger for you.',
    code: `import { AnimateStagger } from '@animix-js/animix/react';

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
import { useAnimation, useInView, usePrefersReducedMotion } from '@animix-js/animix/react';

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

export const recipeTabs: Record<RecipeMode, SnippetTab> = {
  command: {
    id: 'command',
    label: 'Command UI',
    title: 'Keep keyboard-first flows on the overlay, not the panel',
    description:
      'Repeated command surfaces should feel immediate. Animate the backdrop softly and keep the panel nearly instant.',
    code: `<div class="animix-overlay-in"></div>
<div class="animix-in-fade">
  <input aria-label="Search commands" />
  <ul class="animix-stagger animix-slide-up">
    <li>Go to Dashboard</li>
    <li>Invite teammate</li>
    <li>Toggle theme</li>
  </ul>
</div>`,
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
    title: 'Keep alias and core CSS together',
    body: 'The plugin only works well if the underlying CSS bundle remains the source of truth for tokens and keyframes.',
  },
  {
    title: 'Prefer exact utilities',
    body: 'Reach for animate-animix-slide-up instead of broad transition-all patterns that blur intent.',
  },
  {
    title: 'Override tokens, not keyframes',
    body: 'Arbitrary values are for local tuning. The core animation names should stay shared across the product.',
  },
];

export const reactApiCards = [
  {
    title: '<Animate>',
    body: 'Declarative motion wrapper for mount, hover, focus, in-view, manual, and exit flows.',
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

export const shadcnRows = [
  ['Dialog / AlertDialog', 'animix-modal-in', 'animix-modal-out'],
  ['Sheet', 'Directional drawer enter by side', 'Directional drawer exit by side'],
  ['DropdownMenu / Popover', 'Fast scale + directional slide', 'Scale down exit'],
  ['Tooltip', 'animix-tooltip-in', 'animix-tooltip-out'],
  ['Accordion / Collapsible', 'Height expand + opacity', 'Height collapse + opacity'],
  ['Toast / Sonner', 'animix-toast-in-right or bottom', 'animix-toast-out-right'],
  ['Command / CMDk', 'animix-scale-up-in', 'Depends on dialog lifecycle'],
] as const;

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
  { className: 'animix-out-fade', category: 'Exit', blurb: 'Quiet opacity exit' },
  { className: 'animix-out-slide-up', category: 'Exit', blurb: 'Dismiss to top' },
  { className: 'animix-out-slide-right', category: 'Exit', blurb: 'Toast-style sweep right' },
  { className: 'animix-out-scale-down', category: 'Exit', blurb: 'Anchored shrink exit' },
  { className: 'animix-out-rotate', category: 'Exit', blurb: 'Tilt exit for emphasis' },
  { className: 'animix-out-blur', category: 'Exit', blurb: 'Defocus dismiss' },
  { className: 'animix-pulse', category: 'Attention', blurb: 'Soft repeating heartbeat' },
  { className: 'animix-bounce', category: 'Attention', blurb: 'Vertical attention seeker' },
  { className: 'animix-shake', category: 'Attention', blurb: 'Error or invalid state' },
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
  '13 entrance animations and 11 exit animations for mount and teardown flows.',
  '12 attention seekers plus loader components for feedback and status surfaces.',
  '14 transition patterns for modal, drawer, tooltip, toast, overlay, and page UI.',
  'Tailwind v3 and v4 plugin support with animate-animix-* aliases.',
  'React Animate, AnimateStagger, useAnimation, useInView, and reduced-motion hooks.',
  'shadcn/ui presets for Dialog, Sheet, Dropdown, Tooltip, Accordion, Toast, and Command.',
];

export const proofItems = [
  {
    num: '01',
    title: 'Zero runtime by default',
    body: 'Base motion ships as CSS keyframes and token overrides — no JS for the common cases.',
  },
  {
    num: '02',
    title: 'Three integration paths',
    body: 'Pure CSS, Tailwind plugin, and React bindings stay aligned to one source of truth.',
  },
  {
    num: '03',
    title: 'Reduced motion respected',
    body: 'Durations zero out without losing keyframe end-state, so layout never jumps.',
  },
  {
    num: '04',
    title: 'Component presets ready',
    body: 'shadcn/ui and Radix data-state hooks are already mapped to the right motion families.',
  },
];
