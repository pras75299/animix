/**
 * Post-tsup step: replace dist/index.cjs with a thin re-export of
 * dist/tailwind/plugin.cjs so the bundled plugin code isn't duplicated
 * across both CJS entry points.
 */

import { existsSync, writeFileSync } from 'node:fs';
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
console.log('dedupe-cjs: OK');
