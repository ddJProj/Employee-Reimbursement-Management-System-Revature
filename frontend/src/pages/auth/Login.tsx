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
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useLogin } from '../../hooks/useLogin';
import { ROUTES, ROLE_REDIRECT } from '../../constant/routes.constant';
import type { RoleType } from '../../constant/types.constant';

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
    console.log('Login: checking auth state', {isAuthenticated, user: user?.email});
    if (isAuthenticated && user) {
      console.log('User already authenticated, redirecting to dashboard');
      const redirectPath = ROLE_REDIRECT[user.role as RoleType] || ROUTES.DASHBOARD;
      navigate(redirectPath, {replace: true});
    }
  }, []);

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
    <Box
      className="flex items-center justify-center min-h-screen bg-gray-50"
      sx={{ p: 2 }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Login
          </Typography>

          {/* display error message */}
          {displayError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {displayError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              autoComplete="email"
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              autoComplete="current-password"
              margin="normal"
              variant="outlined"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>

          <Typography align="center" variant="body2" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to={ROUTES.REGISTER} underline="hover">
              Register here
            </MuiLink>
          </Typography>

          {/* development helpers */}
          {process.env.NODE_ENV === 'development' && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="caption" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                Test Accounts:
              </Typography>
              <Typography variant="caption" component="div">
                Manager: manager@test.com
              </Typography>
              <Typography variant="caption" component="div">
                Password: Test123!
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
