import { describe, expect, it } from 'vitest';
import { searchItems, shadcnExamples } from '../docs/src/data';

describe('shadcn docs contract', () => {
  it('surfaces the main shadcn adoption targets in search and gallery data', () => {
    const serialized = JSON.stringify(searchItems).toLowerCase();

    for (const target of ['dialog', 'sheet', 'popover', 'toast', 'command']) {
      expect(serialized).toContain(target);
    }

    expect(shadcnExamples.map((example) => example.id)).toEqual(
      expect.arrayContaining(['dialog', 'sheet', 'popover', 'toast', 'command']),
    );
  });

  it('gives every shadcn example css, tailwind, and react entry paths', () => {
    for (const example of shadcnExamples) {
      expect(example.tabs.map((tab) => tab.id)).toEqual(['css', 'tailwind', 'react']);
      expect(example.tabs.every((tab) => tab.code.trim().length > 0)).toBe(true);
    }
  });

  it('keeps command examples aligned with the documented exit lifecycle', () => {
    const command = shadcnExamples.find((example) => example.id === 'command');
    const code = command?.tabs.map((tab) => tab.code).join('\n') ?? '';

    expect(code).toContain('animix-overlay-out');
    expect(code).toContain('animix-scale-down-out');
    expect(code).toContain('animate-animix-overlay-out');
    expect(code).toContain('animate-animix-scale-down-out');
  });
});
