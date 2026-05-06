/** @vitest-environment node */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { JSDOM } from 'jsdom';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import {
  cssTabs,
  installTabs,
  migrationTabs,
  pairingTabs,
  reactTabs,
  recipeTabs,
  tailwindTabs,
  tokenOverrideTabs,
  viewTransitionTabs,
} from '../docs/src/data';

type SnippetFixture = {
  label: string;
  code: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const readme = readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
const utilitiesCss = readFileSync(path.join(repoRoot, 'src/utilities.css'), 'utf8');

function collectDocsSnippets(): SnippetFixture[] {
  return [
    ...Object.values(installTabs),
    ...cssTabs,
    ...tailwindTabs,
    ...Object.values(reactTabs),
    ...viewTransitionTabs,
    ...tokenOverrideTabs,
    ...pairingTabs,
    ...Object.values(migrationTabs),
    ...Object.values(recipeTabs),
  ].map((tab) => ({
    label: `docs:${tab.id}`,
    code: tab.code,
  }));
}

function collectReadmeFenceSnippets(): SnippetFixture[] {
  const fences = [...readme.matchAll(/```(?:\w+)?\n([\s\S]*?)```/g)];
  return fences.map((match, index) => ({
    label: `README fence ${index + 1}`,
    code: match[1] ?? '',
  }));
}

function extractClassTokens(source: string) {
  const tokens = new Set<string>();
  const classAttributePattern =
    /class(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\})/g;

  for (const match of source.matchAll(classAttributePattern)) {
    const classList = match.slice(1).find(Boolean);
    if (!classList) {
      continue;
    }

    for (const token of classList.split(/\s+/).filter(Boolean)) {
      tokens.add(token);
    }
  }

  return tokens;
}

function extractHoverFocusSection() {
  const match = readme.match(/#### Hover \/ Focus Triggers\s*([\s\S]*?)(?=\n#### |\n---|\Z)/);
  if (!match) {
    throw new Error('README Hover / Focus section not found');
  }
  return match[1].trim();
}

function extractFirstHtmlFence(section: string) {
  const match = section.match(/```html\n([\s\S]*?)```/);
  if (!match) {
    throw new Error('HTML example not found in README Hover / Focus section');
  }
  return match[1];
}

function collectSelectorSet(cssSource: string) {
  const selectors = new Set<string>();
  const root = postcss.parse(cssSource);

  root.walkRules((rule) => {
    for (const selector of rule.selectors ?? []) {
      selectors.add(selector);
    }
  });

  return selectors;
}

describe('docs class contracts', () => {
  it('keeps README and docs snippet class tokens on shipped utilities', () => {
    const invalidTokens = new Set([
      'animix-loop-1',
      'repeat-1',
      'fill-mode-both',
      'direction-alternate',
    ]);
    const docsTokens = new Set(
      collectDocsSnippets().flatMap((snippet) => [...extractClassTokens(snippet.code)]),
    );
    const readmeTokens = new Set(
      collectReadmeFenceSnippets().flatMap((snippet) => [...extractClassTokens(snippet.code)]),
    );

    for (const invalidToken of invalidTokens) {
      expect(docsTokens.has(invalidToken), `docs snippets should not use ${invalidToken}`).toBe(
        false,
      );
      expect(readmeTokens.has(invalidToken), `README snippets should not use ${invalidToken}`).toBe(
        false,
      );
    }

    expect(docsTokens.has('animix-once')).toBe(true);
    expect(docsTokens.has('animix-alt')).toBe(true);
    expect(readmeTokens.has('animix-once')).toBe(true);
    expect(readmeTokens.has('animix-alt')).toBe(true);
  });

  it('documents the hover/focus trigger limitation precisely in the README section', () => {
    const section = extractHoverFocusSection();

    expect(section).not.toContain('wrapper or the animated element itself');
    expect(section).toContain('Apply hover triggers to a wrapper');
    expect(section).toContain('self-applied hover only for attention classes');
    expect(section).toContain('Focus triggers can also be self-applied');
  });

  it('documents and ships self-applied focus selectors for the README example', () => {
    const section = extractHoverFocusSection();
    const htmlExample = extractFirstHtmlFence(section);
    const fragment = JSDOM.fragment(htmlExample);
    const selfAppliedFocusTrigger = fragment.querySelector('a.animix-on-focus.animix-wiggle');
    const selectors = collectSelectorSet(utilitiesCss);

    expect(selfAppliedFocusTrigger).not.toBeNull();
    expect(selectors.has('.animix-on-focus[class*="animix-"]')).toBe(true);
    expect(selectors.has('.animix-on-focus:focus-visible[class*="animix-"]')).toBe(true);
    expect(selfAppliedFocusTrigger?.matches('.animix-on-focus[class*="animix-"]')).toBe(true);
  });
});
