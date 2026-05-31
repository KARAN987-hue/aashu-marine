/**
 * AdminNavbar Component Tests
 * 
 * Unit tests for AdminNavbar component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AdminNavbar } from './AdminNavbar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderWithAuth = (component, authValue) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('AdminNavbar', () => {
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    role: 'admin'
  };

  const mockAuthValue = {
    user: mockUser,
    isAuthenticated: true,
    logout: vi.fn()
  };

  it('renders logo', () => {
    renderWithAuth(<AdminNavbar onToggleSidebar={vi.fn()} />, mockAuthValue);
    
    expect(screen.getByText('Aashumarine Admin')).toBeInTheDocument();
  });

  it('displays user profile when user is authenticated', () => {
    renderWithAuth(<AdminNavbar onToggleSidebar={vi.fn()} />, mockAuthValue);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    renderWithAuth(<AdminNavbar onToggleSidebar={vi.fn()} />, mockAuthValue);
    
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls logout and navigates when logout button is clicked', async () => {
    renderWithAuth(
      <AdminNavbar onToggleSidebar={vi.fn()} />,
      mockAuthValue
    );
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutButton);
    
    expect(mockAuthValue.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
  });

  it('calls onToggleSidebar when toggle button is clicked', async () => {
    const mockToggle = vi.fn();
    renderWithAuth(
      <AdminNavbar onToggleSidebar={mockToggle} />,
      mockAuthValue
    );
    
    const toggleButton = screen.getByLabelText('Toggle sidebar');
    await userEvent.click(toggleButton);
    
    expect(mockToggle).toHaveBeenCalled();
  });
});
