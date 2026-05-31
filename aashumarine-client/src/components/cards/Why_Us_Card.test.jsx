import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Why_Us_Card from './Why_Us_Card';
import { whyUsReasons } from '../../data/dummyData';

/**
 * Unit Tests for Why_Us_Card Component
 * Feature: landing-page-home
 * **Validates: Requirements 9.3, 9.6**
 * 
 * These tests verify specific examples and edge cases for the Why_Us_Card component.
 */

describe('Why_Us_Card Unit Tests', () => {
  /**
   * Test rendering with specific dummy data from whyUsReasons array
   * Verifies that the component correctly displays icon, heading, and description
   * from the actual dummy data used in the application.
   */
  it('renders correctly with specific dummy data from whyUsReasons array', () => {
    const whyUsData = whyUsReasons[0]; // First reason from dummy data
    
    const { container } = render(
      <Why_Us_Card
        icon={whyUsData.icon}
        heading={whyUsData.heading}
        description={whyUsData.description}
      />
    );
    
    // Verify heading is rendered with correct text
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(whyUsData.heading);
    
    // Verify description is rendered with correct text
    expect(screen.getByText(whyUsData.description)).toBeInTheDocument();
    
    // Verify icon container exists
    const iconContainer = container.querySelector('.why-us-card__icon');
    expect(iconContainer).toBeInTheDocument();
  });

  /**
   * Test rendering with all why us reasons from dummy data
   * Ensures the component works with all entries in the whyUsReasons data array.
   */
  it('renders correctly with all why us reasons from dummy data', () => {
    whyUsReasons.forEach((reason) => {
      const { container } = render(
        <Why_Us_Card
          icon={reason.icon}
          heading={reason.heading}
          description={reason.description}
        />
      );
      
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(reason.heading);
      expect(screen.getByText(reason.description)).toBeInTheDocument();
      expect(container.querySelector('.why-us-card__icon')).toBeInTheDocument();
      
      cleanup();
    });
  });

  /**
   * Test with missing optional props
   * Verifies graceful handling when optional props are not provided.
   * Note: Based on the component implementation, all props (icon, heading, description)
   * are effectively required for proper rendering, but we test edge cases.
   */
  it('handles missing icon prop gracefully', () => {
    const { container } = render(
      <Why_Us_Card
        heading="Test Heading"
        description="Test Description"
      />
    );
    
    // Component should still render heading and description
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Heading');
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    
    // Icon container should exist but be empty or show undefined
    const iconContainer = container.querySelector('.why-us-card__icon');
    expect(iconContainer).toBeInTheDocument();
  });

  it('handles empty string props gracefully', () => {
    const { container } = render(
      <Why_Us_Card
        icon=""
        heading=""
        description=""
      />
    );
    
    // Component should render without crashing
    expect(container.querySelector('.why-us-card')).toBeInTheDocument();
    expect(container.querySelector('.why-us-card__heading')).toBeInTheDocument();
    expect(container.querySelector('.why-us-card__description')).toBeInTheDocument();
    expect(container.querySelector('.why-us-card__icon')).toBeInTheDocument();
  });

  /**
   * Test icon rendering with string (URL)
   * Verifies that string icons are rendered as img elements with empty alt text (decorative).
   */
  it('renders icon as img element when icon is a string', () => {
    const { container } = render(
      <Why_Us_Card
        icon="https://example.com/icon.png"
        heading="Test Reason"
        description="Test Description"
      />
    );
    
    const img = container.querySelector('.why-us-card__icon img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/icon.png');
    // Icons are decorative, so alt text should be empty for accessibility
    expect(img).toHaveAttribute('alt', '');
  });

  /**
   * Test icon rendering with React element
   * Verifies that React element icons are rendered directly.
   */
  it('renders icon as React element when icon is not a string', () => {
    const IconComponent = <svg data-testid="custom-icon"><circle /></svg>;
    
    render(
      <Why_Us_Card
        icon={IconComponent}
        heading="Test Reason"
        description="Test Description"
      />
    );
    
    // Verify the custom icon element is rendered
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  /**
   * Test component structure and CSS classes
   * Verifies that the component has the correct structure and class names.
   */
  it('has correct CSS class structure', () => {
    const { container } = render(
      <Why_Us_Card
        icon="test-icon"
        heading="Test Heading"
        description="Test Description"
      />
    );
    
    expect(container.querySelector('.why-us-card')).toBeInTheDocument();
    expect(container.querySelector('.why-us-card__icon')).toBeInTheDocument();
    expect(container.querySelector('.why-us-card__heading')).toBeInTheDocument();
    expect(container.querySelector('.why-us-card__description')).toBeInTheDocument();
  });
});
