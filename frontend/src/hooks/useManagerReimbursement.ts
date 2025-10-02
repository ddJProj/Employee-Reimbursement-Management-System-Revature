/**
 * @file src/hooks/useManagerReimbursements.ts
 * @description custom hook for manager operations on reimbursements
 * @module Hooks
 * 
 * Resources:
 * @see {@link https://react.dev/reference/react/hooks} - react hooks documentation
 * @see {@link https://kentcdodds.com/blog/application-state-management-with-react} - state management patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { reimbursementApi } from '../service/reimbursement.api.service';
import type { Reimbursement, ReimbursementStatus } from '../service/reimbursement.api.service';


import { useAuth } from './useAuth';

/**
 * return type for usemanagerreimbursements hook
 */
interface UseManagerReimbursementsReturn {
  reimbursements: Reimbursement[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  filterByStatus: (status: ReimbursementStatus | null) => void;
  currentFilter: ReimbursementStatus | null;
  resolveReimbursement: (id: number, status: ReimbursementStatus, comment?: string) => Promise<boolean>;
  isResolving: boolean;
  resolveError: string | null;
}

/**
 * custom hook for manager reimbursement operations
 * fetches ALL reimbursements and provides resolve capability
 * 
 * @returns {UseManagerReimbursementsReturn} manager operations and state
 * 
 * @example
 * const { 
 *   reimbursements, 
 *   isLoading, 
 *   resolveReimbursement 
 * } = useManagerReimbursements();
 * 
 * // approve reimbursement
 * await resolveReimbursement(123, 'APPROVED');
 * 
 * // deny with comment
 * await resolveReimbursement(123, 'DENIED', 'Missing receipt');
 */
export function useManagerReimbursements(): UseManagerReimbursementsReturn {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<ReimbursementStatus | null>(null);
  
  // separate state for resolve operation
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  
  const { user } = useAuth();

  /**
   * fetch all reimbursements from api (manager only)
   * uses current filter if set
   * 
   * @returns {Promise<void>}
   */
  const fetchReimbursements = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('useManagerReimbursements: Fetching all reimbursements', 
        currentFilter ? `with filter: ${currentFilter}` : '');
      
      const data = await reimbursementApi.getAll(currentFilter || undefined);
      
      console.log(`useManagerReimbursements: Retrieved ${data.length} reimbursements`);
      setReimbursements(data);
    } catch (err) {
      console.error('useManagerReimbursements: Failed to fetch reimbursements:', err);
      
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load reimbursements. Please try again.';
      
      setError(errorMessage);
      setReimbursements([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilter]);

  /**
   * fetch reimbursements on mount and when filter changes
   */
  useEffect(() => {
    if (user) {
      fetchReimbursements();
    }
  }, [user, fetchReimbursements]);

  /**
   * manually refresh reimbursements list
   * useful after resolving requests
   * 
   * @returns {Promise<void>}
   */
  const refresh = async (): Promise<void> => {
    console.log('useManagerReimbursements: Manual refresh triggered');
    await fetchReimbursements();
  };

  /**
   * filter reimbursements by status
   * pass null to show all
   * 
   * @param {ReimbursementStatus | null} status - status to filter by
   * @returns {void}
   */
  const filterByStatus = (status: ReimbursementStatus | null): void => {
    console.log('useManagerReimbursements: Filtering by status:', status || 'ALL');
    setCurrentFilter(status);
  };

  /**
   * approve or deny a reimbursement request
   * only works on pending reimbursements
   * 
   * @param {number} id - reimbursement id
   * @param {ReimbursementStatus} status - 'APPROVED' or 'DENIED'
   * @param {string} comment - optional comment (recommended for denials)
   * @returns {Promise<boolean>} true if successful, false otherwise
   */
  const resolveReimbursement = async (
    id: number,
    status: ReimbursementStatus,
    comment?: string
  ): Promise<boolean> => {
    // validation
    if (status !== 'APPROVED' && status !== 'DENIED') {
      setResolveError('Status must be APPROVED or DENIED');
      return false;
    }

    setIsResolving(true);
    setResolveError(null);

    try {
      console.log(`useManagerReimbursements: Resolving reimbursement ${id} as ${status}`);
      
      await reimbursementApi.resolve(id, { status, comment });
      
      console.log('useManagerReimbursements: Resolution successful');
      
      // refresh the list to show updated status
      await fetchReimbursements();
      
      return true;
    } catch (err) {
      console.error('useManagerReimbursements: Failed to resolve reimbursement:', err);
      
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to resolve reimbursement. Please try again.';
      
      setResolveError(errorMessage);
      return false;
    } finally {
      setIsResolving(false);
    }
  };

  return {
    reimbursements,
    isLoading,
    error,
    refresh,
    filterByStatus,
    currentFilter,
    resolveReimbursement,
    isResolving,
    resolveError
  };
}

// TODO: Add bulk approval/denial for multiple reimbursements
// TODO: Add manager comment history viewing
