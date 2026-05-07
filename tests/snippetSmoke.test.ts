/** @vitest-environment node */

import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import postcss from 'postcss';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import * as docsData from '../docs/src/data';
import { animateAnimix, animix } from '../src/classes';
import { motionManifest } from '../src/motion-manifest';

type SnippetFixture = {
  label: string;
  code: string;
  lang?: string;
};

const readmePath = resolve(process.cwd(), 'README.md');
const readmeText = readFileSync(readmePath, 'utf8');
const packageJsonPath = resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
  name: string;
  description?: string;
};
const animixTokenPattern = /--animix-[a-z0-9-]+|animate-animix-[a-z0-9-]+|animix-[a-z0-9-]+/g;
const animixCustomPropertyPattern = /--animix-[a-z0-9-]+/g;

function flattenDeepValues(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  return Object.values(value as Record<string, unknown>).flatMap((nestedValue) =>
    flattenDeepValues(nestedValue),
  );
}

function collectCssSourcePaths() {
  const animationsDir = resolve(process.cwd(), 'src/animations');
  const animationFiles = readdirSync(animationsDir)
    .filter((name) => name.endsWith('.css'))
    .map((name) => resolve(animationsDir, name));

  return [
    resolve(process.cwd(), 'src/index.css'),
    resolve(process.cwd(), 'src/tokens.css'),
    resolve(process.cwd(), 'src/utilities.css'),
    resolve(process.cwd(), 'shadcn-presets.css'),
    ...animationFiles,
  ];
}

function collectShippedAnimixTokens() {
  const tokens = new Set<string>([
    ...flattenDeepValues(animix),
    ...flattenDeepValues(animateAnimix),
    ...flattenDeepValues(motionManifest.shadcn),
  ]);

  for (const cssPath of collectCssSourcePaths()) {
    const cssSource = readFileSync(cssPath, 'utf8');
    for (const match of cssSource.matchAll(animixCustomPropertyPattern)) {
      tokens.add(match[0]);
    }
  }

  return tokens;
}

function extractAnimixTokens(source: string) {
  return [...source.matchAll(animixTokenPattern)].map((match) => match[0]);
}

function transpileSnippet(code: string, label: string, allowSplitFallback = true) {
  const hasJsx = /<[A-Za-z]/.test(code) || code.includes('className=');
  const normalizedCode =
    hasJsx && !/(function\s+\w+|const\s+\w+\s*=|export\s+default)/.test(code)
      ? wrapTopLevelJsxSnippet(code)
      : code;
  const source = ts.createSourceFile(
    `${label}.${hasJsx ? 'tsx' : 'ts'}`,
    normalizedCode,
    ts.ScriptTarget.ES2022,
    true,
    hasJsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const diagnostics = source.parseDiagnostics.filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (
    diagnostics.length > 0 &&
    (normalizedCode.includes('class=') || normalizedCode.trim().startsWith('<'))
  ) {
    expect(() => JSDOM.fragment(normalizedCode)).not.toThrow();
    return;
  }
  if (diagnostics.length > 0 && allowSplitFallback && hasJsx) {
    const segments = splitMixedSnippet(code);
    if (segments.length > 1) {
      segments.forEach((segment, index) => {
        validateSegment(segment, `${label}#${index + 1}`);
      });
      return;
    }
  }
  expect(diagnostics, label).toHaveLength(0);
}

function wrapTopLevelJsxSnippet(code: string) {
  const lines = code.trim().split('\n');
  const headerLines: string[] = [];
  const bodyLines: string[] = [];

  let inHeader = true;
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      inHeader &&
      (trimmed.startsWith('import ') || trimmed === "'use client';" || trimmed === '"use client";')
    ) {
      headerLines.push(line);
      continue;
    }
    inHeader = false;
    if (trimmed.startsWith('//')) {
      continue;
    }
    bodyLines.push(line);
  }

  return `${headerLines.join('\n')}
function SnippetFixture() {
  return (
    <>
${bodyLines.join('\n')}
    </>
  );
}

export default SnippetFixture;`;
}

function validateSegment(code: string, label: string, lang?: string) {
  const trimmed = code.trim();
  expect(trimmed.length, `${label} should not be empty`).toBeGreaterThan(0);

  if (!trimmed) {
    return;
  }

  if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    return;
  }

  if (lang === 'css') {
    expect(() => postcss.parse(trimmed)).not.toThrow();
    return;
  }

  if (lang === 'html') {
    expect(() => JSDOM.fragment(trimmed)).not.toThrow();
    return;
  }

  if (lang === 'ts' || lang === 'tsx' || lang === 'js' || lang === 'jsx') {
    transpileSnippet(trimmed, label);
    return;
  }

  if (/^(npm|pnpm|yarn|git|cd|npx)\b/m.test(trimmed)) {
    return;
  }

  if (trimmed.startsWith('<')) {
    expect(() => JSDOM.fragment(trimmed)).not.toThrow();
    return;
  }

  if ((trimmed.includes('{') && trimmed.includes('}')) || trimmed.startsWith('@')) {
    const looksLikeCss =
      trimmed.startsWith('@') ||
      /^[.#:\[]/.test(trimmed) ||
      /(--animix-|@tailwind|@import|view-transition-name|transition:)/.test(trimmed);
    if (looksLikeCss) {
      expect(() => postcss.parse(trimmed)).not.toThrow();
      return;
    }
  }

  transpileSnippet(trimmed, label);
}

