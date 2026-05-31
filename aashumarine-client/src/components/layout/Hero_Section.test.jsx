import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero_Section from './Hero_Section';

/**
 * Unit Tests for Hero_Section Component
 * 
 * These tests verify specific examples and edge cases for the Hero_Section component.
 */

describe('Hero_Section', () => {
  it('renders with specific heading and subheading', () => {
    const heading = 'WE ARE HERE TO KEEP YOU SAILING';
    const subheading = 'Top Dealer for Ship Machinery & Spare Parts';
    
    render(<Hero_Section heading={heading} subheading={subheading} />);
    
    expect(screen.getByText(heading)).toBeInTheDocument();
    expect(screen.getByText(subheading)).toBeInTheDocument();
  });

  it('renders heading as h1 element', () => {
    const heading = 'Test Heading';
    const subheading = 'Test Subheading';
    
    render(<Hero_Section heading={heading} subheading={subheading} />);
    
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(heading);
  });

  it('renders subheading as paragraph element', () => {
    const heading = 'Test Heading';
    const subheading = 'Test Subheading';
    
    const { container } = render(<Hero_Section heading={heading} subheading={subheading} />);
    
    const subheadingElement = container.querySelector('.hero-subheading');
    expect(subheadingElement).toBeInTheDocument();
    expect(subheadingElement.tagName).toBe('P');
    expect(subheadingElement).toHaveTextContent(subheading);
  });

  it('applies correct CSS classes', () => {
    const heading = 'Test Heading';
    const subheading = 'Test Subheading';
    
    const { container } = render(<Hero_Section heading={heading} subheading={subheading} />);
    
    expect(container.querySelector('.hero-section')).toBeInTheDocument();
    expect(container.querySelector('.hero-content')).toBeInTheDocument();
    expect(container.querySelector('.hero-heading')).toBeInTheDocument();
    expect(container.querySelector('.hero-subheading')).toBeInTheDocument();
  });

  it('renders as a section element', () => {
    const heading = 'Test Heading';
    const subheading = 'Test Subheading';
    
    const { container } = render(<Hero_Section heading={heading} subheading={subheading} />);
    
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders with long heading text', () => {
    const longHeading = 'This is a very long heading that should still render correctly without breaking the layout or causing any issues';
    const subheading = 'Test Subheading';
    
    render(<Hero_Section heading={longHeading} subheading={subheading} />);
    
    expect(screen.getByText(longHeading)).toBeInTheDocument();
  });

  it('renders with long subheading text', () => {
    const heading = 'Test Heading';
    const longSubheading = 'This is a very long subheading that provides detailed information about the company and its services, and it should render correctly';
    
    render(<Hero_Section heading={heading} subheading={longSubheading} />);
    
    expect(screen.getByText(longSubheading)).toBeInTheDocument();
  });

  it('renders with special characters in heading', () => {
    const heading = 'Welcome! We\'re #1 in Marine Equipment & Supply';
    const subheading = 'Test Subheading';
    
    render(<Hero_Section heading={heading} subheading={subheading} />);
    
    expect(screen.getByText(heading)).toBeInTheDocument();
  });

  it('renders with special characters in subheading', () => {
    const heading = 'Test Heading';
    const subheading = 'Quality & Service @ Competitive Prices - 24/7 Support!';
    
    render(<Hero_Section heading={heading} subheading={subheading} />);
    
    expect(screen.getByText(subheading)).toBeInTheDocument();
  });

  it('maintains visual hierarchy with heading larger than subheading', () => {
    const heading = 'Test Heading';
    const subheading = 'Test Subheading';
    
    const { container } = render(<Hero_Section heading={heading} subheading={subheading} />);
    
    const headingElement = container.querySelector('.hero-heading');
    const subheadingElement = container.querySelector('.hero-subheading');
    
    // Verify both elements exist
    expect(headingElement).toBeInTheDocument();
    expect(subheadingElement).toBeInTheDocument();
    
    // Verify heading comes before subheading in DOM
    const heroContent = container.querySelector('.hero-content');
    const children = Array.from(heroContent.children);
    const headingIndex = children.indexOf(headingElement);
    const subheadingIndex = children.indexOf(subheadingElement);
    
    expect(headingIndex).toBeLessThan(subheadingIndex);
  });
});
