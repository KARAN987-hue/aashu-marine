import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import Section_Container from './Section_Container';

/**
 * Property-Based Tests for Section_Container Component
 * 
 * These tests verify universal properties that should hold across all valid inputs
 * using fast-check to generate random test cases.
 */

describe('Section_Container Property Tests', () => {
  /**
   * Property 4: Section Container Heading Rendering
   * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**
   * 
   * For any non-empty heading prop passed to Section_Container,
   * the rendered output should contain that heading text.
   */
  it('Property 4: renders any non-empty heading text', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (heading) => {
          const { container } = render(
            <Section_Container heading={heading}>
              <div>Test Content</div>
            </Section_Container>
          );
          
          // Verify heading appears in the rendered output
          const headingElement = container.querySelector('.section-heading');
          expect(headingElement).toBeInTheDocument();
          expect(headingElement.textContent).toBe(heading);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: Section Container Subheading Rendering
   * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**
   * 
   * For any non-empty subheading prop passed to Section_Container,
   * the rendered output should contain that subheading text.
   */
  it('Property 5: renders any non-empty subheading text', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (subheading) => {
          const { container } = render(
            <Section_Container subheading={subheading}>
              <div>Test Content</div>
            </Section_Container>
          );
          
          // Verify subheading appears in the rendered output
          const subheadingElement = container.querySelector('.section-subheading');
          expect(subheadingElement).toBeInTheDocument();
          expect(subheadingElement.textContent).toBe(subheading);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Section Container Children Rendering
   * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**
   * 
   * For any valid React children passed to Section_Container,
   * those children should appear in the rendered output within the container.
   */
  it('Property 6: renders any valid React children text content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.nat(1000), // Add a unique ID to avoid test ID collisions
        (childText, uniqueId) => {
          const testId = `child-content-${uniqueId}`;
          const { container } = render(
            <Section_Container>
              <div data-testid={testId}>{childText}</div>
            </Section_Container>
          );
          
          // Verify children appear in the rendered output
          const childElement = container.querySelector(`[data-testid="${testId}"]`);
          expect(childElement).toBeInTheDocument();
          expect(childElement.textContent).toBe(childText);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Section Container Props Acceptance
   * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**
   * 
   * For any valid heading string, subheading string, and React children,
   * the Section_Container component should accept these props without throwing errors.
   */
  it('Property 10: accepts any valid heading, subheading, and children without errors', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1 }),
        (heading, subheading, childText) => {
          // This test verifies the component doesn't throw errors
          let renderError = null;
          
          try {
            const { container } = render(
              <Section_Container heading={heading} subheading={subheading}>
                <div>{childText}</div>
              </Section_Container>
            );
            
            // Verify all props are rendered correctly
            const headingElement = container.querySelector('.section-heading');
            const subheadingElement = container.querySelector('.section-subheading');
            const childrenContainer = container.querySelector('.section-children');
            
            expect(headingElement).toBeInTheDocument();
            expect(headingElement.textContent).toBe(heading);
            expect(subheadingElement).toBeInTheDocument();
            expect(subheadingElement.textContent).toBe(subheading);
            expect(childrenContainer).toBeInTheDocument();
            expect(childrenContainer.textContent).toBe(childText);
            
            cleanup();
          } catch (error) {
            renderError = error;
          }
          
          // Assert no errors occurred
          expect(renderError).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
