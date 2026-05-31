import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Landing_Page from './Landing_Page';
import About_Page from './About_Page';
import Products_Page from './Products_Page';
import Product_Detail_Page from './Product_Detail_Page';
import Not_Found_Page from './Not_Found_Page';

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);

/**
 * Accessibility Tests for All Page Components
 * 
 * These tests use jest-axe to check for accessibility violations
 * in all page components according to WCAG 2.1 AA standards.
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**
 */

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Accessibility Tests - All Page Components', () => {
  it('Landing_Page should have no accessibility violations', { timeout: 15000 }, async () => {
    const { container } = renderWithRouter(<Landing_Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('About_Page should have no accessibility violations', { timeout: 15000 }, async () => {
    const { container } = renderWithRouter(<About_Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Products_Page should have no accessibility violations', { timeout: 15000 }, async () => {
    const { container } = renderWithRouter(<Products_Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Product_Detail_Page should have no accessibility violations (valid product)', { timeout: 15000 }, async () => {
    // Use MemoryRouter to simulate a valid product ID route
    const { container } = render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<Product_Detail_Page />} />
        </Routes>
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Product_Detail_Page should have no accessibility violations (invalid product)', { timeout: 15000 }, async () => {
    // Use MemoryRouter to simulate an invalid product ID route
    const { container } = render(
      <MemoryRouter initialEntries={['/products/999']}>
        <Routes>
          <Route path="/products/:id" element={<Product_Detail_Page />} />
        </Routes>
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Not_Found_Page should have no accessibility violations', { timeout: 15000 }, async () => {
    const { container } = renderWithRouter(<Not_Found_Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
