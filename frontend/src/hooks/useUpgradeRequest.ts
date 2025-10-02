/**
 * @file src/hooks/useUpgradeRequest.ts
 * @description custom hook for requesting employee role upgrade
 * @module Hooks
 * 
 * Resources:
 * @see {@link https://react.dev/reference/react/hooks} - react hooks documentation
 * @see {@link https://kentcdodds.com/blog/application-state-management-with-react} - state management
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { userApi } from '../service/user.api.service'; 
import { ROUTES } from '../constant/routes.constant';

/**
 * return type for useupgraderequest hook
 */
interface UseUpgradeRequestReturn {
  requestUpgrade: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * custom hook for requesting employee role upgrade
 * updates auth context with new role and redirects on success
 * 
 * @returns {UseUpgradeRequestReturn} upgrade handler and state
 * 
 * @example
 * const { requestUpgrade, isLoading, error, success } = useUpgradeRequest();
 * 
 * const handleClick = async () => {
 *   const upgraded = await requestUpgrade();
 *   if (upgraded) {
 *     // Success - user redirected to employee dashboard
 *   }
 * };
 */
export function useUpgradeRequest(): UseUpgradeRequestReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  /**
   * request upgrade from restricted to employee role
   * updates auth context with new user data on success
   * redirects to employee dashboard
   * 
   * @returns {Promise<boolean>} true if upgrade successful, false otherwise
   */
  const requestUpgrade = async (): Promise<boolean> => {
    // Validation checks
    if (!user) {
      setError('No user logged in');
      return false;
    }

    if (user.role !== 'RESTRICTED') {
      setError('Only restricted users can request employee access');
      return false;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('useUpgradeRequest: Requesting employee access for user:', user.userId);
      
      // call api to upgrade user role
      const updatedUser = await userApi.requestEmployeeAccess(user.userId);
      
      console.log('useUpgradeRequest: Upgrade successful, new role:', updatedUser.role);
      
      // update auth context with new user data
      updateUser(updatedUser);
      
      setSuccess(true);
      
      console.log('useUpgradeRequest: Redirecting to employee dashboard');
      
      // redirect to employee dashboard after short delay to show success message
      setTimeout(() => {
        navigate(ROUTES.EMPLOYEE);
      }, 1500);
      
      return true;
    } catch (err) {
      console.error('useUpgradeRequest: Upgrade request failed:', err);
      
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to request employee access. Please try again.';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { requestUpgrade, isLoading, error, success };
}

// TODO: support for checking existing upgrade request status?