function splitMixedSnippet(code: string) {
  return code
    .split(/\n\s*\n/g)
    .map((segment) => segment.trim())
    .filter((segment) => segment && !/^\.\.\.$/.test(segment));
}

function isWholeProgramSnippet(code: string) {
  return /(import|export|function\s+\w+|const\s+\w+|let\s+\w+|interface\s+\w+|useState|=>)/.test(
    code,
  );
}

function collectDocsSnippets(): SnippetFixture[] {
  return [
    ...Object.values(docsData.installTabs),
    ...docsData.cssTabs,
    ...docsData.tailwindTabs,
    ...Object.values(docsData.reactTabs),
    ...docsData.viewTransitionTabs,
    ...docsData.tokenOverrideTabs,
    ...docsData.pairingTabs,
    ...Object.values(docsData.migrationTabs),
    ...Object.values(docsData.recipeTabs),
  ].map((tab) => ({
    label: `docs:${tab.id}`,
    code: tab.code,
  }));
}

function collectStringFixtures(value: unknown, label: string): SnippetFixture[] {
  if (typeof value === 'string') {
    return [{ label, code: value }];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => collectStringFixtures(entry, `${label}[${index}]`));
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, entry]) =>
    collectStringFixtures(entry, `${label}.${key}`),
  );
}

function collectDocsContentStrings(): SnippetFixture[] {
  return Object.entries(docsData).flatMap(([key, value]) =>
    collectStringFixtures(value, `docs-data:${key}`),
  );
}

function collectReadmeFences(): SnippetFixture[] {
  const fences = [...readmeText.matchAll(/```(\w+)?\n([\s\S]*?)```/g)];
  return fences.map((match, index) => ({
    label: `README fence ${index + 1}`,
    lang: match[1],
    code: match[2] ?? '',
  }));
}

function extractReadmeSection(title: string) {
  const sectionPattern = new RegExp(
    `^##\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
    'm',
  );
  const sectionMatch = readmeText.match(sectionPattern);

  expect(sectionMatch, `README should include ## ${title}`).not.toBeNull();
  if (!sectionMatch) {
    return '';
  }

  const sectionStart = sectionMatch.index ?? 0;
  const nextSectionMatch = readmeText.slice(sectionStart + sectionMatch[0].length).match(/\n##\s+/);
  const sectionEnd = nextSectionMatch
    ? sectionStart + sectionMatch[0].length + nextSectionMatch.index!
    : readmeText.length;

  return readmeText.slice(sectionStart, sectionEnd).trim();
}

describe('docs snippet smoke tests', () => {
  it('keeps the npm-facing README surface focused on the 30-second install path', () => {
    const installationSection = extractReadmeSection('Installation');
    const quickStartSection = extractReadmeSection('Quick Start');

    expect(readmeText).toContain(`npm install ${packageJson.name}`);
    expect(installationSection).toContain(`npm install ${packageJson.name}`);
    expect(readmeText).toContain('## Why teams pick animix');
    expect(readmeText).toContain('## Trust surface');
    expect(quickStartSection).toContain('### 30-second install');
    expect(quickStartSection).toContain('### Where animix fits');
    expect(quickStartSection).toMatch(/\|\s*Use animix for\s*\|\s*Use Motion \/ GSAP when\s*\|/);
    expect(packageJson.description).toContain('reduced-motion safe');
  });

  it('collects only published animix tokens from shipped surfaces', () => {
    const shippedTokens = collectShippedAnimixTokens();

    expect(shippedTokens).toContain('animix-accordion-down');
    expect(shippedTokens).toContain('animix-accordion-up');

    expect(shippedTokens).not.toContain('animix-fade-in');
    expect(shippedTokens).not.toContain('animix-spin');
  });

  it('keeps docs data snippets parseable', () => {
    for (const snippet of collectDocsSnippets()) {
      if (isWholeProgramSnippet(snippet.code)) {
        validateSegment(snippet.code, snippet.label);
        continue;
      }
      const segments = splitMixedSnippet(snippet.code);
      segments.forEach((segment, index) => {
        validateSegment(segment, `${snippet.label}#${index + 1}`);
      });
    }
  });

  it('keeps README fenced snippets parseable', () => {
    for (const snippet of collectReadmeFences()) {
      validateSegment(snippet.code, snippet.label, snippet.lang);
    }
  });

  it('keeps rendered docs content and README animix tokens on the shipped surface area', () => {
    const shippedTokens = collectShippedAnimixTokens();
    const docsContentFixtures = collectDocsContentStrings();
    const fixtures = [...docsContentFixtures, ...collectReadmeFences()];

    expect(
      docsContentFixtures.some(
        (snippet) =>
          !snippet.label.endsWith('.code') &&
          (snippet.code.includes('animix-no-motion') ||
            snippet.code.includes('--animix-duration-base')),
      ),
      'docs surface coverage should include rendered content outside tab.code fields',
    ).toBe(true);

    for (const snippet of fixtures) {
      const invalidTokens = [...new Set(extractAnimixTokens(snippet.code))].filter(
        (token) => !shippedTokens.has(token),
      );

      expect(invalidTokens, `${snippet.label} contains unshipped animix tokens`).toEqual([]);
    }
  });
});
