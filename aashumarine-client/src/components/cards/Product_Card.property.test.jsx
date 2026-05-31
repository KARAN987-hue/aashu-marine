import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import Product_Card from './Product_Card';

/**
 * Property-Based Tests for Product_Card Component
 * Feature: website-ui-improvements
 * 
 * These tests verify universal properties that should hold for all valid inputs
 * using fast-check to generate random test cases.
 */

describe('Product_Card Property Tests', () => {
  /**
   * Property 3: Card Component Rendering Completeness
   * **Validates: Requirements 1.2, 8.4**
   * 
   * For any Product_Card given valid props (image, name, engineType, manufacturer),
   * the rendered output should contain all provided prop values.
   */
  it('Property 3: renders all provided prop values in output', () => {
    fc.assert(
      fc.property(
        fc.record({
          image: fc.webUrl(), // Generate valid image URLs
          name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          engineType: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined }),
          manufacturer: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), { nil: undefined })
        }),
        (props) => {
          const { container } = render(<Product_Card {...props} />);
          
          // Verify name is rendered
          const nameElement = container.querySelector('.product-card__name');
          expect(nameElement).toBeInTheDocument();
          expect(nameElement.textContent).toBe(props.name);
          
          // Verify image is rendered with descriptive alt text
          const imgElement = container.querySelector('.product-card__image img');
          expect(imgElement).toBeInTheDocument();
          expect(imgElement).toHaveAttribute('src');
          
          // Alt text includes engine type for better accessibility when engineType is provided
          const expectedAlt = props.engineType ? `${props.name} - ${props.engineType}` : props.name;
          expect(imgElement.alt).toBe(expectedAlt);
          
          // Verify engineType is rendered if provided
          if (props.engineType) {
            const engineTypeElement = container.querySelector('.product-card__engine-type');
            expect(engineTypeElement).toBeInTheDocument();
            expect(engineTypeElement.textContent).toBe(props.engineType);
          }
          
          // Verify manufacturer is rendered if provided
          if (props.manufacturer) {
            const manufacturerElement = container.querySelector('.product-card__manufacturer');
            expect(manufacturerElement).toBeInTheDocument();
            expect(manufacturerElement.textContent).toBe(props.manufacturer);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11: Card Component Props Acceptance
   * **Validates: Requirements 1.2, 8.4**
   * 
   * For any valid prop values (image, name, engineType, manufacturer),
   * the Product_Card component should accept these props without throwing errors.
   */
  it('Property 11: accepts valid props without throwing errors', () => {
    fc.assert(
      fc.property(
        fc.record({
          image: fc.webUrl(),
          name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          engineType: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined }),
          manufacturer: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), { nil: undefined })
        }),
        (props) => {
          // This should not throw an error
          let didThrow = false;
          try {
            render(<Product_Card {...props} />);
          } catch (error) {
            didThrow = true;
          }
          
          expect(didThrow).toBe(false);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
