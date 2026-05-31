/**
 * AdminLayout Component
 * 
 * Main layout wrapper for admin pages with sidebar and content area.
 * Provides responsive layout for desktop and tablet screens.
 * 
 * Requirements: 32.1, 34.2, 34.3
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import './AdminLayout.css';

/**
 * AdminLayout Component
 * Wraps admin pages with navigation and sidebar
 */
export function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="admin-layout">
      <AdminNavbar onToggleSidebar={toggleSidebar} />
      <div className="admin-layout-container">
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
        <main className="admin-content" role="main" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
