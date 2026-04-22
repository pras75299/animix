# Contributing to animix

Thank you for taking the time to contribute. This document covers everything you need to go from zero to merged PR.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
  - [Adding a New Animation](#adding-a-new-animation)
  - [CSS Conventions](#css-conventions)
  - [TypeScript Conventions](#typescript-conventions)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

Be respectful and constructive. Harassment of any kind will not be tolerated.

---

## Development Setup

### Prerequisites

| Tool    | Version                     |
| ------- | --------------------------- |
| Node.js | ≥ 18                        |
| npm     | ≥ 9 (or pnpm ≥ 8, yarn ≥ 4) |
| Git     | ≥ 2.34                      |

### Steps

**1. Fork and clone the repository**

```bash
git clone https://github.com/animix-js/animix.git
cd animix
```

**2. Install dependencies**

```bash
npm install
```

This automatically installs Husky hooks via the `prepare` script. You will see:

```
> husky
```

**3. Verify setup**

```bash
npm run typecheck   # should pass with 0 errors
npm run lint        # should pass with 0 errors
npm run build       # should produce dist/
```

**4. Create a feature branch**

```bash
git checkout -b feat/entrance-blur-heavy
# or
git checkout -b fix/attention-float-easing
```

---

## Project Structure

```
animix/
├── src/
│   ├── tokens.css              # All CSS custom properties (:root vars)
│   ├── utilities.css           # Modifier classes and stagger system
│   ├── index.css               # CSS barrel (@import of everything)
│   ├── index.ts                # JS barrel (re-exports Tailwind plugin)
│   └── animations/
│       ├── entrance.css        # .animix-in-* classes + @keyframes
│       ├── exit.css            # .animix-out-* classes + @keyframes
│       ├── attention.css       # .animix-* looping attention classes
│       ├── loaders.css         # .animix-loader-* components
│       └── transitions.css     # Page / drawer / modal / toast patterns
├── tailwind/
│   └── plugin.ts               # Tailwind v3/v4 plugin (plugin.withOptions)
├── react/
│   ├── Animate.tsx             # <Animate> and <AnimateStagger> components
│   ├── useAnimation.ts         # useAnimation() and useInView() hooks
│   └── index.ts                # React barrel export
├── shadcn-presets.css          # data-state/data-side Radix UI overrides
├── commitlint.config.js        # Conventional commit rules
├── eslint.config.js            # ESLint flat config
├── .prettierrc                 # Prettier config
├── .husky/                     # Git hooks (pre-commit, commit-msg, pre-push)
├── tsconfig.json               # TypeScript config
└── package.json                # tsup build config is inline here
```

---

## Making Changes

### Adding a New Animation

Follow this checklist **in order**. All steps are required before a PR will be merged.

#### Step 1 — Define the `@keyframes`

Add to the appropriate file in `src/animations/`:

```css
/* In entrance.css, exit.css, attention.css, or transitions.css */

@keyframes animix-your-animation-name {
  from {
    opacity: 0;
    transform: /* ... */;
  }
  to {
    opacity: 1;
    transform: /* ... */;
  }
}
```

**Rules:**

- Animate **only** `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `box-shadow` — these trigger layout recalculation.
- `filter: blur()` is allowed for blur effects only.
- Use `var(--animix-slide-distance, 16px)` for distance, `var(--animix-scale-start, 0.95)` for scale — makes it token-overridable.
- Keyframe name must follow `animix-{descriptive-name}` with no `-in`/`-out` suffix.

#### Step 2 — Add the CSS class

```css
.animix-in-your-name {
  animation-name: animix-your-animation-name;
  animation-duration: var(--animix-duration-base, 300ms);
  animation-timing-function: var(--animix-ease-out, cubic-bezier(0, 0, 0.2, 1));
  animation-delay: var(--animix-delay, 0ms);
  animation-fill-mode: var(--animix-fill-mode, both);
  animation-iteration-count: var(--animix-iteration, 1);
}
```

**Easing direction rules:**

- Entrance: `ease-out` or `ease-spring`
- Exit: `ease-in`
- Attention loops: `ease-default`
- Loaders: `linear` or `ease-in-out`

**Duration rules:**

- Fast interactions (tooltip, hover): `var(--animix-duration-fast, 150ms)` — 150ms
- Most entrances/exits: `var(--animix-duration-base, 300ms)` — 300ms
- Drawers, page transitions: `var(--animix-duration-slow, 500ms)` — 500ms
- Attention loops: `var(--animix-duration-slower, 800ms)` — 800ms

#### Step 3 — Register in the Tailwind plugin

Open `tailwind/plugin.ts` and add to **both** objects:

```ts
// 1. In the keyframes object:
'animix-your-animation-name': {
  from: { opacity: '0', transform: '...' },
  to:   { opacity: '1', transform: '...' },
},

// 2. In the animations object:
'your-name': 'animix-your-animation-name var(--animix-duration-base,300ms) var(--animix-ease-out,...) var(--animix-delay,0ms) both',
```

This is how Tailwind users get `animate-animix-your-name`.

#### Step 4 — Export the React type

Open `react/Animate.tsx` and add the animation name to the appropriate union type:

```ts
// For entrances:
export type EntranceAnimation = 'fade' | 'slide-up' | 'your-name'; // ← add here
// ...
```

#### Step 5 — Verify the animation checklist

Before opening a PR, confirm:

- [ ] Only `transform` and `opacity` are animated (no layout properties)
- [ ] Duration follows the timing table above
- [ ] Easing direction is correct (ease-out for in, ease-in for out)
- [ ] All `var()` calls have hard-coded fallbacks: `var(--animix-duration-base, 300ms)`
- [ ] `animation-fill-mode` is `var(--animix-fill-mode, both)`
- [ ] `animation-delay` is `var(--animix-delay, 0ms)`
- [ ] `animation-iteration-count` is `var(--animix-iteration, 1)` (or `infinite` for attention loops)
- [ ] Keyframe is registered in `tailwind/plugin.ts` → `keyframes`
- [ ] Animation shorthand is registered in `tailwind/plugin.ts` → `animations`
- [ ] TypeScript union type updated in `react/Animate.tsx`
- [ ] README.md Animation Catalog table updated

#### Step 6 — Add a shadcn preset (if applicable)

If the animation is designed for a shadcn/ui component lifecycle, add it to `shadcn-presets.css`:

```css
/* Target the Radix data-state attribute — never use class names */
[data-radix-your-component][data-state='open'] {
  animation: animix-your-animation-name var(--animix-duration-base, 300ms) var(--animix-ease-spring) both;
}
```

Never touch shadcn CSS variables (`--background`, `--foreground`, `--primary`, etc.).

---

### CSS Conventions

**Naming**

| Element         | Pattern                | Example                           |
| --------------- | ---------------------- | --------------------------------- |
| Keyframe        | `animix-{name}`        | `animix-slide-up-in`              |
| Entrance class  | `animix-in-{name}`     | `animix-in-slide-up`              |
| Exit class      | `animix-out-{name}`    | `animix-out-slide-up`             |
| Attention class | `animix-{name}`        | `animix-rubber-band`              |
| Loader class    | `animix-loader-{name}` | `animix-loader-spin`              |
| Modifier        | `animix-{modifier}`    | `animix-fast`, `animix-delay-300` |

**Token fallbacks required**

Every `var()` must include a fallback value so the file works without `tokens.css`:

```css
/* ✅ Correct */
animation-duration: var(--animix-duration-base, 300ms);

/* ✗ Wrong — will fail without tokens.css */
animation-duration: var(--animix-duration-base);
```

**Comment blocks**

Use the established section header style:

```css
/* ── Section Name ──────────────────────────────────────────────── */
```

---

### TypeScript Conventions

- Use `type` imports: `import type { Foo } from './foo'`
- No `any` without a `// eslint-disable` comment explaining why
- All `forwardRef` components need `displayName` set
- Exported interfaces must be documented with a JSDoc comment when non-obvious

---

## Commit Convention

animix uses [Conventional Commits](https://www.conventionalcommits.org/). The `commit-msg` Husky hook enforces this automatically.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to use                                                  |
| ---------- | ------------------------------------------------------------ |
| `feat`     | New animation, new component, new React hook                 |
| `fix`      | Bug fix in animation timing, easing, or behavior             |
| `anim`     | Add/change a specific animation (animix-specific type)       |
| `docs`     | README, CONTRIBUTING, JSDoc comments                         |
| `style`    | CSS formatting, whitespace, ordering (no behavior change)    |
| `refactor` | Code reorganization without behavior change                  |
| `perf`     | Performance improvement (keyframe optimization, bundle size) |
| `chore`    | Build config, dependencies, tooling                          |
| `ci`       | CI/CD workflow changes                                       |
| `revert`   | Revert a previous commit                                     |

### Scopes (optional but encouraged)

`entrance`, `exit`, `attention`, `loaders`, `transitions`, `utilities`, `tokens`, `tailwind`, `react`, `shadcn`, `a11y`, `dx`, `deps`, `release`

### Examples

```bash
# ✅ Good commit messages
git commit -m "anim(entrance): add blur-heavy animation with 12px blur"
git commit -m "fix(attention): correct float animation cubic-bezier easing"
git commit -m "feat(react): add useReducedMotion hook"
git commit -m "docs: update animation catalog table with blur-heavy"
git commit -m "chore(deps): bump husky to 9.1.0"
git commit -m "perf(entrance): reduce keyframe steps in elastic-in"

# ✗ Rejected by commitlint
git commit -m "Fixed stuff"
git commit -m "add animation"
git commit -m "WIP"
git commit -m "FEAT: new animation"  # subject must be lowercase
```

### Breaking Changes

Include `BREAKING CHANGE:` in the commit footer:

```bash
git commit -m "refactor(tokens): rename --animix-ease-spring to --animix-ease-overshoot

BREAKING CHANGE: --animix-ease-spring has been renamed to --animix-ease-overshoot.
Update any inline CSS variable overrides in your project."
```

---

## Pull Request Process

### Before opening a PR

1. **Rebase** onto `main` to keep history clean: `git rebase origin/main`
2. **Run** the full check suite locally:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
3. **Verify** all pre-commit hooks pass by making a test commit.

### PR title

Follow the same Conventional Commits format as commit messages:

```
anim(entrance): add blur-heavy entrance animation
fix(shadcn): tooltip preset not firing on instant-open state
docs: add stagger system section to README
```

### PR description template

When opening a PR on GitHub, the description template will be pre-filled. Fill in all sections:

- **What** — what changed and why
- **Animation checklist** (if adding/modifying an animation)
- **Breaking changes** — list any, or mark "None"
- **Testing** — how to verify the change visually

### Review criteria

PRs are reviewed against these criteria:

1. Animation uses only `transform`/`opacity` (GPU composited)
2. Timing and easing follow the defined token system
3. `prefers-reduced-motion` still works correctly
4. TypeScript compiles with no errors
5. Existing Tailwind utilities are not broken
6. shadcn presets do not conflict with shadcn variables

---

## Pre-commit Hooks

Three Husky hooks run automatically:

| Hook         | Trigger      | What it does                                                      |
| ------------ | ------------ | ----------------------------------------------------------------- |
| `pre-commit` | `git commit` | Runs `lint-staged` (ESLint fix + Prettier format on staged files) |
| `commit-msg` | `git commit` | Validates commit message via `commitlint`                         |
| `pre-push`   | `git push`   | Runs `tsc --noEmit` typecheck                                     |

### Skipping hooks (emergencies only)

```bash
# Skip pre-commit + commit-msg (e.g. for a WIP checkpoint commit on a private branch)
git commit --no-verify -m "chore: wip"

# Skip pre-push typecheck
git push --no-verify
```

Do **not** use `--no-verify` on commits destined for `main`.

### Troubleshooting hooks

**Hook not running after `npm install`?**

```bash
npx husky install
chmod +x .husky/pre-commit .husky/commit-msg .husky/pre-push
```

**`commitlint` rejecting a valid message?**

Run it manually to see the exact error:

```bash
echo "your commit message" | npx commitlint
```

---

## Reporting Bugs

Open an issue with:

1. **Version** — `npm list animix`
2. **Reproduction** — a minimal HTML snippet or CodeSandbox link
3. **Expected behavior** — what should happen
4. **Actual behavior** — what happens instead (include browser/OS)
5. **Reduced-motion** — does the bug appear with `prefers-reduced-motion: reduce`?

---

## Requesting Features

Open an issue tagged `enhancement` with:

1. **Use case** — what UI pattern is this for? What components will use it?
2. **Proposed class name** — following the naming convention
3. **Reference** — a link or description of the target animation behavior
4. **shadcn component** — if this targets a specific Radix/shadcn component, name it

---

Thank you for contributing to animix.
