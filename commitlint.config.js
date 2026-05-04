/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Types allowed in commit messages
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New animation, feature, or component
        'fix',      // Bug fix in animation, timing, or behavior
        'docs',     // README, CONTRIBUTING, code comments
        'style',    // CSS formatting, whitespace (no behavior change)
        'refactor', // Code reorganization without behavior change
        'perf',     // Performance improvements (keyframe optimization, etc.)
        'test',     // Adding or updating tests
        'chore',    // Build, tooling, dependencies
        'ci',       // CI/CD changes
        'revert',   // Revert a previous commit
        'anim',     // New animation or animation category (animix-specific)
      ],
    ],
    // Scope options (optional but encouraged)
    'scope-enum': [
      1, // warning only
      'always',
      [
        'entrance',
        'exit',
        'attention',
        'loaders',
        'transitions',
        'utilities',
        'tokens',
        'tailwind',
        'react',
        'shadcn',
        'a11y',
        'dx',
        'deps',
        'release',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 120],
    // Dependabot and release tooling often attach useful bodies/footers.
    'body-empty': [0],
    'body-max-line-length': [2, 'always', 200],
    'footer-empty': [0],
  },
};
