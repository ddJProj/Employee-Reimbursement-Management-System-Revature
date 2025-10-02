import type { RoleType } from "../constant/types.constant";

export const PERMISSION_SETS: Record<RoleType, {permissions: string[]}> = {
	'MANAGER' : {
		permissions: [],
	},
	'EMPLOYEE' : {
		permissions: [],
	},
	'RESTRICTED' : {
		permissions: [],
		},
	'GUEST' : {
		permissions: [],
			},
}
