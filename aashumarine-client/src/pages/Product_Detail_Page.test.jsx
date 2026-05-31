import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Product_Detail_Page from './Product_Detail_Page';
import { products } from '../data/dummyData';

/**
 * Unit Tests for Product_Detail_Page Component
 * 
 * These tests verify specific examples and edge cases for the Product_Detail_Page component.
 * Validates: Requirements 7.1, 7.2, 7.3, 7.6, 7.7
 */

describe('Product_Detail_Page', () => {
  describe('Product Data Retrieval with Valid ID', () => {
    it('retrieves product data using ID from URL parameter', () => {
      // Render with a valid product ID (1)
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify product data is retrieved and displayed
      const product = products.find(p => p.id === 1);
      expect(screen.getByRole('heading', { name: product.productName, level: 1 })).toBeInTheDocument();
    });

    it('retrieves correct product for different valid IDs', () => {
      // Test with product ID 2
      const { unmount } = render(
        <MemoryRouter initialEntries={['/products/2']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product2 = products.find(p => p.id === 2);
      expect(screen.getByRole('heading', { name: product2.productName, level: 1 })).toBeInTheDocument();
      
      unmount();

      // Test with product ID 3
      render(
        <MemoryRouter initialEntries={['/products/3']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product3 = products.find(p => p.id === 3);
      expect(screen.getByRole('heading', { name: product3.productName, level: 1 })).toBeInTheDocument();
    });

    it('parses product ID as integer from URL', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify product is found (ID is correctly parsed as integer)
      expect(screen.queryByText('Product Not Found')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Marine Diesel Engine/i, level: 1 })).toBeInTheDocument();
    });
  });

  describe('All 14 Product Schema Fields Display', () => {
    it('displays all 14 Product_Schema fields in rendered output', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);

      // Verify all 14 fields are present in the document
      // 1. id
      expect(screen.getByText(product.id.toString())).toBeInTheDocument();
      
      // 2. productName (in Hero_Section heading)
      expect(screen.getByRole('heading', { name: product.productName, level: 1 })).toBeInTheDocument();
      
      // 3. image (alt text)
      const image = screen.getByAltText(product.productName);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', product.image);
      
      // 4. category (in Hero_Section subheading and Product Information)
      const categoryElements = screen.getAllByText(product.category);
      expect(categoryElements.length).toBeGreaterThan(0);
      
      // 5. productType
      expect(screen.getByText(product.productType)).toBeInTheDocument();
      
      // 6. manufacturer
      expect(screen.getByText(product.manufacturer)).toBeInTheDocument();
      
      // 7. condition
      expect(screen.getByText(product.condition)).toBeInTheDocument();
      
      // 8. model
      expect(screen.getByText(product.model)).toBeInTheDocument();
      
      // 9. searchKeyword
      expect(screen.getByText(product.searchKeyword)).toBeInTheDocument();
      
      // 10. shortDescription
      expect(screen.getByText(product.shortDescription)).toBeInTheDocument();
      
      // 11. mainDescription
      expect(screen.getByText(product.mainDescription)).toBeInTheDocument();
      
      // 12. createdDate (formatted)
      const createdDate = new Date(product.createdDate).toLocaleDateString();
      expect(screen.getByText(createdDate)).toBeInTheDocument();
      
      // 13. updatedDate (formatted)
      const updatedDate = new Date(product.updatedDate).toLocaleDateString();
      expect(screen.getByText(updatedDate)).toBeInTheDocument();
      
      // 14. owner
      expect(screen.getByText(product.owner)).toBeInTheDocument();
    });

    it('displays product image with correct src and alt attributes', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);
      const image = screen.getByAltText(product.productName);
      
      expect(image).toHaveAttribute('src', product.image);
      expect(image).toHaveAttribute('alt', product.productName);
    });

    it('displays all metadata fields in Product Information section', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);

      // Verify Product Information section heading
      expect(screen.getByRole('heading', { name: /Product Information/i, level: 2 })).toBeInTheDocument();

      // Verify all metadata fields
      expect(screen.getByText('Manufacturer')).toBeInTheDocument();
      expect(screen.getByText(product.manufacturer)).toBeInTheDocument();
      
      expect(screen.getByText('Model')).toBeInTheDocument();
      expect(screen.getByText(product.model)).toBeInTheDocument();
      
      expect(screen.getByText('Condition')).toBeInTheDocument();
      expect(screen.getByText(product.condition)).toBeInTheDocument();
      
      expect(screen.getByText('Product Type')).toBeInTheDocument();
      expect(screen.getByText(product.productType)).toBeInTheDocument();
    });

    it('displays mainDescription in Description section', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);

      // Verify Description section heading
      expect(screen.getByRole('heading', { name: /^Description$/i, level: 2 })).toBeInTheDocument();

      // Verify mainDescription is displayed
      expect(screen.getByText(product.mainDescription)).toBeInTheDocument();
    });

    it('displays additional information fields', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);

      // Verify Additional Information section heading
      expect(screen.getByRole('heading', { name: /Additional Information/i, level: 2 })).toBeInTheDocument();

      // Verify additional fields
      expect(screen.getByText('Product ID')).toBeInTheDocument();
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Search Keywords')).toBeInTheDocument();
      expect(screen.getByText('Short Description')).toBeInTheDocument();
      expect(screen.getByText('Created Date')).toBeInTheDocument();
      expect(screen.getByText('Updated Date')).toBeInTheDocument();
    });

    it('formats dates correctly', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);
      
      // Verify dates are formatted using toLocaleDateString
      const createdDate = new Date(product.createdDate).toLocaleDateString();
      const updatedDate = new Date(product.updatedDate).toLocaleDateString();
      
      expect(screen.getByText(createdDate)).toBeInTheDocument();
      expect(screen.getByText(updatedDate)).toBeInTheDocument();
    });
  });

  describe('Hero_Section Display', () => {
    it('displays Hero_Section with product name as heading', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);
      
      // Verify product name is displayed as h1 heading
      const heading = screen.getByRole('heading', { name: product.productName, level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('displays Hero_Section with category as subheading', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product = products.find(p => p.id === 1);
      
      // Verify category is displayed (appears in hero section and product info)
      const categoryElements = screen.getAllByText(product.category);
      expect(categoryElements.length).toBeGreaterThan(0);
    });

    it('displays correct Hero_Section for different products', () => {
      // Test product 2
      const { unmount } = render(
        <MemoryRouter initialEntries={['/products/2']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product2 = products.find(p => p.id === 2);
      expect(screen.getByRole('heading', { name: product2.productName, level: 1 })).toBeInTheDocument();
      
      unmount();

      // Test product 3
      render(
        <MemoryRouter initialEntries={['/products/3']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const product3 = products.find(p => p.id === 3);
      expect(screen.getByRole('heading', { name: product3.productName, level: 1 })).toBeInTheDocument();
    });
  });

  describe('Error State - Invalid Product ID', () => {
    it('displays error message when product is not found', () => {
      // Render with an invalid product ID (999)
      render(
        <MemoryRouter initialEntries={['/products/999']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify error message is displayed
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
      expect(
        screen.getByText(
          "The product you're looking for doesn't exist or has been removed."
        )
      ).toBeInTheDocument();
    });

    it('displays error message for non-numeric product ID', () => {
      render(
        <MemoryRouter initialEntries={['/products/invalid']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify error message is displayed
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    });

    it('displays error message for negative product ID', () => {
      render(
        <MemoryRouter initialEntries={['/products/-1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify error message is displayed
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    });

    it('renders Navbar for navigation even in error state', () => {
      render(
        <MemoryRouter initialEntries={['/products/999']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify Navbar is present by checking for navigation element
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('displays user-friendly error message', () => {
      render(
        <MemoryRouter initialEntries={['/products/999']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify the error message is user-friendly (not technical)
      const errorMessage = screen.getByText(
        "The product you're looking for doesn't exist or has been removed."
      );
      expect(errorMessage).toBeInTheDocument();
      
      // Verify no technical error details are shown
      expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument();
    });
  });

  describe('Link Back to Products Page in Error State', () => {
    it('provides Link back to /products page', () => {
      render(
        <MemoryRouter initialEntries={['/products/999']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify link to products page exists
      const backLink = screen.getByRole('link', { name: /view all products/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/products');
    });

    it('displays link with appropriate text', () => {
      render(
        <MemoryRouter initialEntries={['/products/999']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify link text is user-friendly
      const backLink = screen.getByRole('link', { name: /view all products/i });
      expect(backLink).toHaveTextContent('View All Products');
    });

    it('does not display back link when product is found', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify back link is NOT displayed for valid product
      const backLink = screen.queryByRole('link', { name: /view all products/i });
      expect(backLink).not.toBeInTheDocument();
    });
  });

  describe('Valid Product Display', () => {
    it('displays product details when valid ID is provided', () => {
      // Render with a valid product ID (1)
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify product name is displayed in the hero heading (from dummyData product with id 1)
      expect(screen.getByRole('heading', { name: /Marine Diesel Engine MAN B&W 6S50MC/i, level: 1 })).toBeInTheDocument();
    });

    it('does not display error message for valid product', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify error message is NOT displayed
      expect(screen.queryByText('Product Not Found')).not.toBeInTheDocument();
    });

    it('renders Navbar component', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify Navbar is present
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('includes skip navigation link for accessibility', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify skip link is present
      const skipLink = screen.getByText(/Skip to main content/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('skip navigation link is keyboard accessible', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      const skipLink = screen.getByText(/Skip to main content/i);
      
      // Skip link should be focusable (not have tabindex="-1")
      const tabindex = skipLink.getAttribute('tabindex');
      expect(tabindex).not.toBe('-1');
      
      // Skip link should have proper CSS class for focus visibility
      expect(skipLink).toHaveClass('skip-link');
    });

    it('has main content area with correct id', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify main element with id="main-content" exists
      const mainContent = document.querySelector('main#main-content');
      expect(mainContent).toBeInTheDocument();
    });

    it('renders Section_Container component', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify Section_Container is present
      const sectionContainer = document.querySelector('.section-container');
      expect(sectionContainer).toBeInTheDocument();
    });

    it('maintains proper semantic HTML structure', () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<Product_Detail_Page />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify semantic elements are present
      const nav = document.querySelector('nav');
      const section = document.querySelector('section');
      const main = document.querySelector('main');
      
      expect(nav).toBeInTheDocument();
      expect(section).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });
  });
});
