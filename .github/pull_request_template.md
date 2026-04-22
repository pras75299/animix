## What

<!-- Describe what changed and why. -->

## Type of change

- [ ] `feat` — new animation or component
- [ ] `anim` — new/modified animation keyframe
- [ ] `fix` — bug fix
- [ ] `docs` — documentation only
- [ ] `refactor` — no behavior change
- [ ] `perf` — performance improvement
- [ ] `chore` — build, tooling, dependencies

## Animation checklist (skip if no new/modified animations)

- [ ] Animates only `transform` and/or `opacity` (no layout properties)
- [ ] Duration uses `var(--animix-duration-*, Xms)` with hard-coded fallback
- [ ] Easing uses `var(--animix-ease-*, ...)` with hard-coded fallback
- [ ] Entrance uses `ease-out`, exit uses `ease-in`
- [ ] `animation-fill-mode: var(--animix-fill-mode, both)`
- [ ] `animation-delay: var(--animix-delay, 0ms)`
- [ ] Keyframe registered in `tailwind/plugin.ts` → `keyframes`
- [ ] Animation shorthand registered in `tailwind/plugin.ts` → `animations`
- [ ] TypeScript union type updated in `react/Animate.tsx`
- [ ] README Animation Catalog table updated

## Breaking changes

<!-- List breaking changes or write "None" -->

None

## Testing

<!-- How to verify this change visually. Paste an HTML snippet or describe steps. -->

```html
<!-- Paste a minimal reproduction or usage example -->
```

## Screenshots / recordings (optional)

<!-- Attach a GIF or screen recording if the change is visual -->
