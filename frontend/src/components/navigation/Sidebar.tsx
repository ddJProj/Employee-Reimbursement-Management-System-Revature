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
 *
 *
 * @see {@link https://mui.com/material-ui/react-drawer/#permanent-drawer} - mui sidebar example 
 * @see {@link } - sidebar ux patterns
 * @see {@link } - sidebar ux patterns
 * @see {@link } - sidebar ux patterns
 *
 *
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../service/auth.api.service'; 
import { ROUTES } from '../../constant/routes.constant';
import type { RoleType } from '../../constant/types.constant';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * set width for nav drawer
 */
const drawerWidth = 240;

/**
 * navigation item structure
 */
interface NavItem {
  /** display text for the navigation item */
  label: string;
  /** route path */
  path: string;
  /** component icon */
  icon: React.ReactElement;
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
    icon: <HomeIcon />,
    roles: [RoleType.Manager, RoleType.Employee, RoleType.Restricted]
  }
  // TODO : add home/welcome page logic
  //
  // TODO:: separate reimbursement logic into separate menu entry and page?
  

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
  
  
  /**
   * filters nav items by user role
   */
  const getVisibleNavItems = (items: NavItem[]): NavItem[] => {
    if (!user) return [];

    return items.filter(item => item.roles.includes(user.role as RoleType));
  };  



  const visibleItems = getVisibleNavItems(navigationItems);

  // don't render sidebar if not authenticated
  if (!isAuthenticated || !user) {
    return <></>;
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* top spacing with user info */}
      <Toolbar>
        <Box sx={{ p: 2, width: '100%' }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            ERS
          </Box>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 1 }}>
            {user.email}
          </Box>
          <Box 
            sx={{ 
              fontSize: '0.75rem',
              color: 'text.secondary',
              bgcolor: 'action.hover',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: 'inline-block',
              mt: 0.5
            }}
          >
            {user.role}
          </Box>
        </Box>
      </Toolbar>
      
      <Divider />

      {/* navigation items using navlink */}
      <List>
        {visibleItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <NavLink
              to={item.path}
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
            >
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? 'primary.main' : 'inherit' 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* logout button - push to bottom */}
      <Box sx={{ mt: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* development info */}
      {process.env.NODE_ENV === 'development' && (
        <Box 
          sx={{ 
            p: 1.5,
            fontSize: '0.625rem',
            color: 'text.disabled',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ m: 0 }}>Permissions: {user.permissions.length}</Box>
        </Box>
      )}
    </Drawer>

  );
}

export default Sidebar; 


  // TODO : ADD TO NAVITEMS:
  //  add home/welcome page logic
  //  separate reimbursement logic into separate menu entry and page?
