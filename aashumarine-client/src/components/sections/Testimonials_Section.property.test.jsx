import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import Testimonials_Section from './Testimonials_Section';

/**
 * Property-Based Tests for Testimonials_Section Component
 * Feature: website-ui-improvements
 */

describe('Testimonials_Section - Property-Based Tests', () => {
  /**
   * Property 7: Testimonials Array Rendering Completeness
   * 
   * **Validates: Requirements 3.2**
   * 
   * For any array of testimonial objects passed to Testimonials_Section,
   * the number of rendered testimonial elements should equal the length of the input array.
   */
  it('Property 7: For any array of testimonial objects, the number of rendered testimonial elements should equal the array length', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.oneof(fc.integer(), fc.string()),
            name: fc.string({ minLength: 1 }),
            company: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
            text: fc.string({ minLength: 1 }),
            rating: fc.option(fc.integer({ min: 1, max: 5 }), { nil: undefined })
          }),
          { minLength: 0, maxLength: 10 }
        ),
        fc.constantFrom('grid', 'slider'),
        (testimonials, layout) => {
          const { container } = render(<Testimonials_Section testimonials={testimonials} layout={layout} />);
          
          // Count the number of rendered testimonial cards
          const testimonialCards = container.querySelectorAll('.testimonial-card');
          
          // The number of rendered cards should equal the input array length
          expect(testimonialCards.length).toBe(testimonials.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional Property Test: Testimonial Content Rendering
   * 
   * For any testimonial object, all provided fields (name, text, optional company, optional rating)
   * should be rendered in the output.
   */
  it('Property: For any testimonial object, all provided fields should be rendered', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.oneof(fc.integer(), fc.string()),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          company: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined }),
          text: fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length > 0),
          rating: fc.option(fc.integer({ min: 1, max: 5 }), { nil: undefined })
        }),
        (testimonial) => {
          const { container } = render(<Testimonials_Section testimonials={[testimonial]} layout="grid" />);
          
          // Name should always be rendered
          const nameElement = container.querySelector('.author-name');
          expect(nameElement).toBeInTheDocument();
          expect(nameElement.textContent).toBe(testimonial.name);
          
          // Text should always be rendered (with quotes and possible truncation)
          const textElement = container.querySelector('.testimonial-text');
          expect(textElement).toBeInTheDocument();
          // Text may be truncated, so just check it starts with quote
          expect(textElement.textContent).toMatch(/^"/);
          
          // Company should be rendered if provided
          if (testimonial.company) {
            const companyElement = container.querySelector('.author-company');
            expect(companyElement).toBeInTheDocument();
            expect(companyElement.textContent).toBe(testimonial.company);
          }
          
          // Rating stars should be rendered if rating is provided
          if (testimonial.rating) {
            const stars = container.querySelectorAll('.star');
            expect(stars.length).toBe(5); // Always 5 stars total
            
            const filledStars = container.querySelectorAll('.star.filled');
            expect(filledStars.length).toBe(testimonial.rating);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property Test: Empty Array Handling
   * 
   * For an empty testimonials array, the component should render gracefully
   * with an appropriate message.
   */
  it('Property: Empty testimonials array should render gracefully', () => {
    const { container } = render(<Testimonials_Section testimonials={[]} />);
    
    // Should render the section
    expect(container.querySelector('.testimonials-section')).toBeInTheDocument();
    
    // Should show empty message
    expect(screen.getByText(/no testimonials available/i)).toBeInTheDocument();
    
    // Should not render any testimonial cards
    const testimonialCards = container.querySelectorAll('.testimonial-card');
    expect(testimonialCards.length).toBe(0);
  });

  /**
   * Property Test: Layout Prop Behavior
   * 
   * **Validates: Requirements 3.2**
   * 
   * For any layout value ('grid' or 'slider'), the component should render
   * the appropriate layout structure.
   */
  it('Property: Layout prop determines rendering structure', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.oneof(fc.integer(), fc.string()),
            name: fc.string({ minLength: 1 }),
            text: fc.string({ minLength: 1 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.constantFrom('grid', 'slider'),
        (testimonials, layout) => {
          const { container } = render(<Testimonials_Section testimonials={testimonials} layout={layout} />);
          
          if (layout === 'grid') {
            // Grid layout should have testimonials-grid class
            expect(container.querySelector('.testimonials-grid')).toBeInTheDocument();
            expect(container.querySelector('.testimonials-slider-wrapper')).not.toBeInTheDocument();
          } else {
            // Slider layout should have slider wrapper
            expect(container.querySelector('.testimonials-slider-wrapper')).toBeInTheDocument();
            expect(container.querySelector('.testimonials-grid')).not.toBeInTheDocument();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property Test: Navigation Controls Presence
   * 
   * **Validates: Requirements 3.5**
   * 
   * For slider layout with sufficient testimonials, navigation controls should be present.
   */
  it('Property: Slider layout renders navigation controls when needed', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer(),
            name: fc.string({ minLength: 1 }),
            text: fc.string({ minLength: 1 }),
          }),
          { minLength: 4, maxLength: 10 } // Enough to require navigation
        ),
        (testimonials) => {
          const { container } = render(<Testimonials_Section testimonials={testimonials} layout="slider" />);
          
          // Should have slider controls
          const controls = container.querySelector('.testimonials-slider-controls');
          expect(controls).toBeInTheDocument();
          
          // Should have prev and next buttons
          const prevButtons = container.querySelectorAll('[aria-label="Previous testimonial"]');
          const nextButtons = container.querySelectorAll('[aria-label="Next testimonial"]');
          expect(prevButtons.length).toBeGreaterThan(0);
          expect(nextButtons.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });
});
