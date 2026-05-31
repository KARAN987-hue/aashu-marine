/**
 * AdminSidebar Component Tests
 * 
 * Unit tests for AdminSidebar component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

describe('AdminSidebar', () => {
  it('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <AdminSidebar isCollapsed={false} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Contact Leads')).toBeInTheDocument();
    expect(screen.getByText('Quote Requests')).toBeInTheDocument();
    expect(screen.getByText('Newsletter Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('applies collapsed class when isCollapsed is true', () => {
    const { container } = render(
      <BrowserRouter>
        <AdminSidebar isCollapsed={true} />
      </BrowserRouter>
    );
    
    const sidebar = container.querySelector('.admin-sidebar');
    expect(sidebar).toHaveClass('collapsed');
  });

  it('does not apply collapsed class when isCollapsed is false', () => {
    const { container } = render(
      <BrowserRouter>
        <AdminSidebar isCollapsed={false} />
      </BrowserRouter>
    );
    
    const sidebar = container.querySelector('.admin-sidebar');
    expect(sidebar).not.toHaveClass('collapsed');
  });

  it('highlights active navigation link', () => {
    render(
      <MemoryRouter initialEntries={['/admin/products']}>
        <AdminSidebar isCollapsed={false} />
      </MemoryRouter>
    );
    
    const productsLink = screen.getByText('Products').closest('a');
    expect(productsLink).toHaveClass('active');
  });

  it('renders navigation with proper ARIA labels', () => {
    render(
      <BrowserRouter>
        <AdminSidebar isCollapsed={false} />
      </BrowserRouter>
    );
    
    const sidebar = screen.getByRole('navigation', { name: /admin sidebar navigation/i });
    expect(sidebar).toBeInTheDocument();
  });

  it('renders all navigation links with correct paths', () => {
    render(
      <BrowserRouter>
        <AdminSidebar isCollapsed={false} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/admin/dashboard');
    expect(screen.getByText('Products').closest('a')).toHaveAttribute('href', '/admin/products');
    expect(screen.getByText('Testimonials').closest('a')).toHaveAttribute('href', '/admin/testimonials');
    expect(screen.getByText('Contact Leads').closest('a')).toHaveAttribute('href', '/admin/leads');
    expect(screen.getByText('Quote Requests').closest('a')).toHaveAttribute('href', '/admin/quotes');
    expect(screen.getByText('Newsletter Subscribers').closest('a')).toHaveAttribute('href', '/admin/subscribers');
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/admin/profile');
  });
});
