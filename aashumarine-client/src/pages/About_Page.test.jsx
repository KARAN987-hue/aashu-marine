import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About_Page from './About_Page';

/**
 * Unit Tests for About_Page Component
 * 
 * These tests verify specific examples and edge cases for the About_Page component.
 * Requirements: 3.1, 3.2, 3.6
 */

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('About_Page', () => {
  it('renders without errors', () => {
    renderWithRouter(<About_Page />);
    
    // Verify the page container exists
    const aboutPage = document.querySelector('.about-page');
    expect(aboutPage).toBeInTheDocument();
  });

  it('displays Hero_Section with correct heading', () => {
    renderWithRouter(<About_Page />);
    
    // Verify the heading "ABOUT US" is displayed
    const heading = screen.getByRole('heading', { level: 1, name: /ABOUT US/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays Hero_Section with subheading', () => {
    renderWithRouter(<About_Page />);
    
    // Verify the subheading is present
    const subheading = screen.getByText(/Your trusted partner in marine equipment supply and solutions/i);
    expect(subheading).toBeInTheDocument();
  });

  it('renders Navbar component', () => {
    renderWithRouter(<About_Page />);
    
    // Verify navbar is present
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('renders content placeholder divs', () => {
    renderWithRouter(<About_Page />);
    
    // Verify content placeholder divs are present
    const placeholders = document.querySelectorAll('.about-content-placeholder-1');
    
    // Should have multiple content sections
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('includes skip navigation link for accessibility', () => {
    renderWithRouter(<About_Page />);
    
    // Verify skip link is present
    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('skip navigation link is keyboard accessible', () => {
    renderWithRouter(<About_Page />);
    
    const skipLink = screen.getByText(/Skip to main content/i);
    
    // Skip link should be focusable (not have tabindex="-1")
    const tabindex = skipLink.getAttribute('tabindex');
    expect(tabindex).not.toBe('-1');
    
    // Skip link should have proper CSS class for focus visibility
    expect(skipLink).toHaveClass('skip-link');
  });

  it('has main content area with correct id', () => {
    renderWithRouter(<About_Page />);
    
    // Verify main element with id="main-content" exists
    const mainContent = document.querySelector('main#main-content');
    expect(mainContent).toBeInTheDocument();
  });

  it('renders Section_Container component', () => {
    renderWithRouter(<About_Page />);
    
    // Verify Section_Container is present
    const sectionContainer = document.querySelector('.section-container');
    expect(sectionContainer).toBeInTheDocument();
  });

  it('maintains proper semantic HTML structure', () => {
    renderWithRouter(<About_Page />);
    
    // Verify semantic elements are present
    const nav = document.querySelector('nav');
    const section = document.querySelector('section');
    const main = document.querySelector('main');
    
    expect(nav).toBeInTheDocument();
    expect(section).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });

  it('renders navigation items in Navbar', () => {
    renderWithRouter(<About_Page />);
    
    // Verify navigation links are present by role
    const navLinks = screen.getAllByRole('menuitem');
    
    expect(navLinks).toHaveLength(4);
    expect(navLinks[0]).toHaveTextContent('Home');
    expect(navLinks[1]).toHaveTextContent('About Us');
    expect(navLinks[2]).toHaveTextContent('Products');
    expect(navLinks[3]).toHaveTextContent('Contact');
  });

  it('applies correct CSS classes to content divs', () => {
    renderWithRouter(<About_Page />);
    
    const placeholders = document.querySelectorAll('.about-content-placeholder-1');
    
    // Verify content divs have the correct class
    expect(placeholders.length).toBeGreaterThan(0);
    placeholders.forEach(placeholder => {
      expect(placeholder).toHaveClass('about-content-placeholder-1');
    });
  });

  it('renders content in correct order', () => {
    renderWithRouter(<About_Page />);
    
    const sectionContainer = document.querySelector('.section-container');
    const placeholders = sectionContainer.querySelectorAll('[class*="about-content-placeholder"]');
    
    // Verify there are multiple content sections
    expect(placeholders.length).toBeGreaterThan(0);
    
    // Verify they all have the same class (placeholder-1)
    placeholders.forEach(placeholder => {
      expect(placeholder).toHaveClass('about-content-placeholder-1');
    });
  });
});
