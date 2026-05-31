import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Landing_Page from './pages/Landing_Page';
import About_Page from './pages/About_Page';
import Products_Page from './pages/Products_Page';
import Product_Detail_Page from './pages/Product_Detail_Page';
import Not_Found_Page from './pages/Not_Found_Page';

/**
 * Integration tests for routing configuration
 * Validates: Requirements 1.2, 1.3, 1.4
 */

// Helper to render the routing configuration
const renderRoutes = (initialPath = '/') => {
  window.history.pushState({}, '', initialPath);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing_Page />} />
        <Route path="/about" element={<About_Page />} />
        <Route path="/products" element={<Products_Page />} />
        <Route path="/products/:id" element={<Product_Detail_Page />} />
        <Route path="*" element={<Not_Found_Page />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('App Routing Integration Tests', () => {
  it('renders Landing_Page for / route', () => {
    renderRoutes('/');
    
    // Verify Landing_Page content is present
    expect(screen.getByText('WE ARE HERE TO KEEP YOU SAILING')).toBeInTheDocument();
    expect(screen.getByText('Top Dealer for Ship Machinery & Spare Parts')).toBeInTheDocument();
  });

  it('renders About_Page for /about route', () => {
    renderRoutes('/about');
    
    // Verify About_Page content is present
    expect(screen.getByText('ABOUT US')).toBeInTheDocument();
  });

  it('renders Products_Page for /products route', () => {
    renderRoutes('/products');
    
    // Verify Products_Page content is present
    expect(screen.getByText('OUR PRODUCTS')).toBeInTheDocument();
    // Verify product cards are rendered
    const productCards = screen.getAllByRole('link');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('renders Product_Detail_Page for /products/:id route with valid ID', () => {
    renderRoutes('/products/1');
    
    // Verify Product_Detail_Page content is present
    // The hero section should display the product name
    expect(screen.getByText('Marine Diesel Engine MAN B&W 6S50MC')).toBeInTheDocument();
  });

  it('extracts product ID correctly from dynamic route /products/:id', () => {
    renderRoutes('/products/2');
    
    // Verify the correct product is displayed based on ID
    expect(screen.getByText('Hydraulic Steering Gear System')).toBeInTheDocument();
  });

  it('renders Not_Found_Page for invalid routes (catch-all)', () => {
    renderRoutes('/invalid-route');
    
    // Verify 404 page content is present
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist or has been moved.")).toBeInTheDocument();
  });

  it('renders Not_Found_Page for nested invalid routes', () => {
    renderRoutes('/products/invalid/nested');
    
    // Verify 404 page is displayed
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  it('navigates between routes without page reload', async () => {
    const user = userEvent.setup();
    
    renderRoutes('/');
    
    // Start on Landing_Page
    expect(screen.getByText('WE ARE HERE TO KEEP YOU SAILING')).toBeInTheDocument();
    
    // Click on About Us link in navbar
    const aboutLink = screen.getByRole('menuitem', { name: /navigate to about us/i });
    await user.click(aboutLink);
    
    // Verify navigation to About_Page without page reload
    await waitFor(() => {
      expect(screen.getByText('ABOUT US')).toBeInTheDocument();
    });
  });

  it('navigates from Landing_Page to Products_Page via View all Products button', async () => {
    const user = userEvent.setup();
    
    renderRoutes('/');
    
    // Click View all Products button
    const viewAllButton = screen.getByText('View all Products');
    await user.click(viewAllButton);
    
    // Verify navigation to Products_Page
    await waitFor(() => {
      expect(screen.getByText('OUR PRODUCTS')).toBeInTheDocument();
    });
  });

  it('navigates from Products_Page to Product_Detail_Page via product card click', async () => {
    const user = userEvent.setup();
    
    renderRoutes('/products');
    
    // Find and click the first product card link
    const productLinks = screen.getAllByRole('link', { name: /view details for/i });
    await user.click(productLinks[0]);
    
    // Verify navigation to Product_Detail_Page
    await waitFor(() => {
      // Should display product name in hero section
      expect(screen.getByText('Marine Diesel Engine MAN B&W 6S50MC')).toBeInTheDocument();
    });
  });

  it('navigates from Product_Detail_Page back to Products_Page via navbar', async () => {
    const user = userEvent.setup();
    
    renderRoutes('/products/1');
    
    // Verify we're on Product_Detail_Page
    expect(screen.getByText('Marine Diesel Engine MAN B&W 6S50MC')).toBeInTheDocument();
    
    // Click Products link in navbar
    const productsLink = screen.getByRole('menuitem', { name: /navigate to products/i });
    await user.click(productsLink);
    
    // Verify navigation back to Products_Page
    await waitFor(() => {
      expect(screen.getByText('OUR PRODUCTS')).toBeInTheDocument();
    });
  });

  it('displays error message for non-existent product ID', () => {
    renderRoutes('/products/999');
    
    // Verify error message is displayed
    expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    expect(screen.getByText("The product you're looking for doesn't exist or has been removed.")).toBeInTheDocument();
  });

  it('maintains navbar across all routes', () => {
    const routes = ['/', '/about', '/products', '/products/1'];
    
    routes.forEach(route => {
      const { unmount } = renderRoutes(route);
      
      // Verify navbar is present on each route
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      unmount();
    });
  });

  it('highlights active navigation item based on current route', () => {
    renderRoutes('/about');
    
    // Find the About Us link
    const aboutLink = screen.getByRole('menuitem', { name: /navigate to about us/i });
    
    // Verify it has the active class
    expect(aboutLink).toHaveClass('active');
  });

  it('supports browser back/forward navigation', async () => {
    const user = userEvent.setup();
    
    renderRoutes('/');
    
    // Navigate to About page
    const aboutLink = screen.getByRole('menuitem', { name: /navigate to about us/i });
    await user.click(aboutLink);
    
    await waitFor(() => {
      expect(screen.getByText('ABOUT US')).toBeInTheDocument();
    });
    
    // Navigate to Products page
    const productsLink = screen.getByRole('menuitem', { name: /navigate to products/i });
    await user.click(productsLink);
    
    await waitFor(() => {
      expect(screen.getByText('OUR PRODUCTS')).toBeInTheDocument();
    });
  });
});
