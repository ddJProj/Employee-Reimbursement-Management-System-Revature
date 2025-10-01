/**
 * @file src/util/auth.util.ts
 * @description util for auth functionality w/ jwt tokens
 * @module Services
 */
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp?: number;
}

const AUTH_KEYS = {
  ACCESS_TOKEN: "authToken",
  USER: "authUser",
};

export const authUtils = {
  /**
   * Stores tokens and user data in storage.
   * @param token - Authentication token
   * @param user - User data
   */
  setAuthData(token: string, user: Record<string, any>): void {
    try {
      // use localStorage instead of sessionStorage persistence
      localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
      console.log("Auth data stored successfully:", { tokenSaved: !!token, userSaved: !!user });
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  },


  /**
   * retrieves the stored token.
   * @returns The stored token or null
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
  },

  /**
   * retrieves the stored user data.
   * @returns User data object or null
   */
  getUser(): Record<string, any> | null {
    try {
      const user = localStorage.getItem(AUTH_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  /**
   * clears all authentication data from storage.
   */
  clearAuthData(): void {
    console.log("Clearing auth data");
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);
  },

  /**
   * check if the stored token is valid and not expired.
   * @returns whether the token is valid
   */
// In auth.util.ts, modify isAuthenticated()
isAuthenticated(): boolean {
  const token = this.getToken();
  console.log("Is authenticated check - token located: ", !!token);
  
  if (!token) return false;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    console.log("Token decoded successfully", decoded);
    
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    const isValid = exp ? exp > now : false;
    
    console.log("Token validation:", {
      expiry: exp ? new Date(exp * 1000).toISOString() : 'none',
      currentTime: new Date(now * 1000).toISOString(),
      isValid
    });
    
    return isValid;
  } catch (error) {
    console.error("Token decode error:", error);
    // Don't clear token on decode error
    return false;
  }
},


  /**
   * Refreshes the token if close to expiration.
   * @param thresholdMinutes - Minutes before expiration to refresh
   * @returns Whether a refresh is required
   */
  needsRefresh(thresholdMinutes = 5): boolean {
    const token = this.getToken();
    if (!token) return false;

    const { exp } = jwtDecode<TokenPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp ? exp - currentTime < thresholdMinutes * 60 : false;
  },

};
