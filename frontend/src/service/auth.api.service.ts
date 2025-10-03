/**
 * @file src/services/auth.api.service.ts
 * @description api service for authentication endpoints
 * @module services
 */

import axios, { AxiosError } from 'axios';
import type { UserAccount, RoleType } from '../constant/types.constant';
import { API_BASE_URL } from '../config/api.config';
/**
 * base api configuration
 * uses vite proxy in development, update for production
 */
/** const API_BASE_URL = '/api'; */

/**
 * login request payload structure
 */
interface LoginRequest {
  email: string;
  password: string;
}

/**
 * registration request payload structure
 */
interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Authentication response from backend
 * Matches LoginAuthResponseDTO from backend
 */
interface AuthResponse {
  token: string;
  role: string;
  userId: number;
  email: string;
  permissions: string[];
}

/**
 * API error response structure
 */
interface ApiErrorResponse {
  error: string;
  status: number;
}

/**
 * converts backend auth response to frontend useraccount format
 * 
 * @param {AuthResponse} response - backend authentication response
 * @returns {UserAccount} formatted user account for frontend
 */
function mapAuthResponseToUser(response: AuthResponse): UserAccount {
  return {
    userId: response.userId,
    email: response.email,
    role: response.role as RoleType,
    permissions: response.permissions
  };
}

/**
 * authentication api service with login and registration endpoints
 */
export const authApi = {
  /**
   * authenticates user with email and passwor
   * 
   * @param {LoginRequest} credentials - user login credentials
   * @returns {Promise<{token: string, user: UserAccount}>} token and user data
   * @throws {Error} if authentication fails
   */
  async login(credentials: LoginRequest): Promise<{ token: string; user: UserAccount }> {
    try {
      console.log('Attempting login for:', credentials.email);
      
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      
      console.log('Login successful, received response');
      
      return {
        token: response.data.token,
        user: mapAuthResponseToUser(response.data)
      };
    } catch (error) {
      console.error('Login failed:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Invalid credentials';
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * register new user account
   * new users receive restricted role by default
   * 
   * @param {RegisterRequest} userData - new user registration data
   * @returns {Promise<{token: string, user: UserAccount}>} token and user data
   * @throws {Error} if registration fails
   */
  async register(userData: RegisterRequest): Promise<{ token: string; user: UserAccount }> {
    try {
      console.log('Attempting registration for:', userData.email);
      
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      
      console.log('Registration successful, new user created');
      
      return {
        token: response.data.token,
        user: mapAuthResponseToUser(response.data)
      };
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Registration failed';
        
        // handle specific error cases
        if (message.includes('email')) {
          throw new Error('This email is already registered');
        }
        if (message.includes('password')) {
          throw new Error('Password must contain uppercase, lowercase, number, and special character (8+ chars)');
        }
        
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * logs out current user
   * sends logout request to invalidate token on backend
   * 
   * @param {string} token - current JWT token to invalidate
   * @returns {Promise<void>}
   */
  async logout(token: string): Promise<void> {
    try {
      console.log('Attempting logout');
      
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout request failed:', error);
      // even if backend fails, we'll clear local state
    }
  }
};

/**
 * configure axios defaults for authenticated requests
 * call this after login to set auth header for all requests
 * 
 * @param {string | null} token - JWT token to set in headers
 * @returns {void}
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth token set for API requests');
  } else {
    delete axios.defaults.headers.common['Authorization'];
    console.log('Auth token cleared from API requests');
  }
}

// TODO: Add token refresh logic when implementing token expiration
// TODO: Add request/response interceptors for better error handling
// TODO: Add retry logic for failed requests
