/**
 * @file src/hooks/useCreateReimbursement.ts
 * @description custom hook for creating new reimbursement requests
 * @module Hooks
 * 
 * Resources:
 * @see {@link https://react.dev/reference/react/hooks} - react hooks documentation
 * @see {@link https://kentcdodds.com/blog/application-state-management-with-react} - state management patterns
 */

import { useState } from 'react';
import { reimbursementApi, Reimbursement, ReimbursementType } from '../service/reimbursement.api.service';

/**
 * form data for creating reimbursement
 */
export interface CreateReimbursementData {
  description: string;
  type: ReimbursementType;
}

/**
 * return type for usecreatereimbursement hook
 */
interface UseCreateReimbursementReturn {
  createReimbursement: (data: CreateReimbursementData) => Promise<Reimbursement | null>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

/**
 * custom hook for creating new reimbursement requests
 * handles loading states, errors, and success feedback
 * 
 * @returns {UseCreateReimbursementReturn} create function and state
 * 
 * @example
 * const { createReimbursement, isLoading, error, success } = useCreateReimbursement();
 * 
 * const handleSubmit = async () => {
 *   const reimbursement = await createReimbursement({
 *     description: 'Client dinner',
 *     type: ReimbursementType.FOOD
 *   });
 *   
 *   if (reimbursement) {
 *     // success - reimbursement created
 *     onRefresh(); // refresh the list
 *   }
 * };
 */
export function useCreateReimbursement(): UseCreateReimbursementReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  /**
   * create new reimbursement request
   * 
   * @param {CreateReimbursementData} data - reimbursement details
   * @returns {Promise<Reimbursement | null>} created reimbursement or null if failed
   */
  const createReimbursement = async (
    data: CreateReimbursementData
  ): Promise<Reimbursement | null> => {
    // validation
    if (!data.description || data.description.trim().length < 10) {
      setError('Description must be at least 10 characters');
      return null;
    }

    if (!data.type) {
      setError('Please select a reimbursement type');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('useCreateReimbursement: Creating reimbursement');
      
      const reimbursement = await reimbursementApi.create({
        description: data.description.trim(),
        type: data.type
      });
      
      console.log('useCreateReimbursement: Reimbursement created successfully');
      setSuccess(true);
      
      return reimbursement;
    } catch (err) {
      console.error('useCreateReimbursement: Failed to create reimbursement:', err);
      
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to create reimbursement. Please try again.';
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * reset hook state (clear error/success messages)
   * useful when closing forms or starting new submission
   * 
   * @returns {void}
   */
  const reset = (): void => {
    setError(null);
    setSuccess(false);
  };

  return {
    createReimbursement,
    isLoading,
    error,
    success,
    reset
  };
}

// TODO: Add validation + sanitization for description length limits?
// TODO: Add support for file attachments (image receipts, etc). 
//       - Just consider how we might implement
//  
