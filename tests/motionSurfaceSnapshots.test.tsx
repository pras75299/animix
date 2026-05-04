import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const tokensCss = readFileSync(path.join(repoRoot, 'src/tokens.css'), 'utf8');
const entranceCss = readFileSync(path.join(repoRoot, 'src/animations/entrance.css'), 'utf8');
const transitionsCss = readFileSync(path.join(repoRoot, 'src/animations/transitions.css'), 'utf8');
const utilitiesCss = readFileSync(path.join(repoRoot, 'src/utilities.css'), 'utf8');

function MotionSurfaceFixture({ reduced = false }: { reduced?: boolean }) {
  const reducedMotionVars = reduced
    ? {
        '--animix-duration-micro': '0ms',
        '--animix-duration-fast': '0ms',
        '--animix-duration-base': '0ms',
        '--animix-duration-slow': '0ms',
        '--animix-duration-slower': '0ms',
        '--animix-delay': '0ms',
        '--animix-stagger-delay': '0ms',
        '--animix-motion-intensity': '0',
      }
    : undefined;

  return (
    <section data-motion={reduced ? 'reduced' : 'default'} style={reducedMotionVars}>
      <div data-surface="modal" className="animix-modal-in">
        Modal
      </div>
      <aside data-surface="drawer" className="animix-drawer-in-right">
        Drawer
      </aside>
      <div data-surface="tooltip" className="animix-tooltip-in">
        Tooltip
      </div>
      <div data-surface="toast" className="animix-toast-in-right">
        Toast
      </div>
      <ul data-surface="stagger" className="animix-stagger">
        <li className="animix-in-fade">Alpha</li>
        <li className="animix-in-fade">Beta</li>
        <li className="animix-in-fade">Gamma</li>
      </ul>
    </section>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractRule(source: string, selector: string) {
  const match = source.match(new RegExp(`${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  if (!match) {
    throw new Error(`Rule not found for selector: ${selector}`);
  }

  return `${selector} {\n${match[1].trim()}\n}`;
}

function extractKeyframeStage(source: string, name: string, stage: 'from' | 'to') {
  const match = source.match(
    new RegExp(`@keyframes\\s+${escapeRegExp(name)}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'),
  );
  if (!match) {
    throw new Error(`Keyframe not found: ${name}`);
  }

  const stageMatch = match[1].match(new RegExp(`${stage}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'm'));
  if (!stageMatch) {
    throw new Error(`Stage "${stage}" not found for keyframe: ${name}`);
  }

  return `${name} ${stage} {\n${stageMatch[1].trim()}\n}`;
}

function extractReducedMotionRoot(source: string) {
  const mediaMatch = source.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/m);
  if (!mediaMatch) {
    throw new Error('Reduced-motion media query not found');
  }

  const rootMatch = mediaMatch[1].match(/:root\s*\{([\s\S]*?)\n\s*\}/m);
  if (!rootMatch) {
    throw new Error('Reduced-motion :root block not found');
  }

  return `@media (prefers-reduced-motion: reduce) {\n  :root {\n${rootMatch[1].trim()}\n  }\n}`;
}

describe('motion surface snapshots', () => {
  it('matches the default rendered surfaces for modal, drawer, tooltip, toast, and stagger', () => {
    const { asFragment } = render(<MotionSurfaceFixture />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the reduced-motion rendered end states for modal, drawer, tooltip, toast, and stagger', () => {
    const { asFragment } = render(<MotionSurfaceFixture reduced />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the surface motion contract snapshots', () => {
    expect({
      modal: extractRule(transitionsCss, '.animix-modal-in'),
      drawer: extractRule(transitionsCss, '.animix-drawer-in-right'),
      tooltip: extractRule(transitionsCss, '.animix-tooltip-in'),
      toast: extractRule(transitionsCss, '.animix-toast-in-right'),
      staggerContainer: extractRule(utilitiesCss, '.animix-stagger > *'),
      staggerFirstItem: extractRule(utilitiesCss, '.animix-stagger > *:nth-child(1)'),
      staggerSecondItem: extractRule(utilitiesCss, '.animix-stagger > *:nth-child(2)'),
      staggerThirdItem: extractRule(utilitiesCss, '.animix-stagger > *:nth-child(3)'),
      listItemEntrance: extractRule(entranceCss, '.animix-in-fade'),
    }).toMatchSnapshot();
  });

  it('matches reduced-motion end-state snapshots', () => {
    expect({
      reducedMotionTokens: extractReducedMotionRoot(tokensCss),
      modalEndState: extractKeyframeStage(transitionsCss, 'animix-modal-in', 'to'),
      drawerEndState: extractKeyframeStage(transitionsCss, 'animix-drawer-in-right', 'to'),
      tooltipEndState: extractKeyframeStage(transitionsCss, 'animix-tooltip-in', 'to'),
      toastEndState: extractKeyframeStage(transitionsCss, 'animix-toast-in-right', 'to'),
      listItemEndState: extractKeyframeStage(entranceCss, 'animix-fade-in', 'to'),
    }).toMatchSnapshot();
  });
});
