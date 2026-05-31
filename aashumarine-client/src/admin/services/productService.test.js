import { describe, it, expect, beforeEach } from 'vitest';
import { productService } from './productService';

describe('productService', () => {
  describe('getAll', () => {
    it('should return products with pagination', async () => {
      const result = await productService.getAll({ page: 1, limit: 10 });
      
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.products)).toBe(true);
      expect(result.pagination).toHaveProperty('page');
      expect(result.pagination).toHaveProperty('limit');
      expect(result.pagination).toHaveProperty('total');
      expect(result.pagination).toHaveProperty('totalPages');
    });

    it('should filter products by search term', async () => {
      const result = await productService.getAll({ search: 'GPS' });
      
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.products[0].product_name).toContain('GPS');
    });

    it('should filter products by category', async () => {
      const result = await productService.getAll({ category: 'Navigation' });
      
      result.products.forEach(product => {
        expect(product.category).toBe('Navigation');
      });
    });

    it('should filter products by active status', async () => {
      const result = await productService.getAll({ is_active: true });
      
      result.products.forEach(product => {
        expect(product.is_active).toBe(true);
      });
    });

    it('should sort products by name', async () => {
      const result = await productService.getAll({ sort_by: 'product_name', sort_order: 'asc' });
      
      const names = result.products.map(p => p.product_name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });
  });

  describe('getById', () => {
    it('should return a product by id', async () => {
      const product = await productService.getById(1);
      
      expect(product).toHaveProperty('product_id', 1);
      expect(product).toHaveProperty('product_name');
    });

    it('should throw error for non-existent product', async () => {
      await expect(productService.getById(9999)).rejects.toThrow('Product not found');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const newProduct = {
        product_name: 'Test Product',
        category: 'Navigation',
        manufacturer: 'Test Manufacturer',
        condition: 'New',
      };

      const result = await productService.create(newProduct);
      
      expect(result).toHaveProperty('product_id');
      expect(result.product_name).toBe('Test Product');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updates = {
        product_name: 'Updated Product Name',
      };

      const result = await productService.update(1, updates);
      
      expect(result.product_name).toBe('Updated Product Name');
      expect(result).toHaveProperty('updated_at');
    });

    it('should throw error for non-existent product', async () => {
      await expect(productService.update(9999, {})).rejects.toThrow('Product not found');
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const result = await productService.delete(1);
      
      expect(result).toHaveProperty('message');
      await expect(productService.getById(1)).rejects.toThrow('Product not found');
    });

    it('should throw error for non-existent product', async () => {
      await expect(productService.delete(9999)).rejects.toThrow('Product not found');
    });
  });

  describe('getCategories', () => {
    it('should return list of categories', async () => {
      const result = await productService.getCategories();
      
      expect(result).toHaveProperty('categories');
      expect(Array.isArray(result.categories)).toBe(true);
      expect(result.categories.length).toBeGreaterThan(0);
    });
  });

  describe('getManufacturers', () => {
    it('should return list of manufacturers', async () => {
      const result = await productService.getManufacturers();
      
      expect(result).toHaveProperty('manufacturers');
      expect(Array.isArray(result.manufacturers)).toBe(true);
      expect(result.manufacturers.length).toBeGreaterThan(0);
    });
  });
});
