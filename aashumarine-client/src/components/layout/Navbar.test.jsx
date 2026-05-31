import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { navItems } from '../../data/dummyData';

/**
 * Unit Tests for Navbar Component
 * 
 * These tests verify specific examples and edge cases for the Navbar component.
 */

describe('Navbar', () => {
  it('renders with specific navItems from dummy data', () => {
    render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );
    
    // Verify all navigation items from dummy data are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders correct number of navigation items', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );
    
    const navItemElements = container.querySelectorAll('.navbar-item');
    expect(navItemElements.length).toBe(4);
  });

  it('renders navigation links with correct href attributes', () => {
    render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );
    
    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About Us').closest('a');
    const productsLink = screen.getByText('Products').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(productsLink).toHaveAttribute('href', '/products');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('renders with empty navItems array', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={[]} />
      </BrowserRouter>
    );
    
    // Navbar should still render but with no navigation items
    expect(container.querySelector('.navbar')).toBeInTheDocument();
    expect(container.querySelectorAll('.navbar-item').length).toBe(0);
  });

  it('renders brand name', () => {
    render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Aashumarine')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );
    
    expect(container.querySelector('.navbar')).toBeInTheDocument();
    expect(container.querySelector('.navbar-container')).toBeInTheDocument();
    expect(container.querySelector('.navbar-brand')).toBeInTheDocument();
    expect(container.querySelector('.navbar-menu')).toBeInTheDocument();
  });

  it('renders as a nav element', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );
    
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('renders navigation items in correct order', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={navItems} />
      </BrowserRouter>
    );
    
    const links = container.querySelectorAll('.navbar-link');
    expect(links[0].textContent).toBe('Home');
    expect(links[1].textContent).toBe('About Us');
    expect(links[2].textContent).toBe('Products');
    expect(links[3].textContent).toBe('Contact');
  });

  it('handles single navigation item', () => {
    const singleItem = [{ label: 'Home', path: '/' }];
    render(
      <BrowserRouter>
        <Navbar navItems={singleItem} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={singleItem} />
      </BrowserRouter>
    );
    expect(container.querySelectorAll('.navbar-item').length).toBe(1);
  });

  it('handles many navigation items', () => {
    const manyItems = [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Products', path: '/products' },
      { label: 'Services', path: '/services' },
      { label: 'Contact', path: '/contact' }
    ];
    
    const { container } = render(
      <BrowserRouter>
        <Navbar navItems={manyItems} />
      </BrowserRouter>
    );
    expect(container.querySelectorAll('.navbar-item').length).toBe(5);
  });
});
