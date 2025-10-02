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

import React, { createContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react';
import type {UserAccount} from '../constant/types.constant';
import { authUtils } from '../util/auth.util';
import { setAuthToken } from '../service/auth.api.service'; 

/**
 * structure of authentication context value
 */
interface AuthContextType {
  /** current authenticated user or null */
  user: UserAccount | null;
  /** jwt token for api authentication */
  token: string | null;
  /** loading state during initial auth check */
  isLoading: boolean;
  /** function to log in user */
  login: (token: string, user: UserAccount) => void;
  /** function to update a user Account */
  updateUser: (user: UserAccount) => void;
  /** function to log out user */
  logout: () => void;
  /** computed boolean for authentication status */
  isAuthenticated: boolean;
}

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}



/** context with undefined default (will be set by provider) */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * provides authentication state to entire application
 * handles initial session restoration from localstorage
 * 
 * @param {ReactNode} children - child components to wrap
 * @returns {React.ReactElement} provider component with auth context
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {

  // authentication state
  const [user, setUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * restores authentication session from localstorage on mount
   * validates token isn't expired before restoring
   */
  useEffect(() => {
    console.log('AuthContext: Checking for existing session');
    
    const storedToken = authUtils.getToken();
    const storedUser = authUtils.getUser();
    
    if (storedToken && storedUser && authUtils.isAuthenticated()) {
      console.log('AuthContext: Restoring session for user:', storedUser.email);
      setToken(storedToken);
      setUser(storedUser as UserAccount);
      setAuthToken(storedToken);
    } else {
      console.log('AuthContext: No valid session found');
      // Clear any invalid data
      authUtils.clearAuthData();
    }
    
    setIsLoading(false);
  }, []);

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
    
    // TODO: call backend logout endpoint to invalidate token
    // this should be done from the component that calls logout
  };

  /**
   * updates user data in auth context and localstorage
   * used when user role or permissions change
   * 
   * @param {UserAccount} updatedUser - updated user account data
   * @returns {void}
   */
  const updateUser = (updatedUser: UserAccount): void => {
    console.log('AuthContext: Updating user data for:', updatedUser.email);
    
    setUser(updatedUser);
    
    // update localstorage with new user data, keep existing token
    if (token) {
      authUtils.setAuthData(token, updatedUser);
    }
  };


  /** token and user required for valid auth state */
  const isAuthenticated: boolean = !!token && !!user;

  /** context value with explicit typing */
  const authValue: AuthContextType = {
    user,
    token,
    isLoading,
    updateUser,
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




