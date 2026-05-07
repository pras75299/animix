# animix

> **CSS animation library for Tailwind CSS v3/v4, React, and shadcn/ui. Zero runtime by default, reduced-motion safe.**

<p>
  <a href="https://www.npmjs.com/package/@pras75299/animix"><img src="https://img.shields.io/npm/v/@pras75299%2Fanimix?style=flat-square&label=npm&color=5B5BFF" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@pras75299/animix"><img src="https://img.shields.io/npm/dm/@pras75299%2Fanimix?style=flat-square&label=downloads&color=5B5BFF" alt="downloads" /></a>
  <a href="https://bundlephobia.com/package/@pras75299/animix"><img src="https://img.shields.io/bundlephobia/minzip/@pras75299%2Fanimix?style=flat-square&label=gzip&color=5B5BFF" alt="bundle size" /></a>
  <a href="https://github.com/pras75299/animix/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-5B5BFF?style=flat-square" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/types-included-5B5BFF?style=flat-square" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tree--shaking-yes-5B5BFF?style=flat-square" alt="tree-shaking" />
</p>

**[Documentation](https://pras75299.github.io/animix/)** · **[Live playground](https://pras75299.github.io/animix/#overview)** · **[Changelog](https://github.com/pras75299/animix/blob/main/CHANGELOG.md)** · **[Issues](https://github.com/pras75299/animix/issues)**

---

## Why teams pick animix

- **One package, one motion system** across CSS, Tailwind, React, and shadcn/ui.
- **Zero runtime for the default path** — pure CSS keyframes and token overrides handle the common cases.
- **Reduced-motion safe** — `prefers-reduced-motion` zeros the motion tokens without breaking the end state.
- **Built for product surfaces** — mounts, exits, overlays, loaders, drawers, toasts, and repeatable list motion.

## Trust surface

Measured from the published tarball. Run `npm pack --dry-run` to verify the current release surface:

| Trust signal  | Evidence                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Package name  | Published as `@pras75299/animix` on npm.                                                          |
| Runtime JS    | Pure CSS entry points ship with 0 runtime JS.                                                     |
| Motion safety | Tokens honor `prefers-reduced-motion`, and `.animix-no-motion` is available for explicit opt-out. |
| Entry points  | CSS, Tailwind, React, and shadcn/ui all share the same motion surface.                            |
| Publish shape | Source maps stay out of the tarball, and the shipped files stay limited to the release surface.   |

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Mode 1: Pure CSS](#mode-1--pure-css)
- [Mode 2: Tailwind Plugin](#mode-2--tailwind-plugin)
- [Mode 3: React Bindings](#mode-3--react-bindings)
- [shadcn/ui Integration](#shadcnui-integration)
- [CSS Token Reference](#css-token-reference)
- [Recipes by UI Surface](#recipes-by-ui-surface)
- [Animation Catalog](#animation-catalog)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Choose the Right Tool](#choose-the-right-tool)
- [Pairing Guide](#pairing-guide)
- [Migration Guides](#migration-guides)
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

### 30-second install

```bash
npm install @pras75299/animix
```

```js
import '@pras75299/animix/css';

<div class="animix-in-slide-up">Hello world</div>;
```

Use the CSS entry point when you want the fastest path from npm install to motion on screen. The rest of the guide covers the Tailwind, React, and shadcn/ui entry points.

### Where animix fits

| Use animix for                                                                | Use Motion / GSAP when                                                       |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| mounts, exits, overlays, loaders, toasts, drawers, and repeatable list motion | layout animation, drag, shared elements, scroll scenes, or bespoke timelines |
| CSS-first product surfaces that need consistent tokens                        | the motion itself is the product and needs runtime choreography              |
| shared motion rules across CSS, Tailwind, React, and shadcn/ui                | the experience is better expressed as imperative orchestration               |

animix is the default layer for repeatable lifecycle motion. Motion and GSAP remain the better fit when the work is layout-heavy, gesture-heavy, or timeline-driven.

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

> **Most exits** use the fast `ease-out` teardown curve for responsive UI dismissal. More emphatic exits such as `light-speed`, `roll`, and `hinge` switch to `ease-in`.

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

#### Direction

```html
<div class="animix-pulse animix-reverse">Reverse direction</div>
<div class="animix-pulse animix-alt">Alternate direction</div>
```

#### Play State

```html
<div class="animix-pulse animix-paused" id="loader">Paused</div>
<div class="animix-pulse animix-running">Running</div>
```

#### Hover / Focus Triggers

Apply hover triggers to a wrapper. Use self-applied hover only for attention classes. Focus triggers can also be self-applied to the animated element.

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
<div class="animate-animix-slide-up" style="--animix-slide-distance:32px; --animix-duration-base:420ms">
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

#### React caveats

- **Parent-managed exits only.** `Animate` cannot stop React from unmounting a child. Keep mount state in the parent, flip `exiting` first, then remove the subtree in `onEnd` or after `animix:exit-complete`.
- **Wrapper behavior is the default.** `Animate` renders a wrapper element unless you opt into `asChild`. Use the wrapper when it is acceptable for the motion container to own refs, observers, and event wiring.
- **`asChild` needs a real host element contract.** The child must render a single DOM-bearing element and forward `ref`, `className`, `style`, and event props. Fragments or components that swallow those props cannot host the animation correctly.
- **Keep semantic containers stable.** For lists, tables, or Radix primitives where an extra wrapper changes layout or semantics, use `asChild` or place `Animate` inside an existing semantic node instead of around it.

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
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
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

### Customize with tokens first

The default customization path is:

1. Keep the named preset that matches the surface.
2. Scope token overrides on the surface wrapper.
3. Fork a keyframe only if the movement pattern itself is wrong.

**Before**: duplicated animation rules for one product area.

```css
.settings-modal {
  animation: animix-modal-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.settings-toast {
  animation: animix-toast-in-right 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

**After**: one scoped motion profile, shared by all related surfaces.

```css
.settings-surface {
  --animix-duration-base: 320ms;
  --animix-duration-fast: 200ms;
  --animix-slide-distance: 20px;
  --animix-scale-start: 0.97;
}
```

```html
<section class="settings-surface">
  <div class="animix-modal-in">Preferences</div>
  <div class="animix-toast-in-right">Saved</div>
</section>
```

**Tailwind / inline override** works the same way:

```html
<aside class="animate-animix-drawer-in-right" style="--animix-duration-slow: 340ms; --animix-slide-distance: 22px;">
  ...
</aside>

<ul class="animix-stagger" style="--animix-stagger-delay: 40ms;">
  <li class="animate-animix-slide-up">Overview</li>
  <li class="animate-animix-slide-up">Invoices</li>
  <li class="animate-animix-slide-up">People</li>
</ul>
```

### Timing Tokens

| Token                      | Default | Notes                                  |
| -------------------------- | ------- | -------------------------------------- |
| `--animix-duration-micro`  | `140ms` | Press feedback and micro state changes |
| `--animix-duration-fast`   | `180ms` | Tooltips, hover feedback               |
| `--animix-duration-base`   | `240ms` | Most UI entrances/exits                |
| `--animix-duration-slow`   | `280ms` | Drawers, page transitions              |
| `--animix-duration-slower` | `420ms` | Attention animations                   |

### Easing Tokens

| Token                   | Default                                 | Curve                |
| ----------------------- | --------------------------------------- | -------------------- |
| `--animix-ease-default` | `cubic-bezier(0.23, 1, 0.32, 1)`        | Primary UI easing    |
| `--animix-ease-in`      | `cubic-bezier(0.64, 0, 0.78, 0)`        | Accelerate (exits)   |
| `--animix-ease-out`     | `cubic-bezier(0.23, 1, 0.32, 1)`        | Responsive entrances |
| `--animix-ease-spring`  | `cubic-bezier(0.34, 1.56, 0.64, 1)`     | Overshoot spring     |
| `--animix-ease-bounce`  | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | Elastic bounce       |

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

| Class                    | Keyframe                      | Token Default  | Default Easing |
| ------------------------ | ----------------------------- | -------------- | -------------- |
| `.animix-in-fade`        | opacity 0→1                   | 240ms (`base`) | ease-out       |
| `.animix-in-slide-up`    | translateY + opacity          | 240ms (`base`) | ease-out       |
| `.animix-in-slide-down`  | translateY + opacity          | 240ms (`base`) | ease-out       |
| `.animix-in-slide-left`  | translateX + opacity          | 240ms (`base`) | ease-out       |
| `.animix-in-slide-right` | translateX + opacity          | 240ms (`base`) | ease-out       |
| `.animix-in-scale-up`    | scale(0.95→1) + opacity       | 240ms (`base`) | spring         |
| `.animix-in-scale-down`  | scale(1.05→1) + opacity       | 240ms (`base`) | spring         |
| `.animix-in-flip-x`      | perspective rotateX           | 240ms (`base`) | ease-out       |
| `.animix-in-flip-y`      | perspective rotateY           | 240ms (`base`) | ease-out       |
| `.animix-in-rotate`      | rotate(-180→0) + scale        | 240ms (`base`) | spring         |
| `.animix-in-bounce`      | multi-step scale bounce       | 240ms (`base`) | default        |
| `.animix-in-elastic`     | overshoot scale elastic       | 240ms (`base`) | bounce         |
| `.animix-in-blur`        | blur(8px→0) + scale + opacity | 240ms (`base`) | ease-out       |
| `.animix-in-light-speed` | skewed slide + opacity        | 280ms (`slow`) | ease-out       |
| `.animix-in-roll`        | translated rotate + opacity   | 280ms (`slow`) | ease-out       |

### Exits (`.animix-out-*`)

| Class                     | Keyframe                      | Token Default    | Default Easing |
| ------------------------- | ----------------------------- | ---------------- | -------------- |
| `.animix-out-fade`        | opacity 1→0                   | 180ms (`fast`)   | ease-out       |
| `.animix-out-slide-up`    | translateY + opacity          | 180ms (`fast`)   | ease-out       |
| `.animix-out-slide-down`  | translateY + opacity          | 180ms (`fast`)   | ease-out       |
| `.animix-out-slide-left`  | translateX + opacity          | 180ms (`fast`)   | ease-out       |
| `.animix-out-slide-right` | translateX + opacity          | 180ms (`fast`)   | ease-out       |
| `.animix-out-scale-up`    | scale(1→1.05) + opacity       | 180ms (`fast`)   | ease-out       |
| `.animix-out-scale-down`  | scale(1→0.95) + opacity       | 180ms (`fast`)   | ease-out       |
| `.animix-out-flip-x`      | perspective rotateX           | 180ms (`fast`)   | ease-out       |
| `.animix-out-flip-y`      | perspective rotateY           | 180ms (`fast`)   | ease-out       |
| `.animix-out-rotate`      | rotate(0→180) + scale         | 180ms (`fast`)   | ease-out       |
| `.animix-out-blur`        | blur(0→8px) + scale + opacity | 180ms (`fast`)   | ease-out       |
| `.animix-out-light-speed` | skewed slide + opacity        | 180ms (`fast`)   | ease-in        |
| `.animix-out-roll`        | translated rotate + opacity   | 180ms (`fast`)   | ease-in        |
| `.animix-out-hinge`       | hinged drop + fade            | 420ms (`slower`) | ease-in        |

### Attention (`.animix-*`)

| Class                 | Default Iteration | Default Duration |
| --------------------- | ----------------- | ---------------- |
| `.animix-pulse`       | infinite          | 420ms            |
| `.animix-bounce`      | infinite          | 420ms            |
| `.animix-shake`       | 1                 | 280ms            |
| `.animix-head-shake`  | 1                 | 280ms            |
| `.animix-wiggle`      | infinite          | 600ms            |
| `.animix-ping`        | infinite          | 1s               |
| `.animix-float`       | infinite          | 3s               |
| `.animix-heartbeat`   | infinite          | 1.4s             |
| `.animix-jello`       | 1                 | 420ms            |
| `.animix-rubber-band` | 1                 | 420ms            |
| `.animix-tada`        | 1                 | 420ms            |
| `.animix-swing`       | 1                 | 420ms            |
| `.animix-wobble`      | 1                 | 420ms            |

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

## Choose the Right Tool

Use this when deciding whether animix should be the only motion layer or one layer in a broader stack.

| Tool                  | Reach for it when                                                                                                          | Not the right tool when                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `animix`              | You need lifecycle motion for mounts, exits, overlays, loaders, shadcn/ui primitives, or shared CSS/Tailwind/React tokens. | You need layout transitions, drag, FLIP, gesture physics, or arbitrary runtime timelines.                          |
| `Motion`              | React owns the experience and you need layout animation, shared-element transitions, gestures, or runtime orchestration.   | You want zero-runtime CSS-first motion for common UI states.                                                       |
| `GSAP`                | You need timeline choreography, ScrollTrigger, multi-step hero sequences, or imperative cross-component control.           | The problem is mostly app-shell lifecycle motion that CSS can already handle cleanly.                              |
| `Anime.js`            | You want a compact imperative timeline engine or WAAPI-friendly sequencing for bespoke interactions.                       | You need design-system tokens, shadcn-ready presets, or a React exit helper.                                       |
| `animate.css`         | You want quick generic keyframes on isolated elements with minimal setup.                                                  | You need tokenized product motion, lifecycle conventions, or framework integration.                                |
| `tailwindcss-animate` | You want lightweight Tailwind-native helpers for simple component transitions.                                             | You want a larger preset catalog, React exit orchestration, or one package shared across CSS, Tailwind, and React. |

The wedge is straightforward: animix owns repeatable lifecycle motion; runtime libraries still own choreography, layout, and interaction-heavy work.

---

## Pairing Guide

animix pairs well with runtime libraries when each layer owns different elements or responsibilities.

| Pairing              | Let animix own                                                                         | Let the partner own                                                                 | Handoff rule                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `animix + Motion`    | Dialogs, sheets, toasts, route-shell entrances/exits, and reduced-motion token policy. | Shared-element transitions, drag, gesture state, and layout reflow animation.       | Do not let both libraries animate the same `transform` or `opacity` on the same element at the same time.                      |
| `animix + GSAP`      | Product-wide tokens, overlays, loaders, and repeatable component lifecycle motion.     | Hero choreography, scroll scenes, SVG storytelling, and timeline-driven sequences.  | Keep GSAP on isolated stage elements or dedicated wrappers rather than on nodes already carrying animix lifecycle classes.     |
| `animix + Anime.js`  | App-shell motion, reusable presets, and shadcn/ui surface behavior.                    | Small imperative sequences, WAAPI-synced effects, and bespoke one-off interactions. | Use animix for mount and exit; start Anime.js only after the element is in its stable entered state.                           |
| `animix + shadcn/ui` | Radix `data-state` / `data-side` lifecycle motion and token consistency.               | Structure, accessibility, focus management, and primitive behavior.                 | Import `@pras75299/animix/shadcn` last and override individual presets only when the product genuinely needs a different feel. |

The clean split is responsibility, not brand loyalty: animix handles repeatable lifecycle motion; partner runtimes handle exceptional choreography.

---

## Recipes by UI Surface

These patterns are organized by surface, not by framework. Start with the surface, then choose CSS, Tailwind, React, or shadcn wiring.

### Dialog / sheet / drawer

Use the overlay for the atmosphere and the panel for the main movement.

```html
<div class="animix-overlay-in"></div>
<div class="animix-modal-in">Centered dialog</div>
<aside class="animix-drawer-in-right">Right sheet</aside>

<ul class="animix-stagger" style="--animix-stagger-delay: 45ms;">
  <li class="animix-in-fade">Profile</li>
  <li class="animix-in-fade">Notifications</li>
  <li class="animix-in-fade">Billing</li>
</ul>
```

### Popover / tooltip / dropdown

Keep anchored surfaces attached to the trigger with the correct transform origin.

```html
<button class="animix-focus-soft animix-press-in">Invite member</button>
<div class="animix-tooltip-in" style="transform-origin: var(--radix-popover-content-transform-origin, left top);">
  Roles, permissions, and invite options
</div>
```

### Toasts

Use the same direction for enter and exit so the stack feels spatially consistent.

```html
<div class="animix-toast-in-right">Project published</div>
<div class="animix-toast-out-right">Project published</div>
```

### Command palette

Animate the backdrop and shell softly. Keep keyboard-heavy content nearly instant.

```html
<div class="animix-overlay-in"></div>
<div class="animix-in-fade">
  <input aria-label="Search commands" />
  <ul class="animix-stagger" style="--animix-stagger-delay: 45ms;">
    <li class="animix-in-slide-up">Go to Dashboard</li>
    <li class="animix-in-slide-up">Invite teammate</li>
    <li class="animix-in-slide-up">Toggle theme</li>
  </ul>
</div>
```

### List / table insert-remove

Dense collections should stay quiet. Prefer staggered insert motion and simple fades on remove.

```html
<tbody class="animix-stagger" style="--animix-stagger-delay: 35ms;">
  <tr class="animix-in-fade">
    <td>Invoice #1042</td>
    <td>Paid</td>
  </tr>
  <tr class="animix-in-fade">
    <td>Invoice #1043</td>
    <td>Pending</td>
  </tr>
</tbody>

<tr class="animix-out-fade">
  <td>Invite revoked</td>
  <td>Archived</td>
</tr>
```

### Route transitions

Animate the route shell first. Stagger one meaningful content cluster only if the page density justifies it.

```html
<main class="animix-page-slide-in">
  <header class="animix-in-fade">People</header>
  <section class="animix-stagger" style="--animix-stagger-delay: 50ms;">
    <article class="animix-in-slide-up">Owner</article>
    <article class="animix-in-slide-up">Admin</article>
    <article class="animix-in-slide-up">Member</article>
  </section>
</main>
```

---

## Migration Guides

### From Animate.css

Map generic keyframes to named lifecycle surfaces, then customize with tokens instead of copied animation rules.

```html
<!-- Before -->
<div class="animate__animated animate__fadeInUp">Modal body</div>
<div class="animate__animated animate__fadeOut">Toast</div>

<!-- After -->
<div class="animix-modal-in">Modal body</div>
<div class="animix-toast-out-right">Toast</div>
```

Quick mapping:

- `animate__fadeInUp` -> `animix-in-slide-up`
- `animate__fadeIn` -> `animix-in-fade`
- `animate__fadeOut` -> `animix-out-fade`
- `animate__bounceIn` -> `animix-in-bounce`
- `animate__heartBeat` -> `animix-heartbeat`

### From tailwindcss-animate

Keep Tailwind as the authoring layer, but migrate repeated surface combinations into named animix aliases first.

```html
<!-- Before -->
<div class="animate-in fade-in zoom-in-95 duration-200">Dialog</div>
<div class="slide-in-from-right-full fade-in duration-300">Sheet</div>

<!-- After -->
<div class="animate-animix-modal-in">Dialog</div>
<div class="animate-animix-drawer-in-right">Sheet</div>

<!-- Keep parametric utilities for finer tuning -->
<div class="animate-animix-fade-in-50 animate-animix-slide-in-from-top-4">Lightweight popover</div>
```

### From Motion

Migrate only the surfaces that are really lifecycle motion. Keep Motion for layout, gestures, and shared-element work.

```tsx
// Before
import { AnimatePresence, motion } from 'motion/react';

<AnimatePresence>
  {open ? (
    <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} />
  ) : null}
</AnimatePresence>;

// After
import { Animate } from '@pras75299/animix/react';

function Drawer({ open, closing }: { open: boolean; closing: boolean }) {
  if (!open) return null;

  return (
    <Animate animation="drawer-in-right" exitAnimation="drawer-out-right" exiting={closing}>
      <aside className="animix-drawer-in-right" />
    </Animate>
  );
}
```

### From GSAP

Move shells, overlays, and repeatable product surfaces to animix. Leave bespoke sequences and scroll choreography in GSAP.

```js
// Before: GSAP owns shell + content
gsap.from('.drawer', { xPercent: 100, opacity: 0, duration: 0.32 });
gsap.from('.drawer-item', { y: 20, opacity: 0, stagger: 0.05 });
```

```html
<!-- After: animix owns the shell -->
<aside class="animix-drawer-in-right">
  <ul class="drawer-items">
    ...
  </ul>
</aside>
```

```js
// GSAP keeps the inner sequence
gsap.from('.drawer-items > *', {
  y: 16,
  opacity: 0,
  stagger: 0.05,
  duration: 0.24,
});
```

The safest migration rule is simple: move overlays, drawers, toasts, menus, and route shells first. Leave layout animation, drag, scroll choreography, and timeline-heavy hero work in Motion or GSAP until there is a clear reason not to.

---

## FAQ

**How do I choose between animix, Motion, GSAP, and Anime.js?**
Start with [Choose the Right Tool](#choose-the-right-tool). Short version: animix is the lifecycle-motion layer; Motion, GSAP, and Anime.js take over when the work becomes layout-driven or choreography-heavy.

**Can animix be paired with Motion/GSAP instead of replacing them?**
Yes. See [Pairing Guide](#pairing-guide). The safe split is animix for shared lifecycle motion and partner runtimes for specialized orchestration on separate elements or wrappers.

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

This package follows [SemVer](https://semver.org/). See [CHANGELOG.md](https://github.com/pras75299/animix/blob/main/CHANGELOG.md) for release notes.

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
