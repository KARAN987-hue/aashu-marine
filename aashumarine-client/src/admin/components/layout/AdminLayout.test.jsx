/**
 * AdminLayout Component Tests
 * 
 * Unit tests for AdminLayout component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { AdminLayout } from './AdminLayout';

// Mock child components to simplify testing
vi.mock('./AdminNavbar', () => ({
  AdminNavbar: ({ onToggleSidebar }) => (
    <div data-testid="admin-navbar">
      <button onClick={onToggleSidebar}>Toggle</button>
    </div>
  )
}));

vi.mock('./AdminSidebar', () => ({
  AdminSidebar: ({ isCollapsed }) => (
    <div data-testid="admin-sidebar" data-collapsed={isCollapsed}>
      Sidebar
    </div>
  )
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AdminLayout', () => {
  it('renders navbar and sidebar', () => {
    renderWithProviders(<AdminLayout />);
    
    expect(screen.getByTestId('admin-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderWithProviders(<AdminLayout />);
    
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass('admin-content');
  });

  it('toggles sidebar when toggle button is clicked', async () => {
    renderWithProviders(<AdminLayout />);
    
    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    
    const toggleButton = screen.getByText('Toggle');
    await userEvent.click(toggleButton);
    
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
  });
});
