/**
 * @file src/hooks/useRegister.ts
 * @description Custom hook for user registration with validation and error handling
 * @module Hooks
 * 
 * Resources:
 * @see {@link https://react.dev/reference/react/hooks} - react hooks documentation
 * @see {@link https://kentcdodds.com/blog/application-state-management-with-react} - state management patterns
 * @see {@link https://www.robinwieruch.de/react-custom-hook/} - Custom hooks guide
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { authApi } from '../services/authApi';
import { ROUTES } from '../constant/routes.constant';

/**
 * return type for useregister hook
 */
interface UseRegisterReturn {
  handleRegister: (email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

/**
 * custom hook for handling user registration
 * provides registration logic with loading states and error handling
 * auto-logs in user after successful registration
 * 
 * @returns {UseRegisterReturn} registration handler function and state
 * 
 * @example
 * const { handleRegister, isLoading, error } = useRegister();
 * 
 * const onSubmit = async () => {
 *   const success = await handleRegister(email, password);
 *   if (success) {
 *     // handle success
 *   }
 * };
 */
export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * handles user registration process
   * calls api, logs in user, and redirects on success
   * 
   * @param {string} email - user email address
   * @param {string} password - user password
   * @returns {Promise<boolean>} true if registration successful, false otherwise
   */
  const handleRegister = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('useRegister: Attempting registration for:', email);
      
      // call registration API
      const response = await authApi.register({ email, password });
      
      console.log('useRegister: Registration successful');
      
      // auto-login after registration
      login(response.token, response.user);
      
      console.log('useRegister: User logged in, redirecting to restricted dashboard');
      
      // redirect to restricted dashboard (default for new users)
      navigate(ROUTES.RESTRICTED);
      
      return true;
    } catch (err) {
      console.error('useRegister: Registration failed:', err);
      
      // extract error message from error object
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading, error };
}

// TODO: add email validation before api call
