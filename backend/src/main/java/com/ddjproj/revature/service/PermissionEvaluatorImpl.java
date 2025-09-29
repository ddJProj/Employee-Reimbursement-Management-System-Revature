package com.ddjproj.revature.service;

import com.ddjproj.revature.domain.entity.Reimbursement;
import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.ddjproj.revature.domain.enums.Roles;

import com.ddjproj.revature.domain.enums.Permissions;
import org.springframework.stereotype.Component;

@Component
public class PermissionEvaluatorImpl implements PermissionEvaluator {

    /**
     * check if the required permission to work with a resource is held by a UserAccount
     *
     * @param userAccount
     * @param permissionType
     * @param resourceObject
     * @return boolean true if permission is held, else false
     */
    @Override
    public boolean hasPermission(UserAccount userAccount, Permissions permissionType, Object resourceObject) {
        if (userAccount.getRole() == Roles.MANAGER) {
            return true;
        }
        boolean hasBasePermission = userAccount.getPermissions().stream().anyMatch(p -> p.equals(permissionType));

        if (!hasBasePermission) {
            return false;
        }

        if (resourceObject != null) {
            return evaluateResourcePermission(userAccount, permissionType, resourceObject);
        }
        return true;
    }

    private boolean evaluateResourcePermission(UserAccount userAccount, Permissions permissionType, Object resourceObject) {
        if (resourceObject instanceof Reimbursement) {
            Reimbursement reimbursement = (Reimbursement) resourceObject;
            switch (permissionType) {
                case VIEW_ALL_REIMBURSEMENT_REQUESTS:
                    // Employees can only view their own reimbursements
                    if (userAccount.getRole() == Roles.EMPLOYEE) {
                        return reimbursement.getUserId().equals(userAccount.getUserAccountId());
                    }
                    break;

                case VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS:
                    // Only view own reimbursements
                    return reimbursement.getUserId().equals(userAccount.getUserAccountId());

                case VIEW_SINGLE_REIMBURSEMENT_REQUEST:
                    // Employees can only view their own reimbursements
                    if (userAccount.getRole() == Roles.EMPLOYEE) {
                        return reimbursement.getUserId().equals(userAccount.getUserAccountId());
                    }
                    break;

                case EDIT_PENDING_REIMBURSEMENT:
                    // Can only edit own reimbursements when pending
                    return reimbursement.getUserId().equals(userAccount.getUserAccountId())
                            && reimbursement.getStatus() == ReimbursementStatus.PENDING;

                default:
                    // default to base permission check
                    break;
            }
        }

        // base useraccount check
        if (resourceObject instanceof UserAccount) {
            UserAccount targetUser = (UserAccount) resourceObject;

            if (permissionType == Permissions.DELETE_USER) {
                // Cannot delete yourself
                return !userAccount.getUserAccountId().equals(targetUser.getUserAccountId());
            }
        }

        // default to base permissions/guest
        return true;
    }
}
