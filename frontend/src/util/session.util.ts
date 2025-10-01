/**
 * @file src/util/session.util.ts
 * @description session management utilities for auth persistence
 * @module Utilities
 *
 * Resources:
 * - @see {https://kentcdodds.com/blog/authentication-in-react-applications} - kent c. dodds auth patterns
 * - @see {https://www.robinwieruch.de/react-token-authentication/} - react token auth guide
 */

import { UserAccount } from "../constant/types.constant";
import { authUtils } from "./auth.util";

/**
 * fetch and validate stored session data
 * currently uses local storage. could be extended for backend validation
 * 
 * @returns {Promise<UserAccount>} stored user data
 * @throws {Error} if no valid session found
 */
export const fetchSession = async (): Promise<UserAccount> => {
  try {
    const storedUser = authUtils.getUser();
    
    if (!storedUser) {
      throw new Error("No matching user data could be found.");
    }
    
    // map stored data to UserAccount type
    return {
      userId: storedUser.userId || 0,  // Changed from 'id' to 'userId'
      email: storedUser.email || '',
      role: storedUser.role || 'GUEST',
      permissions: storedUser.permissions || [],
    };
    
    // TODO: validate token with backend
    // const token = authUtils.getToken();
    // if (!token) throw new Error('No auth token');
    // 
    // const response = await fetch('/api/auth/validate', {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // 
    // if (!response.ok) throw new Error('Invalid session');
    // return storedUser;
    
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

/**
 * get current session token
 * use authutils for consistency
 * 
 * @returns {{ token: string | null }} Session token object
 */
export const getSession = (): { token: string | null } => {
  const token = authUtils.getToken();  // use authUtils instead of direct localStorage
  return { token };
};
