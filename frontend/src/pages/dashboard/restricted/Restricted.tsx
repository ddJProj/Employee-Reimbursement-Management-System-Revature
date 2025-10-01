/**
 * @file src/pages/dashboard/restricted/Restricted.tsx
 * @description dashboard for restricted user types who need to request employee access
 * @module Dashboard
 */

import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useUpgradeRequest } from '../../../hooks/useUpgradeRequest';

/**
 * dashboard component for restricted users
 * shows welcome message and option to request employee role upgrade
 * displays success/error messages for upgrade request
 * 
 * @returns {React.ReactElement} restricted dashboard component
 */
function RestrictedDashboard(): React.ReactElement {
  const { user } = useAuth();
  const { requestUpgrade, isLoading, error, success } = useUpgradeRequest();

  /**
   * handles click on request access button
   * calls upgrade request hook
   * 
   * @returns {Promise<void>}
   */
  const handleRequestAccess = async (): Promise<void> => {
    console.log('User requesting employee access');
    await requestUpgrade();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Restricted Dashboard</h1>
      
      {/* welcome message */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Welcome, {user?.email}!
        </h2>
        <p className="text-gray-600 mb-4">
          Your account currently has restricted access.
        </p>
        <p className="text-gray-600 mb-6">
          To submit and manage reimbursement requests, you need to request Employee access.
        </p>
        
        {/* success message (do we need?) */}
        {success && (
          <div 
            role="alert" 
            className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
          >
            <p className="font-semibold">Success!</p>
            <p>Your account has been upgraded to Employee.</p>
            <p>Redirecting to Employee dashboard...</p>
          </div>
        )}
        
        {/* error message */}
        {error && (
          <div 
            role="alert" 
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {/* request access button */}
        {!success && (
          <button
            onClick={handleRequestAccess}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Request Employee Access'}
          </button>
        )}
      </div>
      
      {/* information card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">
          What is Employee Access?
        </h3>
        <p className="text-blue-800 mb-3">
          Employee access allows you to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-blue-800">
          <li>Submit reimbursement requests</li>
          <li>View all your reimbursement tickets</li>
          <li>Edit pending reimbursements</li>
          <li>Track approval status</li>
        </ul>
        <p className="text-blue-800 mt-4 text-sm">
          Note: Your request will be processed automatically and you'll be redirected to the Employee dashboard.
        </p>
      </div>
      
      {/* development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>Dev Info:</strong> Current role: {user?.role}
          </p>
          <p className="text-sm text-gray-600">
            Permissions: {user?.permissions.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

export default RestrictedDashboard;
