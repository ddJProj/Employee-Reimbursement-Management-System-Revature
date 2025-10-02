/**
 * @file src/pages/dashboard/DashboardRouter.tsx
 * @description dashboard routing component to prevent inf loop
 * @module Dashboard
 * 
 * Resources:
 * @see {@link } - 
 */
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_REDIRECT } from '../../constant/routes.constant';
import RestrictedDashboard from './restricted/Restricted';
import EmployeeDashboard from './employee/Employee';
import ManagerDashboard from './manager/Manager';

function DashboardRouter(): React.ReactElement {
  const { user } = useAuth();
  const navigate = useNavigate();

  // redirect to role-specific dashboard on mount
  useEffect(() => {
    if (user && window.location.pathname === '/dashboard') {
      const redirectPath = ROLE_REDIRECT[user.role];
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="restricted" element={<RestrictedDashboard />} />
      <Route path="employee" element={<EmployeeDashboard />} />
      <Route path="manager" element={<ManagerDashboard />} />
    </Routes>
  );
}

export default DashboardRouter;
