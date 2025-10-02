/**
 * @file src/components/auth/ProtectedRoute.tsx
 * @description route wrapper that ensures user authentication and role-based access
 * @module Authentication
 * 
 * Resources:
 * @see {@link https://ui.dev/react-router-protected-routes-authentication} - protected routes pattern
 * @see {@link https://www.robinwieruch.de/react-router-private-routes/} - private routes in react router
 * @see {@link https://reactrouter.com/en/main/start/tutorial#redirecting-users} - react router redirects
* @see {@link https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/} - auth with react router v6
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constant/routes.constant';

/**
 * props for protectedroute component
 */
interface ProtectedRouteProps {
  /** child components to render if authorized */
  children: React.ReactNode;
}

/**
 * simple protected route - only checks authentication
 * no longer checking roles
 * dashboard component handles role based routing logic
 * 
 * @param {ProtectedRouteProps} props - Component props
 * @returns {React.ReactElement} Protected content or redirect
 * 
 * @example
 * ```typescript
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute check:', { isAuthenticated, isLoading });
  
  // show loading state while checking auth
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  
  /** 
   * not authenticated - redirect to login 
  */
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
 
  // auth check passed - render allowed, dashboard will handle
  return <>{children}</>;
}

