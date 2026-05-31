import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateRequired,
  validateNumeric,
  validateRating,
  validateProduct,
  hasErrors,
} from './validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should return null for valid values', () => {
      expect(validateRequired('value', 'Field')).toBeNull();
      expect(validateRequired('  text  ', 'Field')).toBeNull();
      expect(validateRequired(0, 'Field')).toBeNull();
      expect(validateRequired(false, 'Field')).toBeNull();
    });

    it('should return error message for empty values', () => {
      expect(validateRequired('', 'Field')).toBe('Field is required');
      expect(validateRequired('   ', 'Field')).toBe('Field is required');
      expect(validateRequired(null, 'Field')).toBe('Field is required');
      expect(validateRequired(undefined, 'Field')).toBe('Field is required');
    });
  });

  describe('validateNumeric', () => {
    it('should return null for valid numbers', () => {
      expect(validateNumeric(123, 'Field')).toBeNull();
      expect(validateNumeric('456', 'Field')).toBeNull();
      expect(validateNumeric('123.45', 'Field')).toBeNull();
      expect(validateNumeric(0, 'Field')).toBeNull();
    });

    it('should return null for empty values', () => {
      expect(validateNumeric('', 'Field')).toBeNull();
      expect(validateNumeric(null, 'Field')).toBeNull();
      expect(validateNumeric(undefined, 'Field')).toBeNull();
    });

    it('should return error message for non-numeric values', () => {
      expect(validateNumeric('abc', 'Field')).toBe('Field must be a valid number');
      expect(validateNumeric('12.34.56', 'Field')).toBe('Field must be a valid number');
    });
  });

  describe('validateRating', () => {
    it('should return null for valid ratings', () => {
      expect(validateRating(1)).toBeNull();
      expect(validateRating(3)).toBeNull();
      expect(validateRating(5)).toBeNull();
      expect(validateRating('4')).toBeNull();
    });

    it('should return null for empty values', () => {
      expect(validateRating('')).toBeNull();
      expect(validateRating(null)).toBeNull();
      expect(validateRating(undefined)).toBeNull();
    });

    it('should return error message for out of range ratings', () => {
      expect(validateRating(0)).toBe('Rating must be between 1 and 5');
      expect(validateRating(6)).toBe('Rating must be between 1 and 5');
      expect(validateRating(-1)).toBe('Rating must be between 1 and 5');
    });

    it('should return error message for non-numeric ratings', () => {
      expect(validateRating('abc')).toBe('Rating must be a valid number');
    });
  });

  describe('validateProduct', () => {
    it('should return no errors for valid product data', () => {
      const validProduct = {
        product_name: 'Test Product',
        category: 'Navigation',
        manufacturer: 'Test Manufacturer',
        condition: 'New',
        price: 100,
        stock_quantity: 10,
      };

      const errors = validateProduct(validProduct);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should return errors for missing required fields', () => {
      const invalidProduct = {
        product_name: '',
        category: '',
        manufacturer: '',
        condition: '',
      };

      const errors = validateProduct(invalidProduct);
      expect(errors.product_name).toBeDefined();
      expect(errors.category).toBeDefined();
      expect(errors.manufacturer).toBeDefined();
      expect(errors.condition).toBeDefined();
    });

    it('should return errors for invalid numeric fields', () => {
      const invalidProduct = {
        product_name: 'Test',
        category: 'Test',
        manufacturer: 'Test',
        condition: 'New',
        price: 'invalid',
        stock_quantity: 'invalid',
      };

      const errors = validateProduct(invalidProduct);
      expect(errors.price).toBeDefined();
      expect(errors.stock_quantity).toBeDefined();
    });

    it('should allow optional fields to be empty', () => {
      const product = {
        product_name: 'Test Product',
        category: 'Navigation',
        manufacturer: 'Test Manufacturer',
        condition: 'New',
        model: '',
        short_description: '',
      };

      const errors = validateProduct(product);
      expect(errors.model).toBeUndefined();
      expect(errors.short_description).toBeUndefined();
    });
  });

  describe('hasErrors', () => {
    it('should return true when errors object has errors', () => {
      expect(hasErrors({ field1: 'Error message' })).toBe(true);
      expect(hasErrors({ field1: 'Error 1', field2: 'Error 2' })).toBe(true);
    });

    it('should return false when errors object is empty', () => {
      expect(hasErrors({})).toBe(false);
    });
  });
});
