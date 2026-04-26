# animix — Open source code review

**Scope:** Full repository review against common open source library practices (packaging, CI, correctness, accessibility, documentation, and maintainability).  
**Review date:** 2026-04-13  
**Verification run:** `npm run lint` (failed: invalid `--ext` with flat config), `npx eslint .` (failed: 18 errors), `npm run typecheck` (passed), `npm run format:check` (failed: Prettier reports issues in 21 files including docs and CSS).

---

## Executive summary

animix is a well-scoped CSS-first animation kit with a thoughtful architecture: design tokens with fallbacks, a Tailwind plugin, optional React bindings, and shadcn/Radix-oriented presets. Contributor-facing docs (README, CONTRIBUTING, CHANGELOG, issue/PR templates, commitlint, Husky, GitHub Actions) are ahead of many early-stage libraries.

The main gaps for a trustworthy public release are: **(1) CI and local lint are currently broken** due to ESLint flat config vs CLI flags; **(2) Prettier check fails** on many tracked files, so the format CI step is red; **(3) ESLint reports many errors** in the React sources (unused state, style rules); **(4) several behavioral bugs or incomplete features** in React hooks/components; **(5) material drift between pure CSS and the Tailwind plugin** (keyframes/utilities present in CSS but absent from `tailwind/plugin.ts`); and **(6) no automated test suite**, so regressions are easy to introduce.

---

## Severity legend

| Level  | Meaning                                                              |
| ------ | -------------------------------------------------------------------- |
| **P0** | Blocks trustworthy CI, publish, or causes clear user-facing breakage |
| **P1** | Correctness, a11y, or parity bugs that will surprise consumers       |
| **P2** | Maintainability, DX, or polish; should fix before wide adoption      |
| **P3** | Nice-to-have OSS hygiene                                             |

---

## P0 — Release and automation blockers

### 1. `npm run lint` is incompatible with ESLint 9 flat config

`package.json` uses:

```json
"lint": "eslint . --ext .ts,.tsx"
```

With `eslint.config.js` (flat config), `--ext` is **rejected**. Running `npm run lint` fails immediately with:

> `Invalid option '--ext'`

**Impact:** Local `npm run lint`, `prepublishOnly`, and **GitHub Actions** (`.github/workflows/ci.yml` step “Lint”) will fail until the script is updated (for example: `eslint .` with file patterns defined in config, or explicit globs).

**Recommendation:** Change to `eslint .` (patterns already limited in `eslint.config.js` via `files`), and align `lint-staged` if it passes deprecated flags.

### 2. Prettier check fails across the repo

`npm run format:check` reports **21 files** out of compliance (markdown, JSON, TS, CSS). CI runs this step, so **pipelines are red** for formatting until `npm run format` (or equivalent) is applied and committed.

### 3. ESLint currently fails on committed TypeScript

Running `npx eslint .` reports **18 errors**, including:

- **`curly` rule:** one-line `if` bodies without braces across `react/Animate.tsx` and `react/useAnimation.ts`.
- **`@typescript-eslint/no-unused-vars`:** `setIsExiting`, `delayClass`, and destructured `onStart` / `onEnd` flagged as unused.
- **`eqeqeq`:** `duration != null` flagged in favor of strict `!==` / `===` (or restructure).

**Impact:** Even after fixing the `--ext` flag, CI will fail until these are resolved or rules relaxed (not recommended for a strict baseline).

---

## P1 — Correctness and API behavior

### 4. `useAnimation`: `animationcancel` listener is never removed correctly

In `react/useAnimation.ts`, `attachListeners` registers:

```ts
el.addEventListener('animationcancel', () => setState('idle'));
```

The cleanup uses **a new arrow function** in `removeEventListener`, which does **not** match the original listener reference. The cancel handler (and possibly others if copy-pasted similarly) can leak and stack across `play()` calls.

**Recommendation:** Name each handler (`const onCancel = () => { ... }`) and pass the same reference to `addEventListener` and `removeEventListener`.

### 5. `<Animate>`: forwarded ref handling is not correct for callback refs

