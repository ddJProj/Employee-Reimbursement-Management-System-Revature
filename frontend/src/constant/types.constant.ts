/**
 * @file src/constants/types.constant.ts
 * @description 
 * @module constant
 * 
 * Resources:
 * @see {@link } -
 */
export enum RoleType {
	Manager = 'MANAGER',
	Employee = 'EMPLOYEE',
	Restricted = 'RESTRICTED',
	Guest = 'GUEST',
};

export interface UserAccount {
	userId: number; // userAccount Id
	email: string;
	role: RoleType;
	permissions: string[]; //
}


export type Permission = string; 
