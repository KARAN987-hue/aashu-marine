import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Landing_Page from './Landing_Page';

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Landing_Page Integration Tests', () => {
  it('renders all sections in correct order', () => {
    const { container } = renderWithRouter(<Landing_Page />);
    
    // Verify Navbar is present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Verify Hero section with specific text
    expect(screen.getByText('WE ARE HERE TO KEEP YOU SAILING')).toBeInTheDocument();
    expect(screen.getByText('Top Dealer for Ship Machinery & Spare Parts')).toBeInTheDocument();
    
    // Verify Services section
    expect(screen.getByText('OUR SERVICES')).toBeInTheDocument();
    
    // Verify Products section
    expect(screen.getByText('OUR PRODUCTS')).toBeInTheDocument();
    expect(screen.getByText('View all Products')).toBeInTheDocument();
    
    // Verify Why Us section
    expect(screen.getByText('WHY US?')).toBeInTheDocument();
  });

  it('renders exactly 4 service cards', () => {
    const { container } = renderWithRouter(<Landing_Page />);
    const serviceCards = container.querySelectorAll('.service-card');
    expect(serviceCards.length).toBe(4);
  });

  it('renders exactly 3 product cards', () => {
    const { container } = renderWithRouter(<Landing_Page />);
    const productCards = container.querySelectorAll('.product-card');
    expect(productCards.length).toBe(3);
  });

  it('renders exactly 5 why us cards', () => {
    const { container } = renderWithRouter(<Landing_Page />);
    const whyUsCards = container.querySelectorAll('.why-us-card');
    expect(whyUsCards.length).toBe(5);
  });

  it('navigates to /products when View all Products button is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<Landing_Page />);
    
    const viewAllButton = screen.getByText('View all Products');
    await user.click(viewAllButton);
    
    // Verify navigation occurred by checking the URL
    expect(window.location.pathname).toBe('/products');
  });

  it('maintains existing button styling and accessibility', () => {
    renderWithRouter(<Landing_Page />);
    
    const viewAllButton = screen.getByText('View all Products');
    
    // Verify button has correct class
    expect(viewAllButton).toHaveClass('view-all-products-btn');
    
    // Verify button has aria-label for accessibility
    expect(viewAllButton).toHaveAttribute('aria-label', 'View all products page');
  });

  it('renders testimonials section with testimonials', () => {
    renderWithRouter(<Landing_Page />);
    
    // Check for at least one testimonial name from dummy data
    expect(screen.getByText('Captain James Morrison')).toBeInTheDocument();
  });

  it('passes navigation items to Navbar', () => {
    renderWithRouter(<Landing_Page />);
    
    // Verify navigation items from dummy data
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