The component uses:

```ts
const ref = (forwardedRef as React.RefObject<HTMLElement>) ?? internalRef;
```

This assumes `forwardedRef` is a `RefObject`. **`forwardRef` may receive a callback ref**; coercing it to `RefObject` breaks assignment and breaks `ref` merging with the child when `asChild` is used with Radix-style components.

**Recommendation:** Use a small `composeRefs` / `useMergedRefs` utility, or assign via `useCallback` that handles both object and function refs.

### 6. Exit animation path appears incomplete

`Animate` declares `exitAnimation` and `isExiting`, but **`setIsExiting` is never used** (eslint flags it). The exit class is derived from `isExiting && exitAnimation`, yet nothing in the reviewed code sets `isExiting` to `true`. Consumers expecting documented exit-on-unmount behavior may not get it.

**Recommendation:** Either implement a documented exit flow (e.g. controlled visibility + `onAnimationEnd` + portal teardown, or a small “exit phase” state machine), or narrow the public API/docs until the behavior is real.

### 7. CSS ↔ Tailwind plugin parity gaps

Pure CSS in `src/animations/transitions.css` defines keyframes and classes that are **not present** in `tailwind/plugin.ts` (confirmed by search), including at least:

- **Overlay / backdrop:** `animix-overlay-in`, `animix-overlay-out` (used by `shadcn-presets.css`).
- **Page transitions:** `animix-page-fade-in/out`, `animix-page-slide-in/out`.
- **Drawer top:** `animix-drawer-in-top`, `animix-drawer-out-top` (CSS has these; the plugin excerpt documents left/right/bottom only).
- **Toast bottom:** `animix-toast-in-bottom`, `animix-toast-out-bottom` (CSS has these; plugin maps `toast-in` / `toast-out` to the right-side variants only).

**Impact:** Projects that use **only** the Tailwind plugin (no CSS import) may miss keyframes that shadcn presets or class names imply exist. This is a **silent** failure mode (animations no-op or invalid `animation-name`).

**Recommendation:** Treat `tailwind/plugin.ts` and the CSS files as a **single checklist** (as CONTRIBUTING already suggests) and add a small script or test that diffs keyframe names, or generate one source of truth.

### 8. Performance guideline vs `blur` animations

Project guidance (see `CLAUDE.md`) prefers animating **transform and opacity**. Blur keyframes use **`filter`**, which is heavier and can affect compositing. This is not wrong, but it is a **documented tradeoff** worth calling out in README (performance section) so consumers choose consciously.

---

## P2 — Developer experience and maintainability

### 9. Prettier and ESLint integration

`eslint-config-prettier` is a dependency but **not wired into `eslint.config.js`**. Today, Prettier and ESLint can fight over formatting (e.g. `curly` “all” vs Prettier’s tolerance of single-line `if`).

**Recommendation:** Import and spread `eslintConfigPrettier` as the last flat-config entry, or drop redundant stylistic ESLint rules that Prettier owns.

### 10. Dead or misleading code

- **`delayClass`** in `Animate.tsx` is assigned as `delay ? '' : ''` and unused — likely a leftover.
- **Plugin header comment** in `tailwind/plugin.ts` shows `animate-fade-in`; the theme registers **`animate-animix-fade-in`**-style keys via the `animix-` prefix. Update the comment to match reality to reduce integration mistakes.

### 11. Package metadata placeholders

`package.json` still has:

- `"author": ""`
- `"homepage"` / `"repository"` / `"bugs"` pointing at `https://github.com/your-org/animix.git`

Same placeholder appears in `CONTRIBUTING.md` clone URL.

**Recommendation:** Fill before publish; add `"publishConfig"` if using npm org scopes; consider `"engines": { "node": ">=18" }` to match CI.

### 12. Optional: `sideEffects` for bundlers

For a package that ships **only** side-effect-free JS re-exports plus raw CSS paths, declaring [`sideEffects`](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) correctly can help consumers tree-shake. CSS imports are inherently side-effectful; document which subpaths are safe.

### 13. Repository naming vs package name

