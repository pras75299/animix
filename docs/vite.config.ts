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
        '@animix-js/animix/react': path.join(repoRoot, 'react/index.ts'),
        '@animix-js/animix/css': path.join(repoRoot, 'src/index.css'),
        '@animix-js/animix/css/tokens': path.join(repoRoot, 'src/tokens.css'),
        '@animix-js/animix/css/entrance': path.join(repoRoot, 'src/animations/entrance.css'),
        '@animix-js/animix/css/exit': path.join(repoRoot, 'src/animations/exit.css'),
        '@animix-js/animix/css/transitions': path.join(repoRoot, 'src/animations/transitions.css'),
        '@animix-js/animix/css/utilities': path.join(repoRoot, 'src/utilities.css'),
        '@animix-js/animix/shadcn': path.join(repoRoot, 'shadcn-presets.css'),
      },
    },
  };
});
