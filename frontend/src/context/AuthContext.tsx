/**
 * @file src/context/AuthContext.tsx
 * @description global authentication state management using react context api with session restoration
 * @module authentication
 *
 * Resources:
 * @see {@link https://kentcdodds.com/blog/authentication-in-react-applications} - Authentication patterns in React
 * @see {@link https://www.robinwieruch.de/react-hooks-fetch-data/} - Data fetching with hooks
 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/} - TypeScript context patterns
 * @see {@link https://dev.to/omardiaa48/managing-authentication-state-in-react-context-api-vs-redux-2k6c} - Auth state management
 * @see {@link https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81} - JWT storage strategies
 */

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserAccount } from '../constant/types.constant';
import { authUtils } from '../util/auth.util';
import { setAuthToken } from '../services/authApi';

/**
 * structure of authentication context value
 */
interface AuthContextType {
  /** current authenticated user or null */
  user: useraccount | null;
  /** jwt token for api authentication */
  token: string | null;
  /** loading state during initial auth check */
  isloading: boolean;
  /** function to log in user */
  login: (token: string, user: useraccount) => void;
  /** function to log out user */
  logout: () => void;
  /** computed boolean for authentication status */
  isauthenticated: boolean;
}

/** context with undefined default (will be set by provider) */
export const authcontext = createcontext<authcontexttype | undefined>(undefined);

/**
 * provides authentication state to entire application
 * handles initial session restoration from localstorage
 * 
 * @param {ReactNode} children - child components to wrap
 * @returns {React.ReactElement} provider component with auth context
 */
export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  // Authentication state
  const [user, setUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * restores authentication session from localstorage on mount
   * validates token isn't expired before restoring
   */
  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      console.log('Checking for existing auth session...');
      
      try {
        // check if we have a valid token in storage
        const isValid = authUtils.isAuthenticated();
        
        if (!isValid) {
          console.log('No valid auth session found');
          setIsLoading(false);
          return;
        }
        
        // retrieve stored data
        const storedToken = authUtils.getToken();
        const storedUser = authUtils.getUser();
        
        if (storedToken && storedUser) {
          console.log('Restoring auth session for:', storedUser.email);
          
          // restore session state
          setToken(storedToken);
          setUser({
            userId: storedUser.userId,
            email: storedUser.email,
            role: storedUser.role,
            permissions: storedUser.permissions || []
          });
          
          // set token for api requests
          setAuthToken(storedToken);
          
          console.log('Auth session restored successfully');
          
          // TODO: Optional - Verify token with backend
          // This could be a call to a /api/auth/verify endpoint
          // to ensure the token is still valid on the server
        }
      } catch (error) {
        console.error('Error restoring auth session:', error);
        // clear any corrupted data
        authUtils.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };
    
    restoreSession();
  }, []); // only run once on mount

  /**
   * handles user login by storing auth data and updating state
   * 
   * @param {string} newToken - JWT token from backend
   * @param {UserAccount} newUser - User account data
   * @returns {void}
   */
  const login = (newToken: string, newUser: UserAccount): void => {
    console.log('Logging in user:', newUser.email);
    
    // update state
    setToken(newToken);
    setUser(newUser);
    
    // persist to localstorage
    authUtils.setAuthData(newToken, newUser);
    
    // set token for future api requests
    setAuthToken(newToken);
    
    console.log('User logged in successfully');
  };

  /**
   * handles user logout by clearing all auth data
   * 
   * @returns {void}
   */
  const logout = (): void => {
    console.log('Logging out user');
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // clear localstorage
    authUtils.clearAuthData();
    
    // remove token from api requests
    setAuthToken(null);
    
    console.log('User logged out successfully');
    
    // TODO: Call backend logout endpoint to invalidate token
    // This should be done from the component that calls logout
  };

  /** token and user required for valid auth state */
  const isAuthenticated: boolean = !!token && !!user;

  /** context value with explicit typing */
  const authValue: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * custom hook for accessing authentication context
 * req use within authprovider component tree
 * 
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```typescript
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * if (isLoading) {
 *   return <LoadingSpinner />;
 * }
 * 
 * if (!isAuthenticated) {
 *   return <Navigate to="/auth/login" />;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}






