import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as fc from 'fast-check';
import Landing_Page from './Landing_Page';
import About_Page from './About_Page';
import Products_Page from './Products_Page';
import Product_Detail_Page from './Product_Detail_Page';
import Not_Found_Page from './Not_Found_Page';
import { products as actualProducts } from '../data/dummyData';

describe('Page Heading Hierarchy - Property-Based Tests', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Helper function to extract heading levels from a container
   * Returns an array of heading levels in the order they appear in the DOM
   */
  const extractHeadingLevels = (container) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map(heading => {
      const tagName = heading.tagName.toLowerCase();
      return parseInt(tagName.substring(1), 10);
    });
  };

  /**
   * Helper function to validate heading hierarchy
   * Returns true if hierarchy is valid, false otherwise
   * Rules:
   * 1. h1 should appear before h2
   * 2. h2 should appear before h3
   * 3. No heading levels should be skipped (e.g., h1 -> h3 without h2)
   */
  const validateHeadingHierarchy = (headingLevels) => {
    if (headingLevels.length === 0) {
      return true; // No headings is technically valid
    }

    // Check that h1 appears first
    if (headingLevels[0] !== 1) {
      return false;
    }

    // Check for skipped levels and proper ordering
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];

      // Heading level should not increase by more than 1
      // (e.g., h1 -> h3 is invalid, but h2 -> h2 or h2 -> h1 is valid)
      if (currentLevel > previousLevel + 1) {
        return false;
      }
    }

    return true;
  };

  /**
   * Property 13: Page Heading Hierarchy
   * 
   * For any page component (Landing_Page, About_Page, Products_Page, 
   * Product_Detail_Page, Not_Found_Page), the heading elements should follow 
   * proper hierarchy where h1 appears before h2, h2 appears before h3, and 
   * no heading levels are skipped.
   * 
   * **Validates: Requirements 10.2**
   */
  it('Property 13: Page Heading Hierarchy - Landing_Page', { timeout: 15000 }, () => {
    fc.assert(
      fc.property(
        fc.constant(null), // Landing page has no dynamic parameters
        () => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/']}>
              <Routes>
                <Route path="/" element={<Landing_Page />} />
              </Routes>
            </MemoryRouter>
          );

          const headingLevels = extractHeadingLevels(container);
          const isValid = validateHeadingHierarchy(headingLevels);

          expect(isValid).toBe(true);
          expect(headingLevels[0]).toBe(1); // First heading should be h1
          
          unmount();
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Property 13: Page Heading Hierarchy - About_Page', () => {
    fc.assert(
      fc.property(
        fc.constant(null), // About page has no dynamic parameters
        () => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/about']}>
              <Routes>
                <Route path="/about" element={<About_Page />} />
              </Routes>
            </MemoryRouter>
          );

          const headingLevels = extractHeadingLevels(container);
          const isValid = validateHeadingHierarchy(headingLevels);

          expect(isValid).toBe(true);
          expect(headingLevels[0]).toBe(1); // First heading should be h1
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: Page Heading Hierarchy - Products_Page', { timeout: 15000 }, () => {
    fc.assert(
      fc.property(
        fc.constant(null), // Products page has no dynamic parameters
        () => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/products']}>
              <Routes>
                <Route path="/products" element={<Products_Page />} />
              </Routes>
            </MemoryRouter>
          );

          const headingLevels = extractHeadingLevels(container);
          const isValid = validateHeadingHierarchy(headingLevels);

          expect(isValid).toBe(true);
          expect(headingLevels[0]).toBe(1); // First heading should be h1
          
          unmount();
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Property 13: Page Heading Hierarchy - Product_Detail_Page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: actualProducts.length - 1 }),
        (productIndex) => {
          const product = actualProducts[productIndex];
          const productId = product.id;

          const { container, unmount } = render(
            <MemoryRouter initialEntries={[`/products/${productId}`]}>
              <Routes>
                <Route path="/products/:id" element={<Product_Detail_Page />} />
              </Routes>
            </MemoryRouter>
          );

          const headingLevels = extractHeadingLevels(container);
          const isValid = validateHeadingHierarchy(headingLevels);

          expect(isValid).toBe(true);
          expect(headingLevels[0]).toBe(1); // First heading should be h1
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: Page Heading Hierarchy - Not_Found_Page', () => {
    fc.assert(
      fc.property(
        fc.constant(null), // Not found page has no dynamic parameters
        () => {
          const { container, unmount } = render(
            <MemoryRouter initialEntries={['/invalid-route']}>
              <Routes>
                <Route path="*" element={<Not_Found_Page />} />
              </Routes>
            </MemoryRouter>
          );

          const headingLevels = extractHeadingLevels(container);
          const isValid = validateHeadingHierarchy(headingLevels);

          expect(isValid).toBe(true);
          expect(headingLevels[0]).toBe(1); // First heading should be h1
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
