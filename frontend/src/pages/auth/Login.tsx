/**
 * @file src/pages/auth/Login.tsx
 * @description login form component with full auth integration
 * @module Authentication
 * 
 * Resources:
 * - @see {https://reactrouter.com/en/main/hooks/use-navigate} - useNavigate hook 
 * - @see {https://www.developerway.com/posts/how-to-handle-errors-in-react} - error handling in react
 * - @see {https://react-hook-form.com/get-started#TypeScript} - react forms with typescript
 * - @see {https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5} - 
 * - @see {} - 
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi, setAuthToken } from '../../services/authApi';

/**
 * login form component that handles user authentication
 * integrates with authcontext and backend api
 * 
 * @returns {React.ReactElement} login form component
 */
function Login(): React.ReactElement {
  // form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // ui state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * handles form submission and authentication
   * calls api, updates auth context, and redirects on success
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // clear previous errors
    setError(null);
    
    // basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    console.log('Starting login process for:', email);
    
    try {
      // call login api
      const response = await authApi.login({ email, password });
      console.log('Login API call successful');
      
      // set token for future api calls
      setAuthToken(response.token);
      
      // update auth context
      login(response.token, response.user);
      
      // TODO: Store token in localStorage for persistence
      // localStorage.setItem('authToken', response.token);
      // localStorage.setItem('authUser', JSON.stringify(response.user));
      
      console.log('Redirecting to dashboard for role:', response.user.role);
      
      // redirect based on role
      switch (response.user.role) {
        case 'MANAGER':
          navigate('/dashboard/manager');
          break;
        case 'EMPLOYEE':
          navigate('/dashboard/employee');
          break;
        case 'RESTRICTED':
          navigate('/dashboard/restricted');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      
      // handle error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * updates email state on input change
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - input change event
   * @returns {void}
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    // clear error when user starts typing
    if (error) setError(null);
  };

  /**
   * updates password state on input change
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - input change event
   * @returns {void}
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    // clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <div>
      <h2>Login</h2>
      
      {/* display error message */}
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
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
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p>
        Don't have an account? <Link to="/auth/register">Register here</Link>
      </p>
      
      {/* dev helpers */}
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
