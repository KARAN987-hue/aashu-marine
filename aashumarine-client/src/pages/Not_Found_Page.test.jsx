import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Not_Found_Page from './Not_Found_Page';

/**
 * Unit Tests for Not_Found_Page Component
 * 
 * These tests verify specific examples and edge cases for the Not_Found_Page component.
 * Validates: Requirements 1.4
 */

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Not_Found_Page', () => {
  it('renders without errors', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify the page container exists
    const notFoundPage = document.querySelector('.not-found-page');
    expect(notFoundPage).toBeInTheDocument();
  });

  it('displays 404 heading message', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify the "404 - Page Not Found" heading is displayed
    const heading = screen.getByRole('heading', { level: 1, name: /404 - Page Not Found/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays user-friendly error message', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify the error message is displayed
    const errorMessage = screen.getByText(/The page you're looking for doesn't exist or has been moved/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('includes Link to home page', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify the link to home page is present
    const homeLink = screen.getByRole('link', { name: /Return to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders Navbar component', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify navbar is present
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('has main content area', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify main element exists
    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('maintains proper semantic HTML structure', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify semantic elements are present
    const nav = document.querySelector('nav');
    const main = document.querySelector('main');
    
    expect(nav).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });

  it('renders navigation items in Navbar', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify navigation links are present by role
    const navLinks = screen.getAllByRole('menuitem');
    
    expect(navLinks).toHaveLength(4);
    expect(navLinks[0]).toHaveTextContent('Home');
    expect(navLinks[1]).toHaveTextContent('About Us');
    expect(navLinks[2]).toHaveTextContent('Products');
    expect(navLinks[3]).toHaveTextContent('Contact');
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify CSS classes are applied correctly
    const notFoundPage = document.querySelector('.not-found-page');
    const notFoundContent = document.querySelector('.not-found-content');
    const notFoundHeading = document.querySelector('.not-found-heading');
    const notFoundMessage = document.querySelector('.not-found-message');
    const homeLink = document.querySelector('.home-link');
    
    expect(notFoundPage).toHaveClass('not-found-page');
    expect(notFoundContent).toHaveClass('not-found-content');
    expect(notFoundHeading).toHaveClass('not-found-heading');
    expect(notFoundMessage).toHaveClass('not-found-message');
    expect(homeLink).toHaveClass('home-link');
  });

  it('home link is keyboard accessible', () => {
    renderWithRouter(<Not_Found_Page />);
    
    // Verify the home link can be focused
    const homeLink = screen.getByRole('link', { name: /Return to Home/i });
    homeLink.focus();
    
    expect(document.activeElement).toBe(homeLink);
  });
});
