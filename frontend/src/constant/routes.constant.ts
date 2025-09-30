// src/constants/routes.constants.ts
//

export const ROUTES = {
	LOGIN: "/auth/login",
	REGISTER: "/auth/register",
	DASHBOARD: "/dashboard",
	MANAGER: "/dashboard/manager",
	EMPLOYEE: "/dashboard/employee",
	RESTRICTED: "dashboard/restricted",
	GUEST: "/auth/login"
};

export const ROUTER_CONFIG = {
	{
	path: ROUTES.DASHBOARD ,
	inProtected: false,
	},
	{
	path: ROUTES.LOGIN ,
	inProtected: false,
	},
	{
	path: ROUTES.REGISTER ,
	inProtected: false,
	},	
	{
	path: ROUTES.GUEST ,
	inProtected: false,
	},
	{
	path: ROUTES.MANAGER ,
	inProtected: true,
	},
	{
	path: ROUTES.EMPLOYEE,
	inProtected: true,
	},
	{
	path: ROUTES.RESTRICTED ,
	inProtected: true,
	},


}
