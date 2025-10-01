/**
 * @file src/pages/auth/Registration.tsx
 * @description registration form component with validation and auto-login
 * @module Authentication
 * 
 * Resources:
 * @see {@link https://reactrouter.com/en/main/hooks/use-navigate} - react router navigation
 * @see {@link https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5} - auth patterns
 * @see {@link https://www.patterns.dev/posts/react-hook-form-pattern} - form validation patterns
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/authentication_cheat_sheet.html} - password security
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';
import { ROUTES, ROLE_REDIRECT } from '../../constant/routes.constant';

/**
 * password validation requirements
 * must match backend validation rules
 */
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[@#$%^&+=!]/,
};

/**
 * registration form component that creates new user accounts
 * validates password requirements and auto-logs in on success
 * new users receive restricted role by default
 * 
 * @returns {React.ReactElement} registration form component
 */
function Registration(): React.ReactElement {
  // Form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false);
  
  // Hooks
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  /**
   * redirect if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User already authenticated, redirecting to dashboard');
      const redirectPath = ROLE_REDIRECT[user.role] || ROUTES.DASHBOARD;
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  /**
   * validates password meets all requirements
   * 
   * @param {string} pwd - password to validate
   * @returns {string | null} error message or null if valid
   */
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < PASSWORD_REQUIREMENTS.minLength) {
      return `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
    }
    if (!PASSWORD_REQUIREMENTS.hasUpperCase.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!PASSWORD_REQUIREMENTS.hasLowerCase.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!PASSWORD_REQUIREMENTS.hasNumber.test(pwd)) {
      return 'Password must contain at least one number';
    }
    if (!PASSWORD_REQUIREMENTS.hasSpecialChar.test(pwd)) {
      return 'Password must contain at least one special character (@#$%^&+=!)';
    }
    return null;
  };

  /**
   * handles form submission and registration
   * auto-logs in user after successful registration
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // clear previous errors
    setError(null);
    
    // basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    // email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    // confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    console.log('Starting registration process for:', email);
    
    try {
      // Call registration API
      const response = await authApi.register({ email, password });
      console.log('Registration successful, auto-logging in user');
      
      // auto-login after successful registration
      login(response.token, response.user);
      
      console.log('User registered with role:', response.user.role);
      console.log('Redirecting to restricted dashboard');
      
      // new users get restricted role, redirect accordingly
      navigate(ROUTES.RESTRICTED);
      
    } catch (err) {
      console.error('Registration failed:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
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
    if (error) setError(null);
  };

  /**
   * updates password state on input change
   * shows password requirements on first focus
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - input change event
   * @returns {void}
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  /**
   * updates confirm password state on input change
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - input change event
   * @returns {void}
   */
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
    if (error) setError(null);
  };

  /**
   * shows password requirements when password field is focused
   * 
   * @returns {void}
   */
  const handlePasswordFocus = (): void => {
    setShowPasswordRequirements(true);
  };

  /**
   * hides password requirements when password field lose focus
   * if password is empty
   * 
   * @returns {void}
   */
  const handlePasswordBlur = (): void => {
    if (!password) {
      setShowPasswordRequirements(false);
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      
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
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            placeholder="Create a password"
            required
            disabled={isLoading}
            autoComplete="new-password"
          />
          
          {/* password requirements hint */}
          {showPasswordRequirements && (
            <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
              <p>Password must contain:</p>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character (@#$%^&+=!)</li>
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p>
        Already have an account? <Link to={ROUTES.LOGIN}>Login here</Link>
      </p>
      
      {/* information about default role */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Note: New accounts start with restricted access.</p>
        <p>Request employee access after registration.</p>
      </div>
    </div>
  );
}

export default Registration;
