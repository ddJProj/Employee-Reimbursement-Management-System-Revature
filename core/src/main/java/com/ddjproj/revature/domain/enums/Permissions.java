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
     * Admin level:
     */
    EDIT_USER_ROLE("Edits the Role attribute value of a UserAccount instance."),
    UPGRADE_ACCOUNT_ROLE("Upgrades a UserAccount with the restricted role type to one with the Employee role type."),
    DELETE_USER("Removes a UserAccount from the system."),
    VIEW_ALL_REIMBURSEMENT_REQUESTS("template description"),



    /**
     * Employee level:
     */
    CREATE_REIMBURSEMENT_REQUEST("template description"),
    VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS("template description"),
    LOGOUT("template description"),


    /**
     * Restricted level:
     */
    REQUEST_EMPLOYEE_ACCOUNT("Requests an upgrade from Restricted role to Employee role."),


    /**
     * Guest level:
     */
    CREATE_ACCOUNT("Creates a new account with the default restricted role type and permissions.");


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
