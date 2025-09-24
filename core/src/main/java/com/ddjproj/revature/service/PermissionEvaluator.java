package com.ddjproj.revature.service;

import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.domain.enums.Permissions;


public interface PermissionEvaluator {
    /**
     *  check if the required permission to work with a resource is held by a UserAccount
     *
     * @param userAccount
     * @param permissionType
     * @param resourceObject
     * @return boolean true if permission is held, else false
     */
    boolean hasPermission(UserAccount userAccount, Permissions permissionType, Object resourceObject);
}
