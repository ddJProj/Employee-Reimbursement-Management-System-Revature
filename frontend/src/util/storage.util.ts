/**
 * @file src/util/storage.util.ts
 * @description utilities for localstorage with versioning, ttl, and error handling
 * @module Utilities
 * 
 * Resources:
 * - localstorage best practices: https://blog.logrocket.com/localstorage-javascript-complete-guide/
 * - storage patterns: https://www.freecodecamp.org/news/how-to-use-localstorage-with-react-hooks-to-set-and-get-items/
 * - ttl implementation: https://www.sohamkamani.com/javascript/localstorage-with-ttl-expiry/
 */

const CURRENT_VERSION = 1;

/**
 * storage item wrapper with metadata
 * includes versioning and optional expiry
 */
interface StorageItem<T> {
  value: T;
  expiry?: number;
  version?: number;
}

/**
 * utility functions for persistent storage w/ safetyy
 * handles versioning, expiry, and storage errors gracefully
 */
export const storageUtils = {
  /**
   * set an item in localstorage with versioning and optional ttl
   * 
   * @param {string} key - storage key
   * @param {T} value - value to store
   * @param {number} ttlMinutes - time-to-live in minutes (optional)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // store auth token for 24 hours
   * storageUtils.set('authToken', token, 1440);
   * 
   * // store user data without expiry
   * storageUtils.set('userData', user);
   * ```
   */
  set<T>(key: string, value: T, ttlMinutes?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        version: CURRENT_VERSION,
        expiry: ttlMinutes
          ? new Date().getTime() + ttlMinutes * 60 * 1000
          : undefined,
      };
      
      localStorage.setItem(key, JSON.stringify(item));
      console.log(`Storage: Set ${key}${ttlMinutes ? ` with ${ttlMinutes}min TTL` : ''}`);
    } catch (error) {
      console.error(`Storage error setting ${key}:`, error);
    }
  },

  /**
   * retrieves an item from storage with version and expiry checks
   * returns default value if item is expired, wrong version, or missing
   * 
   * @param {string} key - storage key
   * @param {T} defaultValue - Default value if retrieval fails
   * @returns {T} stored value or default
   * 
   * @example
   * ```typescript
   * const token = storageUtils.get('authToken', null);
   * const user = storageUtils.get('userData', { name: 'Guest' });
   * ```
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      
      const item: StorageItem<T> = JSON.parse(raw);
      
      // check version
      if (item.version !== CURRENT_VERSION) {
        console.log(`Storage: ${key} version mismatch, clearing`);
        this.remove(key);
        return defaultValue;
      }
      
      // check expiry
      if (item.expiry && item.expiry < new Date().getTime()) {
        console.log(`Storage: ${key} expired, clearing`);
        this.remove(key);
        return defaultValue;
      }
      
      return item.value;
    } catch (error) {
      console.error(`Storage error getting ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * remove an item from storage
   * 
   * @param {string} key - storage key to remove
   * @returns {void}
   */
  remove(key: string): void {
    localStorage.removeItem(key);
    console.log(`Storage: Removed ${key}`);
  },

  /**
   * clear all storage except specified keys
   * useful logout while preserving settings
   * 
   * @param {string[]} preserveKeys - keys to keep
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // clear all auth data but keep user preference
   * storageUtils.clear(['theme', 'language']);
   * ```
   */
  clear(preserveKeys: string[] = []): void {
    const preserved = preserveKeys.reduce<Record<string, string>>((acc, key) => {
      const value = localStorage.getItem(key);
      if (value) acc[key] = value;
      return acc;
    }, {});
    
    localStorage.clear();
    
    Object.entries(preserved).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    console.log(`Storage: Cleared all${preserveKeys.length ? ` except ${preserveKeys.join(', ')}` : ''}`);
  }
};
