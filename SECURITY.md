# Security Policy

## Supported Versions

The latest published `0.x` release line receives security fixes. Older prerelease or unpublished commits may not.

## Reporting a Vulnerability

Do not open a public GitHub issue for a suspected security vulnerability.

Report it privately to the maintainers at `pras75299@proton.me` with:

- A description of the issue and affected surface
- Reproduction steps or a proof of concept
- The package version, framework mode, and environment details

You should receive an initial response within 5 business days. If the issue is confirmed, the maintainers will coordinate remediation and disclosure timing with the reporter.

## Threat Model

`animix` is primarily a CSS and build-time library.

- Runtime package surface: shipped CSS classes, React helper components, Tailwind plugin output, and published package metadata
- Main security risks: compromised dependencies, unsafe publish artifacts, malformed docs or examples that encourage insecure integration, and browser-side regressions caused by helper runtime code
- Out of scope: vulnerabilities in consumer application code, third-party UI libraries, or deployment infrastructure that `animix` does not control

## Release Checks

Before publish, run:

```bash
npm run lint
npm run typecheck
npm test
npm run test:react
npm run audit:high
npm pack --dry-run
```
