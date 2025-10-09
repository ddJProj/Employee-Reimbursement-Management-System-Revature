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
import {
  Drawer, List, ListItem, ListItemButton, ListItemText, 
  Divider, Typography, Button, Chip } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';




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
   * filter nav items based on user role
   */
  const userNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );



  return (
    <Drawer
      variant="permanent"
      className="w-64"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* user info - tailwind for spacing */}
      <div className="p-4 border-b border-gray-200">
        <Typography variant="h6" className="font-bold mb-2">
          ERS
        </Typography>
        <Typography variant="body2" className="mb-1">
          {user.email}
        </Typography>
        <Chip 
          label={user.role} 
          size="small" 
          color="primary"
        />
      </div>
      
      {/* nav - mui list components */}
      <List className="flex-1 p-2">
        {userNavItems.map((item) => (
          <ListItem key={item.path} disablePadding className="mb-1">
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 1,
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      {/* logout - tailwind spacing */}
      <div className="p-4">
        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      
      {/* dev info - tailwind styling */}
      {process.env.NODE_ENV === 'development' && (
        <div className="px-4 py-2 text-xs text-gray-500 border-t">
          <p>Permissions: {user.permissions.length}</p>
        </div>
      )}
    </Drawer>
  );
}
export default Sidebar; 



