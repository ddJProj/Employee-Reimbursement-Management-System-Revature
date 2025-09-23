
export enum RoleType {
	Manager = 'manager',
	Employee = 'employee',
	Restricted = 'restricted',
	Guest = 'guest',
};

export interface UserAccount {
	id: number, // userAccount Id
	email: ,
	// name: ,?
	role: RoleType,
	permissions: [], // add here? or destructure from role?
}


export enum Permissions {
// TODO: INSERT THE FULL LIST OF PERMISSION HERE WHEN FINISHED
	// follow this format:
	// REQUEST_REIMBURSEMENT = 'REQUEST_REIMBURSEMENT',
}
