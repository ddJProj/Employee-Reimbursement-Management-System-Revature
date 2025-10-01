/**
 * @file src/pages/dashboard/restricted/Restricted.tsx
 * @description dashboard for restricted user types who need to request employee access
 * @module Dashboard
 */

import React from 'react';

/**
 * dashboard component for restricted users
 * shows options to request employee role upgrade
 * 
 * @returns {React.ReactElement} restricted dashboard component
 */
function RestrictedDashboard(): React.ReactElement {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Restricted Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Welcome! Your account has restricted access.</p>
        <p>To submit reimbursement requests, you need to request Employee access.</p>
        {/* TODO: add request employee access form */}
        {/* TODO: add status of pending requests */}
      </div>
    </div>
  );
}

export default RestrictedDashboard;
