# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
