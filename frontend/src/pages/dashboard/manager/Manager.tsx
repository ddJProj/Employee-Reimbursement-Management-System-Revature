/**
 * @file src/pages/dashboard/manager/Manager.tsx
 * @description manager dashboard with reimbursement approval/denial
 * @module Dashboard
 * 
 * Resources:
 * @see {@link https://react.dev/learn/conditional-rendering} - conditional rendering patterns
 * @see {@link https://www.robinwieruch.de/react-component-composition/} - component composition
 * @see {@link https://dev.to/chintanonweb/from-zero-to-hero-building-a-scalable-react-admin-dashboard-layout-53p9} - conditional rendering patterns
 */

import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { useAuth } from '../../../hooks/useAuth';
import { useManagerReimbursements } from '../../../hooks/useManagerReimbursement';
import type { Reimbursement, ReimbursementStatus } from '../../../service/reimbursement.api.service';

/**
 * manager dashboard component
 * displays all reimbursements with approve/deny functionality
 * 
 * @returns {React.ReactElement} manager dashboard
 */
function ManagerDashboard(): React.ReactElement {
  const { user } = useAuth();
  const {
    reimbursements,
    isLoading,
    error,
    filterByStatus,
    currentFilter,
    resolveReimbursement,
    isResolving,
    resolveError
  } = useManagerReimbursements();

  // state for resolve modal
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<ReimbursementStatus>('APPROVED');
  const [comment, setComment] = useState<string>('');
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);

  /**
   * open resolve modal for a reimbursement
   * 
   * @param {Reimbursement} reimbursement - reimbursement to resolve
   * @param {ReimbursementStatus} status - initial status (APPROVED or DENIED)
   * @returns {void}
   */
  const handleOpenResolve = (reimbursement: Reimbursement, status: ReimbursementStatus): void => {
    setSelectedReimbursement(reimbursement);
    setResolutionStatus(status);
    setComment('');
    setShowResolveModal(true);
  };

  /**
   * close resolve modal
   * 
   * @returns {void}
   */
  const handleCloseResolve = (): void => {
    setSelectedReimbursement(null);
    setResolutionStatus('APPROVED');
    setComment('');
    setShowResolveModal(false);
  };

  /**
   * submit resolution decision
   * 
   * @returns {Promise<void>}
   */
  const handleSubmitResolution = async (): Promise<void> => {
    if (!selectedReimbursement) return;

    const success = await resolveReimbursement(
      selectedReimbursement.id,
      resolutionStatus,
      comment || undefined
    );

    if (success) {
      handleCloseResolve();
    }
  };

  /**
   * get status badge color
   * 
   * @param {ReimbursementStatus} status - reimbursement status
   * @returns {string} css color class
   */
  const getStatusColor = (status: ReimbursementStatus): string => {
    switch (status) {
      case 'PENDING':
        return 'yellow';
      case 'APPROVED':
        return 'green';
      case 'DENIED':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Manager Dashboard
        </h1>

        {/* welcome message */}
        <p style={{ marginBottom: '20px' }}>
          Welcome, {user?.email}!
        </p>

        {/* filter buttons */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => filterByStatus(null)}
            style={{
              padding: '10px 20px',
              backgroundColor: currentFilter === null ? '#0056b3' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            All
          </button>
          <button
            onClick={() => filterByStatus('PENDING')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentFilter === 'PENDING' ? '#0056b3' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Pending
          </button>
          <button
            onClick={() => filterByStatus('APPROVED')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentFilter === 'APPROVED' ? '#0056b3' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Approved
          </button>
          <button
            onClick={() => filterByStatus('DENIED')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentFilter === 'DENIED' ? '#0056b3' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Denied
          </button>
        </div>

        {/* loading state */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading reimbursements...
          </div>
        )}

        {/* error state */}
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* reimbursements list */}
        {!isLoading && !error && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              All Reimbursements ({reimbursements.length})
            </h2>

            {reimbursements.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                padding: '40px',
                textAlign: 'center',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <p style={{ color: '#666' }}>
                  {currentFilter
                    ? `No ${currentFilter.toLowerCase()} reimbursements found.`
                    : 'No reimbursements in the system yet.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {reimbursements.map((reimbursement: Reimbursement) => (
                  <div
                    key={reimbursement.id}
                    style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* header with status and employee info */}
                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            backgroundColor:
                              getStatusColor(reimbursement.status) === 'yellow' ? '#fff3cd' :
                              getStatusColor(reimbursement.status) === 'green' ? '#d4edda' :
                              getStatusColor(reimbursement.status) === 'red' ? '#f8d7da' : '#e9ecef',
                            color:
                              getStatusColor(reimbursement.status) === 'yellow' ? '#856404' :
                              getStatusColor(reimbursement.status) === 'green' ? '#155724' :
                              getStatusColor(reimbursement.status) === 'red' ? '#721c24' : '#666'
                          }}
                        >
                          {reimbursement.status}
                        </span>
                        <span style={{ marginLeft: '10px', color: '#666' }}>
                          {reimbursement.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Employee: <strong>{reimbursement.userEmail}</strong>
                      </div>
                    </div>

                    {/* description */}
                    <p style={{ marginBottom: '10px', color: '#333' }}>
                      {reimbursement.description}
                    </p>

                    {/* amount */}
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>
                      Amount: ${reimbursement.amount.toFixed(2)}
                    </p>

                    {/* footer with actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                        Request ID: #{reimbursement.id}
                      </p>

                      {/* action buttons for pending reimbursements */}
                      {reimbursement.status === 'PENDING' && (
                        <div>
                          <button
                            onClick={() => handleOpenResolve(reimbursement, 'APPROVED')}
                            disabled={isResolving}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginRight: '10px'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenResolve(reimbursement, 'DENIED')}
                            disabled={isResolving}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* resolve modal */}
        {showResolveModal && selectedReimbursement && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                {resolutionStatus === 'APPROVED' ? 'Approve' : 'Deny'} Reimbursement
              </h2>

              {/* reimbursement details */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '5px' }}>
                  <strong>Employee:</strong> {selectedReimbursement.userEmail}
                </p>
                <p style={{ marginBottom: '5px' }}>
                  <strong>Type:</strong> {selectedReimbursement.type}
                </p>
                <p style={{ marginBottom: '5px' }}>
                  <strong>Amount:</strong> <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>${selectedReimbursement.amount.toFixed(2)}</span>
                </p>
                <p style={{ marginBottom: '5px' }}>
                  <strong>Description:</strong> {selectedReimbursement.description}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Request ID:</strong> #{selectedReimbursement.id}
                </p>
              </div>

              {/* resolve error */}
              {resolveError && (
                <div style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}>
                  {resolveError}
                </div>
              )}

              {/* comment field */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="comment" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Comment {resolutionStatus === 'DENIED' ? '(recommended)' : '(optional)'}:
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  disabled={isResolving}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  placeholder="Add a comment about your decision..."
                />
              </div>

              {/* action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={handleCloseResolve}
                  disabled={isResolving}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResolution}
                  disabled={isResolving}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: resolutionStatus === 'APPROVED' ? '#28a745' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isResolving ? 'Processing...' : `Confirm ${resolutionStatus === 'APPROVED' ? 'Approval' : 'Denial'}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ManagerDashboard;

// TODO: sorting options (by date, employee, status)
// TODO: search by email, id, etc
// TODO: REDO inline styles with Tailwind CSS  - ONCE FUNCTIONALITY IS COMPLETELY DONE
