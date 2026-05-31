import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

describe('Property-Based Test Configuration', () => {
  it('should run property-based tests with fast-check', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a; // Commutative property of addition
      }),
      { numRuns: 100 }
    );
  });

  it('should generate random strings', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        return typeof str === 'string';
      }),
      { numRuns: 100 }
    );
  });
});
