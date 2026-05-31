import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products_Page from './Products_Page';
import { products } from '../data/dummyData';

/**
 * Unit Tests for Products_Page Component
 * 
 * These tests verify specific examples and edge cases for the Products_Page component.
 * Requirements: 5.3, 5.4, 6.1, 6.2, 6.5
 */

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Products_Page', () => {
  it('renders without errors', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify the page container exists
    const productsPage = document.querySelector('.products-page');
    expect(productsPage).toBeInTheDocument();
  });

  it('displays Hero_Section with correct heading', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify the heading "OUR PRODUCTS" is displayed
    const heading = screen.getByRole('heading', { level: 1, name: /OUR PRODUCTS/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays Hero_Section with subheading', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify the subheading is present
    const subheading = screen.getByText(/Browse our complete catalog of marine equipment and machinery/i);
    expect(subheading).toBeInTheDocument();
  });

  it('renders Navbar component', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify navbar is present
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('renders all products from dummyData', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify all product cards are rendered
    const productCards = document.querySelectorAll('.product-card');
    expect(productCards).toHaveLength(products.length);
  });

  it('wraps each product card with Link component', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify all product cards are wrapped in links
    const productLinks = document.querySelectorAll('a[href^="/products/"]');
    expect(productLinks).toHaveLength(products.length);
  });

  it('Link components have correct "to" prop with product ID', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify each link has the correct href
    const productLinks = document.querySelectorAll('a[href^="/products/"]');
    
    productLinks.forEach((link, index) => {
      const expectedHref = `/products/${products[index].id}`;
      expect(link).toHaveAttribute('href', expectedHref);
    });
  });

  it('aria-label attributes are present on product links', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify each link has an aria-label
    const productLinks = document.querySelectorAll('a[href^="/products/"]');
    
    productLinks.forEach((link, index) => {
      const ariaLabel = link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain(products[index].productName);
    });
  });

  it('includes skip navigation link for accessibility', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify skip link is present
    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('skip navigation link is keyboard accessible', () => {
    renderWithRouter(<Products_Page />);
    
    const skipLink = screen.getByText(/Skip to main content/i);
    
    // Skip link should be focusable (not have tabindex="-1")
    const tabindex = skipLink.getAttribute('tabindex');
    expect(tabindex).not.toBe('-1');
    
    // Skip link should have proper CSS class for focus visibility
    expect(skipLink).toHaveClass('skip-link');
  });

  it('has main content area with correct id', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify main element with id="main-content" exists
    const mainContent = document.querySelector('main#main-content');
    expect(mainContent).toBeInTheDocument();
  });

  it('renders Section_Container component', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify Section_Container is present
    const sectionContainer = document.querySelector('.section-container');
    expect(sectionContainer).toBeInTheDocument();
  });

  it('uses cards-grid class for responsive grid layout', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify cards-grid class is present
    const cardsGrid = document.querySelector('.cards-grid');
    expect(cardsGrid).toBeInTheDocument();
  });

  it('maintains proper semantic HTML structure', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify semantic elements are present
    const nav = document.querySelector('nav');
    const section = document.querySelector('section');
    const main = document.querySelector('main');
    
    expect(nav).toBeInTheDocument();
    expect(section).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });

  it('renders navigation items in Navbar', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify navigation links are present by role
    const navLinks = screen.getAllByRole('menuitem');
    
    expect(navLinks).toHaveLength(4);
    expect(navLinks[0]).toHaveTextContent('Home');
    expect(navLinks[1]).toHaveTextContent('About Us');
    expect(navLinks[2]).toHaveTextContent('Products');
    expect(navLinks[3]).toHaveTextContent('Contact');
  });

  it('displays product names correctly', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify each product name is displayed
    products.forEach((product) => {
      const productName = screen.getByText(product.productName);
      expect(productName).toBeInTheDocument();
    });
  });

  it('displays product engine types correctly', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify each product engine type (category) is displayed
    // Note: Product_Card was simplified per Requirement 1.2 to only show name, engine type, and manufacturer
    products.forEach((product) => {
      const productEngineType = screen.getByText(product.category);
      expect(productEngineType).toBeInTheDocument();
    });
  });

  it('displays product manufacturers correctly', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify each product manufacturer is displayed
    // Note: Product_Card was simplified per Requirement 1.2 to only show name, engine type, and manufacturer
    products.forEach((product) => {
      if (product.manufacturer) {
        const productManufacturer = screen.getByText(product.manufacturer);
        expect(productManufacturer).toBeInTheDocument();
      }
    });
  });

  it('product images have correct src attributes', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify each product image has the correct src
    const productImages = document.querySelectorAll('.product-card__image img');
    
    productImages.forEach((img, index) => {
      expect(img).toHaveAttribute('src', products[index].image);
    });
  });

  it('product images have correct alt attributes', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify each product image has an alt attribute
    const productImages = document.querySelectorAll('.product-card__image img');
    
    productImages.forEach((img, index) => {
      const altText = img.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText).toContain(products[index].productName);
    });
  });

  it('product cards are rendered in correct order', () => {
    renderWithRouter(<Products_Page />);
    
    // Verify product cards are in the same order as products array
    const productNames = document.querySelectorAll('.product-card__name');
    
    productNames.forEach((nameElement, index) => {
      expect(nameElement).toHaveTextContent(products[index].productName);
    });
  });
});
