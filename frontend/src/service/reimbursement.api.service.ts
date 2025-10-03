/**
 * @file src/service/reimbursement.api.service.ts
 * @description api service for reimbursement crud operations
 * @module service(s)
 * 
 * Resources:
 * @see {@link https://axios-http.com/docs/intro} - axios documentation
 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example} - typescript patterns
 * @see {@link https://www.robinwieruch.de/react-hooks-fetch-data/} - data fetching patterns
 */
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api.config';

/**
 * base api configuration
 */
/** const API_BASE_URL = '/api'; */

/**
 * reimbursement type - backend defines: FOOD, AIRLINE, GAS, HOTEL, SUPPLIES, OTHER
 * using string type to match backend enum values
 */
export type ReimbursementType = 'FOOD' | 'AIRLINE' | 'GAS' | 'HOTEL' | 'SUPPLIES' | 'OTHER';

/**
 * reimbursement status - backend defines values PENDING, APPROVED, DENIED
 * string type to match backend enum values
 */
export type ReimbursementStatus = 'PENDING' | 'APPROVED' | 'DENIED';

/**
 * reimbursement data structure matching backend ReimbursementResponseDTO
 */
export interface Reimbursement {
  id: number;
  userId: number;
  userEmail: string;
  description: string;
  type: ReimbursementType;
  status: ReimbursementStatus;
}

/**
 * request payload for creating reimbursement
 * matches backend CreateReimbursementDTO
 */
interface CreateReimbursementRequest {
  description: string;
  type: ReimbursementType;
}

/**
 * request payload for resolving reimbursement (manager only)
 * matches backend ResolveReimbursementDTO
 */
interface ResolveReimbursementRequest {
  status: ReimbursementStatus;
  comment?: string;
}

/**
 * api error response structure
 */
interface ApiErrorResponse {
  error: string;
  status: number;
}

/**
 * reimbursement api service for CRUD operations
 */
export const reimbursementApi = {
  /**
   * create new reimbursement request
   * 
   * @param {CreateReimbursementRequest} data reimbursement details
   * @returns {Promise<Reimbursement>} created reimbursement
   * @throws {Error} if creation fails
   * 
   * @example
   * const newReimbursement = await reimbursementApi.create({
   *   description: 'Client dinner at restaurant', // example descr
   *   type: ReimbursementType.FOOD
   * });
   */
  async create(data: CreateReimbursementRequest): Promise<Reimbursement> {
    try {
      console.log('Creating reimbursement:', data);
      
      const response = await axios.post<Reimbursement>(
        `${API_BASE_URL}/reimbursements`,
        data
      );
      
      console.log('Reimbursement created successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to create reimbursement:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to create reimbursement';
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * get current user's reimbursements
   * 
   * @param {ReimbursementStatus} status - optional status filter
   * @returns {Promise<Reimbursement[]>} list of user's reimbursements
   * @throws {Error} if request fails
   * 
   * @example
   * // get all reimbursements
   * const all = await reimbursementApi.getMy();
   * 
   * // get only pending
   * const pending = await reimbursementApi.getMy(ReimbursementStatus.PENDING);
   */
  async getMy(status?: ReimbursementStatus): Promise<Reimbursement[]> {
    try {
      console.log('Fetching my reimbursements', status ? `with status: ${status}` : '');
      
      const params = status ? { status } : {};
      const response = await axios.get<Reimbursement[]>(
        `${API_BASE_URL}/reimbursements/self`,
        { params }
      );
      
      console.log(`Retrieved ${response.data.length} reimbursements`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reimbursements:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to fetch reimbursements';
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * get all reimbursements (manager only)
   * 
   * @param {ReimbursementStatus} status - optional status filter
   * @returns {Promise<Reimbursement[]>} list of all reimbursements
   * @throws {Error} if request fails or unauthorized
   */
  async getAll(status?: ReimbursementStatus): Promise<Reimbursement[]> {
    try {
      console.log('Fetching all reimbursements', status ? `with status: ${status}` : '');
      
      const params = status ? { status } : {};
      const response = await axios.get<Reimbursement[]>(
        `${API_BASE_URL}/reimbursements`,
        { params }
      );
      
      console.log(`Retrieved ${response.data.length} reimbursements`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all reimbursements:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to fetch reimbursements';
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * get single reimbursement by id
   * 
   * @param {number} id - reimbursement id
   * @returns {Promise<Reimbursement>} reimbursement details
   * @throws {Error} if not found or unauthorized
   */
  async getById(id: number): Promise<Reimbursement> {
    try {
      console.log('Fetching reimbursement:', id);
      
      const response = await axios.get<Reimbursement>(
        `${API_BASE_URL}/reimbursements/${id}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reimbursement:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to fetch reimbursement';
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * update reimbursement (only if pending)
   * 
   * @param {number} id - reimbursement id
   * @param {CreateReimbursementRequest} data - updated details
   * @returns {Promise<Reimbursement>} updated reimbursement
   * @throws {Error} if update fails or not allowed
   */
  async update(id: number, data: CreateReimbursementRequest): Promise<Reimbursement> {
    try {
      console.log('Updating reimbursement:', id);
      
      const response = await axios.put<Reimbursement>(
        `${API_BASE_URL}/reimbursements/${id}`,
        data
      );
      
      console.log('Reimbursement updated successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to update reimbursement:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to update reimbursement';
        
        if (message.includes('pending')) {
          throw new Error('Can only edit pending reimbursements');
        }
        
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  },

  /**
   * resolve reimbursement - approve or deny (manager only)
   * 
   * @param {number} id - reimbursement id
   * @param {ResolveReimbursementRequest} data -- resolution details
   * @returns {Promise<Reimbursement>} resolved reimbursement
   * @throws {Error} if resolution fails or unauthorized
   * 
   * @example
   * // approve reimbursement
   * await reimbursementApi.resolve(123, {
   *   status: ReimbursementStatus.APPROVED
   * });
   * 
   * // deny with comment
   * await reimbursementApi.resolve(123, {
   *   status: ReimbursementStatus.DENIED,
   *   comment: 'Receipt missing required information'
   * });
   */
  async resolve(id: number, data: ResolveReimbursementRequest): Promise<Reimbursement> {
    try {
      console.log('Resolving reimbursement:', id, data.status);
      
      const response = await axios.put<Reimbursement>(
        `${API_BASE_URL}/reimbursements/${id}/resolve`,
        data
      );
      
      console.log('Reimbursement resolved successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to resolve reimbursement:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.error || 'Failed to resolve reimbursement';
        
        if (message.includes('Only managers')) {
          throw new Error('Only managers can resolve reimbursements');
        }
        if (message.includes('pending')) {
          throw new Error('Can only resolve pending reimbursements');
        }
        
        throw new Error(message);
      }
      
      throw new Error('Network error. Please try again.');
    }
  }
};
/**
 * TODO: 
 *
 */
