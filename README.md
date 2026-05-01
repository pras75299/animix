# animix

> **Production-ready CSS animation library for Tailwind CSS v3/v4, React, and shadcn/ui — zero runtime by default, reduced-motion safe.**

<p>
  <a href="https://www.npmjs.com/package/@pras75299/animix"><img src="https://img.shields.io/npm/v/@pras75299%2Fanimix?style=flat-square&label=npm&color=5B5BFF" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@pras75299/animix"><img src="https://img.shields.io/npm/dm/@pras75299%2Fanimix?style=flat-square&label=downloads&color=5B5BFF" alt="downloads" /></a>
  <a href="https://bundlephobia.com/package/@pras75299/animix"><img src="https://img.shields.io/bundlephobia/minzip/@pras75299%2Fanimix?style=flat-square&label=gzip&color=5B5BFF" alt="bundle size" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-5B5BFF?style=flat-square" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/types-included-5B5BFF?style=flat-square" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tree--shaking-yes-5B5BFF?style=flat-square" alt="tree-shaking" />
</p>

**[Documentation](https://pras75299.github.io/animix)** · **[Live playground](https://pras75299.github.io/animix#overview)** · **[Changelog](./CHANGELOG.md)** · **[Issues](https://github.com/pras75299/animix/issues)**

---

## What you get

- **Zero runtime JS** for base animations — pure CSS keyframes, no main-thread cost.
- **Three consumption modes** — drop-in CSS, Tailwind plugin, or React component API. One token system across all of them.
- **shadcn/ui presets** — Radix UI `data-state` and `data-side` selectors mapped to motion families, no component rewrites.
- **CSS custom property tokens** — override duration, easing, distance, scale start, hover lift, press scale, intensity per component.
- **Accessibility first** — `prefers-reduced-motion` zeros durations without breaking final layout state.
- **Compositor-friendly by default** — core entrance, exit, attention, and transition presets target `transform` and `opacity`. The blur presets (`animix-in-blur`, `animix-out-blur`) animate `filter` as the explicit exception — see [Blur presets and performance](#blur-presets-and-performance) for guidance.
- **Fully typed** — TypeScript definitions for the React layer.

## Bundle size & latency

Measured from the published tarball (run `npm pack --dry-run` to verify):

| Path                     | Runtime JS      | CSS (gzip)    | First-frame latency | Notes                                                                 |
| ------------------------ | --------------- | ------------- | ------------------- | --------------------------------------------------------------------- |
| Pure CSS (full)          | **0 kB**        | **8.8 kB**    | 1 frame (~16 ms)    | composited on the GPU                                                 |
| Pure CSS (cherry-picked) | 0 kB            | from **1 kB** | 1 frame             | per-category imports (`/css/entrance`, `/css/exit`, …)                |
| Tailwind plugin          | 0 kB at runtime | 8.8 kB        | 1 frame             | plugin runs at build time only                                        |
| React bindings           | **3.0 kB gzip** | 8.8 kB        | 1 frame             | uses `useLayoutEffect`, no `setTimeout` between mount and class apply |
| Reduced motion           | 0 kB            | —             | instant             | tokens zero out, end-state still applies                              |

Published tarball: **46 kB compressed / 264 kB unpacked / 32 files** — source maps are stripped for publish.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Mode 1: Pure CSS](#mode-1--pure-css)
- [Mode 2: Tailwind Plugin](#mode-2--tailwind-plugin)
- [Mode 3: React Bindings](#mode-3--react-bindings)
- [shadcn/ui Integration](#shadcnui-integration)
- [CSS Token Reference](#css-token-reference)
- [Animation Catalog](#animation-catalog)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [FAQ](#faq)
- [Versioning & changelog](#versioning--changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
# npm
npm install @pras75299/animix

# pnpm
pnpm add @pras75299/animix

# yarn
yarn add @pras75299/animix
```

**Peer dependencies** (all optional — install only what you use):

```bash
npm install tailwindcss    # for Tailwind plugin
npm install react react-dom # for React bindings
```

---

## Quick Start

**Fastest path** — import the CSS and add a class:

```html
<link rel="stylesheet" href="node_modules/@pras75299/animix/src/index.css" />
<div class="animix-in-slide-up">Hello world</div>
```

Or with a bundler:

```js
import '@pras75299/animix/css';
```

```html
<div class="animix-in-fade animix-slow">Fades in at 280ms</div>
<div class="animix-in-slide-up animix-delay-300">Slides up after 300ms</div>
<button class="animix-shake animix-on-hover">Shakes on hover</button>
```

---

## Mode 1 — Pure CSS

Import the full bundle or individual categories:

```js
// Full bundle (all animations + utilities)
import '@pras75299/animix/css';

// Or cherry-pick for smaller bundles
import '@pras75299/animix/css/tokens'; // CSS custom properties only
import '@pras75299/animix/css/entrance'; // Entrance keyframes + classes
import '@pras75299/animix/css/exit'; // Exit keyframes + classes
import '@pras75299/animix/css/attention'; // Attention seeker animations
import '@pras75299/animix/css/loaders'; // Loading indicators
import '@pras75299/animix/css/transitions'; // UI transition patterns
import '@pras75299/animix/css/utilities'; // Modifier & stagger classes
```

---

### Entrance Animations

Classes prefixed `.animix-in-*` — play once on mount with `fill-mode: both`.

```html
<div class="animix-in-fade">Fade in</div>
<div class="animix-in-slide-up">Slide up from below</div>
<div class="animix-in-slide-down">Slide down from above</div>
<div class="animix-in-slide-left">Slide in from right</div>
<div class="animix-in-slide-right">Slide in from left</div>
<div class="animix-in-scale-up">Scale up from 0.95</div>
<div class="animix-in-scale-down">Scale down from 1.05</div>
<div class="animix-in-flip-x">Flip on X axis</div>
<div class="animix-in-flip-y">Flip on Y axis</div>
<div class="animix-in-rotate">Rotate + scale in</div>
<div class="animix-in-bounce">Bounce in</div>
<div class="animix-in-elastic">Elastic overshoot</div>
<div class="animix-in-blur">Blur + scale in</div>
```

> **All entrances** use `ease-out` timing (decelerate into place) per motion design best practice.

---

### Exit Animations

Classes prefixed `.animix-out-*` — use `fill-mode: both` so the element stays hidden after completion.

```html
<div class="animix-out-fade">Fade out</div>
<div class="animix-out-slide-up">Slide up and out</div>
<div class="animix-out-slide-down">Slide down and out</div>
<div class="animix-out-slide-left">Slide left and out</div>
<div class="animix-out-slide-right">Slide right and out</div>
<div class="animix-out-scale-up">Scale up and out</div>
<div class="animix-out-scale-down">Scale down and out</div>
<div class="animix-out-flip-x">Flip out on X axis</div>
<div class="animix-out-flip-y">Flip out on Y axis</div>
<div class="animix-out-rotate">Rotate out</div>
<div class="animix-out-blur">Blur + scale out</div>
```

> **All exits** use `ease-in` timing (accelerate as they leave) — the asymmetric pair to entrances.

---

### Attention Seekers

Classes prefixed `.animix-*` — most default to `infinite` iteration.

```html
<!-- Infinite loops (use .animix-once or .animix-loop-3 to cap) -->
<div class="animix-pulse">Opacity pulse (loading state)</div>
<div class="animix-bounce">Vertical bounce</div>
<div class="animix-wiggle">Rotation wiggle</div>
<div class="animix-ping">Ping broadcast effect</div>
<div class="animix-float">Gentle vertical float</div>
<div class="animix-heartbeat">Heartbeat scale pulse</div>

<!-- One-shot attention grabs -->
<div class="animix-shake">Horizontal shake (error state)</div>
<div class="animix-jello">Jello skew distortion</div>
<div class="animix-rubber-band">Rubber band scale</div>
<div class="animix-tada">Tada scale + rotate combo</div>
<div class="animix-swing">Pendulum swing (transform-origin: top)</div>
<div class="animix-wobble">Horizontal wobble</div>
```

---

### Loaders

Self-contained loading components built from a single element + CSS `::before`/`::after` where possible.

```html
<!-- Spinning border ring -->
<span class="animix-loader-spin" aria-label="Loading"></span>

<!-- Three bouncing dots — needs 3 child <span> elements -->
<div class="animix-loader-dots" aria-label="Loading">
  <span></span>
  <span></span>
  <span></span>
</div>

<!-- Five stretching bars — needs 5 child <span> elements -->
<div class="animix-loader-bars" aria-label="Loading">
  <span></span><span></span><span></span><span></span><span></span>
</div>

<!-- Pulsing concentric rings (::before + ::after only) -->
<div class="animix-loader-pulse-ring" aria-label="Loading"></div>

<!-- Skeleton shimmer — set width/height on the element -->
<div class="animix-loader-skeleton" style="width: 200px; height: 1rem;"></div>
<div class="animix-loader-skeleton animix-loader-skeleton-circle" style="width: 3rem; height: 3rem;"></div>

<!-- Typing indicator dots — needs 3 child <span> elements -->
<div class="animix-loader-typing-dots" aria-label="Typing">
  <span></span>
  <span></span>
  <span></span>
</div>
```

> Add `aria-hidden="true"` for purely decorative loaders. Add `aria-label="Loading"` when the loader represents meaningful state.

---

### Transitions

Pre-built patterns for common UI component lifecycle animations.

```html
<!-- Page transitions -->
<div class="animix-page-fade-in">Page enters with fade</div>
<div class="animix-page-slide-in">Page enters with slide</div>

<!-- Modal -->
<div class="animix-modal-in">Modal opens (centered scale + fade)</div>
<div class="animix-modal-out">Modal closes</div>

<!-- Drawer — choose the side it opens from -->
<div class="animix-drawer-in-right">Sheet from right</div>
<div class="animix-drawer-in-left">Sheet from left</div>
<div class="animix-drawer-in-top">Sheet from top</div>
<div class="animix-drawer-in-bottom">Bottom sheet / mobile drawer</div>

<!-- Toast notifications -->
<div class="animix-toast-in-right">Toast from right</div>
<div class="animix-toast-in-bottom">Toast from bottom</div>

<!-- Tooltip / Popover -->
<div class="animix-tooltip-in">Tooltip appears (fast pop)</div>
<div class="animix-tooltip-out">Tooltip disappears</div>

<!-- Backdrop overlay -->
<div class="animix-overlay-in">Scrim / backdrop fades in</div>
<div class="animix-overlay-out">Scrim fades out</div>
```

---

### Modifier Classes

Chain any modifier after the animation class to override individual sub-properties.

#### Duration

```html
<div class="animix-in-fade animix-fast">180ms</div>
<div class="animix-in-fade">240ms (default)</div>
<div class="animix-in-fade animix-slow">280ms</div>
<div class="animix-in-fade animix-slower">420ms</div>
```

#### Delay

```html
<div class="animix-in-slide-up animix-delay-75">75ms delay</div>
<div class="animix-in-slide-up animix-delay-150">150ms delay</div>
<div class="animix-in-slide-up animix-delay-300">300ms delay</div>
<div class="animix-in-slide-up animix-delay-500">500ms delay</div>
<div class="animix-in-slide-up animix-delay-700">700ms delay</div>
<div class="animix-in-slide-up animix-delay-1000">1000ms delay</div>
```

#### Easing

```html
<div class="animix-in-scale-up animix-ease-spring">Spring overshoot</div>
<div class="animix-in-scale-up animix-ease-bounce">Elastic bounce</div>
<div class="animix-in-fade animix-ease-in">Ease in (accelerate)</div>
<div class="animix-in-fade animix-ease-out">Ease out (decelerate)</div>
<div class="animix-loader-spin animix-ease-linear">Linear spin</div>
```

#### Repeat

```html
<div class="animix-pulse animix-once">Run once</div>
<div class="animix-pulse animix-loop">Infinite loop (default for attention)</div>
<div class="animix-pulse animix-loop-2">Run 2 times</div>
<div class="animix-pulse animix-loop-3">Run 3 times</div>
```

#### Fill Mode

```html
<div class="animix-in-fade animix-fill-forwards">Stay visible after</div>
<div class="animix-out-fade animix-fill-backwards">Start invisible</div>
<div class="animix-in-fade animix-fill-both">Both (default)</div>
```

#### Play State

```html
<div class="animix-pulse animix-paused" id="loader">Paused</div>
<div class="animix-pulse animix-running">Running</div>
```

#### Hover / Focus Triggers

Apply to a wrapper — the animation plays only on interaction.

```html
<!-- Plays the child animation on hover only -->
<div class="animix-on-hover">
  <div class="animix-rubber-band">Hover me</div>
</div>

<!-- Can also be self-applied -->
<button class="animix-on-hover animix-tada">Tada on hover</button>

<!-- Plays on keyboard focus-visible -->
<a href="#" class="animix-on-focus animix-wiggle">Focus trigger</a>
```

#### Per-Component Token Overrides

Override any CSS custom property inline to control an animation independently:

```html
<!-- Longer slide distance, slower duration, custom easing -->
<div
  class="animix-in-slide-up"
  style="
    --animix-slide-distance: 40px;
    --animix-duration-base: 600ms;
    --animix-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  "
>
  Custom feel
</div>

<!-- Override scale starting point -->
<div class="animix-in-scale-up" style="--animix-scale-start: 0.8;">Bigger scale entrance</div>
```

---

### Stagger System

Animate a list with progressive delays. CSS-only version supports up to 20 children.

```html
<!-- Default 75ms between children -->
<ul class="animix-stagger">
  <li class="animix-in-slide-up">Item 1 — 0ms delay</li>
  <li class="animix-in-slide-up">Item 2 — 75ms delay</li>
  <li class="animix-in-slide-up">Item 3 — 150ms delay</li>
</ul>

<!-- Custom stagger interval -->
<ul class="animix-stagger animix-stagger-100">
  <li class="animix-in-fade">Item 1</li>
  <li class="animix-in-fade">Item 2</li>
  <li class="animix-in-fade">Item 3</li>
</ul>
```

Available stagger intervals: `.animix-stagger-25`, `.animix-stagger-50`, `.animix-stagger-75` (default), `.animix-stagger-100`, `.animix-stagger-150`.

For larger lists (20+ items), use `<AnimateStagger>` from the React bindings which sets `--animix-stagger-index` via JS.

---

## Mode 2 — Tailwind Plugin

```ts
// tailwind.config.ts
import animix from '@pras75299/animix/tailwind';

export default {
  plugins: [animix()],
};
```

Import the token stylesheet separately (the plugin registers keyframes but CSS vars come from the file):

```css
/* globals.css */
@import '@pras75299/animix/css/tokens';
```

Now use `animate-animix-*` utilities alongside standard Tailwind duration/delay/easing:

```html
<!-- Basic entrance -->
<div class="animate-animix-fade-in">Fade in</div>
<div class="animate-animix-slide-up">Slide up</div>

<!-- Parametric utility variants -->
<div class="animate-animix-fade-in-25">Fade from 25% opacity</div>
<div class="animate-animix-zoom-in-90">Zoom in from 0.9 scale</div>
<div class="animate-animix-slide-in-from-top-8">Slide in from top (2rem)</div>
<div class="animate-animix-slide-out-to-right-8">Slide out to right (2rem)</div>

<!-- Combine with Tailwind modifiers -->
<div class="animate-animix-scale-up duration-500 delay-150">Custom timing via Tailwind</div>

<!-- Custom easing (added to Tailwind's ease scale) -->
<div class="animate-animix-slide-up ease-spring">Spring easing</div>
<div class="animate-animix-scale-up ease-bounce">Bounce easing</div>

<!-- Attention loops -->
<div class="animate-animix-pulse">Pulse</div>
<div class="animate-animix-float">Float</div>

<!-- Transitions -->
<div class="animate-animix-modal-in">Modal enter</div>
<div class="animate-animix-tooltip-in">Tooltip pop</div>
<div class="animate-animix-toast-in">Toast slide in</div>
<div class="animate-animix-drawer-in-right">Sheet from right</div>
```

Override tokens inline with Tailwind's arbitrary value syntax or inline styles:

```html
<div class="animate-animix-slide-up" style="--animix-slide-distance:32px; --animix-duration-base:500ms">
  Big custom slide
</div>
```

---

## Mode 3 — React Bindings

```tsx
import { Animate, AnimateStagger, useAnimation, useInView } from '@pras75299/animix/react';
import '@pras75299/animix/css';
```

---

### Animate Component

```tsx
interface AnimateProps {
  children: React.ReactNode;
  animation: AnimationName; // see Animation Catalog below
  trigger?: 'mount' | 'hover' | 'focus' | 'inView' | 'manual';
  /** Required when trigger='manual' */
  manualActive?: boolean;
  duration?: 'fast' | 'base' | 'slow' | 'slower' | number; // number = ms
  delay?: number; // milliseconds
  easing?: 'default' | 'spring' | 'bounce' | 'in' | 'out';
  repeat?: number | 'infinite';
  /** Exit keyframes — used when `exiting` is true */
  exitAnimation?: ExitAnimation;
  /** Set true to run `exitAnimation`; then unmount or hide in `onAnimationEnd` / `animix:exit-complete` */
  exiting?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  className?: string;
  asChild?: boolean; // Radix asChild — no wrapper div
  inViewThreshold?: number; // 0–1, default 0.1
}
```

**Examples:**

```tsx
// Basic mount animation
<Animate animation="slide-up">
  <Card>Slides up when mounted</Card>
</Animate>

// With all options
<Animate
  animation="scale-up"
  duration={400}
  delay={200}
  easing="spring"
  repeat={1}
  onStart={() => console.log('started')}
  onEnd={() => console.log('done')}
>
  <Button>Click me</Button>
</Animate>

// Scroll-triggered entrance
<Animate animation="slide-up" trigger="inView" inViewThreshold={0.2}>
  <Section>Animates when 20% visible</Section>
</Animate>

// Hover trigger
<Animate animation="rubber-band" trigger="hover">
  <Avatar src="/me.jpg" />
</Animate>

// Manual trigger (controlled by parent state)
<Animate animation="fade" trigger="manual" manualActive={isOpen}>
  <Panel />
</Animate>

// asChild — merges animation onto the child (no wrapper div)
<Animate animation="fade" asChild>
  <p className="text-muted-foreground">No extra wrapper div</p>
</Animate>

// Exit: parent sets `exiting` when closing, then removes after the exit animation ends
import { useState } from 'react';

function ToastWithExit() {
  const [open, setOpen] = useState(true);
  const [exiting, setExiting] = useState(false);
  if (!open) return null;
  return (
    <Animate
      animation="fade"
      exitAnimation="scale-down"
      exiting={exiting}
      onEnd={() => {
        if (exiting) setOpen(false);
      }}
    >
      <Toast onDismiss={() => setExiting(true)}>Message sent!</Toast>
    </Animate>
  );
}
```

#### Blur presets and performance

Entrance/exit presets such as `animix-in-blur` / `animate-animix-blur-in` animate the CSS **`filter`** (blur), not just `opacity` / `transform`. That can be **more expensive** (repaints, compositing) on low-end devices. Prefer fade or slide variants when you need maximum smoothness; rely on `prefers-reduced-motion` (token durations go to `0ms`) or `.animix-no-motion` for user-controlled reduction.

`animix-loader-skeleton` currently uses `background-position` shimmer for broad compatibility. A transform-driven pseudo-element shimmer is planned as a dedicated performance refactor rather than bundled into routine transition tuning.

---

### AnimateStagger Component

Applies progressive delays to each child automatically via JS-set `--animix-stagger-index`.

```tsx
// Basic stagger — 75ms between items
<AnimateStagger animation="slide-up">
  {items.map((item) => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</AnimateStagger>

// Custom delay interval
<AnimateStagger animation="fade" delay={120}>
  {features.map((f) => <FeatureCard key={f.id} {...f} />)}
</AnimateStagger>

// Scroll-triggered stagger — waits until container enters viewport
<AnimateStagger
  animation="slide-up"
  delay={80}
  inView
  inViewThreshold={0.1}
>
  {testimonials.map((t) => <Testimonial key={t.id} {...t} />)}
</AnimateStagger>

// Keep semantic list markup with no extra wrapper
<AnimateStagger animation="slide-up" delay={60} as="ul">
  {rows.map((row) => (
    <li key={row.id}>{row.label}</li>
  ))}
</AnimateStagger>

// Or merge onto a single child container
<AnimateStagger animation="fade" asChild>
  <ol className="space-y-2">{items.map((item) => <li key={item.id}>{item}</li>)}</ol>
</AnimateStagger>
```

---

### useAnimation Hook

Imperative control: play, pause, resume, reverse, and reset a CSS animation on any DOM element.

```tsx
import { useRef } from 'react';
import { useAnimation } from '@pras75299/animix/react';

function NotificationBell() {
  const ref = useRef<HTMLButtonElement>(null);

  const { play, pause, resume, reverse, reset, state } = useAnimation(ref, {
    animation: 'animix-wiggle',
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    repeat: 3,
    onEnd: () => console.log('wiggle finished'),
  });

  return (
    <button ref={ref} onClick={play} disabled={state === 'running'}>
      {state === 'running' ? 'Ringing…' : 'Ring Bell'}
    </button>
  );
}
```

```tsx
// Available controls
const { play, pause, resume, reverse, reset, state } = useAnimation(ref, opts);
// state: 'idle' | 'running' | 'paused' | 'finished' | 'reversed'
```

---

### useInView Hook

Returns `true` when the referenced element enters the viewport.

```tsx
import { useRef } from 'react';
import { useInView } from '@pras75299/animix/react';

function AnimatedCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    threshold: 0.5, // 50% visible before triggering
    once: true, // trigger only once (default)
    rootMargin: '0px 0px -100px 0px', // offset trigger point
  });

  return (
    <div ref={ref} className={inView ? 'animix-in-slide-up' : 'opacity-0'}>
      {inView ? <Counter to={1000} /> : null}
    </div>
  );
}
```

---

## shadcn/ui Integration

Import the presets file **after** your shadcn styles:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* animix */
@import '@pras75299/animix/css';
@import '@pras75299/animix/shadcn'; /* ← must come last */
```

This automatically wires animations onto Radix UI `data-state`/`data-side` attributes — no class changes to your components needed:

| Component                      | Opens with                         | Closes with           |
| ------------------------------ | ---------------------------------- | --------------------- |
| `Dialog` / `AlertDialog`       | `modal-in` (centered scale + fade) | `modal-out`           |
| `Sheet` `side="right"`         | drawer slide from right            | slide back out right  |
| `Sheet` `side="left"`          | drawer from left                   | slide back out left   |
| `Sheet` `side="top"`           | drawer from top                    | slide back out top    |
| `Sheet` `side="bottom"`        | drawer from bottom (mobile)        | slide back out bottom |
| `DropdownMenu` / `ContextMenu` | directional slide + scale          | scale down out        |
| `Popover`                      | directional slide + scale          | scale down out        |
| `Tooltip`                      | fast pop (150ms spring)            | fast fade out         |
| `Accordion` / `Collapsible`    | height expand                      | height collapse       |
| `Toast` (Radix)                | slide in from right                | slide out right       |
| `Sonner` toast                 | slide in from right                | slide out right       |
| `Command` / CMDk dialog        | scale up                           | —                     |
| `NavigationMenu`               | fade in                            | fade out              |

> All shadcn presets respect `prefers-reduced-motion` — a single `@media` rule at the bottom of `shadcn-presets.css` strips all animations for users who prefer reduced motion.

**Override a preset** for a specific component:

```css
/* Disable the animix preset for dialog only */
[data-radix-dialog-content] {
  animation: none !important;
}

/* Use a different animation for tooltips */
[data-radix-tooltip-content][data-state='delayed-open'] {
  animation: animix-slide-up-in 150ms var(--animix-ease-spring) both;
}
```

---

## CSS Token Reference

All tokens are CSS custom properties on `:root`. Override them on any element or container.

### Timing Tokens

| Token                      | Default | Notes                     |
| -------------------------- | ------- | ------------------------- |
| `--animix-duration-fast`   | `180ms` | Tooltips, hover feedback  |
| `--animix-duration-base`   | `240ms` | Most UI entrances/exits   |
| `--animix-duration-slow`   | `280ms` | Drawers, page transitions |
| `--animix-duration-slower` | `420ms` | Attention animations      |

### Easing Tokens

| Token                   | Default                                 | Curve                  |
| ----------------------- | --------------------------------------- | ---------------------- |
| `--animix-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)`          | Smooth in-out          |
| `--animix-ease-in`      | `cubic-bezier(0.4, 0, 1, 1)`            | Accelerate (exits)     |
| `--animix-ease-out`     | `cubic-bezier(0, 0, 0.2, 1)`            | Decelerate (entrances) |
| `--animix-ease-spring`  | `cubic-bezier(0.34, 1.56, 0.64, 1)`     | Overshoot spring       |
| `--animix-ease-bounce`  | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | Elastic bounce         |

### Motion Tokens

| Token                     | Default | Controls                                 |
| ------------------------- | ------- | ---------------------------------------- |
| `--animix-slide-distance` | `16px`  | translateX/Y offset for slide animations |
| `--animix-scale-start`    | `0.95`  | Starting scale for scale-up entrance     |
| `--animix-delay`          | `0ms`   | Global animation delay                   |

### Stagger Tokens

| Token                    | Default | Controls                             |
| ------------------------ | ------- | ------------------------------------ |
| `--animix-stagger-delay` | `75ms`  | Delay per child in stagger container |
| `--animix-stagger-index` | `0`     | Set by JS / nth-child selectors      |

### Skeleton Tokens

| Token                         | Default (light)   | Default (dark)    |
| ----------------------------- | ----------------- | ----------------- |
| `--animix-skeleton-base`      | `hsl(0, 0%, 88%)` | `hsl(0, 0%, 18%)` |
| `--animix-skeleton-highlight` | `hsl(0, 0%, 96%)` | `hsl(0, 0%, 26%)` |

---

## Animation Catalog

### Entrances (`.animix-in-*`)

| Class                    | Keyframe                      | Default Duration | Default Easing |
| ------------------------ | ----------------------------- | ---------------- | -------------- |
| `.animix-in-fade`        | opacity 0→1                   | 300ms            | ease-out       |
| `.animix-in-slide-up`    | translateY + opacity          | 300ms            | ease-out       |
| `.animix-in-slide-down`  | translateY + opacity          | 300ms            | ease-out       |
| `.animix-in-slide-left`  | translateX + opacity          | 300ms            | ease-out       |
| `.animix-in-slide-right` | translateX + opacity          | 300ms            | ease-out       |
| `.animix-in-scale-up`    | scale(0.95→1) + opacity       | 300ms            | spring         |
| `.animix-in-scale-down`  | scale(1.05→1) + opacity       | 300ms            | spring         |
| `.animix-in-flip-x`      | perspective rotateX           | 500ms            | ease-out       |
| `.animix-in-flip-y`      | perspective rotateY           | 500ms            | ease-out       |
| `.animix-in-rotate`      | rotate(-180→0) + scale        | 500ms            | spring         |
| `.animix-in-bounce`      | multi-step scale bounce       | 500ms            | ease           |
| `.animix-in-elastic`     | overshoot scale elastic       | 500ms            | ease           |
| `.animix-in-blur`        | blur(8px→0) + scale + opacity | 300ms            | ease-out       |

### Exits (`.animix-out-*`)

| Class                     | Keyframe                      | Default Duration | Default Easing |
| ------------------------- | ----------------------------- | ---------------- | -------------- |
| `.animix-out-fade`        | opacity 1→0                   | 300ms            | ease-in        |
| `.animix-out-slide-up`    | translateY + opacity          | 300ms            | ease-in        |
| `.animix-out-slide-down`  | translateY + opacity          | 300ms            | ease-in        |
| `.animix-out-slide-left`  | translateX + opacity          | 300ms            | ease-in        |
| `.animix-out-slide-right` | translateX + opacity          | 300ms            | ease-in        |
| `.animix-out-scale-up`    | scale(1→1.05) + opacity       | 300ms            | ease-in        |
| `.animix-out-scale-down`  | scale(1→0.95) + opacity       | 300ms            | ease-in        |
| `.animix-out-flip-x`      | perspective rotateX           | 500ms            | ease-in        |
| `.animix-out-flip-y`      | perspective rotateY           | 500ms            | ease-in        |
| `.animix-out-rotate`      | rotate(0→180) + scale         | 500ms            | ease-in        |
| `.animix-out-blur`        | blur(0→8px) + scale + opacity | 300ms            | ease-in        |

### Attention (`.animix-*`)

| Class                 | Default Iteration | Default Duration |
| --------------------- | ----------------- | ---------------- |
| `.animix-pulse`       | infinite          | 800ms            |
| `.animix-bounce`      | infinite          | 800ms            |
| `.animix-shake`       | 1                 | 500ms            |
| `.animix-wiggle`      | infinite          | 600ms            |
| `.animix-ping`        | infinite          | 1s               |
| `.animix-float`       | infinite          | 3s               |
| `.animix-heartbeat`   | infinite          | 1.4s             |
| `.animix-jello`       | 1                 | 800ms            |
| `.animix-rubber-band` | 1                 | 800ms            |
| `.animix-tada`        | 1                 | 800ms            |
| `.animix-swing`       | 1                 | 800ms            |
| `.animix-wobble`      | 1                 | 800ms            |

### Loaders (`.animix-loader-*`)

| Class                        | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `.animix-loader-spin`        | Single element spinner ring                       |
| `.animix-loader-dots`        | Three bouncing dots (needs 3 `<span>` children)   |
| `.animix-loader-bars`        | Five stretching bars (needs 5 `<span>` children)  |
| `.animix-loader-pulse-ring`  | Double concentric pulsing rings                   |
| `.animix-loader-skeleton`    | Shimmer skeleton placeholder                      |
| `.animix-loader-typing-dots` | Chat typing indicator (needs 3 `<span>` children) |

---

## Accessibility

### prefers-reduced-motion

animix handles reduced motion by zeroing all duration tokens:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --animix-duration-fast: 0ms;
    --animix-duration-base: 0ms;
    --animix-duration-slow: 0ms;
    --animix-duration-slower: 0ms;
  }
}
```

This approach (zeroing durations rather than `animation: none`) means:

- `animation-fill-mode: both` still applies — elements end up in their final keyframe state
- No FOUC or layout jump — elements don't flash from start state to end state
- Purely decorative animations complete instantly without being visible

### Global Disable

Add `.animix-no-motion` to `<html>` to kill all animations site-wide — useful for a user preference toggle:

```html
<html class="animix-no-motion"></html>
```

```js
// Toggle based on stored user preference
const prefersNoMotion = localStorage.getItem('motion') === 'off';
document.documentElement.classList.toggle('animix-no-motion', prefersNoMotion);
```

### Loader Accessibility

```html
<!-- Decorative loader: hidden from screen readers -->
<span class="animix-loader-spin" aria-hidden="true"></span>

<!-- Meaningful loader: announced to screen readers -->
<span class="animix-loader-spin" role="status" aria-label="Loading results"></span>
```

---

## Browser Support

| Browser          | Version |
| ---------------- | ------- |
| Chrome / Edge    | 88+     |
| Firefox          | 90+     |
| Safari           | 14+     |
| iOS Safari       | 14+     |
| Samsung Internet | 14+     |

Core presets animate `transform` and `opacity` only — both GPU-composited, no layout recalculation. The blur family (`animix-in-blur`, `animix-out-blur`) animates `filter`, which is paint-bound and not GPU-composited on every browser; reach for the fade or slide variants on large surfaces. Every preset honours `prefers-reduced-motion`.

---

## FAQ

**How do I choose between animix, Motion, GSAP, and Anime.js?**
Use animix for CSS-first lifecycle motion (mount/exit/overlay/attention/loaders) with design-system tokens. Use Motion for React layout/shared-element/gesture-heavy orchestration. Use GSAP for timeline choreography, ScrollTrigger, and advanced interaction sequencing. Use Anime.js when you want a compact JS timeline engine with WAAPI sync.

**Can animix be paired with Motion/GSAP instead of replacing them?**
Yes. Recommended split: animix owns app-shell lifecycle motion and token consistency; Motion/GSAP/Anime.js own specialized choreography and runtime interaction flows where imperative sequencing is required.

**Does it work without React?**
Yes. The `@pras75299/animix/css` and `@pras75299/animix/tailwind` paths have no JS runtime at all. The React bindings are an optional layer.

**Does it work in Server Components / Next.js App Router?**
The CSS path is fully server-renderable — no `"use client"` needed. The React bindings (`Animate`, `AnimateStagger`, `useAnimation`, `useInView`) are client components and need `"use client"` on their importing files.

**Why are some animations starting from `scale(0.95)` and not `scale(0)`?**
"Natural" entry: `scale(0)` looks unprofessional and exaggerates motion. animix uses `scale(0.95)` for subtle emphasis that reads as polished, not theatrical. Override `--animix-scale-start` if you need different.

**Can I disable motion globally?**
Three ways: (1) the user's `prefers-reduced-motion` is respected automatically; (2) add `class="animix-no-motion"` to `<html>` or any subtree as a manual kill switch; (3) override `--animix-motion-intensity: 0` for surgical scope.

**Do animations block hydration / Largest Contentful Paint?**
No. The CSS bundle is render-blocking only at first paint (8.8 kB gzip). Animations themselves run on the compositor thread and don't affect LCP scoring after initial paint.

**Does it tree-shake?**
The Tailwind plugin uses Tailwind's JIT to ship only the classes you reference. The CSS path has cherry-pick imports (`/css/entrance`, `/css/exit`, etc.) for partial loading. The React layer is marked `sideEffects: false` for JS but `*.css` files are flagged as side-effectful so bundlers don't drop them.

**What about CLS (Cumulative Layout Shift)?**
Zero. animix never animates dimensional properties — only `transform` and `opacity`. Reduced-motion mode keeps `animation-fill-mode: both`, so the end state lands instantly without a layout shift.

---

## Versioning & changelog

This package follows [SemVer](https://semver.org/). See [CHANGELOG.md](./CHANGELOG.md) for release notes.

Pre-1.0 means the public surface is still maturing — minor versions may rename CSS classes or React APIs. Pin exact versions if you need stability today.

---

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for setup, commit conventions, and the animation checklist.

```bash
git clone https://github.com/pras75299/animix
cd animix
npm install
npm run dev          # playground at :5173
npm run dev:docs     # docs site
npm run build        # build + emit /dist
npm run typecheck    # type check all workspaces
npm run lint
```

---

## License

[MIT](LICENSE) © animix contributors
