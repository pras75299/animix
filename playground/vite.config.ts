import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const playgroundDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(playgroundDir, '..');

export default defineConfig({
  root: playgroundDir,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@animix-js/animix/react': path.join(repoRoot, 'react/index.ts'),
      '@animix-js/animix/css': path.join(repoRoot, 'src/index.css'),
    },
  },
});
