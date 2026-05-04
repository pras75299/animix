import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

function collectFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    return stats.isDirectory() ? collectFiles(path) : [path];
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertDistContains(distDir, markers) {
  assert(existsSync(distDir), `Missing build output: ${distDir}`);

  const files = collectFiles(distDir);
  assert(files.length > 0, `No files found in ${distDir}`);

  const searchableText = files
    .filter((file) => /\.(html|js|css|svg)$/.test(file))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');

  for (const marker of markers) {
    assert(
      searchableText.includes(marker),
      `Expected preview marker "${marker}" in ${distDir}`,
    );
  }
}

const docsDist = resolve(process.cwd(), 'docs', 'dist');
const playgroundDist = resolve(process.cwd(), 'playground', 'dist');

assertDistContains(docsDist, [
  'Choose the Right Tool',
  'Pairing Guide',
  'Tailwind Plugin',
]);

assertDistContains(playgroundDist, [
  'P1 Motion Quality Bench',
  'Blur vs fade/slide',
  'High-frequency interactions',
]);

console.log('preview-assertions: OK');
