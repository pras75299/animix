# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**animix** is a production-ready CSS animation library for Tailwind CSS v3/v4 and shadcn/ui. It ships three consumption modes: pure CSS, a Tailwind plugin, and React bindings. Zero runtime JS is required for base animations.

## Development Commands

```bash
npm run build        # tsup: CJS + ESM output + .d.ts in /dist
npm run build:watch  # watch mode
npm run typecheck    # tsc --noEmit
npm run lint         # eslint on .ts/.tsx
npm run prepublishOnly  # build + typecheck (runs before npm publish)
```

The build uses **tsup** with three separate entry points (configured in `package.json` under `"tsup"`):

- `src/index.ts` → `dist/index.[js|cjs]`
- `tailwind/plugin.ts` → `dist/tailwind/plugin.[js|cjs]`
- `react/index.ts` → `dist/react/index.[js|cjs]`

CSS files are **not** processed by tsup — they are exported raw via the `exports` map. Never add a CSS build step; consumers import the source files directly via the exports map entries (`./css`, `./css/entrance`, etc.).

## Architecture

### CSS token cascade

`src/tokens.css` defines all `:root` custom properties (`--animix-*`). Every animation class uses `var(--animix-*)` with a hard-coded fallback, which means:

- CSS files work standalone without `tokens.css` (fallbacks activate)
- Any token can be overridden inline on an element or a parent container
- Reduced-motion is handled by zeroing all duration tokens — `animation-fill-mode: both` then locks in the final keyframe state instantly

### CSS class naming conventions

| Context          | Pattern                 | Example                  |
| ---------------- | ----------------------- | ------------------------ |
| Entrance         | `animix-in-{name}`      | `animix-in-slide-up`     |
| Exit             | `animix-out-{name}`     | `animix-out-blur`        |
| Attention        | `animix-{name}`         | `animix-rubber-band`     |
| Loaders          | `animix-loader-{name}`  | `animix-loader-spin`     |
| Tailwind utility | `animate-animix-{name}` | `animate-animix-fade-in` |
| Keyframe name    | `animix-{name}`         | `animix-slide-up-in`     |

Modifiers (`.animix-fast`, `.animix-delay-300`, `.animix-ease-spring`, etc.) override individual `animation-*` sub-properties and can be chained onto any animation class.

### Tailwind plugin (`tailwind/plugin.ts`)

Uses `plugin.withOptions` (not plain `plugin`) to support future config options. On registration it:

1. Injects CSS tokens and reduced-motion overrides via `addBase`
2. Registers all keyframes in `theme.extend.keyframes` for JIT tree-shaking
3. Generates `animate-animix-*` utilities from the `animations` map via `addUtilities`
4. Adds `ease-spring` and `ease-bounce` to Tailwind's `transitionTimingFunction` scale

**When adding a new animation**, it must be added to **both** the `keyframes` object and the `animations` object in `plugin.ts`, in addition to the relevant CSS file.

### React layer (`react/`)

- `Animate.tsx` — `<Animate>` wrapper (5 triggers: mount/hover/focus/inView/manual) and `<AnimateStagger>`. Uses `IntersectionObserver` for `inView` trigger; no other runtime dependencies. `asChild` prop follows the Radix UI slot pattern (merges animation classes onto the child element instead of wrapping in a div).
- `useAnimation.ts` — `useAnimation(ref, opts)` for imperative control (`.play/.pause/.resume/.reverse/.reset`) and `useInView(ref, opts)` returning a boolean.

### shadcn-presets.css

Targets only Radix UI `data-state` and `data-side` attributes. **Never touches shadcn CSS variables** (`--background`, `--foreground`, `--primary`, `--radius`, etc.). Must be imported **after** shadcn's styles to avoid specificity conflicts. All selectors use attribute form (`[data-radix-*]`) not class names, so they cannot clash with user-defined classes.

### Performance rules

- Animate only `transform` and `opacity` — never `width`, `height`, `top`, `left`, `margin`, or `box-shadow`
- Exits use `ease-in` timing (objects accelerate as they leave); entrances use `ease-out` (decelerate into place)
- `animation-fill-mode: both` is the default so elements stay at the keyframe end-state after completion

# 12-rule template

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

## Rule 1 — Think Before Coding

State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

## Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

## Rule 3 — Surgical Changes

Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

## Rule 4 — Goal-Driven Execution

Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

## Rule 5 — Use the model only for judgment calls

Use me for: classification, drafting, summarization, extraction.
Do NOT use me for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets are not advisory

Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

## Rule 7 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 8 — Read before you write

Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

## Rule 9 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step

Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

## Rule 11 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud

"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.
