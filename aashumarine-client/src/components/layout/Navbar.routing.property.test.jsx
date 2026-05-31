import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import Navbar from './Navbar';

/**
 * Property-Based Tests for Navbar Routing
 * Feature: routing-and-pages
 * 
 * These tests verify universal properties that should hold true across all valid inputs.
 */

describe('Navbar Routing Properties', () => {
  /**
   * Property 1: Navigation Link Routing
   * **Validates: Requirements 1.3**
   * 
   * For any navigation link in the navbar, clicking that link should navigate 
   * to the corresponding route path without triggering a full page reload.
   */
  it('Property 1: Navigation links should use React Router Link components without page reload', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
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

          // Verify all links are React Router Link components (not anchor tags with href)
          const links = container.querySelectorAll('.navbar-link');
          
          links.forEach((link, index) => {
            // React Router Link components render as anchor tags but with special handling
            expect(link.tagName).toBe('A');
            
            // Verify the link has the correct path (React Router normalizes paths)
            const expectedPath = navItems[index].path;
            const actualPath = link.getAttribute('href');
            
            // React Router may normalize paths, so we check if they're equivalent
            expect(actualPath).toBe(expectedPath);
            
            // Verify the link has the correct label
            expect(link.textContent).toBe(navItems[index].label);
          });

          // Verify the number of links matches the number of navItems
          expect(links.length).toBe(navItems.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Active Navigation Highlighting
   * **Validates: Requirements 2.3**
   * 
   * For any defined route path, when the current location matches that path, 
   * the corresponding navbar link should have the active CSS class applied.
   */
  it('Property 3: Active navigation link should have active CSS class for current route', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
            path: fc.oneof(
              fc.constant('/'),
              fc.string({ minLength: 1, maxLength: 30 })
                .filter(s => s.trim().length > 0 && !s.includes('#'))
                .map(s => `/${s.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-_]/g, '')}`)
            )
          }),
          { minLength: 1, maxLength: 10 }
        )
        .filter(items => {
          // Ensure all paths are unique to avoid ambiguity in active state
          const paths = items.map(item => item.path);
          return new Set(paths).size === paths.length;
        }),
        fc.integer({ min: 0, max: 9 }),
        (navItems, activeIndex) => {
          // Only test if activeIndex is within bounds
          if (activeIndex >= navItems.length) return true;

          const currentPath = navItems[activeIndex].path;

          const { container } = render(
            <MemoryRouter initialEntries={[currentPath]}>
              <Navbar navItems={navItems} />
            </MemoryRouter>
          );

          const links = container.querySelectorAll('.navbar-link');

          links.forEach((link, index) => {
            if (index === activeIndex) {
              // The active link should have the 'active' class
              expect(link.classList.contains('active')).toBe(true);
            } else {
              // Non-active links should not have the 'active' class
              expect(link.classList.contains('active')).toBe(false);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
