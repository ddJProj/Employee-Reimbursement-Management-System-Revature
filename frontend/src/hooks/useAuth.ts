/**
 * @file src/hooks/useAuth.tsx
 * @description 
 * @module Hooks
 * 
 * Resources:
 * @see {} - 
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// short hook to provide authContext 
export function useAuth(){
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Can only apply useAuth within AuthProvider');
  }
  return context;
}
