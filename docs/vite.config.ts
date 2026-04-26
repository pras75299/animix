import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const docsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(docsDir, '..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, repoRoot, '');

  return {
    root: docsDir,
    base: env.DOCS_BASE || '/',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@pras75299/animix/react': path.join(repoRoot, 'react/index.ts'),
        '@pras75299/animix/css': path.join(repoRoot, 'src/index.css'),
        '@pras75299/animix/css/tokens': path.join(repoRoot, 'src/tokens.css'),
        '@pras75299/animix/css/entrance': path.join(repoRoot, 'src/animations/entrance.css'),
        '@pras75299/animix/css/exit': path.join(repoRoot, 'src/animations/exit.css'),
        '@pras75299/animix/css/transitions': path.join(repoRoot, 'src/animations/transitions.css'),
        '@pras75299/animix/css/utilities': path.join(repoRoot, 'src/utilities.css'),
        '@pras75299/animix/shadcn': path.join(repoRoot, 'shadcn-presets.css'),
      },
    },
  };
});
