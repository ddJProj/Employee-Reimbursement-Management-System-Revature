/**
 * @file src/components/navigation/Sidebar.tsx
 * @description sidebar navigation component with role-based menu items and logout
 * @module Navigation
 * 
 * Resources:
 * @see {@link https://www.patterns.dev/posts/compound-pattern} - compound component patterns
 * @see {@link https://blog.logrocket.com/creating-sidebar-react-tailwindcss/} - sidebar patterns
 * @see {@link https://www.w3.org/wai/aria/apg/patterns/navigation/} - navigation accessibility
 * @see {@link https://uxdesign.cc/the-sidebar-navigation-in-web-design-2ce5db531a3} - sidebar ux patterns
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../service/auth.api.service'; 
import { ROUTES } from '../../constant/routes.constant';
import { RoleType } from '../../constant/types.constant';

/**
 * navigation item structure
 */
interface NavItem {
  /** display text for the navigation item */
  label: string;
  /** route path */
  path: string;
  /** roles allowed to see this item */
  roles: RoleType[];
}

/**
 * nav config by role
 */
const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    roles: [RoleType.Manager, RoleType.Employee, RoleType.Restricted]
  },
  // manager-specific items
  {
    label: 'Manager Dashboard',
    path: ROUTES.MANAGER,
    roles: [RoleType.Manager]
  },
  // employee-specific items
  {
    label: 'Employee Dashboard',
    path: ROUTES.EMPLOYEE,
    roles: [RoleType.Employee]
  },
  // restricted-specific items
  {
    label: 'Restricted Dashboard',
    path: ROUTES.RESTRICTED,
    roles: [RoleType.Restricted]
  }
];

/**
 * sidebar navigation component with role-based menu and logout
 * displays user info at top and logout at bottom
 * 
 * @returns {React.ReactElement} sidebar navigation component
 */
function Sidebar(): React.ReactElement {
  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  /**
   * handles user logout
   * calls backend to invalidate token, then clears local auth
   * 
   * @returns {Promise<void>}
   */
  const handleLogout = async (): Promise<void> => {
    console.log('Initiating logout process...');
    
    try {
      // call backend logout endpoint if we have a token
      if (token) {
        await authApi.logout(token);
        console.log('Backend logout successful');
      }
    } catch (error) {
      console.error('Backend logout failed:', error);
      // continue with local logout even if backend fails
    }
    
    // clear local auth state
    logout();
    
    // redirect to login
    navigate(ROUTES.LOGIN);
    console.log('Logout complete, redirected to login');
  };
  
  // don't render sidebar if not authenticated
  if (!isAuthenticated || !user) {
    return <></>;
  }
  
  /**
   * Filters navigation items based on user role
   */
  const userNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );  



  return (
    <aside style={{ 
      width: '250px', 
      height: '100vh', 
      borderRight: '1px solid #ccc',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
    }}>
      {/* user info section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
          ERS
        </h2>
        <p style={{ fontSize: '14px', marginTop: '10px', marginBottom: '5px' }}>
          {user.email}
        </p>
        <p style={{ 
          fontSize: '12px', 
          color: '#666',
          backgroundColor: '#e9ecef',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {user.role}
        </p>
      </div>
      
      {/* navigation items */}
      <nav style={{ flex: 1, padding: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {userNavItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '10px' }}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '10px',
                  textDecoration: 'none',
                  color: isActive ? '#007bff' : '#333',
                  backgroundColor: isActive ? '#e9ecef' : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                })}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* logout button at bottom */}
      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid #ccc'
      }}>
        <button
          onClick={handleLogout}
          type="button"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Logout
        </button>
      </div>
      
      {/* development info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          padding: '10px 20px', 
          fontSize: '10px',
          color: '#999',
          borderTop: '1px solid #ccc'
        }}>
          <p style={{ margin: 0 }}>Permissions: {user.permissions.length}</p>
        </div>
      )}
    </aside>
  );
}

export default Sidebar; 



