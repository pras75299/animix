import type { Config } from 'tailwindcss';
import animix from '../tailwind/plugin';

/** Paths are relative to this config file (Tailwind resolves from config directory). */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  plugins: [animix({})],
} satisfies Config;
