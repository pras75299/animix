# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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
