package com.ddjproj.revature.domain.enums;

import lombok.Getter;

import java.util.EnumSet;
import java.util.Set;

@Getter
public enum Permissions {
    // template
    // permission(""),

    /**
     * UserAccount level:
     */
    //LOGOUT("template description"),

    /**
     *
     * Manager level:
     */
    EDIT_USER_ROLE("Edit the Role attribute value of a UserAccount instance."),
    UPGRADE_ACCOUNT_ROLE("Upgrade a UserAccount with the restricted role type to one with the Employee role type."),
    DELETE_USER("Remove a UserAccount from the system."),
    VIEW_ALL_REIMBURSEMENT_REQUESTS("View all reimbursement requests."),
    VIEW_ALL_USERACCOUNTS("View all UserAccounts in the system."),



    /**
     * Employee level:
     */
    CREATE_REIMBURSEMENT_REQUEST("template description"),
    VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS("template description"),
    VIEW_SINGLE_REIMBURSEMENT_REQUEST("template description"),
    EDIT_PENDING_REIMBURSEMENT("template description"),


    /**
     * Restricted level:
     */
    REQUEST_EMPLOYEE_ACCOUNT("Requests an upgrade from Restricted role to Employee role."),
    LOGOUT("Ends the user session and exits the system."),


    /**
     * Guest level:
     */
    CREATE_ACCOUNT("Creates a new account with the default restricted role type and permissions."),
    LOGIN("Attempts to authenticate the user and access the role based system.");

    private final String description;

    Permissions(String description){
        this.description = description;
    }

    /**
     * @return String nameOfPermission
     */
    @Override
    public String toString(){
        return name();
    }

    /**
     *
     * @return Set<Permissions> allPermissions - set of all permissions
     */
    public static Set<Permissions> getAllPermissions(){
        return EnumSet.allOf(Permissions.class);
    }

}
