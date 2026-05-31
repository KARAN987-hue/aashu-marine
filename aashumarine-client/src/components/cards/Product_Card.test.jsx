import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Product_Card from './Product_Card';
import { products } from '../../data/dummyData';

/**
 * Unit Tests for Product_Card Component
 * Feature: website-ui-improvements
 * **Validates: Requirements 1.2, 8.4**
 * 
 * These tests verify specific examples and edge cases for the simplified Product_Card component.
 * The component now displays only essential information: product name, engine type, and manufacturer.
 */

describe('Product_Card Unit Tests', () => {
  /**
   * Test rendering with specific dummy data from products array
   * Verifies that the component correctly displays product information
   * from the actual dummy data used in the application.
   */
  it('renders correctly with specific dummy data from products array', () => {
    const productData = products[0]; // First product from dummy data
    
    render(
      <Product_Card
        image={productData.image}
        name={productData.productName}
        engineType={productData.category}
        manufacturer={productData.manufacturer || 'Test Manufacturer'}
      />
    );
    
    // Verify product name is rendered
    expect(screen.getByText(productData.productName)).toBeInTheDocument();
    
    // Verify engine type is rendered
    expect(screen.getByText(productData.category)).toBeInTheDocument();
    
    // Verify manufacturer is rendered
    expect(screen.getByText(productData.manufacturer || 'Test Manufacturer')).toBeInTheDocument();
    
    // Verify image is rendered with correct src and alt (includes engine type for accessibility)
    const expectedAltText = `${productData.productName} - ${productData.category}`;
    const image = screen.getByAltText(expectedAltText);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', productData.image);
  });

  /**
   * Test rendering with all products from dummy data
   * Ensures the component works with all product entries in the data array.
   */
  it('renders correctly with all products from dummy data', () => {
    products.forEach((product) => {
      render(
        <Product_Card
          image={product.image}
          name={product.productName}
          engineType={product.category}
          manufacturer={product.manufacturer || 'Test Manufacturer'}
        />
      );
      
      expect(screen.getByText(product.productName)).toBeInTheDocument();
      expect(screen.getByText(product.category)).toBeInTheDocument();
      expect(screen.getByText(product.manufacturer || 'Test Manufacturer')).toBeInTheDocument();
      
      // Alt text includes engine type for better accessibility
      const expectedAltText = `${product.productName} - ${product.category}`;
      expect(screen.getByAltText(expectedAltText)).toHaveAttribute('src', product.image);
      
      cleanup();
    });
  });

  it('renders product with all props including engineType and manufacturer', () => {
    const props = {
      image: '/test-image.jpg',
      name: 'Test Product',
      engineType: 'Diesel Engine',
      manufacturer: 'Caterpillar'
    };

    render(<Product_Card {...props} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Diesel Engine')).toBeInTheDocument();
    expect(screen.getByText('Caterpillar')).toBeInTheDocument();
    
    // Alt text includes engine type for better accessibility
    const expectedAltText = 'Test Product - Diesel Engine';
    expect(screen.getByAltText(expectedAltText)).toHaveAttribute('src', '/test-image.jpg');
  });

  /**
   * Test optional engineType and manufacturer prop handling
   * Verifies that the component renders correctly when optional props are not provided.
   */
  it('renders product without optional engineType and manufacturer', () => {
    const props = {
      image: '/test-image.jpg',
      name: 'Test Product'
    };

    render(<Product_Card {...props} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.queryByText(/diesel/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/caterpillar/i)).not.toBeInTheDocument();
  });

  /**
   * Test image loading with correct attributes
   * Verifies that product image is rendered with correct src and alt text.
   */
  it('renders product image with correct alt text', () => {
    const props = {
      image: '/product.jpg',
      name: 'Marine Equipment',
      engineType: 'Diesel Engine',
      manufacturer: 'Volvo Penta'
    };

    render(<Product_Card {...props} />);

    const image = screen.getByAltText('Marine Equipment - Diesel Engine');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/product.jpg');
  });

  /**
   * Test image loading with placeholder fallback
   * Verifies that the component handles image loading errors gracefully.
   */
  it('renders image element with provided src for placeholder fallback', () => {
    const props = {
      image: '/placeholder-product.jpg',
      name: 'Product with Placeholder',
      engineType: 'Test Engine',
      manufacturer: 'Test Manufacturer'
    };

    const { container } = render(<Product_Card {...props} />);

    // Alt text includes engine type for better accessibility
    const expectedAltText = 'Product with Placeholder - Test Engine';
    const image = screen.getByAltText(expectedAltText);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/placeholder-product.jpg');
    
    // Verify image is within the correct container
    const imageContainer = container.querySelector('.product-card__image');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer.querySelector('img')).toBe(image);
  });

  /**
   * Test component structure and CSS classes
   * Verifies that the component has the correct structure and class names.
   */
  it('has correct CSS class structure', () => {
    const { container } = render(
      <Product_Card
        image="/test.jpg"
        name="Test Product"
        engineType="Diesel Engine"
        manufacturer="Test Manufacturer"
      />
    );
    
    expect(container.querySelector('.product-card')).toBeInTheDocument();
    expect(container.querySelector('.product-card__image')).toBeInTheDocument();
    expect(container.querySelector('.product-card__content')).toBeInTheDocument();
    expect(container.querySelector('.product-card__name')).toBeInTheDocument();
    expect(container.querySelector('.product-card__engine-type')).toBeInTheDocument();
    expect(container.querySelector('.product-card__manufacturer')).toBeInTheDocument();
  });

  /**
   * Test onClick handler
   * Verifies that the onClick prop is called when the card is clicked.
   */
  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Product_Card
        image="/test.jpg"
        name="Test Product"
        engineType="Diesel Engine"
        manufacturer="Test Manufacturer"
        onClick={handleClick}
      />
    );
    
    const card = container.querySelector('.product-card');
    card.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
