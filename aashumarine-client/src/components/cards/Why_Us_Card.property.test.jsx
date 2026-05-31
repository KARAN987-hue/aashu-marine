import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import Why_Us_Card from './Why_Us_Card';

/**
 * Property-Based Tests for Why_Us_Card Component
 * Feature: landing-page-home
 * 
 * These tests verify universal properties that should hold for all valid inputs
 * using fast-check to generate random test cases.
 */

describe('Why_Us_Card Property Tests', () => {
  /**
   * Property 3: Card Component Rendering Completeness
   * **Validates: Requirements 9.3, 9.6, 5.4**
   * 
   * For any Why_Us_Card given valid props (icon, heading, description),
   * the rendered output should contain all provided prop values.
   */
  it('Property 3: renders all provided prop values in output', () => {
    fc.assert(
      fc.property(
        fc.record({
          icon: fc.webUrl(), // Generate valid image URLs (component treats strings as URLs)
          heading: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0)
        }),
        (props) => {
          const { container } = render(<Why_Us_Card {...props} />);
          
          // Verify heading is rendered
          const headingElement = container.querySelector('.why-us-card__heading');
          expect(headingElement).toBeInTheDocument();
          expect(headingElement.textContent).toBe(props.heading);
          
          // Verify description is rendered
          const descriptionElement = container.querySelector('.why-us-card__description');
          expect(descriptionElement).toBeInTheDocument();
          expect(descriptionElement.textContent).toBe(props.description);
          
          // Verify icon is rendered as an image
          // Note: Browser normalizes URLs, so we verify the img element exists with a src attribute
          const iconContainer = container.querySelector('.why-us-card__icon');
          expect(iconContainer).toBeInTheDocument();
          
          const imgElement = iconContainer.querySelector('img');
          expect(imgElement).toBeInTheDocument();
          expect(imgElement).toHaveAttribute('src'); // Icon URL is used as src
          // Icons are decorative, so alt text should be empty for accessibility
          expect(imgElement.alt).toBe('');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11: Card Component Props Acceptance
   * **Validates: Requirements 9.3, 9.6, 5.4**
   * 
   * For any valid prop values (icon, heading, description),
   * the Why_Us_Card component should accept these props without throwing errors.
   */
  it('Property 11: accepts valid props without throwing errors', () => {
    fc.assert(
      fc.property(
        fc.record({
          icon: fc.webUrl(), // Component treats strings as image URLs
          heading: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0)
        }),
        (props) => {
          // This should not throw an error
          let didThrow = false;
          try {
            render(<Why_Us_Card {...props} />);
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
