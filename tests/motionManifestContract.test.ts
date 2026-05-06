/** @vitest-environment node */

import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { animateAnimix, animix } from '../src/classes';
import { motionManifest } from '../src/motion-manifest';
import {
  ANIMATE_INTENT_UTILITY_CLASSES,
  ANIMATE_REACT_ANIMATION_CLASS_MAP,
} from '../react/Animate';

function flattenDeepValues(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  return Object.values(value as Record<string, unknown>).flatMap((entry) =>
    flattenDeepValues(entry),
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

function collectShippedCssSurface() {
  const selectors = new Set<string>();
  const animationNames = new Set<string>();

  for (const cssPath of collectCssSourcePaths()) {
    const root = postcss.parse(readFileSync(cssPath, 'utf8'));

    root.walkRules((rule) => {
      for (const selector of rule.selectors ?? []) {
        for (const match of selector.matchAll(/\.([a-z0-9-]+)/gi)) {
          selectors.add(match[1]);
        }
      }
    });

    root.walkAtRules('keyframes', (rule) => {
      animationNames.add(rule.params);
    });

    root.walkDecls((decl) => {
      if (decl.prop === 'animation' || decl.prop === 'animation-name') {
        for (const match of decl.value.matchAll(/\banimix-[a-z0-9-]+\b/g)) {
          animationNames.add(match[0]);
        }
      }
    });
  }

  return { selectors, animationNames };
}

describe('motion manifest contract', () => {
  it('keeps manifest CSS selectors and animation names on the shipped surface', () => {
    const { selectors, animationNames } = collectShippedCssSurface();
    const cssSurfaceTokens = new Set<string>([
      ...flattenDeepValues(motionManifest.css),
      ...flattenDeepValues(animix.patterns),
    ]);

    for (const token of cssSurfaceTokens) {
      expect(selectors.has(token), `${token} should ship as a CSS selector`).toBe(true);
    }

    for (const token of flattenDeepValues(motionManifest.shadcn.animation)) {
      expect(animationNames.has(token), `${token} should ship as a referenced animation name`).toBe(
        true,
      );
    }

    expect(motionManifest.css.transitions.toastInRight).toBe('animix-toast-in-right');
    expect(motionManifest.css.transitions.toastOutRight).toBe('animix-toast-out-right');
    expect(motionManifest.shadcn.animation.scaleUpIn).toBe('animix-scale-up-in');
    expect(animateAnimix.transitions.toastIn).toBe('animate-animix-toast-in');
    expect(animateAnimix.transitions.toastOut).toBe('animate-animix-toast-out');
  });

  it('keeps React alias resolution aligned with the CSS and intent surface', () => {
    const cssManifestTokens = new Set(flattenDeepValues(motionManifest.css));

    for (const token of flattenDeepValues(ANIMATE_REACT_ANIMATION_CLASS_MAP)) {
      expect(
        cssManifestTokens.has(token),
        `${token} should resolve React aliases to shipped CSS classes`,
      ).toBe(true);
    }

    for (const intentClassList of Object.values(ANIMATE_INTENT_UTILITY_CLASSES)) {
      for (const token of intentClassList.split(/\s+/).filter(Boolean)) {
        expect(flattenDeepValues(animix.patterns)).toContain(token);
      }
    }

    expect(ANIMATE_REACT_ANIMATION_CLASS_MAP.transition['toast-in']).toBe(
      motionManifest.css.transitions.toastInRight,
    );
    expect(ANIMATE_REACT_ANIMATION_CLASS_MAP.transition['toast-out']).toBe(
      motionManifest.css.transitions.toastOutRight,
    );
    expect(ANIMATE_REACT_ANIMATION_CLASS_MAP.transition['toast-in']).not.toBe(
      motionManifest.animate.transitions.toastIn,
    );
    expect(ANIMATE_REACT_ANIMATION_CLASS_MAP.transition['toast-out']).not.toBe(
      motionManifest.animate.transitions.toastOut,
    );
    expect(ANIMATE_REACT_ANIMATION_CLASS_MAP.entrance['slide-up']).toBe(
      motionManifest.css.entrance.slideUp,
    );
    expect(ANIMATE_INTENT_UTILITY_CLASSES.button.split(' ')).toEqual([
      animix.patterns.hoverLift,
      animix.patterns.focusSoft,
      animix.patterns.pressIn,
    ]);
    expect(ANIMATE_INTENT_UTILITY_CLASSES.image.split(' ')).toEqual([
      animix.patterns.intensityQuiet,
      animix.patterns.originCenter,
    ]);
  });
});
