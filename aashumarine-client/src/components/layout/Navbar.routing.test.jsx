import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { navItems } from '../../data/dummyData';

/**
 * Unit Tests for Navbar Routing Behavior
 * 
 * These tests verify specific examples and edge cases for Navbar routing functionality.
 * Requirements: 2.1, 2.2, 2.3
 */

describe('Navbar Routing Behavior', () => {
  /**
   * Test Link components render with correct 'to' prop
   * Requirements: 2.1, 2.2
   */
  it('renders Link components with correct to prop for each navigation item', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );

    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About Us').closest('a');
    const productsLink = screen.getByText('Products').closest('a');

    // Verify Link components have correct href attributes (React Router Link renders as <a>)
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  /**
   * Test active class applied to current route
   * Requirements: 2.3
   */
  it('applies active class to the link matching the current route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/about']}>
        <Navbar navItems={navItems} />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About Us').closest('a');
    const productsLink = screen.getByText('Products').closest('a');

    // Only the About Us link should have the active class
    expect(homeLink).not.toHaveClass('active');
    expect(aboutLink).toHaveClass('active');
    expect(productsLink).not.toHaveClass('active');
  });

  it('applies active class to home link when on home route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar navItems={navItems} />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About Us').closest('a');
    const productsLink = screen.getByText('Products').closest('a');

    // Only the Home link should have the active class
    expect(homeLink).toHaveClass('active');
    expect(aboutLink).not.toHaveClass('active');
    expect(productsLink).not.toHaveClass('active');
  });

  it('applies active class to products link when on products route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/products']}>
        <Navbar navItems={navItems} />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About Us').closest('a');
    const productsLink = screen.getByText('Products').closest('a');

    // Only the Products link should have the active class
    expect(homeLink).not.toHaveClass('active');
    expect(aboutLink).not.toHaveClass('active');
    expect(productsLink).toHaveClass('active');
  });

  /**
   * Test navigation without page reload
   * Requirements: 2.2
   */
  it('uses React Router Link components instead of anchor tags for navigation', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );

    const links = container.querySelectorAll('.navbar-link');

    // All links should be anchor tags (React Router Link renders as <a>)
    links.forEach(link => {
      expect(link.tagName).toBe('A');
      // React Router Link components have href attribute
      expect(link).toHaveAttribute('href');
    });
  });

  it('does not apply active class when on a non-matching route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <Navbar navItems={navItems} />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About Us').closest('a');
    const productsLink = screen.getByText('Products').closest('a');

    // No links should have the active class
    expect(homeLink).not.toHaveClass('active');
    expect(aboutLink).not.toHaveClass('active');
    expect(productsLink).not.toHaveClass('active');
  });

  it('maintains all existing styling classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );

    // Verify navbar structure classes are present
    expect(container.querySelector('.navbar')).toBeInTheDocument();
    expect(container.querySelector('.navbar-container')).toBeInTheDocument();
    expect(container.querySelector('.navbar-menu')).toBeInTheDocument();
    
    // Verify all links have the navbar-link class
    const links = container.querySelectorAll('.navbar-link');
    expect(links.length).toBe(navItems.length);
    links.forEach(link => {
      expect(link).toHaveClass('navbar-link');
    });
  });

  it('maintains responsive behavior classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );

    // Verify hamburger menu is present (for mobile)
    expect(container.querySelector('.hamburger-menu')).toBeInTheDocument();
    
    // Verify overlay is present (for mobile)
    expect(container.querySelector('.navbar-overlay')).toBeInTheDocument();
  });
});
