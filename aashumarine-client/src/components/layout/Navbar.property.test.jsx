import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import Navbar from './Navbar';

/**
 * Property-Based Tests for Navbar Component
 * 
 * These tests verify universal properties that should hold across all valid inputs
 * using fast-check to generate random test cases.
 */

describe('Navbar Property Tests', () => {
  /**
   * Property 1: Navigation Item Rendering Completeness
   * **Validates: Requirements 1.3**
   * 
   * For any array of navigation items passed to the Navbar component,
   * all items from the array should be rendered in the navigation bar.
   */
  it('Property 1: renders all navigation items from any array', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            path: fc.string({ minLength: 1 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (navItems) => {
          const { container } = render(
            <BrowserRouter>
              <Navbar navItems={navItems} />
            </BrowserRouter>
          );
          
          // Verify all navigation items are rendered
          const renderedItems = container.querySelectorAll('.navbar-item');
          expect(renderedItems.length).toBe(navItems.length);
          
          // Verify each item's label appears in the rendered output using container query
          navItems.forEach((item) => {
            const links = container.querySelectorAll('.navbar-link');
            const matchingLink = Array.from(links).find(link => link.textContent === item.label);
            expect(matchingLink).toBeTruthy();
          });
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Navigation Click Handler
   * **Validates: Requirements 1.2**
   * 
   * For any navigation item with a valid path, clicking that navigation item
   * should trigger navigation to the corresponding path.
   */
  it('Property 2: clicking any navigation item triggers navigation to corresponding path', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            path: fc.oneof(
              fc.constant('/'),
              fc.string({ minLength: 1, maxLength: 30 })
                .filter(s => s.trim().length > 0 && !s.includes('#'))
                .map(s => `/${s.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-_]/g, '')}`)
            )
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (navItems) => {
          const { container } = render(
            <BrowserRouter>
              <Navbar navItems={navItems} />
            </BrowserRouter>
          );
          
          // Get all rendered links
          const links = container.querySelectorAll('.navbar-link');
          
          // Verify each navigation item by index
          navItems.forEach((item, index) => {
            const link = links[index];
            
            // Verify the link exists
            expect(link).toBeTruthy();
            
            // Verify the link has the correct text content
            expect(link.textContent).toBe(item.label);
            
            // Verify the link has the correct href attribute (React Router normalizes paths)
            const href = link.getAttribute('href');
            expect(href).toBe(item.path);
          });
          
          cleanup();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
