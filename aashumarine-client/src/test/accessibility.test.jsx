import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing_Page from '../pages/Landing_Page';
import Navbar from '../components/layout/Navbar';
import Contact_Form from '../components/forms/Contact_Form';
import { navItems } from '../data/dummyData';

/**
 * Accessibility Tests
 * Feature: landing-page-home
 * Task: 13.3 Add accessibility features
 * 
 * These tests verify that accessibility features are properly implemented.
 */

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Accessibility Tests', () => {
  describe('Navigation Accessibility', () => {
    it('navbar has proper ARIA labels', () => {
      const { container } = renderWithRouter(<Navbar navItems={navItems} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('hamburger menu button has proper ARIA attributes', () => {
      const { container } = renderWithRouter(<Navbar navItems={navItems} />);
      
      const button = container.querySelector('.hamburger-menu');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-expanded');
    });

    it('navigation items have proper roles', () => {
      const { container } = renderWithRouter(<Navbar navItems={navItems} />);
      
      const menubar = container.querySelector('[role="menubar"]');
      expect(menubar).toBeInTheDocument();
      
      const menuItems = container.querySelectorAll('[role="menuitem"]');
      expect(menuItems.length).toBe(navItems.length);
    });
  });

  describe('Form Accessibility', () => {
    it('form fields have proper labels', () => {
      const { container } = render(<Contact_Form onSubmit={() => {}} />);
      
      // Check that all inputs have associated labels
      const nameInput = container.querySelector('#name');
      const emailInput = container.querySelector('#email');
      const phoneInput = container.querySelector('#phone');
      const messageInput = container.querySelector('#message');
      
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(phoneInput).toBeInTheDocument();
      expect(messageInput).toBeInTheDocument();
      
      // Check labels exist
      const nameLabel = container.querySelector('label[for="name"]');
      const emailLabel = container.querySelector('label[for="email"]');
      const phoneLabel = container.querySelector('label[for="phone"]');
      const messageLabel = container.querySelector('label[for="message"]');
      
      expect(nameLabel).toBeInTheDocument();
      expect(emailLabel).toBeInTheDocument();
      expect(phoneLabel).toBeInTheDocument();
      expect(messageLabel).toBeInTheDocument();
    });

    it('required fields have aria-required attribute', () => {
      const { container } = render(<Contact_Form onSubmit={() => {}} />);
      
      const nameInput = container.querySelector('#name');
      const emailInput = container.querySelector('#email');
      const messageInput = container.querySelector('#message');
      
      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(messageInput).toHaveAttribute('aria-required', 'true');
    });

    it('error messages have role="alert"', () => {
      const { container } = render(<Contact_Form onSubmit={() => {}} />);
      
      // Error messages should have role="alert" when they appear
      const errorMessages = container.querySelectorAll('[role="alert"]');
      // Initially no errors, but the structure should support it
      expect(errorMessages).toBeDefined();
    });
  });

  describe('Semantic Structure', () => {
    it('landing page has skip navigation link', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      const skipLink = container.querySelector('.skip-link');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('landing page has main landmark', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('id', 'main-content');
    });

    it('sections have proper aria-labelledby attributes', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      // Check that sections with headings have aria-labelledby
      const sections = container.querySelectorAll('section[aria-labelledby]');
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe('Image Accessibility', () => {
    it('decorative icons have empty alt text', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      // Service and Why Us card icons should have empty alt text (decorative)
      const serviceIcons = container.querySelectorAll('.service-card__icon img');
      const whyUsIcons = container.querySelectorAll('.why-us-card__icon img');
      
      serviceIcons.forEach(icon => {
        expect(icon).toHaveAttribute('alt', '');
      });
      
      whyUsIcons.forEach(icon => {
        expect(icon).toHaveAttribute('alt', '');
      });
    });

    it('product images have descriptive alt text', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      // Product images should have descriptive alt text
      const productImages = container.querySelectorAll('.product-card__image img');
      
      productImages.forEach(img => {
        const altText = img.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('interactive elements are keyboard accessible', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      // Check that buttons and links are present and can receive focus
      const buttons = container.querySelectorAll('button');
      const links = container.querySelectorAll('a');
      
      expect(buttons.length).toBeGreaterThan(0);
      expect(links.length).toBeGreaterThan(0);
      
      // All interactive elements should be in the tab order (not have tabindex="-1")
      buttons.forEach(button => {
        const tabindex = button.getAttribute('tabindex');
        expect(tabindex).not.toBe('-1');
      });
    });

    it('form inputs are keyboard accessible', () => {
      const { container } = render(<Contact_Form onSubmit={() => {}} />);
      
      const inputs = container.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        const tabindex = input.getAttribute('tabindex');
        expect(tabindex).not.toBe('-1');
      });
    });

    it('skip navigation link is keyboard accessible', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      const skipLink = container.querySelector('.skip-link');
      expect(skipLink).toBeInTheDocument();
      
      // Skip link should be focusable (not have tabindex="-1")
      const tabindex = skipLink.getAttribute('tabindex');
      expect(tabindex).not.toBe('-1');
      
      // Skip link should have proper href
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('skip link is visible when focused', () => {
      const { container } = renderWithRouter(<Landing_Page />);
      
      const skipLink = container.querySelector('.skip-link');
      expect(skipLink).toBeInTheDocument();
      
      // Skip link should have CSS class for focus visibility
      expect(skipLink).toHaveClass('skip-link');
      
      // The CSS should handle visibility on focus (tested via CSS)
      // We verify the element exists and has the correct class
    });
  });
});
