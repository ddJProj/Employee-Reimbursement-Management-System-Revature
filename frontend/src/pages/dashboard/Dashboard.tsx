/**
 * @file src/pages/dashboard/Dashboard.tsx
 * @description main dashboard component that redirects based on user role
 * @module Dashboard
 * 
 * Resources:
 * @see {@link https://reactrouter.com/en/main/hooks/use-navigate} - programmatic navigation
 * @see {@link https://kentcdodds.com/blog/stop-using-isloading-booleans} - loading state patterns
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_REDIRECT } from '../../constant/routes.constant';

/**
 * main db component, acts as router based on role
 * automatically redirects users to their role-specific dashboard
 * shows loading state while determining redirect
 * 
 * @returns {React.ReactElement} Dashboard component or redirect
 */
function Dashboard(): React.ReactElement {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  /**
   * effect to handle role-based redirects
   */
  useEffect(() => {
    // don't redirect while loading
    if (isLoading) {
      return;
    }
    
    // this shouldn't happen due to protectedroute, but just in case
    if (!user) {
      console.error('Dashboard: No user found, this should not happen');
      navigate('/auth/login');
      return;
    }
    
    // redirect based on user role
    const redirectPath = ROLE_REDIRECT[user.role];
    
    if (redirectPath) {
      console.log(`Redirecting ${user.role} to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    } else {
      console.warn(`No redirect path configured for role: ${user.role}`);
    }
  }, [user, isLoading, navigate]);
  
  // show loading while determining redirect
  if (isLoading || !user) {
    return (
      <div>
        <h2>Loading Dashboard...</h2>
        <p>Determining your access level...</p>
      </div>
    );
  }
  
  // show temporary content while redirect processes
  // this should only flash briefly before redirect
  return (
    <div>
      <h2>Redirecting to your dashboard...</h2>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default Dashboard;

/**
 * TODO:
 * 
 */
