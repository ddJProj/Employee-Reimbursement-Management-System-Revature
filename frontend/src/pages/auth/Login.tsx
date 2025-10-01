/**
 * @file src/pages/auth/Login.tsx
 * @description Login form component with full auth integration and session persistence
 * @module Authentication
 * 
 * Resources:
 * @see {@link https://reactrouter.com/en/main/hooks/use-navigate} - React Router navigation
 * @see {@link https://www.developerway.com/posts/how-to-handle-errors-in-react} - Error handling patterns
 * @see {@link https://react-hook-form.com/get-started#TypeScript} - Form handling in React
 * @see {@link https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5} - Auth patterns
 * @see {@link https://www.robinwieruch.de/react-hooks-fetch-data/} - Data fetching with hooks
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi, setAuthToken } from '../../service/auth.api.service';
import { authUtils } from '../../util/auth.util';
import { ROUTES, ROLE_REDIRECT } from '../../constant/routes.constant';

/**
 * login form component that handles user authentication
 * integrates with AuthContext and backend API
 * automatically redirects authenticated users
 * 
 * @returns {React.ReactElement} login form component
 */
function Login(): React.ReactElement {
  // form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // validation state
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Hooks
  const { isAuthenticated, user } = useAuth();
  const { handleLogin, isLoading, error } = useLogin();
  const navigate = useNavigate();
  
  /**
   * redirect if already authenticated
   * handles cases where user navigates to login while logged in
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User already authenticated, redirecting to dashboard');
      const redirectPath = ROLE_REDIRECT[user.role] || ROUTES.DASHBOARD;
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  /**
   * validates form inputs before submission
   * checks for empty fields and valid email format
   * 
   * @returns {boolean} true if validation passes, false otherwise
   */
  const validateForm = (): boolean => {
    // clear previous validation errors
    setValidationError(null);
    
    // check for empty fields
    if (!email || !password) {
      setValidationError('Please fill in all fields');
      return false;
    }
    
    // email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  /**
   * handles form submission
   * validates inputs and calls uselogin hook
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // validate before attempting login
    if (!validateForm()) {
      return;
    }
    
    console.log('Submitting login form for:', email);
    
    // uselogin hook handles the api call, auth context update, and redirect
    await handleLogin(email, password);
  };

  /**
   * updates email state on input change
   * clears validation errors when user starts typing
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - input change event
   * @returns {void}
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (validationError) setValidationError(null);
  };

  /**
   * updates password state on input change
   * clears validation errors when user starts typing
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   * @returns {void}
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    // Clear errors when user starts typing
    if (validationError) setValidationError(null);
  };

  // display validation error or api error
  const displayError = validationError || error;

  return (
    <div>
      <h2>Login</h2>
      
      {/* display error message */}
      {displayError && (
        <div role="alert" style={{ color: 'red', marginBottom: '10px' }}>
          {displayError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p>
        Don't have an account? <Link to={ROUTES.REGISTER}>Register here</Link>
      </p>
      
      {/* development helpers */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <p>Test Accounts:</p>
          <p>Manager: manager@test.com</p>
          <p>Employee: employee@test.com</p>
          <p>Password: Test123!</p>
        </div>
      )}
    </div>
  );
}

export default Login;
