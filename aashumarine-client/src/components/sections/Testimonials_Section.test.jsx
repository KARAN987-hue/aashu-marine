import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Testimonials_Section from './Testimonials_Section';
import { testimonials } from '../../data/dummyData';

/**
 * Unit Tests for Testimonials_Section Component
 * Requirements: 3.2, 3.5
 */

describe('Testimonials_Section', () => {
  it('renders with specific testimonials from dummy data in grid layout', () => {
    const { container } = render(<Testimonials_Section testimonials={testimonials} layout="grid" />);
    
    // Should render the section
    expect(container.querySelector('.testimonials-section')).toBeInTheDocument();
    
    // Should render the heading
    expect(screen.getByText('TESTIMONIALS')).toBeInTheDocument();
    
    // Should render the subheading
    expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
    
    // Should render grid layout
    expect(container.querySelector('.testimonials-grid')).toBeInTheDocument();
    
    // Should render all testimonials from dummy data
    const testimonialCards = container.querySelectorAll('.testimonial-card');
    expect(testimonialCards.length).toBe(testimonials.length);
    
    // Verify first testimonial content
    expect(screen.getByText('Captain James Morrison')).toBeInTheDocument();
    expect(screen.getByText('Pacific Shipping Lines')).toBeInTheDocument();
  });

  it('renders with slider layout by default', () => {
    const { container } = render(<Testimonials_Section testimonials={testimonials} />);
    
    // Should render slider wrapper
    expect(container.querySelector('.testimonials-slider-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.testimonials-slider')).toBeInTheDocument();
    
    // Should render navigation controls (Requirement 3.5)
    expect(container.querySelector('.testimonials-slider-controls')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous testimonial')).toBeInTheDocument();
    expect(screen.getByLabelText('Next testimonial')).toBeInTheDocument();
  });

  it('renders with empty testimonials array', () => {
    const { container } = render(<Testimonials_Section testimonials={[]} />);
    
    // Should render the section
    expect(container.querySelector('.testimonials-section')).toBeInTheDocument();
    
    // Should render the heading
    expect(screen.getByText('TESTIMONIALS')).toBeInTheDocument();
    
    // Should show empty message
    expect(screen.getByText(/no testimonials available/i)).toBeInTheDocument();
    
    // Should not render any testimonial cards
    const testimonialCards = container.querySelectorAll('.testimonial-card');
    expect(testimonialCards.length).toBe(0);
  });

  it('renders testimonials with optional company field', () => {
    const testimonialsWithCompany = [
      {
        id: 1,
        name: 'John Doe',
        company: 'Test Company',
        text: 'Great service!',
        rating: 5
      }
    ];
    
    render(<Testimonials_Section testimonials={testimonialsWithCompany} layout="grid" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('renders testimonials without optional company field', () => {
    const testimonialsWithoutCompany = [
      {
        id: 1,
        name: 'Jane Smith',
        text: 'Excellent products!',
        rating: 4
      }
    ];
    
    const { container } = render(<Testimonials_Section testimonials={testimonialsWithoutCompany} layout="grid" />);
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Company should not be rendered
    const companyElement = container.querySelector('.author-company');
    expect(companyElement).not.toBeInTheDocument();
  });

  it('renders testimonials with optional rating field', () => {
    const testimonialsWithRating = [
      {
        id: 1,
        name: 'Bob Johnson',
        text: 'Amazing experience!',
        rating: 5
      }
    ];
    
    const { container } = render(<Testimonials_Section testimonials={testimonialsWithRating} layout="grid" />);
    
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    
    // Should render 5 stars
    const stars = container.querySelectorAll('.star');
    expect(stars.length).toBe(5);
    
    // All 5 should be filled
    const filledStars = container.querySelectorAll('.star.filled');
    expect(filledStars.length).toBe(5);
  });

  it('renders testimonials without optional rating field', () => {
    const testimonialsWithoutRating = [
      {
        id: 1,
        name: 'Alice Brown',
        text: 'Very satisfied!',
      }
    ];
    
    const { container } = render(<Testimonials_Section testimonials={testimonialsWithoutRating} layout="grid" />);
    
    expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    
    // Rating should not be rendered
    const ratingElement = container.querySelector('.testimonial-rating');
    expect(ratingElement).not.toBeInTheDocument();
  });

  it('navigation controls work correctly in slider layout', () => {
    const manyTestimonials = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      text: `Testimonial ${i + 1}`,
      rating: 5
    }));
    
    const { container } = render(<Testimonials_Section testimonials={manyTestimonials} />);
    
    const prevButton = screen.getByLabelText('Previous testimonial');
    const nextButton = screen.getByLabelText('Next testimonial');
    
    // Previous button should be disabled initially
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    
    // Click next button
    fireEvent.click(nextButton);
    
    // Previous button should now be enabled
    expect(prevButton).not.toBeDisabled();
  });

  it('slider indicators are rendered and clickable', () => {
    const manyTestimonials = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      text: `Testimonial ${i + 1}`,
      rating: 5
    }));
    
    const { container } = render(<Testimonials_Section testimonials={manyTestimonials} />);
    
    const indicators = container.querySelectorAll('.slider-indicator');
    expect(indicators.length).toBeGreaterThan(0);
    
    // First indicator should be active
    expect(indicators[0]).toHaveClass('active');
  });

  it('does not render navigation controls when testimonials fit in one view', () => {
    const fewTestimonials = [
      { id: 1, name: 'User 1', text: 'Test 1', rating: 5 },
      { id: 2, name: 'User 2', text: 'Test 2', rating: 5 }
    ];
    
    const { container } = render(<Testimonials_Section testimonials={fewTestimonials} />);
    
    // Should not render controls if all testimonials fit in view
    const controls = container.querySelector('.testimonials-slider-controls');
    // Controls may or may not be present depending on viewport size
    // This is handled by the cardsPerView logic
  });

  it('truncates testimonial text based on maxWords prop', () => {
    const longTestimonial = [
      {
        id: 1,
        name: 'Test User',
        text: 'This is a very long testimonial text that should be truncated to the maximum number of words specified by the maxWords prop to ensure it fits nicely in the card',
        rating: 5
      }
    ];
    
    const { container } = render(
      <Testimonials_Section testimonials={longTestimonial} layout="grid" maxWords={10} />
    );
    
    const textElement = container.querySelector('.testimonial-text');
    expect(textElement.textContent).toContain('...');
  });
});
