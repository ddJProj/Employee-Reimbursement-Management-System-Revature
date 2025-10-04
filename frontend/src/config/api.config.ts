/**
 * @file src/config/api.config.ts
 * @description api configuration with environment-based urls
 * @module config
 * 
 * resources:
 * @see {@link https://vitejs.dev/guide/env-and-mode.html} - vite environment variables
 */

/**
 * base api url determined by environment.
 * development: uses vite proxy (/api -> http://localhost:8080)
 * Production: uses ec2 public ip directly
 */
export const API_BASE_URL: string = 'http://18.217.219.201:8080/api';

//export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * log current api configuration (development only)
 */
// if (import.meta.env.DEV) {
//   console.log('API Base URL:', API_BASE_URL);
// }
