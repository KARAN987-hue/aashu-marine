import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Products_Page from './Products_Page';
import { products as actualProducts } from '../data/dummyData';

/**
 * Property-Based Tests for Products_Page
 * Feature: routing-and-pages
 * 
 * These tests verify universal properties that should hold true across all valid inputs.
 */

describe('Products_Page Properties', () => {
  /**
   * Property 6: Products Page Display Completeness
   * **Validates: Requirements 5.3, 5.4**
   * 
   * For any state of the products array in dummyData, the Products_Page should 
   * render exactly the same number of Product_Card components as there are 
   * products in the array.
   */
  it('Property 6: Products_Page renders exactly the same number of Product_Cards as products in array', () => {
    // Test with actual products data
    const { container } = render(
      <BrowserRouter>
        <Products_Page />
      </BrowserRouter>
    );

    // Count the number of product cards rendered
    const productCards = container.querySelectorAll('.product-card');
    
    // Verify the number of product cards matches the number of products
    expect(productCards.length).toBe(actualProducts.length);

    // Verify each product card is wrapped in a link
    const productLinks = container.querySelectorAll('a[href^="/products/"]');
    expect(productLinks.length).toBe(actualProducts.length);
  });

  /**
   * Property 7: Product Card Navigation
   * **Validates: Requirements 6.1, 6.2**
   * 
   * For any product in the products array, clicking the product card should 
   * navigate to the URL path `/products/{product.id}` where {product.id} is 
   * the numeric ID of that product.
   */
  it('Property 7: Product cards navigate to correct URL path with product ID', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: actualProducts.length - 1 }),
        (productIndex) => {
          const { container } = render(
            <BrowserRouter>
              <Products_Page />
            </BrowserRouter>
          );

          // Get all product card links
          const productLinks = container.querySelectorAll('a[href^="/products/"]');

          // Verify the link at productIndex has the correct href with product ID
          const expectedHref = `/products/${actualProducts[productIndex].id}`;
          const actualHref = productLinks[productIndex].getAttribute('href');
          expect(actualHref).toBe(expectedHref);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Product Card Accessibility Labels
   * **Validates: Requirements 6.5**
   * 
   * For any product card rendered on the Products_Page, the link wrapper should 
   * include an aria-label attribute that describes the navigation action 
   * (e.g., "View details for {productName}").
   */
  it('Property 8: Product card links have descriptive aria-label attributes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: actualProducts.length - 1 }),
        (productIndex) => {
          const { container } = render(
            <BrowserRouter>
              <Products_Page />
            </BrowserRouter>
          );

          // Get all product card links
          const productLinks = container.querySelectorAll('a[href^="/products/"]');

          // Verify the link at productIndex has an aria-label attribute
          const link = productLinks[productIndex];
          const ariaLabel = link.getAttribute('aria-label');
          
          // Verify aria-label exists
          expect(ariaLabel).toBeTruthy();
          
          // Verify aria-label contains the product name
          expect(ariaLabel).toContain(actualProducts[productIndex].productName);
          
          // Verify aria-label describes the action (contains "View" or "details")
          const lowerLabel = ariaLabel.toLowerCase();
          expect(
            lowerLabel.includes('view') || lowerLabel.includes('details')
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
