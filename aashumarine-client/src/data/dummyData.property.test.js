import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { products } from './dummyData';

describe('Product Schema Property Tests', () => {
  describe('Property 4: Product Schema Field Naming', () => {
    it('For any product in the products array, all field names should follow camelCase naming convention', () => {
      /**
       * **Validates: Requirements 4.3**
       * 
       * This property test verifies that all field names in product objects follow
       * the camelCase naming convention (first word lowercase, subsequent words
       * capitalized, no spaces or underscores).
       */
      
      // Helper function to check if a string is in camelCase
      const isCamelCase = (str) => {
        // camelCase pattern: starts with lowercase, no spaces, no underscores, no hyphens
        // Allows numbers but they shouldn't start the string
        const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
        return camelCaseRegex.test(str);
      };
      
      // Test each product in the products array
      products.forEach((product, index) => {
        const fieldNames = Object.keys(product);
        
        fieldNames.forEach((fieldName) => {
          expect(
            isCamelCase(fieldName),
            `Product at index ${index} (${product.productName}) has field "${fieldName}" which is not in camelCase format`
          ).toBe(true);
        });
      });
    });
  });

  describe('Property 5: Date Field Format Validation', () => {
    it('For any product in the products array, the createdDate and updatedDate fields should be valid ISO 8601 format strings', () => {
      /**
       * **Validates: Requirements 4.4**
       * 
       * This property test verifies that createdDate and updatedDate fields
       * in all products follow the ISO 8601 date format (YYYY-MM-DDTHH:mm:ssZ).
       */
      
      // Helper function to check if a string is valid ISO 8601 format
      const isISO8601 = (dateString) => {
        // ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss.sssZ
        const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
        
        if (!iso8601Regex.test(dateString)) {
          return false;
        }
        
        // Also verify it's a valid date by parsing
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return false;
        }
        
        // Check if the parsed date matches the original string
        // Handle both formats: with and without milliseconds
        const isoString = date.toISOString();
        return isoString === dateString || 
               isoString.replace('.000Z', 'Z') === dateString ||
               isoString === dateString.replace('Z', '.000Z');
      };
      
      // Test each product in the products array
      products.forEach((product, index) => {
        // Check createdDate
        expect(
          product.createdDate,
          `Product at index ${index} (${product.productName}) is missing createdDate field`
        ).toBeDefined();
        
        expect(
          isISO8601(product.createdDate),
          `Product at index ${index} (${product.productName}) has createdDate "${product.createdDate}" which is not in valid ISO 8601 format`
        ).toBe(true);
        
        // Check updatedDate
        expect(
          product.updatedDate,
          `Product at index ${index} (${product.productName}) is missing updatedDate field`
        ).toBeDefined();
        
        expect(
          isISO8601(product.updatedDate),
          `Product at index ${index} (${product.productName}) has updatedDate "${product.updatedDate}" which is not in valid ISO 8601 format`
        ).toBe(true);
      });
    });
  });

  describe('Property-Based Test: Generated Product Schema Validation', () => {
    it('Property 4 (Generated): Any generated product object with camelCase fields should pass validation', () => {
      /**
       * **Validates: Requirements 4.3**
       * 
       * This property-based test generates random product-like objects and verifies
       * that the camelCase validation logic works correctly across many inputs.
       */
      
      // Arbitrary generator for camelCase field names
      const camelCaseArbitrary = fc.tuple(
        fc.stringMatching(/^[a-z][a-z]*$/), // First word (lowercase)
        fc.array(fc.stringMatching(/^[A-Z][a-z]*$/), { minLength: 0, maxLength: 3 }) // Subsequent words (capitalized)
      ).map(([first, rest]) => first + rest.join(''));
      
      // Generator for product-like objects with camelCase fields
      const productArbitrary = fc.dictionary(
        camelCaseArbitrary,
        fc.oneof(fc.string(), fc.integer(), fc.boolean()),
        { minKeys: 5, maxKeys: 15 }
      );
      
      const isCamelCase = (str) => {
        const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
        return camelCaseRegex.test(str);
      };
      
      fc.assert(
        fc.property(productArbitrary, (product) => {
          const fieldNames = Object.keys(product);
          return fieldNames.every(fieldName => isCamelCase(fieldName));
        }),
        { numRuns: 100 }
      );
    });

    it('Property 5 (Generated): Any generated ISO 8601 date string should pass validation', () => {
      /**
       * **Validates: Requirements 4.4**
       * 
       * This property-based test generates random ISO 8601 date strings and verifies
       * that the date validation logic works correctly across many inputs.
       */
      
      // Arbitrary generator for ISO 8601 date strings
      // Use a constrained date range to avoid edge cases with very old/future dates
      const iso8601Arbitrary = fc.date({ 
        min: new Date('1970-01-01T00:00:00.000Z'),
        max: new Date('2100-12-31T23:59:59.999Z')
      }).map(date => date.toISOString());
      
      const isISO8601 = (dateString) => {
        const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
        if (!iso8601Regex.test(dateString)) {
          return false;
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return false;
        }
        // Check if the parsed date matches the original string
        const isoString = date.toISOString();
        return isoString === dateString || 
               isoString.replace('.000Z', 'Z') === dateString ||
               isoString === dateString.replace('Z', '.000Z');
      };
      
      fc.assert(
        fc.property(iso8601Arbitrary, (dateString) => {
          return isISO8601(dateString);
        }),
        { numRuns: 100 }
      );
    });
  });
});
