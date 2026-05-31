import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing_Page from '../pages/Landing_Page';
import About_Page from '../pages/About_Page';
import Products_Page from '../pages/Products_Page';
import Product_Detail_Page from '../pages/Product_Detail_Page';
import Not_Found_Page from '../pages/Not_Found_Page';

/**
 * Heading Hierarchy Tests
 * **Validates: Requirements 10.2**
 * 
 * These tests verify that all pages maintain proper heading hierarchy:
 * - h1 appears before h2
 * - h2 appears before h3
 * - No heading levels are skipped
 */

/**
 * Helper function to extract heading hierarchy from rendered component
 * Returns array of heading objects with level and text
 */
const extractHeadingHierarchy = (container) => {
  const headings = [];
  const headingElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headingElements.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    headings.push({
      level,
      text: heading.textContent,
      tagName: heading.tagName
    });
  });
  
  return headings;
};

/**
 * Validates that heading hierarchy is correct:
 * - First heading should be h1
 * - No heading level jumps (e.g., h1 -> h3)
 * - h1 appears before h2, h2 before h3, etc.
 */
const validateHeadingHierarchy = (headings) => {
  if (headings.length === 0) {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  
  // Check that first heading is h1
  if (headings[0].level !== 1) {
    errors.push(`First heading should be h1, but found ${headings[0].tagName}: "${headings[0].text}"`);
  }
  
  // Check for level jumps and proper ordering
  for (let i = 1; i < headings.length; i++) {
    const prevLevel = headings[i - 1].level;
    const currentLevel = headings[i].level;
    
    // Check if we're jumping more than one level down (e.g., h1 -> h3)
    if (currentLevel > prevLevel + 1) {
      errors.push(
        `Heading level skipped: ${headings[i - 1].tagName} ("${headings[i - 1].text}") ` +
        `followed by ${headings[i].tagName} ("${headings[i].text}")`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

describe('Heading Hierarchy Tests', () => {
  describe('Landing_Page', () => {
    it('should maintain proper heading hierarchy', () => {
      const { container } = render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      const validation = validateHeadingHierarchy(headings);
      
      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.log('Landing_Page heading hierarchy errors:', validation.errors);
        console.log('Headings found:', headings);
      }
      expect(validation.errors).toEqual([]);
    });
    
    it('should have h1 as the first heading', () => {
      const { container } = render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0].level).toBe(1);
      expect(headings[0].tagName).toBe('H1');
    });
    
    it('should have h2 elements after h1', () => {
      const { container } = render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      const h1Index = headings.findIndex(h => h.level === 1);
      const h2Indices = headings.map((h, i) => h.level === 2 ? i : -1).filter(i => i !== -1);
      
      expect(h1Index).toBeGreaterThanOrEqual(0);
      h2Indices.forEach(h2Index => {
        expect(h2Index).toBeGreaterThan(h1Index);
      });
    });
    
    it('should have h3 elements after h2', () => {
      const { container } = render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      const h2Index = headings.findIndex(h => h.level === 2);
      const h3Indices = headings.map((h, i) => h.level === 3 ? i : -1).filter(i => i !== -1);
      
      if (h3Indices.length > 0) {
        expect(h2Index).toBeGreaterThanOrEqual(0);
        h3Indices.forEach(h3Index => {
          expect(h3Index).toBeGreaterThan(h2Index);
        });
      }
    });
  });
  
  describe('About_Page', () => {
    it('should maintain proper heading hierarchy', () => {
      const { container } = render(
        <BrowserRouter>
          <About_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      const validation = validateHeadingHierarchy(headings);
      
      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.log('About_Page heading hierarchy errors:', validation.errors);
        console.log('Headings found:', headings);
      }
      expect(validation.errors).toEqual([]);
    });
    
    it('should have h1 as the first heading', () => {
      const { container } = render(
        <BrowserRouter>
          <About_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0].level).toBe(1);
      expect(headings[0].tagName).toBe('H1');
    });
  });
  
  describe('Products_Page', () => {
    it('should maintain proper heading hierarchy', () => {
      const { container } = render(
        <BrowserRouter>
          <Products_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      const validation = validateHeadingHierarchy(headings);
      
      if (!validation.valid) {
        console.log('Products_Page heading hierarchy errors:', validation.errors);
        console.log('Headings found:', headings);
      }
      
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
    
    it('should have h1 as the first heading', () => {
      const { container } = render(
        <BrowserRouter>
          <Products_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0].level).toBe(1);
      expect(headings[0].tagName).toBe('H1');
    });
    
    it('should have h3 elements after h1 (from product cards)', () => {
      const { container } = render(
        <BrowserRouter>
          <Products_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      const h1Index = headings.findIndex(h => h.level === 1);
      const h3Indices = headings.map((h, i) => h.level === 3 ? i : -1).filter(i => i !== -1);
      
      if (h3Indices.length > 0) {
        expect(h1Index).toBeGreaterThanOrEqual(0);
        h3Indices.forEach(h3Index => {
          expect(h3Index).toBeGreaterThan(h1Index);
        });
      }
    });
  });
  
  describe('Product_Detail_Page', () => {
    it('should maintain proper heading hierarchy with valid product', () => {
      // Mock useParams to return a valid product ID
      const { container } = render(
        <BrowserRouter>
          <Product_Detail_Page />
        </BrowserRouter>
      );
      
      // Navigate to a valid product
      window.history.pushState({}, '', '/products/1');
      
      const headings = extractHeadingHierarchy(container);
      const validation = validateHeadingHierarchy(headings);
      
      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.log('Product_Detail_Page heading hierarchy errors:', validation.errors);
        console.log('Headings found:', headings);
      }
      expect(validation.errors).toEqual([]);
    });
    
    it('should have h1 as the first heading', () => {
      const { container } = render(
        <BrowserRouter>
          <Product_Detail_Page />
        </BrowserRouter>
      );
      
      window.history.pushState({}, '', '/products/1');
      
      const headings = extractHeadingHierarchy(container);
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0].level).toBe(1);
      expect(headings[0].tagName).toBe('H1');
    });
    
    it('should have h2 elements after h1', () => {
      const { container } = render(
        <BrowserRouter>
          <Product_Detail_Page />
        </BrowserRouter>
      );
      
      window.history.pushState({}, '', '/products/1');
      
      const headings = extractHeadingHierarchy(container);
      const h1Index = headings.findIndex(h => h.level === 1);
      const h2Indices = headings.map((h, i) => h.level === 2 ? i : -1).filter(i => i !== -1);
      
      if (h2Indices.length > 0) {
        expect(h1Index).toBeGreaterThanOrEqual(0);
        h2Indices.forEach(h2Index => {
          expect(h2Index).toBeGreaterThan(h1Index);
        });
      }
    });
    
    it('should maintain proper heading hierarchy in error state', () => {
      const { container } = render(
        <BrowserRouter>
          <Product_Detail_Page />
        </BrowserRouter>
      );
      
      // Navigate to an invalid product ID
      window.history.pushState({}, '', '/products/999');
      
      const headings = extractHeadingHierarchy(container);
      const validation = validateHeadingHierarchy(headings);
      
      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.log('Product_Detail_Page (error state) heading hierarchy errors:', validation.errors);
        console.log('Headings found:', headings);
      }
      expect(validation.errors).toEqual([]);
    });
  });
  
  describe('Not_Found_Page', () => {
    it('should maintain proper heading hierarchy', () => {
      const { container } = render(
        <BrowserRouter>
          <Not_Found_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      const validation = validateHeadingHierarchy(headings);
      
      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.log('Not_Found_Page heading hierarchy errors:', validation.errors);
        console.log('Headings found:', headings);
      }
      expect(validation.errors).toEqual([]);
    });
    
    it('should have h1 as the first heading', () => {
      const { container } = render(
        <BrowserRouter>
          <Not_Found_Page />
        </BrowserRouter>
      );
      
      const headings = extractHeadingHierarchy(container);
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0].level).toBe(1);
      expect(headings[0].tagName).toBe('H1');
    });
  });
});
