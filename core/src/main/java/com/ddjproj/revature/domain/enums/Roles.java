package com.ddjproj.revature.domain.enums;

import java.util.EnumSet;
import java.util.Set;

import static com.ddjproj.revature.domain.enums.Permissions.*;

public enum Roles {
    GUEST(EnumSet.of(
        Permissions.CREATE_ACCOUNT,
        Permissions.LOGIN
    )),
    RESTRICTED(EnumSet.of(
        Permissions.REQUEST_EMPLOYEE_ACCOUNT,
        Permissions.LOGOUT
    )),
    EMPLOYEE(EnumSet.of(
        Permissions.CREATE_REIMBURSEMENT_REQUEST,
        Permissions.VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS,
        Permissions.VIEW_SINGLE_REIMBURSEMENT_REQUEST,
        Permissions.EDIT_PENDING_REIMBURSEMENT,
        Permissions.LOGOUT
    )),
    MANAGER(EnumSet.of(
        Permissions.VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS,
        Permissions.VIEW_ALL_REIMBURSEMENT_REQUESTS,
        Permissions.VIEW_SINGLE_REIMBURSEMENT_REQUEST,
        Permissions.VIEW_ALL_USERACCOUNTS,
        Permissions.EDIT_USER_ROLE,
        Permissions.UPGRADE_ACCOUNT_ROLE,
        Permissions.DELETE_USER,
        Permissions.LOGOUT
    )
);
private final Set<Permissions> permissions;

Roles(Set<Permissions> permissions){
    this.permissions = EnumSet.copyOf(permissions);
}

public Set<Permissions> getPermissions() {
    return EnumSet.copyOf(permissions);
}
    }

