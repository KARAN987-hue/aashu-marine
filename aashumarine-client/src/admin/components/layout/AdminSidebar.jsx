/**
 * AdminSidebar Component
 * 
 * Navigation sidebar with links to all admin pages.
 * Highlights active route and collapses on tablet view.
 * 
 * Requirements: 32.3, 34.3
 */

import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

/**
 * AdminSidebar Component
 * @param {boolean} isCollapsed - Whether sidebar is collapsed (for tablet view)
 */
export function AdminSidebar({ isCollapsed }) {
  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/admin/products',
      label: 'Products',
      icon: '📦'
    },
    {
      path: '/admin/testimonials',
      label: 'Testimonials',
      icon: '💬'
    },
    {
      path: '/admin/leads',
      label: 'Contact Leads',
      icon: '📧'
    },
    {
      path: '/admin/quotes',
      label: 'Quote Requests',
      icon: '📋'
    },
    {
      path: '/admin/subscribers',
      label: 'Newsletter Subscribers',
      icon: '📰'
    },
    {
      path: '/admin/profile',
      label: 'Profile',
      icon: '👤'
    }
  ];

  return (
    <aside
      className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      role="navigation"
      aria-label="Admin sidebar navigation"
    >
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
