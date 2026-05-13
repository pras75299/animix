/**
 * Post-tsup step:
 * 1. Replace dist/index.cjs with a thin re-export of dist/tailwind/plugin.cjs so
 *    the bundled plugin code isn't duplicated across both CJS entry points.
 * 2. Remove dist/**\/*.d.cts duplicates emitted by tsup. They are byte-identical
 *    to the .d.ts files and aren't referenced by the exports map.
 */

import { existsSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const target = join(distDir, 'tailwind', 'plugin.cjs');
const stubPath = join(distDir, 'index.cjs');

if (!existsSync(target)) {
  console.error(`dedupe-cjs: expected ${target} to exist after tsup build`);
  process.exit(1);
}

const stub = `'use strict';
const plugin = require('./tailwind/plugin.cjs');
module.exports = plugin.default ?? plugin;
module.exports.default = module.exports;
module.exports.animixPlugin = module.exports;
`;

writeFileSync(stubPath, stub);

function removeDtsCtsRecursively(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      removeDtsCtsRecursively(full);
    } else if (entry.endsWith('.d.cts')) {
      unlinkSync(full);
    }
  }
}

removeDtsCtsRecursively(distDir);

console.log('dedupe-cjs: OK');
