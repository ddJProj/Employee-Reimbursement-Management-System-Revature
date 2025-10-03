/**
 * @file src/services/user.api.service.ts
 * @description API service for user management and account operations
 * @module Services
 * 
 * Resources:
 * @see {@link https://axios-http.com/docs/intro} - Axios documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods} - HTTP methods
 */

import axios, { AxiosError } from 'axios';
import type { UserAccount, RoleType } from '../constant/types.constant';
import { API_BASE_URL } from '../config/api.config';

/**
 * base api configuration
 */
/** const API_BASE_URL = '/api'; */

/**
 * request payload for account upgrade
 */
interface AccountUpgradeRequest {
  userAccountId: number;
}

/**
 * response from account upgrade request
 */
interface AccountUpgradeResponse {
  userAccountId: number;
  email: string;
  role: string;
  permissions: string[];
}

/**
 * api error response structure
 */
interface ApiErrorResponse {
  error: string;
  status: number;
}

/**
 * user api service for account management operations
 */
export const userApi = {
  /**
   * request upgrade from restricted to employee role
   * backend automatically upgrades to employee (only valid upgrade path)
   * 
   * @param {number} userAccountId - ID of user requesting upgrade
   * @returns {Promise<UserAccount>} updated user account data
   * @throws {Error} if upgrade request fails
   * 
   * @example
   * const updatedUser = await userApi.requestEmployeeAccess(123);
   */
  async requestEmployeeAccess(userAccountId: number): Promise<UserAccount> {
    try {
      console.log('Requesting employee access for user:', userAccountId);
      
      const response = await axios.post<AccountUpgradeResponse>(
        `${API_BASE_URL}/users/upgrade`,
        { userAccountId } as AccountUpgradeRequest,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Employee access granted');
      
      // convert to useraccount format
      return {
        userId: response.data.userAccountId,
        email: response.data.email,
        role: response.data.role as RoleType,
        permissions: response.data.permissions
      };
    } catch (error) {
      console.error('Employee access request failed:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to request employee access';
        
        // handle specific error cases
        if (message.includes('RESTRICTED')) {
          throw new Error('Only restricted users can request employee access');
        }
        if (message.includes('already')) {
          throw new Error('You already have employee access or higher');
        }
        
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * get all users (manager only)
   * 
   * @returns {Promise<UserAccount[]>} list of all users
   * @throws {Error} if request fails
   */
  async getAllUsers(): Promise<UserAccount[]> {
    try {
      console.log('Fetching all users');
      
      const response = await axios.get<AccountUpgradeResponse[]>(
        `${API_BASE_URL}/users`
      );
      
      // convert to useraccount format
      return response.data.map(user => ({
        userId: user.userAccountId,
        email: user.email,
        role: user.role as RoleType,
        permissions: user.permissions
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to fetch users';
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * delete user account (manager only)
   * 
   * @param {number} userId - ID of user to delete
   * @returns {Promise<void>}
   * @throws {Error} if deletion fails
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      console.log('Deleting user:', userId);
      
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to delete user';
        
        // handle specific error cases
        if (message.includes('own account')) {
          throw new Error('Cannot delete your own account');
        }
        
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  }
};

// TODO: endpoint for checking upgrade request status
// TODO: endpoint for manager to approve/deny upgrade requests
