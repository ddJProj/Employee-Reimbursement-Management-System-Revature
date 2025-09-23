import { RoleType, Permissions } from "../constant/types.constant";

// TODO: finish filling out each role specific permission set
export const PERMISSION_SETS: Record<RoleType, {permissions: Permissions[]}> = {
	[RoleType.Manager]: {
		permissions: [
			// Permissions.permissionName
		],
	},
	[RoleType.Employee]: {
		permissions: [

		],
	},
	[RoleType.Restricted]: {
		permissions: [

		],
	},
	[RoleType.Guest]: {
		permissions: [

		],
	},
}
