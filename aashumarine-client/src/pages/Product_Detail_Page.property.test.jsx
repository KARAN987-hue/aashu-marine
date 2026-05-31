import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as fc from 'fast-check';
import Product_Detail_Page from './Product_Detail_Page';
import { products as actualProducts } from '../data/dummyData';

describe('Product_Detail_Page - Property-Based Tests', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Property 9: Product Detail Hero Display
   * 
   * For any valid product ID in the URL parameter, the Product_Detail_Page should 
   * display a Hero_Section component with the heading prop set to that product's 
   * productName field.
   * 
   * **Validates: Requirements 7.1**
   */
  it('Property 9: Product Detail Hero Display', { timeout: 15000 }, () => {
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

          // Verify Hero_Section displays product name as heading
          const heroHeading = container.querySelector('.hero-heading');
          expect(heroHeading).toBeInTheDocument();
          expect(heroHeading.textContent).toBe(product.productName);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 10: Product Detail Data Retrieval
   * 
   * For any valid product ID in the URL parameter, the Product_Detail_Page should 
   * retrieve and display the product object from dummyData whose id field matches 
   * the URL parameter (parsed as an integer).
   * 
   * **Validates: Requirements 7.2**
   */
  it('Property 10: Product Detail Data Retrieval', () => {
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

          // Verify the correct product is retrieved by checking unique fields
          const heroHeading = container.querySelector('.hero-heading');
          expect(heroHeading.textContent).toBe(product.productName);
          expect(container.textContent).toContain(product.manufacturer);
          expect(container.textContent).toContain(product.model);
          
          // Verify product-specific description is displayed
          expect(container.textContent).toContain(product.mainDescription);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11: Product Detail Field Completeness
   * 
   * For any product displayed on the Product_Detail_Page, all 14 fields from the 
   * Product_Schema (id, productName, image, category, productType, manufacturer, 
   * condition, model, searchKeyword, shortDescription, mainDescription, createdDate, 
   * updatedDate, owner) should be present in the rendered output.
   * 
   * **Validates: Requirements 7.3, 7.6**
   */
  it('Property 11: Product Detail Field Completeness', { timeout: 30000 }, () => {
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

          // Use within to scope queries to this specific render
          const productDetailPage = container.querySelector('.product-detail-page');
          expect(productDetailPage).toBeInTheDocument();
          
          // Verify all 14 Product_Schema fields are present in the rendered output
          
          // 1. id - displayed in Additional Information section
          expect(within(productDetailPage).getByText(product.id.toString())).toBeInTheDocument();
          
          // 2. productName - displayed in hero heading
          expect(within(productDetailPage).getByRole('heading', { name: product.productName, level: 1 })).toBeInTheDocument();
          
          // 3. image - verify img element with correct alt text
          const productImage = within(productDetailPage).getByAltText(product.productName);
          expect(productImage).toBeInTheDocument();
          expect(productImage).toHaveAttribute('src', product.image);
          
          // 4. category - displayed in hero subheading and Product Information
          const categoryElements = within(productDetailPage).getAllByText(product.category);
          expect(categoryElements.length).toBeGreaterThan(0);
          
          // 5. productType - displayed in Product Information
          expect(within(productDetailPage).getByText(product.productType)).toBeInTheDocument();
          
          // 6. manufacturer - displayed in Product Information
          expect(within(productDetailPage).getByText(product.manufacturer)).toBeInTheDocument();
          
          // 7. condition - displayed in Product Information
          expect(within(productDetailPage).getByText(product.condition)).toBeInTheDocument();
          
          // 8. model - displayed in Product Information
          expect(within(productDetailPage).getByText(product.model)).toBeInTheDocument();
          
          // 9. searchKeyword - displayed in Additional Information
          expect(within(productDetailPage).getByText(product.searchKeyword)).toBeInTheDocument();
          
          // 10. shortDescription - displayed in Additional Information
          expect(within(productDetailPage).getByText(product.shortDescription)).toBeInTheDocument();
          
          // 11. mainDescription - displayed in Description section
          expect(within(productDetailPage).getByText(product.mainDescription)).toBeInTheDocument();
          
          // 12. createdDate - displayed as formatted date in Additional Information
          const formattedCreatedDate = new Date(product.createdDate).toLocaleDateString();
          const createdDateElements = within(productDetailPage).getAllByText(formattedCreatedDate);
          expect(createdDateElements.length).toBeGreaterThan(0);
          
          // 13. updatedDate - displayed as formatted date in Additional Information
          const formattedUpdatedDate = new Date(product.updatedDate).toLocaleDateString();
          const updatedDateElements = within(productDetailPage).getAllByText(formattedUpdatedDate);
          expect(updatedDateElements.length).toBeGreaterThan(0);
          
          // 14. owner - displayed in Additional Information
          expect(within(productDetailPage).getByText(product.owner)).toBeInTheDocument();
          
          unmount();
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 12: Invalid Product ID Error Handling
   * 
   * For any product ID in the URL parameter that does not match any product in the 
   * products array, the Product_Detail_Page should display an error message indicating 
   * the product was not found.
   * 
   * **Validates: Requirements 7.7**
   */
  it('Property 12: Invalid Product ID Error Handling', { timeout: 15000 }, () => {
    // Get all valid product IDs
    const validProductIds = actualProducts.map(p => p.id);
    const maxValidId = Math.max(...validProductIds);
    
    fc.assert(
      fc.property(
        // Generate invalid product IDs (either negative, zero, or greater than max valid ID)
        fc.oneof(
          fc.integer({ min: -1000, max: -1 }), // Negative IDs
          fc.constant(0), // Zero ID
          fc.integer({ min: maxValidId + 1, max: maxValidId + 1000 }) // IDs beyond valid range
        ).filter(id => !validProductIds.includes(id)), // Ensure ID is not in valid list
        (invalidProductId) => {
          const { unmount } = render(
            <MemoryRouter initialEntries={[`/products/${invalidProductId}`]}>
              <Routes>
                <Route path="/products/:id" element={<Product_Detail_Page />} />
              </Routes>
            </MemoryRouter>
          );

          // Verify error message is displayed
          expect(screen.getByRole('heading', { name: 'Product Not Found', level: 1 })).toBeInTheDocument();
          expect(
            screen.getByText(
              "The product you're looking for doesn't exist or has been removed."
            )
          ).toBeInTheDocument();
          
          // Verify link back to products page is provided
          const backLink = screen.getByRole('link', { name: /view all products/i });
          expect(backLink).toBeInTheDocument();
          expect(backLink).toHaveAttribute('href', '/products');
          
          unmount();
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });
});
