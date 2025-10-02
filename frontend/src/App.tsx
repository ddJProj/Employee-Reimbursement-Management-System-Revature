/**
 * Primary App Container -
 * This is the entry point/core application container for the application
 *
 * @file /src/App.tsx
 * @description - the root application structure all components are rendered within
 *
 * @returns {React.ReactElement} full application
 * 
 * @see {@link https://reactrouter.com/en/main/start/tutorial} - router documentation
 * @see {@link https://react.dev/learn/passing-data-deeply-with-context} - context pattern
 * @see {@link https://jsdoc.app/tags.html} - 
 * @see {@link https://google.github.io/styleguide/tsguide.html#comments} - 
 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/#documenting-components} -
 *
 * @author ddjProj
 * @created
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Registration from './pages/auth/Registration';
import { ROUTES } from './constant/routes.constant';
import DashboardRouter from './pages/dashboard/DashboardRouter';

function App(): React.ReactElement {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          /** public routes */
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Registration />} />
          
          {/* all dashboard routes handled by dashboardrouter */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
