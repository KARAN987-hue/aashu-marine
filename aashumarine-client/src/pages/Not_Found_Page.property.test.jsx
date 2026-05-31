import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Not_Found_Page from './Not_Found_Page';
import Landing_Page from './Landing_Page';
import About_Page from './About_Page';
import Products_Page from './Products_Page';
import Product_Detail_Page from './Product_Detail_Page';

/**
 * Property-Based Tests for Not_Found_Page
 * Feature: routing-and-pages
 * 
 * These tests verify universal properties that should hold true across all valid inputs.
 */

describe('Not_Found_Page Properties', () => {
  // Clean up after each property test iteration
  afterEach(() => {
    cleanup();
  });

  /**
   * Property 2: Invalid Route Handling
   * **Validates: Requirements 1.4**
   * 
   * For any URL path that does not match a defined route (/, /about, /products, /products/:id),
   * the router should display the 404 Not Found page.
   */
  it('Property 2: Invalid routes display the 404 Not Found page', { timeout: 30000 }, () => {
    // Define valid route patterns
    const validRoutes = ['/', '/about', '/products', '/products/'];
    // Any path starting with /products/ is a valid route pattern (even if the product doesn't exist)
    const validProductRoutePattern = /^\/products\/.+$/;

    // Generator for invalid route paths
    const invalidRouteArbitrary = fc.oneof(
      // Random paths that don't match valid routes
      fc.array(
        fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '_'),
        { minLength: 2, maxLength: 30 }
      ).map(chars => {
        const path = '/' + chars.join('');
        return path;
      }).filter(path => {
        // Exclude valid routes
        if (validRoutes.includes(path)) return false;
        if (validRoutes.includes(path + '/')) return false;
        if (validProductRoutePattern.test(path)) return false;
        return true;
      }),
      // Specific invalid paths (not matching any route pattern)
      fc.constantFrom(
        '/invalid',
        '/not-a-page',
        '/about/extra',
        '/random-path',
        '/test',
        '/404',
        '/home',
        '/contact',
        '/services',
        '/blog'
      )
    );

    fc.assert(
      fc.property(invalidRouteArbitrary, (invalidPath) => {
        // Clean up before each render
        cleanup();
        
        // Render the router with the invalid path
        render(
          <MemoryRouter initialEntries={[invalidPath]}>
            <Routes>
              <Route path="/" element={<Landing_Page />} />
              <Route path="/about" element={<About_Page />} />
              <Route path="/products" element={<Products_Page />} />
              <Route path="/products/:id" element={<Product_Detail_Page />} />
              <Route path="*" element={<Not_Found_Page />} />
            </Routes>
          </MemoryRouter>
        );

        // Verify the 404 Not Found page is displayed
        const heading = screen.getByRole('heading', { name: /404.*page not found/i });
        expect(heading).toBeInTheDocument();

        // Verify the error message is displayed
        const errorMessage = screen.getByText(/the page you're looking for doesn't exist/i);
        expect(errorMessage).toBeInTheDocument();

        // Verify the link back to home is present
        const homeLink = screen.getByRole('link', { name: /return to home/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
      }),
      { numRuns: 10 }
    );
  });
});
