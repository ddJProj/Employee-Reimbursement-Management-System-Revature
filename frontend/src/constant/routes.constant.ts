/**
 * @file src/constants/routes.constant.ts
 * @description Login form component with full auth integration and session persistence
 * @module Authentication
 * 
 * Resources:
 * @see {@link } -
 */

export const ROUTES = {
	LOGIN: "/auth/login",
	REGISTER: "/auth/register",
	DASHBOARD: "/dashboard",
	MANAGER: "/dashboard/manager",
	EMPLOYEE: "/dashboard/employee",
	RESTRICTED: "/dashboard/restricted",
	GUEST: "/auth/login"
} as const;


export const ROLE_REDIRECT = {
	MANAGER: ROUTES.MANAGER,
	EMPLOYEE: ROUTES.EMPLOYEE,
	RESTRICTED: ROUTES.RESTRICTED,
	GUEST: ROUTES.LOGIN
} as const;

export const ROUTER_CONFIG = [
	{
		path: ROUTES.DASHBOARD,
		inProtected: true, // T or F?
	},
	{
		path: ROUTES.LOGIN,
		inProtected: false,
	},
	{
		path: ROUTES.REGISTER,
		inProtected: false,
	},
	{
		path: ROUTES.MANAGER,
		inProtected: true,
		allowedRole: ['MANAGER'] // limit to only MANAGER ,
	},
	{
		path: ROUTES.EMPLOYEE,
		inProtected: true,
		allowedRole: ['EMPLOYEE'] // limit to only EMPLOYEE ,

	},
	{
		path: ROUTES.RESTRICTED,
		inProtected: true,
		allowedRole: ['RESTRICTED'] // limit to only Restricteed ,'EMPLOYEE','MANAGER']
	}
];
