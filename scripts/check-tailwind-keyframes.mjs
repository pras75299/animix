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
];

let failed = false;
for (const name of required) {
  const quoted = `'${name}'`;
  if (!text.includes(quoted)) {
    console.error(`check-tailwind-keyframes: missing ${quoted} in tailwind/plugin.ts`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('check-tailwind-keyframes: OK');
