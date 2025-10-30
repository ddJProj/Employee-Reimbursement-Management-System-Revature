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
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Collapse,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../service/auth.api.service';
import { ROUTES, ROLE_REDIRECT } from '../../constant/routes.constant';
import type { RoleType } from '../../constant/types.constant';

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
    console.log('Registration: Checking auth state', { isAuthenticated, user: user?.email });
    if (isAuthenticated && user) {
      console.log('User already authenticated, redirecting to dashboard');
      const redirectPath = ROLE_REDIRECT[user.role as RoleType] || ROUTES.DASHBOARD;
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath, {replace:true});
    }
  }, []);

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
    <Box
      className="flex items-center justify-center min-h-screen bg-gray-50"
      sx={{ p: 2 }}
    >
      <Card
        sx={{
          maxWidth: 500,
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
            Create Account
          </Typography>

          {/* display error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
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
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              placeholder="Create a password"
              required
              disabled={isLoading}
              autoComplete="new-password"
              margin="normal"
              variant="outlined"
            />

            {/* password requirements hint */}
            <Collapse in={showPasswordRequirements}>
              <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Password must contain:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ py: 0, px: 0 }}>
                    <ListItemText
                      primary="At least 8 characters"
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0, px: 0 }}>
                    <ListItemText
                      primary="One uppercase letter"
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0, px: 0 }}>
                    <ListItemText
                      primary="One lowercase letter"
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0, px: 0 }}>
                    <ListItemText
                      primary="One number"
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0, px: 0 }}>
                    <ListItemText
                      primary="One special character (@#$%^&+=!)"
                      primaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                </List>
              </Alert>
            </Collapse>

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              autoComplete="new-password"
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
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </Box>

          <Typography align="center" variant="body2" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <MuiLink component={Link} to={ROUTES.LOGIN} underline="hover">
              Login here
            </MuiLink>
          </Typography>

          {/* information about default role */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="caption" component="div">
              <strong>Note:</strong> New accounts start with restricted access.
            </Typography>
            <Typography variant="caption" component="div">
              Request employee access after registration.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Registration;
