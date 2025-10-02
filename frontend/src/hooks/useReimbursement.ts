/**
 * @file src/hooks/useReimbursement.ts
 * @description custom hook for fetching and managing reimbursements list
 * @module hooks
 * 
 * Resources:
 * @see {@link https://react.dev/reference/react/hooks} - react hooks documentation
 * @see {@link https://www.robinwieruch.de/react-hooks-fetch-data/} - data fetching with hooks
 * @see {@link https://kentcdodds.com/blog/application-state-management-with-react} - state management patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { reimbursementApi } from '../service/reimbursement.api.service';
import type { Reimbursement, ReimbursementStatus } from '../service/reimbursement.api.service';

import { useAuth } from './useAuth';

/**
 * return type for usereimbursements hook
 */
interface UseReimbursementsReturn {
  reimbursements: Reimbursement[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  filterByStatus: (status: ReimbursementStatus | null) => void;
  currentFilter: ReimbursementStatus | null;
}

/**
 * custom hook for fetching user's reimbursements with filtering
 * automatically fetches on mount and provides refresh capability
 * 
 * @returns {UseReimbursementsReturn} reimbursements data and control functions
 * 
 * @example
 * const { reimbursements, isLoading, error, refresh, filterByStatus } = useReimbursements();
 * 
 * // show pending only
 * filterByStatus('PENDING');
 * 
 * // show all
 * filterByStatus(null);
 * 
 * // refresh after creating new
 * await refresh();
 */
export function useReimbursements(): UseReimbursementsReturn {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<ReimbursementStatus | null>(null);
  
  const { user } = useAuth();

  /**
   * fetch reimbursements from api
   * uses current filter if set
   * 
   * @returns {Promise<void>}
   */
  const fetchReimbursements = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('useReimbursements: Fetching reimbursements', currentFilter ? `with filter: ${currentFilter}` : '');
      
      const data = await reimbursementApi.getMy(currentFilter || undefined);
      
      console.log(`useReimbursements: Retrieved ${data.length} reimbursements`);
      setReimbursements(data);
    } catch (err) {
      console.error('useReimbursements: Failed to fetch reimbursements:', err);
      
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
   * useful after creating or updating
   * 
   * @returns {Promise<void>}
   */
  const refresh = async (): Promise<void> => {
    console.log('useReimbursements: Manual refresh triggered');
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
    console.log('useReimbursements: Filtering by status:', status || 'ALL');
    setCurrentFilter(status);
  };

  return {
    reimbursements,
    isLoading,
    error,
    refresh,
    filterByStatus,
    currentFilter
  };
}

// TODO: pagination support for large lists
// TODO: sorting capabilities (date, status, etc)
// TODO: searchability (date, name, id, etc) 
