import { describe, it, expect } from 'vitest';
import { products } from './dummyData';

/**
 * Unit Tests for Product Data Structure
 * 
 * These tests validate the product data structure to ensure:
 * - All products have the required 14 fields
 * - Date fields are in ISO 8601 format
 * - Field names follow camelCase convention
 * 
 * Validates: Requirements 4.1, 4.3, 4.4
 */

describe('Product Data Structure Unit Tests', () => {
  // Define the required fields for the product schema
  const requiredFields = [
    'id',
    'productName',
    'image',
    'category',
    'productType',
    'manufacturer',
    'condition',
    'model',
    'searchKeyword',
    'shortDescription',
    'mainDescription',
    'createdDate',
    'updatedDate',
    'owner'
  ];

  describe('Required Fields Validation', () => {
    it('should have at least 3 products in the products array', () => {
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThanOrEqual(3);
    });

    it('should have all 14 required fields for each product', () => {
      products.forEach((product, index) => {
        requiredFields.forEach((field) => {
          expect(
            product,
            `Product at index ${index} should have field "${field}"`
          ).toHaveProperty(field);
          
          expect(
            product[field],
            `Product at index ${index} field "${field}" should not be null or undefined`
          ).toBeDefined();
          
          expect(
            product[field],
            `Product at index ${index} field "${field}" should not be null`
          ).not.toBeNull();
        });
      });
    });

    it('should have exactly 14 fields for each product (no extra fields)', () => {
      products.forEach((product, index) => {
        const fieldCount = Object.keys(product).length;
        expect(
          fieldCount,
          `Product at index ${index} (${product.productName}) should have exactly 14 fields, but has ${fieldCount}`
        ).toBe(14);
      });
    });

    it('should have non-empty string values for all string fields', () => {
      const stringFields = [
        'productName',
        'image',
        'category',
        'productType',
        'manufacturer',
        'condition',
        'model',
        'searchKeyword',
        'shortDescription',
        'mainDescription',
        'createdDate',
        'updatedDate',
        'owner'
      ];

      products.forEach((product, index) => {
        stringFields.forEach((field) => {
          expect(
            typeof product[field],
            `Product at index ${index} field "${field}" should be a string`
          ).toBe('string');
          
          expect(
            product[field].trim().length,
            `Product at index ${index} field "${field}" should not be empty`
          ).toBeGreaterThan(0);
        });
      });
    });

    it('should have numeric id field for each product', () => {
      products.forEach((product, index) => {
        expect(
          typeof product.id,
          `Product at index ${index} should have numeric id`
        ).toBe('number');
        
        expect(
          product.id,
          `Product at index ${index} should have positive id`
        ).toBeGreaterThan(0);
      });
    });

    it('should have unique id for each product', () => {
      const ids = products.map(p => p.id);
      const uniqueIds = new Set(ids);
      
      expect(
        uniqueIds.size,
        `All product IDs should be unique. Found ${ids.length} products but only ${uniqueIds.size} unique IDs`
      ).toBe(ids.length);
    });
  });

  describe('Date Format Validation', () => {
    const isValidISO8601 = (dateString) => {
      // ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss.sssZ
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
      
      if (!iso8601Regex.test(dateString)) {
        return false;
      }
      
      // Verify it's a valid date by parsing
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    };

    it('should have valid ISO 8601 format for createdDate field', () => {
      products.forEach((product, index) => {
        expect(
          isValidISO8601(product.createdDate),
          `Product at index ${index} (${product.productName}) has invalid createdDate format: "${product.createdDate}". Expected ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)`
        ).toBe(true);
      });
    });

    it('should have valid ISO 8601 format for updatedDate field', () => {
      products.forEach((product, index) => {
        expect(
          isValidISO8601(product.updatedDate),
          `Product at index ${index} (${product.productName}) has invalid updatedDate format: "${product.updatedDate}". Expected ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)`
        ).toBe(true);
      });
    });

    it('should have updatedDate greater than or equal to createdDate', () => {
      products.forEach((product, index) => {
        const createdDate = new Date(product.createdDate);
        const updatedDate = new Date(product.updatedDate);
        
        expect(
          updatedDate.getTime(),
          `Product at index ${index} (${product.productName}) has updatedDate before createdDate`
        ).toBeGreaterThanOrEqual(createdDate.getTime());
      });
    });

    it('should have parseable dates that match the original string format', () => {
      products.forEach((product, index) => {
        // Parse and re-stringify to verify format consistency
        const createdDate = new Date(product.createdDate);
        const updatedDate = new Date(product.updatedDate);
        
        const createdISO = createdDate.toISOString();
        const updatedISO = updatedDate.toISOString();
        
        // Check if the format matches (allowing for .000Z vs Z difference)
        const createdMatches = 
          createdISO === product.createdDate || 
          createdISO.replace('.000Z', 'Z') === product.createdDate ||
          createdISO === product.createdDate.replace('Z', '.000Z');
        
        const updatedMatches = 
          updatedISO === product.updatedDate || 
          updatedISO.replace('.000Z', 'Z') === product.updatedDate ||
          updatedISO === product.updatedDate.replace('Z', '.000Z');
        
        expect(
          createdMatches,
          `Product at index ${index} (${product.productName}) createdDate "${product.createdDate}" doesn't match parsed format "${createdISO}"`
        ).toBe(true);
        
        expect(
          updatedMatches,
          `Product at index ${index} (${product.productName}) updatedDate "${product.updatedDate}" doesn't match parsed format "${updatedISO}"`
        ).toBe(true);
      });
    });
  });

  describe('Field Naming Convention Validation', () => {
    const isCamelCase = (str) => {
      // camelCase pattern: starts with lowercase letter, followed by letters/numbers
      // No spaces, underscores, or hyphens allowed
      const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
      return camelCaseRegex.test(str);
    };

    it('should have all field names in camelCase convention', () => {
      products.forEach((product, index) => {
        const fieldNames = Object.keys(product);
        
        fieldNames.forEach((fieldName) => {
          expect(
            isCamelCase(fieldName),
            `Product at index ${index} (${product.productName}) has field "${fieldName}" which is not in camelCase format. Expected format: first word lowercase, subsequent words capitalized, no spaces/underscores`
          ).toBe(true);
        });
      });
    });

    it('should not have any field names with underscores', () => {
      products.forEach((product, index) => {
        const fieldNames = Object.keys(product);
        
        fieldNames.forEach((fieldName) => {
          expect(
            fieldName.includes('_'),
            `Product at index ${index} (${product.productName}) has field "${fieldName}" with underscore. Use camelCase instead`
          ).toBe(false);
        });
      });
    });

    it('should not have any field names with hyphens', () => {
      products.forEach((product, index) => {
        const fieldNames = Object.keys(product);
        
        fieldNames.forEach((fieldName) => {
          expect(
            fieldName.includes('-'),
            `Product at index ${index} (${product.productName}) has field "${fieldName}" with hyphen. Use camelCase instead`
          ).toBe(false);
        });
      });
    });

    it('should not have any field names with spaces', () => {
      products.forEach((product, index) => {
        const fieldNames = Object.keys(product);
        
        fieldNames.forEach((fieldName) => {
          expect(
            fieldName.includes(' '),
            `Product at index ${index} (${product.productName}) has field "${fieldName}" with space. Use camelCase instead`
          ).toBe(false);
        });
      });
    });

    it('should have field names starting with lowercase letter', () => {
      products.forEach((product, index) => {
        const fieldNames = Object.keys(product);
        
        fieldNames.forEach((fieldName) => {
          const firstChar = fieldName.charAt(0);
          expect(
            firstChar,
            `Product at index ${index} (${product.productName}) has field "${fieldName}" starting with "${firstChar}". Field names should start with lowercase letter`
          ).toMatch(/[a-z]/);
        });
      });
    });
  });

  describe('Specific Field Value Validation', () => {
    it('should have valid condition values', () => {
      const validConditions = ['New', 'Refurbished', 'Used'];
      
      products.forEach((product, index) => {
        expect(
          validConditions,
          `Product at index ${index} (${product.productName}) has invalid condition "${product.condition}". Valid values: ${validConditions.join(', ')}`
        ).toContain(product.condition);
      });
    });

    it('should have shortDescription shorter than mainDescription', () => {
      products.forEach((product, index) => {
        expect(
          product.shortDescription.length,
          `Product at index ${index} (${product.productName}) has shortDescription (${product.shortDescription.length} chars) longer than or equal to mainDescription (${product.mainDescription.length} chars)`
        ).toBeLessThan(product.mainDescription.length);
      });
    });

    it('should have reasonable length for shortDescription (50-200 characters)', () => {
      products.forEach((product, index) => {
        const length = product.shortDescription.length;
        expect(
          length,
          `Product at index ${index} (${product.productName}) has shortDescription too short (${length} chars). Expected 50-200 characters`
        ).toBeGreaterThanOrEqual(50);
        
        expect(
          length,
          `Product at index ${index} (${product.productName}) has shortDescription too long (${length} chars). Expected 50-200 characters`
        ).toBeLessThanOrEqual(200);
      });
    });

    it('should have reasonable length for mainDescription (200+ characters)', () => {
      products.forEach((product, index) => {
        const length = product.mainDescription.length;
        expect(
          length,
          `Product at index ${index} (${product.productName}) has mainDescription too short (${length} chars). Expected at least 200 characters`
        ).toBeGreaterThanOrEqual(200);
      });
    });

    it('should have valid image URLs', () => {
      products.forEach((product, index) => {
        expect(
          product.image,
          `Product at index ${index} (${product.productName}) has invalid image URL`
        ).toMatch(/^https?:\/\/.+/);
      });
    });
  });

  describe('Backward Compatibility', () => {
    it('should support mapping to legacy Product_Card props', () => {
      // Verify that products can be mapped to the old format used by Product_Card
      products.forEach((product, index) => {
        const legacyFormat = {
          id: product.id,
          image: product.image,
          name: product.productName,
          description: product.shortDescription,
          category: product.category
        };
        
        expect(legacyFormat.id).toBeDefined();
        expect(legacyFormat.image).toBeDefined();
        expect(legacyFormat.name).toBeDefined();
        expect(legacyFormat.description).toBeDefined();
        expect(legacyFormat.category).toBeDefined();
        
        expect(
          typeof legacyFormat.name,
          `Product at index ${index} cannot be mapped to legacy format: name is not a string`
        ).toBe('string');
        
        expect(
          typeof legacyFormat.description,
          `Product at index ${index} cannot be mapped to legacy format: description is not a string`
        ).toBe('string');
      });
    });
  });
});
