import { describe, it, expect } from 'vitest';
import { truncateText, countWords } from './textUtils';

describe('textUtils', () => {
  describe('truncateText', () => {
    it('should return text as-is when word count is within limit', () => {
      const text = 'This is a short text';
      const result = truncateText(text, 10);
      expect(result).toBe(text);
    });

    it('should truncate text to 24 words by default', () => {
      const words = Array(30).fill('word').join(' ');
      const result = truncateText(words);
      const resultWords = result.replace('...', '').trim().split(/\s+/);
      expect(resultWords.length).toBe(24);
      expect(result).toContain('...');
    });

    it('should truncate text to specified maxWords', () => {
      const text = 'one two three four five six seven eight nine ten';
      const result = truncateText(text, 5);
      expect(result).toBe('one two three four five...');
    });

    it('should handle text with multiple spaces', () => {
      const text = 'word1  word2   word3    word4';
      const result = truncateText(text, 2);
      expect(result).toBe('word1 word2...');
    });

    it('should handle empty string', () => {
      const result = truncateText('');
      expect(result).toBe('');
    });

    it('should handle null or undefined', () => {
      expect(truncateText(null)).toBe('');
      expect(truncateText(undefined)).toBe('');
    });

    it('should handle text with exactly maxWords', () => {
      const text = 'one two three four five';
      const result = truncateText(text, 5);
      expect(result).toBe(text);
    });

    it('should preserve single word when maxWords is 1', () => {
      const text = 'one two three';
      const result = truncateText(text, 1);
      expect(result).toBe('one...');
    });

    it('should handle text with leading/trailing whitespace', () => {
      const text = '  one two three four five six  ';
      const result = truncateText(text, 3);
      expect(result).toBe('one two three...');
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('one two three')).toBe(3);
      expect(countWords('single')).toBe(1);
      expect(countWords('')).toBe(0);
    });

    it('should handle multiple spaces', () => {
      expect(countWords('one  two   three')).toBe(3);
    });

    it('should handle leading/trailing whitespace', () => {
      expect(countWords('  one two three  ')).toBe(3);
    });

    it('should handle null or undefined', () => {
      expect(countWords(null)).toBe(0);
      expect(countWords(undefined)).toBe(0);
    });

    it('should handle text with only whitespace', () => {
      expect(countWords('   ')).toBe(0);
    });
  });
});
