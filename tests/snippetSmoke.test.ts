/** @vitest-environment node */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import postcss from 'postcss';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import {
  cssTabs,
  installTabs,
  pairingTabs,
  reactTabs,
  recipeTabs,
  tailwindTabs,
  viewTransitionTabs,
} from '../docs/src/data';

type SnippetFixture = {
  label: string;
  code: string;
  lang?: string;
};

const readmePath = resolve(process.cwd(), 'README.md');
const readmeText = readFileSync(readmePath, 'utf8');

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
    ...Object.values(installTabs),
    ...cssTabs,
    ...tailwindTabs,
    ...Object.values(reactTabs),
    ...viewTransitionTabs,
    ...pairingTabs,
    ...Object.values(recipeTabs),
  ].map((tab) => ({
    label: `docs:${tab.id}`,
    code: tab.code,
  }));
}

function collectReadmeFences(): SnippetFixture[] {
  const fences = [...readmeText.matchAll(/```(\w+)?\n([\s\S]*?)```/g)];
  return fences.map((match, index) => ({
    label: `README fence ${index + 1}`,
    lang: match[1],
    code: match[2] ?? '',
  }));
}

describe('docs snippet smoke tests', () => {
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
});