The workspace directory is `animax` while the npm package is **`animix`**. Not a functional bug, but it increases friction for contributors and support. Align naming where possible.

---

## P3 — Open source hygiene and roadmap

### 14. Automated tests (missing)

There is **no** `test` script and no unit/integration tests for:

- Tailwind plugin registration (smoke: `tailwindcss` build with plugin).
- React `Animate` / `useAnimation` behavior (JSDOM + `@testing-library/react` or similar).
- CSS snapshot or keyframe parity checks.

**Recommendation:** Start with **one** high-value test: build a minimal Tailwind config with the plugin and assert generated CSS contains expected `@keyframes` names. Add React tests second.

### 15. Security and community files

Present: `LICENSE`, issue templates, PR template, `CONTRIBUTING.md`.  
Consider adding:

- **`SECURITY.md`** with disclosure contact (GitHub “Security” tab expectation).
- **`CODEOWNERS`** if a team maintains areas (`tailwind/`, `react/`, `src/`).
- **Release automation:** `release-please`, Changesets, or manual but documented version bump process tied to `CHANGELOG.md`.

### 16. Broader compatibility claims

README and tooling mention Tailwind v3/v4. **Validate v4** in CI (matrix or separate job) if that claim is contractual; the plugin API differs enough that “works on v4” should be evidence-based.

### 17. Accessibility

Tokens honor `prefers-reduced-motion`; `.animix-no-motion` is a strong escape hatch. For React:

- Ensure `inView` and hover/focus triggers do not trap keyboard users in confusing motion-only state changes; document that `prefers-reduced-motion` should still be respected at the app level (class on `html`).

---

## What is already strong

- **Clear product split:** CSS-only, Tailwind plugin, React — matches how real teams adopt animation.
- **Design token model:** Fallbacks in `var()` keep CSS usable without importing `tokens.css`.
- **Contributor workflow:** Commitlint scopes/types, Husky, lint-staged, multi-version Node CI, export verification step in CI.
- **shadcn presets:** Attribute selectors avoid clashing with user class names; comments state intentional ordering vs shadcn CSS.
- **Documentation volume:** README and CONTRIBUTING are unusually complete for v0.1.0.

---

## Suggested priority order

1. Run **`npm run format`** (or Prettier on the repo) so **`npm run format:check`** passes in CI.
2. Fix **`npm run lint`** and resolve the **18 ESLint errors** so CI is green.
3. Fix **`useAnimation` listener cleanup** and **`<Animate>` ref forwarding**.
4. Either **implement exit animation state** or **narrow docs/API** until it works.
5. **Reconcile Tailwind plugin with CSS keyframes** (overlay, page, drawer-top, toast-bottom, any others found by a diff).
6. Add a **minimal automated test** suite and run it in CI.
7. Replace **placeholder** `package.json` / docs URLs and fill **author**.
8. Polish: Prettier + ESLint integration, `sideEffects`, `SECURITY.md`, Tailwind v4 verification.

---

## Appendix — Source inventory (non-generated)

| Area    | Files                                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| JS/TS   | `src/index.ts`, `tailwind/plugin.ts`, `react/Animate.tsx`, `react/useAnimation.ts`, `react/index.ts`                                                   |
| CSS     | `src/tokens.css`, `src/index.css`, `src/utilities.css`, `src/animations/*.css`, `shadcn-presets.css`                                                   |
| Tooling | `package.json`, `tsconfig.json`, `tsup` config (in `package.json`), `eslint.config.js`, `commitlint.config.js`, `.husky/*`, `.github/workflows/ci.yml` |

---

## Appendix — Commands used during this review

```bash
npm run lint          # failed: invalid --ext with flat config
npx eslint .          # failed: 18 errors in react/*.tsx, react/*.ts
npm run typecheck     # passed
npm run format:check  # failed: 21 files
```

After fixing the lint script and code issues, run:

```bash
npm run lint && npm run typecheck && npm run format:check && npm run build
```

to match CI expectations.

---

_This document is a point-in-time review; re-run verification after changes before treating any “fails/passes” statement as current._
