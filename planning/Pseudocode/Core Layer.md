
```
//---------------------------------------
//---------------------------------------
// CORE MODULE - Domain Layer
// No Spring Dependencies
//---------------------------------------
//---------------------------------------


//---------------------------------------
// Domain Entities:
//---------------------------------------

DECLARE entity "UserAccount" {
    DECLARE userAccountId type Long integer
    DECLARE email type String
    DECLARE passwordHash type String
    DECLARE role type Roles enum (default: RESTRICTED)
}

IMPLEMENT the "UserAccount" entity {
    DECLARE constructor with param:
        email type String
        password type String
    return reference to self {
        UserAccount {
            ASSIGN email from param
            ASSIGN passwordHash from param
            ASSIGN role to RESTRICTED
        }
    }

    DECLARE function getPermissions with param:
        reference to self
    return Set type Permissions {
        RETURN role.getPermissions
    }
}


DECLARE entity "Reimbursement" {
    DECLARE id type Long integer
    DECLARE userId type Long integer
    DECLARE description type String
    DECLARE type type ReimbursementType enum
    DECLARE status type ReimbursementStatus enum (default: PENDING)
}

IMPLEMENT the "Reimbursement" entity {
    DECLARE constructor with no param
    return reference to self {
        Reimbursement {
            ASSIGN status to PENDING
        }
    }
}


//---------------------------------------
// Domain Enums:
//---------------------------------------

DECLARE enum "Roles" {
    DECLARE GUEST with permissions:
        - CREATE_ACCOUNT
        - LOGIN
    
    DECLARE RESTRICTED with permissions:
        - REQUEST_EMPLOYEE_ACCOUNT
        - LOGOUT
    
    DECLARE EMPLOYEE with permissions:
        - CREATE_REIMBURSEMENT_REQUEST
        - VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS
        - VIEW_SINGLE_REIMBURSEMENT_REQUEST
        - EDIT_PENDING_REIMBURSEMENT
        - LOGOUT
    
    DECLARE MANAGER with permissions:
        - VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS
        - VIEW_ALL_REIMBURSEMENT_REQUESTS
        - VIEW_SINGLE_REIMBURSEMENT_REQUEST
        - VIEW_ALL_USERACCOUNTS
        - EDIT_USER_ROLE
        - UPGRADE_ACCOUNT_ROLE
        - DELETE_USER
        - LOGOUT
}

IMPLEMENT the "Roles" enum {
    DECLARE function getPermissions with param:
        reference to self
    return Set type Permissions {
        RETURN EnumSet copy of role permissions
    }
}


DECLARE enum "Permissions" {
    DECLARE CREATE_ACCOUNT
    DECLARE LOGIN
    DECLARE LOGOUT
    DECLARE REQUEST_EMPLOYEE_ACCOUNT
    DECLARE CREATE_REIMBURSEMENT_REQUEST
    DECLARE VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS
    DECLARE VIEW_ALL_REIMBURSEMENT_REQUESTS
    DECLARE VIEW_SINGLE_REIMBURSEMENT_REQUEST
    DECLARE EDIT_PENDING_REIMBURSEMENT
    DECLARE VIEW_ALL_USERACCOUNTS
    DECLARE EDIT_USER_ROLE
    DECLARE UPGRADE_ACCOUNT_ROLE
    DECLARE DELETE_USER
}

IMPLEMENT the "Permissions" enum {
    DECLARE function getAllPermissions
    return Set type all Permissions {
        RETURN EnumSet of all permission values
    }
}


DECLARE enum "ReimbursementStatus" {
    DECLARE PENDING
    DECLARE APPROVED
    DECLARE DENIED
}


DECLARE enum "ReimbursementType" {
    DECLARE FOOD
    DECLARE AIRLINE
    DECLARE GAS
    DECLARE HOTEL
    DECLARE SUPPLIES
    DECLARE OTHER
}


//---------------------------------------
// Repository Interfaces:
//---------------------------------------

DECLARE interface "UserAccountRepository" {
    DECLARE function findByEmail with param:
        email type String
    return Optional type UserAccount

    DECLARE function existsByEmail with param:
        email type String
    return boolean

    DECLARE function findByRole with param:
        role type String
    return List type UserAccount

    DECLARE function existsByRole with param:
        targetRole type Roles
    return boolean

    DECLARE function save with param:
        userAccount type UserAccount
    return UserAccount

    DECLARE function findById with param:
        id type Long
    return Optional type UserAccount

    DECLARE function findAll
    return List type UserAccount

    DECLARE function deleteById with param:
        id type Long
    return void
}


DECLARE interface "ReimbursementRepository" {
    DECLARE function save with param:
        reimbursement type Reimbursement
    return Reimbursement

    DECLARE function findById with param:
        id type Long
    return Optional type Reimbursement

    DECLARE function findAll
    return List type Reimbursement

    DECLARE function findByUserId with param:
        userId type Long
    return List type Reimbursement

    DECLARE function findByStatus with param:
        status type ReimbursementStatus
    return List type Reimbursement

    DECLARE function findByUserIdAndStatus with param:
        userId type Long
        status type ReimbursementStatus
    return List type Reimbursement

    DECLARE function deleteById with param:
        id type Long
    return void
}


//---------------------------------------
// Service Interface:
//---------------------------------------

DECLARE interface "PermissionEvaluator" {
    DECLARE function hasPermission with param:
        userAccount type UserAccount
        permissionType type Permissions
        resourceObject type Object (nullable)
    return boolean
    
    // Evaluates whether user has permission to work with specific resource
    // Returns true if permission granted, false otherwise
}

```