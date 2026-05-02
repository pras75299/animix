/**
 * Guardrail: ensure tailwind/plugin.ts keeps keyframes that exist in transitions.css
 * and are required by shadcn-presets / parity expectations.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginPath = join(__dirname, '..', 'tailwind', 'plugin.ts');
const text = readFileSync(pluginPath, 'utf8');
const fadeSteps = new Set(['0', '25', '50', '75', '100']);
const zoomSteps = new Set(['0', '50', '75', '90', '95']);
const slideSteps = new Set(['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '24', '32', '48', '64', '96']);
const slideDirections = new Set(['top', 'bottom', 'left', 'right']);

const required = [
  'animix-overlay-in',
  'animix-overlay-out',
  'animix-page-fade-in',
  'animix-page-fade-out',
  'animix-page-slide-in',
  'animix-page-slide-out',
  'animix-drawer-in-top',
  'animix-drawer-out-top',
  'animix-toast-in-bottom',
  'animix-toast-out-bottom',
  'animix-fade-in-0',
  'animix-fade-in-100',
  'animix-fade-out-0',
  'animix-fade-out-100',
  'animix-zoom-in-75',
  'animix-zoom-out-75',
  'animix-slide-in-from-top-4',
  'animix-slide-in-from-right-96',
  'animix-slide-out-to-left-4',
  'animix-slide-out-to-bottom-96',
];

function hasGeneratedKeyframe(name) {
  const fadeMatch = name.match(/^animix-fade-(in|out)-(\d+)$/);
  if (fadeMatch) {
    return text.includes('const fadeOpacitySteps = [0, 25, 50, 75, 100] as const;') && fadeSteps.has(fadeMatch[2]);
  }

  const zoomMatch = name.match(/^animix-zoom-(in|out)-(\d+)$/);
  if (zoomMatch) {
    return text.includes('const zoomScaleSteps = [0, 50, 75, 90, 95] as const;') && zoomSteps.has(zoomMatch[2]);
  }

  const slideMatch = name.match(/^animix-slide-(in-from|out-to)-(top|bottom|left|right)-(\d+)$/);
  if (slideMatch) {
    const [, , direction, step] = slideMatch;
    return (
      text.includes('const slideSpacingValues = {') &&
      text.includes('const slideDirections = {') &&
      slideDirections.has(direction) &&
      slideSteps.has(step) &&
      text.includes(`${step}:`) &&
      text.includes(`${direction}: {`)
    );
  }

  return false;
}

let failed = false;
for (const name of required) {
  const quoted = `'${name}'`;
  if (!text.includes(quoted) && !hasGeneratedKeyframe(name)) {
    console.error(`check-tailwind-keyframes: missing ${quoted} in tailwind/plugin.ts`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('check-tailwind-keyframes: OK');
