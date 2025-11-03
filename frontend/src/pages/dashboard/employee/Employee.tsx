/**
 * @file src/pages/dashboard/employee/Employee.tsx
 * @description employee dashboard with reimbursement management
 * @module dashboard
 * 
 * Resources:
 * @see {@link https://react.dev/learn/you-might-not-need-an-effect} - effect best practices
 * @see {@link https://www.robinwieruch.de/react-hooks-fetch-data/} - data fetching patterns
 *

 */

import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { useAuth } from '../../../hooks/useAuth';
import { useReimbursements } from '../../../hooks/useReimbursement';
import { useCreateReimbursement } from '../../../hooks/useCreateReimbursement';
import type { CreateReimbursementData } from '../../../hooks/useCreateReimbursement';
import type { Reimbursement, ReimbursementType, ReimbursementStatus } from '../../../service/reimbursement.api.service';

/**
 * employee dashboard component
 * displays user's reimbursements with filtering and create functionality
 * 
 * @returns {React.ReactElement} employee dashboard
 */
function EmployeeDashboard(): React.ReactElement {
  const { user } = useAuth();
  const { 
    reimbursements, 
    isLoading, 
    error, 
    refresh, 
    filterByStatus, 
    currentFilter 
  } = useReimbursements();
  
  const {
    createReimbursement,
    isLoading: isCreating,
    error: createError,
    reset: resetCreate
  } = useCreateReimbursement();

  // form state
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');  // Empty initially for better UX
  const [type, setType] = useState<ReimbursementType>('OTHER');

  /**
   * handle create form submission
   * 
   * @param {React.FormEvent} e - form event
   * @returns {Promise<void>}
   */
  const handleCreateSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const data: CreateReimbursementData = {
      description,
      amount: typeof amount === 'number' ? amount : Number(amount),
      type
    };

    const result = await createReimbursement(data);

    if (result) {
      // success - clear form and refresh list
      setDescription('');
      setAmount('');
      setType('OTHER');
      setShowCreateForm(false);
      await refresh();
    }
  };

  /**
   * cancel create form
   * 
   * @returns {void}
   */
  const handleCancelCreate = (): void => {
    setDescription('');
    setAmount('');
    setType('OTHER');
    setShowCreateForm(false);
    resetCreate();
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
          Employee Dashboard
        </h1>

        {/* welcome message */}
        <p style={{ marginBottom: '20px' }}>
          Welcome, {user?.email}!
        </p>

        {/* action buttons */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {showCreateForm ? 'Cancel' : 'Create New Reimbursement'}
          </button>

          {/* filter buttons */}
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

        {/* create form */}
        {showCreateForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              Create New Reimbursement
            </h2>

            {createError && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
                  Description (minimum 10 characters):
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  disabled={isCreating}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  placeholder="Describe your reimbursement request..."
                />
              </div>


              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="amount" style={{ display: 'block', marginBottom: '5px' }}>
                  Amount ($ amount to be reimbursed):
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                  disabled={isCreating}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  placeholder="Enter amount (e.g., 50.00)"
                />
              </div>



              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="type" style={{ display: 'block', marginBottom: '5px' }}>
                  Type:
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as ReimbursementType)}
                  required
                  disabled={isCreating}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                >
                  <option value="FOOD">Food</option>
                  <option value="AIRLINE">Airline</option>
                  <option value="GAS">Gas</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="SUPPLIES">Supplies</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  {isCreating ? 'Creating...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  disabled={isCreating}
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
              </div>
            </form>
          </div>
        )}

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
              Your Reimbursements ({reimbursements.length})
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
                    : 'No reimbursements yet. Create your first one above!'}
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
                    <div style={{ marginBottom: '10px' }}>
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

                    <p style={{ marginBottom: '10px', color: '#333' }}>
                      {reimbursement.description}
                    </p>

                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>
                      Amount: ${reimbursement.amount.toFixed(2)}
                    </p>

                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Request ID: #{reimbursement.id}
                    </p>

                    {/* TODO: add edit button for pending / open reimbursements - future */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EmployeeDashboard;

// TODO: edit functionality for pending reimbursements
// TODO: sorting options (by date, status, type)
// TODO: REDO inline styles with Tailwind CSS  - ONCE FUNCTIONALITY IS COMPLETELY DONE
