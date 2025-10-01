/**
 * @file src/components/layout/Layout.tsx
 * @description main layout wrapper w/ sidebar nav
 * @module Layout
 * 
 * Resources:
 * @see {@link https://web.dev/patterns/layout/sidebar-says/} - sidebar layout patterns
 * @see {@link https://www.joshwcomeau.com/react/div-html-semantics/} - semantic html in react
 * @see {@link https://ishadeed.com/article/layout-wrappers-css/} - layout wrapper patterns
 */

import React from 'react';
import Sidebar from '../navigation/Sidebar';
import { useAuth } from '../../hooks/useAuth';

/**
 * props for layout component
 */
interface LayoutProps {
  /** child components to render in main content area */
  children: React.ReactNode;
}

/**
 * main layout component that wraps pages with sidebar navigation
 * only shows sidebar for authenticated users
 * provides consistent page structure
 * 
 * @param {LayoutProps} props - component props
 * @returns {React.ReactElement} layout wrapper with sidebar
 */
function Layout({ children }: LayoutProps): React.ReactElement {
  const { isAuthenticated, isLoading } = useAuth();
  
  // show loading state during auth check
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  // for unauthenticated users, just render children (login/register pages)
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh' }}>
        {children}
      </div>
    );
  }
  
  // for authenticated users, show sidebar layout
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* sidebar navigation */}
      <Sidebar />
      
      {/* main content area */}
      <main style={{ 
        flex: 1, 
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;

