import { describe, it, expect } from 'vitest';
import { escape } from './escape';

describe('escape()', () => {
  it('should escape special characters', () => {
    const input = '_*[]()~`>#+-=|{}.!-';
    const output = '\\_\\*\\[\\]\\(\\)\\~\\`\\>\\#\\+\\-\\=\\|\\{\\}\\.\\!\\-';
    expect(escape(input)).toBe(output);
  });

  it('should not modify a string without special characters', () => {
    const input = 'hello world';
    const output = 'hello world';
    expect(escape(input)).toBe(output);
  });

  it('should escape only the special characters and leave others untouched', () => {
    const input = 'Hello (world)! - Check *markdown* syntax: #1';
    const output = 'Hello \\(world\\)\\! \\- Check \\*markdown\\* syntax: \\#1';
    expect(escape(input)).toBe(output);
  });

  it('should handle empty strings', () => {
    const input = '';
    const output = '';
    expect(escape(input)).toBe(output);
  });

  it('should handle strings with multiple occurrences of the same character', () => {
    const input = 'Hello!!!';
    const output = 'Hello\\!\\!\\!';
    expect(escape(input)).toBe(output);
  });
});
