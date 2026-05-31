/**
 * AdminNavbar Component
 * 
 * Top navigation bar with logo, user profile, and logout button.
 * Includes sidebar toggle button for tablet view.
 * 
 * Requirements: 4.1, 32.2
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import './AdminNavbar.css';

/**
 * AdminNavbar Component
 * @param {function} onToggleSidebar - Callback to toggle sidebar visibility
 */
export function AdminNavbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="admin-navbar" role="navigation" aria-label="Admin navigation">
      <div className="admin-navbar-left">
        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div className="admin-logo">
          <h1>Aashumarine Admin</h1>
        </div>
      </div>
      
      <div className="admin-navbar-right">
        {user && (
          <div className="user-profile">
            <span className="user-name">{user.username}</span>
            <span className="user-role">{user.role}</span>
          </div>
        )}
        <Button
          variant="secondary"
          size="small"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
