
export enum RoleType {
	Manager = 'manager',
	Employee = 'employee',
	Restricted = 'restricted',
};

export interface UserAccount {
	id: number, // userAccount Id
	email: ,
	// name: ?,
	role: RoleType,
	// permissions: []?, add here? or destructure from role?
}


export enum Permissions {

}
