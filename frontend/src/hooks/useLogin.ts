/**
 * @file src/hooks/useLogin.ts
 * @description custom hook for user login with validation and error handling
 * @module Hooks
 * 
 * Resources:
 * @see {@link https://react.dev/reference/react/hooks} - react hooks documentation
 * @see {@link https://kentcdodds.com/blog/application-state-management-with-react} - state management patterns
 * @see {@link https://www.robinwieruch.de/react-custom-hook/} - custom hooks guide
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { authApi } from'../service/auth.api.service'; 
import { ROUTES, ROLE_REDIRECT } from '../constant/routes.constant';

/**
 * return type for uselogin hook
 */
interface UseLoginReturn {
  handleLogin: (email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

/**
 * custom hook for handling user login
 * provides login logic with loading states and error handling
 * redirects to role-specific dashboard on success
 * 
 * @returns {UseLoginReturn} login handler function and state
 * 
 * @example
 * const { handleLogin, isLoading, error } = useLogin();
 * 
 * const onSubmit = async () => {
 *   const success = await handleLogin(email, password);
 *   if (success) {
 *     // handle success (redirect happens automatically)
 *   }
 * };
 */
export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * handles user login process
   * calls api, updates auth context, and redirects based on role
   * 
   * @param {string} email - user email address
   * @param {string} password - user password
   * @returns {Promise<boolean>} true if login successful, false otherwise
   */
  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('useLogin: Attempting login for:', email);
      
      // call login api
      const response = await authApi.login({ email, password });
      
      console.log('useLogin: Login successful for role:', response.user.role);
      
      // update auth context with token and user
      login(response.token, response.user);
      
      // redirect based on user role
      const redirectPath = ROLE_REDIRECT[response.user.role] || ROUTES.DASHBOARD;
      console.log('useLogin: Redirecting to:', redirectPath);
      
      navigate(redirectPath);
      
      return true;
    } catch (err) {
      console.error('useLogin: Login failed:', err);
      
      // extract error message from error object
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Login failed. Please try again.';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}

