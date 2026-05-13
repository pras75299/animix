# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.7] — 2026-05-13

### Fixed

- Replaced the dynamic bundle-size badge with a static `gzip-5.5 kB` shield. Both shields.io/bundlephobia and shields.io/bundlejs return cached errors via the npm image proxy when their upstream APIs throttle, so a static value is the only reliably-rendering option. The bundlejs.com click-through link is preserved for live numbers.

## [0.2.6] — 2026-05-13

### Fixed

- Swapped the README bundle-size badge from bundlephobia (rate-limited and broken on the npm registry page) to bundlejs.com so the size shows again.

## [0.2.5] — 2026-05-13

### Changed

- Enabled tsup minification on the published JS bundles, halving the React bindings and shaving ~20% off the Tailwind plugin output.
- Replaced `dist/index.cjs` with a thin re-export of `dist/tailwind/plugin.cjs` (via `scripts/dedupe-cjs.mjs`) so the bundled plugin code is no longer duplicated in CJS.
- Dropped declaration maps from the published types; consumers don't read them and they only bloated the tarball.

Tarball: 79.0 kB → 66.1 kB; unpacked: 447.3 kB → 346.5 kB; no API or behaviour change.

## [0.2.4] — 2026-05-07

### Fixed

- Excluded test declaration artifacts from the published tarball so `dist/react/__tests__/*` no longer leaks into npm.
- Added the shipped `SECURITY.md` policy to the package contents and aligned the repo hook allowlist so the policy can be maintained normally.
- Removed lint warnings from verification tests used to guard the npm-facing README and React manual trigger coverage.

## [0.2.1] — 2026-04-26

### Fixed

- README badges and install snippet referenced `@animix-js/animix` but the package was published under `@pras75299/animix`. All registry-facing references corrected.

## [0.2.0] — 2026-04-26

### Added

- First public release on the npm registry as `@pras75299/animix`.
- Source maps stripped from publish tarball (47.8 kB compressed / 268.7 kB unpacked / 32 files).
- `publishConfig`, `engines`, `sideEffects`, expanded `keywords` for discoverability.

## [Unreleased]

### Changed

- Refreshed the README top section for npm consumers with a shorter install path, a trust table, and clearer fit guidance.
- Tightened the snippet smoke tests so the README install surface stays aligned with package metadata.

### Added

- Initial implementation of animix CSS animation library
- 13 entrance animations (`animix-in-*`)
- 11 exit animations (`animix-out-*`)
- 12 attention seeker animations (`animix-*`)
- 6 loader components (`animix-loader-*`)
- 14 UI transition patterns (modal, drawer, toast, tooltip, page, overlay)
- Modifier classes: duration, delay, easing, repeat, fill-mode, play-state
- Stagger system with CSS `nth-child` support up to 20 children
- Hover and focus trigger utilities (`.animix-on-hover`, `.animix-on-focus`)
- CSS custom property token system with `prefers-reduced-motion` support
- `.animix-no-motion` global disable class
- Tailwind CSS v3/v4 plugin via `plugin.withOptions`
- `animate-animix-*` utilities registered in Tailwind's animation scale
- `ease-spring` and `ease-bounce` added to Tailwind's easing scale
- React `<Animate>` component with mount/hover/focus/inView/manual triggers
- React `<AnimateStagger>` component with IntersectionObserver support
- `useAnimation(ref, opts)` hook with `.play/.pause/.resume/.reverse/.reset`
- `useInView(ref, opts)` hook
- shadcn/ui presets for Dialog, Sheet, Dropdown, Tooltip, Accordion, Toast, Command
- Husky pre-commit, commit-msg, and pre-push hooks
- Conventional Commits enforcement via commitlint
- GitHub Actions CI workflow (lint + typecheck + build + export verification)
- Motion surface regression snapshots for modal, drawer, tooltip, toast, and staggered lists
- Scheduled `npm audit` workflow with high/critical failure policy
- Dependabot automation with grouped dev-toolchain updates
- `SECURITY.md` with runtime vs toolchain threat model and disclosure path
- Migration guides from Animate.css, tailwindcss-animate, Motion, and GSAP
- Surface-first recipe docs for dialogs, sheets, popovers, toasts, command palettes, list updates, and route transitions
- Token-first customization examples with before/after override patterns

### Changed

- Reduced-motion tokens now zero shared animation delay and stagger delay to avoid lingering sequences
