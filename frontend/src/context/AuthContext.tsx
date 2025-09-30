/**
 * @file src/context/AuthContext.tsx
 * @description Global authentication state management using React Context API
 * @module Authentication
 *
 * References:
 * @see {@link https://marmelab.com/react-admin/AuthProviderWriting.html} - 
 * @see {@link https://www.dhiwise.com/post/how-authprovider-enhances-user-authentication-in-react} - 
 * @see {@link https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5} - 
 * @see {@link https://marmelab.com/react-admin/Authentication.html} - 
 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/} - 
 * @see {@link https://react.dev/learn/reusing-logic-with-custom-hooks} - 
 * @see {@link https://react.dev/learn/passing-data-deeply-with-context} - 
 *
 *
 * @see {@link } - 
 *
 */


import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserAccount, RoleType } from '../constant/types.constant';


/**
* structure of our auth context type 
*/
interface AuthContextType {
  /**  current user or null (default no auth session) */
  user: UserAccount | null;
  /** jwt token for auth with backend */
  token: string | null;
  /** fn to authorize a user session */
  login: (token: string, user: UserAccount) => void;
  /** fn to deauth the current user session */
  logout: () => void;
  /** bool : if user is authenticated in system */
  isAuthenticated: boolean;
}

/** context w/ default value */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * distributes authentication state the application
 * 
 * @param {ReactNode} children - child components
 * @returns {React.ReactElement<AuthContextType>'} provider with auth context
 */
export function AuthProvider({children}:{children: ReactNode}) : React.ReactElement<AuthContextType> {

  // state of current user / token
  const [user, setUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /**
   * handles login, stores user & token on auth success 
   * 
   * @param {string} newToken - JWT token from backend
   * @param {UserAccount} newUser - User account data
   * @returns {void}
   */
  const login = (newToken: string, newUser: UserAccount) => {
    setToken(newToken);
    setUser(newUser);
    console.log('The following user logged in: ', newUser.email);

  };

  /**
   * handle logout, remove stored token/user /clears auth session
   * @returns {void}
   */
  const logout = ()=> {
    setToken(null);
    setUser(null);
    console.log('The user has logged out of the system.');
  };

  /** requires valid user and valid token to = valid auth state */
  const isAuthenticated = !!token && !!user;  // valid token / user?

  /** explicit context value to be passed */
  const authValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={authValue}>
    {children}
    </AuthContext.Provider>
  );

}










