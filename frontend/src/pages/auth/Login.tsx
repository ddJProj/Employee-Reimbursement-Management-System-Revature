/**
 * @file src/pages/auth/Login.tsx
 * @description Login form component for user authentication
 * @module Authentication
 */

import React, { useState } from "react";
import {Link} from 'react-router-dom';


// https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

/**
 * login component with forms for user authentication
 * retrieves input email and password 
 * 
 * @returns {React.ReactElement} login form component
 */
function Login() : React.ReactElement{

	const [email, setEmail] = useState<string>('');
	const [password, setPassword]	= useState<string>('');

	/**
		* manage form submission / log input
		*
		*/
	const handleSubmit = (ev: React.FormEvent<HTMLElement>): void => {
		ev.preventDefault();

		console.log('login sumbission:', {
			email,
			password: 'notpassword' // not actually logging
		});

/** 
 *
 * TODO : 
 * - link to authContext
 * - add api call to api/auth/login
 * - handle errors / response
 *
 *
 */

  /**
   * on change, update email state 
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} ev - change event (input)
   * @returns {void}
   */
  const handleEmailChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(ev.target.value);
  };

  /**
   * on change (input) update password state
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} ev - change event
   * @returns {void}
   */
  const handlePasswordChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(ev.target.value);
  };

  return (
    <div>
      <h2>Login</h2>
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
          />
        </div>
        
        <button type="submit">Login</button>
      </form>
      
      <p>
        Don't have an account? <Link to="/auth/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
