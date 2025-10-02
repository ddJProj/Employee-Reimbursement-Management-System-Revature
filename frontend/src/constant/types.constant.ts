/**
 * @file src/constants/types.constant.ts
 * @description 
 * @module constant
 * 
 * Resources:
 * @see {@link } -
 */

/**
 * changed to const obj from enum for type safety
 */
export const RoleType = {
	Manager : 'MANAGER',
	Employee : 'EMPLOYEE',
	Restricted : 'RESTRICTED',
	Guest : 'GUEST',
} as const;

export type RoleType = typeof RoleType[keyof typeof RoleType];

/**
 * UserAccount representation interface
 */
export interface UserAccount {
	userId: number; // userAccount Id
	email: string;
	role: RoleType;
	permissions: string[]; //
}

/**
 * type alias for permissions
 */
export type Permission = string; 
