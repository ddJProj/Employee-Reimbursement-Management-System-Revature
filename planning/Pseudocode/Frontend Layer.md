

```

//---------------------------------------
//---------------------------------------
// FRONTEND MODULE - React Application
// TypeScript + React + Vite
//---------------------------------------
//---------------------------------------


//---------------------------------------
// Type Definitions & Constants:
//---------------------------------------

DECLARE constant "RoleType" as const object {
    DECLARE Manager assign value 'MANAGER'
    DECLARE Employee assign value 'EMPLOYEE'
    DECLARE Restricted assign value 'RESTRICTED'
    DECLARE Guest assign value 'GUEST'
}

EXPORT type RoleType as keyof of RoleType constant


DECLARE interface "UserAccount" {
    DECLARE userId type number
    DECLARE email type string
    DECLARE role type RoleType
    DECLARE permissions type array of string
}


DECLARE constant "ROUTES" as const object {
    DECLARE LOGIN assign value "/auth/login"
    DECLARE REGISTER assign value "/auth/register"
    DECLARE DASHBOARD assign value "/dashboard"
    DECLARE MANAGER assign value "/dashboard/manager"
    DECLARE EMPLOYEE assign value "/dashboard/employee"
    DECLARE RESTRICTED assign value "/dashboard/restricted"
    DECLARE GUEST assign value "/auth/login"
}


DECLARE constant "ROLE_REDIRECT" as const object {
    DECLARE MANAGER assign value ROUTES.MANAGER
    DECLARE EMPLOYEE assign value ROUTES.EMPLOYEE
    DECLARE RESTRICTED assign value ROUTES.RESTRICTED
    DECLARE GUEST assign value ROUTES.LOGIN
}


DECLARE type "ReimbursementType" as union {
    'FOOD' | 'AIRLINE' | 'GAS' | 'HOTEL' | 'SUPPLIES' | 'OTHER'
}


DECLARE type "ReimbursementStatus" as union {
    'PENDING' | 'APPROVED' | 'DENIED'
}


DECLARE interface "Reimbursement" {
    DECLARE id type number
    DECLARE userId type number
    DECLARE userEmail type string
    DECLARE description type string
    DECLARE type type ReimbursementType
    DECLARE status type ReimbursementStatus
}


//---------------------------------------
// Utility Services:
//---------------------------------------

DECLARE module "auth.util.ts" {
    DECLARE constant AUTH_KEYS {
        DECLARE ACCESS_TOKEN assign "authToken"
        DECLARE USER assign "authUser"
    }

    DECLARE object authUtils {
        DECLARE function setAuthData with param:
            token type string
            user type Record of string to any
        return void {
            TRY {
                STORE token in localStorage
                STORE user JSON in localStorage
                LOG "Auth data stored successfully"
            } CATCH error {
                LOG error "Error storing auth data"
            }
        }

        DECLARE function getToken
        return string or null {
            RETURN token from localStorage
        }

        DECLARE function getUser
        return Record of string to any or null {
            TRY {
                GET user string from localStorage
                IF user exists {
                    RETURN parsed JSON
                }
                RETURN null
            } CATCH error {
                LOG error "Error parsing user data"
                RETURN null
            }
        }

        DECLARE function clearAuthData
        return void {
            LOG "Clearing auth data"
            REMOVE token from localStorage
            REMOVE user from localStorage
        }

        DECLARE function isAuthenticated
        return boolean {
            GET token
            LOG "Is authenticated check"
            
            IF no token {
                RETURN false
            }

            TRY {
                DECODE token
                LOG "Token decoded successfully"
                
                GET expiry from decoded token
                GET current time
                CHECK if token not expired
                
                LOG "Token validation"
                
                RETURN validation result
            } CATCH error {
                LOG error "Token decode error"
                RETURN false
            }
        }

        DECLARE function needsRefresh with param:
            thresholdMinutes type number default 5
        return boolean {
            GET token
            IF no token {
                RETURN false
            }

            DECODE token to get expiry
            GET current time
            CHECK if expiry minus current time less than threshold
            RETURN result
        }
    }

    EXPORT authUtils
}


DECLARE module "storage.util.ts" {
    DECLARE constant CURRENT_VERSION assign 1

    DECLARE interface "StorageItem" generic type T {
        DECLARE value type T
        DECLARE expiry optional type number
        DECLARE version optional type number
    }

    DECLARE object storageUtils {
        DECLARE function set generic type T with param:
            key type string
            value type T
            ttlMinutes optional type number
        return void {
            TRY {
                CREATE StorageItem with value, version, and calculated expiry
                STORE stringified item in localStorage
                LOG "Storage: Set key"
            } CATCH error {
                LOG error "Storage error setting key"
            }
        }

        DECLARE function get generic type T with param:
            key type string
            defaultValue type T
        return type T {
            TRY {
                GET raw value from localStorage
                IF no raw value {
                    RETURN defaultValue
                }
                
                PARSE raw as StorageItem
                
                IF version mismatch {
                    LOG "Version mismatch, clearing"
                    CALL remove with key
                    RETURN defaultValue
                }
                
                IF expired {
                    LOG "Expired, clearing"
                    CALL remove with key
                    RETURN defaultValue
                }
                
                RETURN item value
            } CATCH error {
                LOG error "Storage error getting key"
                RETURN defaultValue
            }
        }

        DECLARE function remove with param:
            key type string
        return void {
            REMOVE item from localStorage
            LOG "Storage: Removed key"
        }

        DECLARE function clear with param:
            preserveKeys type array of string default empty
        return void {
            CREATE preserved object
            FOR each key in preserveKeys {
                GET value from localStorage
                IF value exists {
                    STORE in preserved object
                }
            }
            
            CLEAR localStorage
            
            FOR each entry in preserved {
                RESTORE to localStorage
            }
            
            LOG "Storage: Cleared all"
        }
    }

    EXPORT storageUtils
}


DECLARE module "session.util.ts" {
    DECLARE function fetchSession
    return Promise type UserAccount {
        TRY {
            GET storedUser
            
            IF no storedUser {
                THROW error "No matching user data found"
            }
            
            RETURN UserAccount object with values from storedUser
        } CATCH error {
            LOG error "Error fetching session"
            THROW error
        }
    }

    DECLARE function getSession
    return object with token property {
        GET token
        RETURN object with token
    }

    EXPORT fetchSession and getSession
}


DECLARE module "validation.util.ts" {
    DECLARE object validationUtil {
        DECLARE patterns object {
            DECLARE email as regex pattern
            DECLARE strongPassword as regex pattern
        }

        DECLARE schemas object {
            DECLARE email as Zod schema with regex validation
            DECLARE password as Zod schema with regex validation
            DECLARE date as Zod schema with date validation
        }

        DECLARE function validateWithSchema generic type T with param:
            schema type ZodType of T
            data type unknown
        return object with isValid and errors {
            TRY {
                PARSE data with schema
                RETURN object with isValid true and empty errors
            } CATCH error {
                IF error is ZodError {
                    REDUCE issues to errors object
                    RETURN object with isValid false and errors
                }
                RETURN object with isValid false and generic error
            }
        }
    }

    EXPORT validationUtil
}


//---------------------------------------
// API Services:
//---------------------------------------

DECLARE module "auth.api.service.ts" {
    DECLARE constant API_BASE_URL assign '/api'

    DECLARE interface "LoginRequest" {
        DECLARE email type string
        DECLARE password type string
    }

    DECLARE interface "RegisterRequest" {
        DECLARE email type string
        DECLARE password type string
    }

    DECLARE interface "AuthResponse" {
        DECLARE token type string
        DECLARE role type string
        DECLARE userId type number
        DECLARE email type string
        DECLARE permissions type array of string
    }

    DECLARE function mapAuthResponseToUser with param:
        response type AuthResponse
    return type UserAccount {
        RETURN UserAccount object with values from response
    }

    DECLARE object authApi {
        DECLARE async function login with param:
            credentials type LoginRequest
        return Promise type object with token and user {
            TRY {
                LOG "Attempting login"
                
                POST to login endpoint with credentials
                GET response
                
                LOG "Login successful"
                
                RETURN object with token and mapped user
            } CATCH error {
                LOG error "Login failed"
                
                IF axios error {
                    EXTRACT error message
                    THROW error with message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function register with param:
            userData type RegisterRequest
        return Promise type object with token and user {
            TRY {
                LOG "Attempting registration"
                
                POST to register endpoint with userData
                GET response
                
                LOG "Registration successful"
                
                RETURN object with token and mapped user
            } CATCH error {
                LOG error "Registration failed"
                
                IF axios error {
                    EXTRACT error message
                    
                    IF message contains 'email' {
                        THROW error "Email already registered"
                    }
                    IF message contains 'password' {
                        THROW error "Password requirements not met"
                    }
                    
                    THROW error with message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function logout with param:
            token type string
        return Promise type void {
            TRY {
                LOG "Attempting logout"
                
                POST to logout endpoint with Authorization header
                
                LOG "Logout successful"
            } CATCH error {
                LOG error "Logout request failed"
            }
        }
    }

    DECLARE function setAuthToken with param:
        token type string or null
    return void {
        IF token exists {
            SET axios Authorization header
            LOG "Auth token set"
        } ELSE {
            DELETE axios Authorization header
            LOG "Auth token cleared"
        }
    }

    EXPORT authApi and setAuthToken
}


DECLARE module "user.api.service.ts" {
    DECLARE constant API_BASE_URL assign '/api'

    DECLARE interface "AccountUpgradeRequest" {
        DECLARE userAccountId type number
    }

    DECLARE interface "AccountUpgradeResponse" {
        DECLARE userAccountId type number
        DECLARE email type string
        DECLARE role type string
        DECLARE permissions type array of string
    }

    DECLARE object userApi {
        DECLARE async function requestEmployeeAccess with param:
            userAccountId type number
        return Promise type UserAccount {
            TRY {
                LOG "Requesting employee access"
                
                POST to upgrade endpoint with userAccountId
                
                LOG "Employee access granted"
                
                RETURN UserAccount with values from response
            } CATCH error {
                LOG error "Employee access request failed"
                
                IF axios error {
                    EXTRACT error message
                    
                    IF message contains 'RESTRICTED' {
                        THROW error "Only restricted users can request"
                    }
                    IF message contains 'already' {
                        THROW error "Already have access"
                    }
                    
                    THROW error with message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function getAllUsers
        return Promise type array of UserAccount {
            TRY {
                LOG "Fetching all users"
                
                GET from users endpoint
                
                MAP response to UserAccount array
                RETURN array
            } CATCH error {
                LOG error "Failed to fetch users"
                
                IF axios error {
                    EXTRACT and throw error message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function deleteUser with param:
            userId type number
        return Promise type void {
            TRY {
                LOG "Deleting user"
                
                DELETE from users endpoint with userId
                
                LOG "User deleted successfully"
            } CATCH error {
                LOG error "Failed to delete user"
                
                IF axios error {
                    EXTRACT error message
                    
                    IF message contains 'own account' {
                        THROW error "Cannot delete own account"
                    }
                    
                    THROW error with message
                }
                
                THROW error "Network error"
            }
        }
    }

    EXPORT userApi
}


DECLARE module "reimbursement.api.service.ts" {
    DECLARE constant API_BASE_URL assign '/api'

    DECLARE interface "CreateReimbursementRequest" {
        DECLARE description type string
        DECLARE type type ReimbursementType
    }

    DECLARE interface "ResolveReimbursementRequest" {
        DECLARE status type ReimbursementStatus
        DECLARE comment optional type string
    }

    DECLARE object reimbursementApi {
        DECLARE async function create with param:
            data type CreateReimbursementRequest
        return Promise type Reimbursement {
            TRY {
                LOG "Creating reimbursement"
                
                POST to reimbursements endpoint with data
                
                LOG "Reimbursement created successfully"
                RETURN response data
            } CATCH error {
                LOG error "Failed to create reimbursement"
                
                IF axios error {
                    EXTRACT and throw error message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function getMy with param:
            status optional type ReimbursementStatus
        return Promise type array of Reimbursement {
            TRY {
                LOG "Fetching my reimbursements"
                
                CREATE params with status if provided
                GET from self endpoint with params
                
                LOG "Retrieved reimbursements"
                RETURN response data
            } CATCH error {
                LOG error "Failed to fetch reimbursements"
                
                IF axios error {
                    EXTRACT and throw error message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function getAll with param:
            status optional type ReimbursementStatus
        return Promise type array of Reimbursement {
            TRY {
                LOG "Fetching all reimbursements"
                
                CREATE params with status if provided
                GET from reimbursements endpoint with params
                
                LOG "Retrieved reimbursements"
                RETURN response data
            } CATCH error {
                LOG error "Failed to fetch all reimbursements"
                
                IF axios error {
                    EXTRACT and throw error message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function getById with param:
            id type number
        return Promise type Reimbursement {
            TRY {
                LOG "Fetching reimbursement"
                
                GET from reimbursements endpoint with id
                
                RETURN response data
            } CATCH error {
                LOG error "Failed to fetch reimbursement"
                
                IF axios error {
                    EXTRACT and throw error message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function update with param:
            id type number
            data type CreateReimbursementRequest
        return Promise type Reimbursement {
            TRY {
                LOG "Updating reimbursement"
                
                PUT to reimbursements endpoint with id and data
                
                LOG "Reimbursement updated successfully"
                RETURN response data
            } CATCH error {
                LOG error "Failed to update reimbursement"
                
                IF axios error {
                    EXTRACT error message
                    
                    IF message contains 'pending' {
                        THROW error "Can only edit pending"
                    }
                    
                    THROW error with message
                }
                
                THROW error "Network error"
            }
        }

        DECLARE async function resolve with param:
            id type number
            data type ResolveReimbursementRequest
        return Promise type Reimbursement {
            TRY {
                LOG "Resolving reimbursement"
                
                PUT to resolve endpoint with id and data
                
                LOG "Reimbursement resolved successfully"
                RETURN response data
            } CATCH error {
                LOG error "Failed to resolve reimbursement"
                
                IF axios error {
                    EXTRACT error message
                    
                    IF message contains 'Only managers' {
                        THROW error "Only managers can resolve"
                    }
                    IF message contains 'pending' {
                        THROW error "Can only resolve pending"
                    }
                    
                    THROW error with message
                }
                
                THROW error "Network error"
            }
        }
    }

    EXPORT reimbursementApi
}


//---------------------------------------
// Context & Global State:
//---------------------------------------

DECLARE module "AuthContext.tsx" {
    DECLARE interface "AuthContextType" {
        DECLARE user type UserAccount or null
        DECLARE token type string or null
        DECLARE isLoading type boolean
        DECLARE login type function with token and user param return void
        DECLARE updateUser type function with user param return void
        DECLARE logout type function return void
        DECLARE isAuthenticated type boolean
    }

    CREATE AuthContext with undefined default value

    DECLARE function AuthProvider with param:
        children type ReactNode
    return type ReactElement {
        DECLARE state user type UserAccount or null initial null
        DECLARE state token type string or null initial null
        DECLARE state isLoading type boolean initial true

        USE effect on mount {
            LOG "AuthContext: Checking for existing session"
            
            GET storedToken and storedUser
            
            IF storedToken AND storedUser AND authenticated {
                LOG "AuthContext: Restoring session"
                SET token to storedToken
                SET user to storedUser
                CALL setAuthToken with storedToken
            } ELSE {
                LOG "AuthContext: No valid session found"
                CLEAR auth data
            }
            
            SET isLoading to false
            LOG "AuthContext: Initialization complete"
        }

        DECLARE function login with param:
            newToken type string
            newUser type UserAccount
        return void {
            LOG "Logging in user"
            
            SET token to newToken
            SET user to newUser
            
            CALL setAuthData with token and user
            CALL setAuthToken with token
            
            LOG "User logged in successfully"
        }

        DECLARE function logout
        return void {
            LOG "Logging out user"
            
            SET token to null
            SET user to null
            
            CLEAR auth data
            CALL setAuthToken with null
            
            LOG "User logged out successfully"
        }

        DECLARE function updateUser with param:
            updatedUser type UserAccount
        return void {
            LOG "AuthContext: Updating user data"
            
            SET user to updatedUser
            
            IF token exists {
                CALL setAuthData with token and updatedUser
            }
        }

        COMPUTE isAuthenticated as token AND user both exist

        CREATE authValue object with all properties

        RETURN AuthContext Provider with value authValue
            RENDER children
    }

    EXPORT AuthContext and AuthProvider
}


//---------------------------------------
// Custom Hooks:
//---------------------------------------

DECLARE module "useAuth.ts" {
    DECLARE function useAuth
    return type AuthContextType {
        GET context from AuthContext
        IF context is undefined {
            THROW error "Can only apply useAuth within AuthProvider"
        }
        RETURN context
    }

    EXPORT useAuth
}


DECLARE module "useLogin.ts" {
    DECLARE interface "UseLoginReturn" {
        DECLARE handleLogin type function return Promise boolean
        DECLARE isLoading type boolean
        DECLARE error type string or null
    }

    DECLARE function useLogin
    return type UseLoginReturn {
        DECLARE state isLoading type boolean initial false
        DECLARE state error type string or null initial null
        GET login from useAuth
        GET navigate from useNavigate

        DECLARE async function handleLogin with param:
            email type string
            password type string
        return Promise type boolean {
            SET isLoading to true
            SET error to null

            TRY {
                LOG "useLogin: Attempting login"
                
                CALL authApi.login with credentials
                GET response
                
                LOG "useLogin: Login successful"
                
                CALL login with token and user
                
                GET redirectPath from ROLE_REDIRECT
                LOG "useLogin: Redirecting"
                
                CALL navigate with redirectPath
                
                RETURN true
            } CATCH error {
                LOG error "useLogin: Login failed"
                
                EXTRACT error message
                SET error state
                RETURN false
            } FINALLY {
                SET isLoading to false
            }
        }

        RETURN object with handleLogin, isLoading, error
    }

    EXPORT useLogin
}


DECLARE module "useRegister.ts" {
    DECLARE interface "UseRegisterReturn" {
        DECLARE handleRegister type function return Promise boolean
        DECLARE isLoading type boolean
        DECLARE error type string or null
    }

    DECLARE function useRegister
    return type UseRegisterReturn {
        DECLARE state isLoading type boolean initial false
        DECLARE state error type string or null initial null
        GET login from useAuth
        GET navigate from useNavigate

        DECLARE async function handleRegister with param:
            email type string
            password type string
        return Promise type boolean {
            SET isLoading to true
            SET error to null

            TRY {
                LOG "useRegister: Attempting registration"
                
                CALL authApi.register with credentials
                GET response
                
                LOG "useRegister: Registration successful"
                
                CALL login with token and user
                
                LOG "useRegister: Redirecting to restricted dashboard"
                
                CALL navigate with ROUTES.RESTRICTED
                
                RETURN true
            } CATCH error {
                LOG error "useRegister: Registration failed"
                
                EXTRACT error message
                SET error state
                RETURN false
            } FINALLY {
                SET isLoading to false
            }
        }

        RETURN object with handleRegister, isLoading, error
    }

    EXPORT useRegister
}


DECLARE module "useReimbursements.ts" {
    DECLARE interface "UseReimbursementsReturn" {
        DECLARE reimbursements type array of Reimbursement
        DECLARE isLoading type boolean
        DECLARE error type string or null
        DECLARE refresh type function return Promise void
        DECLARE filterByStatus type function with status param return void
        DECLARE currentFilter type ReimbursementStatus or null
    }

    DECLARE function useReimbursements
    return type UseReimbursementsReturn {
        DECLARE state reimbursements type array initial empty
        DECLARE state isLoading type boolean initial true
        DECLARE state error type string or null initial null
        DECLARE state currentFilter type ReimbursementStatus or null initial null
        
        GET user from useAuth

        DECLARE async function fetchReimbursements callback
        return Promise type void {
            SET isLoading to true
            SET error to null

            TRY {
                LOG "useReimbursements: Fetching reimbursements"
                
                CALL reimbursementApi.getMy with currentFilter
                GET data
                
                LOG "useReimbursements: Retrieved reimbursements"
                SET reimbursements to data
            } CATCH error {
                LOG error "useReimbursements: Failed to fetch"
                
                EXTRACT error message
                SET error state
                SET reimbursements to empty
            } FINALLY {
                SET isLoading to false
            }
        }

        USE effect on user and fetchReimbursements change {
            IF user exists {
                CALL fetchReimbursements
            }
        }

        DECLARE async function refresh
        return Promise type void {
            LOG "useReimbursements: Manual refresh"
            CALL fetchReimbursements
        }

        DECLARE function filterByStatus with param:
            status type ReimbursementStatus or null
        return void {
            LOG "useReimbursements: Filtering by status"
            SET currentFilter to status
        }

        RETURN object with all properties
    }

    EXPORT useReimbursements
}


DECLARE module "useCreateReimbursement.ts" {
    DECLARE interface "CreateReimbursementData" {
        DECLARE description type string
        DECLARE type type ReimbursementType
    }

    DECLARE interface "UseCreateReimbursementReturn" {
        DECLARE createReimbursement type function return Promise Reimbursement or null
        DECLARE isLoading type boolean
        DECLARE error type string or null
        DECLARE success type boolean
        DECLARE reset type function return void
    }

    DECLARE function useCreateReimbursement
    return type UseCreateReimbursementReturn {
        DECLARE state isLoading type boolean initial false
        DECLARE state error type string or null initial null
        DECLARE state success type boolean initial false

        DECLARE async function createReimbursement with param:
            data type CreateReimbursementData
        return Promise type Reimbursement or null {
            IF description invalid {
                SET error "Description must be at least 10 characters"
                RETURN null
            }

            IF no type {
                SET error "Please select a reimbursement type"
                RETURN null
            }

            SET isLoading to true
            SET error to null
            SET success to false

            TRY {
                LOG "useCreateReimbursement: Creating reimbursement"
                
                CALL reimbursementApi.create with data
                GET reimbursement
                
                LOG "useCreateReimbursement: Created successfully"
                SET success to true
                
                RETURN reimbursement
            } CATCH error {
                LOG error "useCreateReimbursement: Failed to create"
                
                EXTRACT error message
                SET error state
                RETURN null
            } FINALLY {
                SET isLoading to false
            }
        }

        DECLARE function reset
        return void {
            SET error to null
            SET success to false
        }

        RETURN object with all properties
    }

    EXPORT useCreateReimbursement
}


DECLARE module "useManagerReimbursements.ts" {
    DECLARE interface "UseManagerReimbursementsReturn" {
        DECLARE reimbursements type array of Reimbursement
        DECLARE isLoading type boolean
        DECLARE error type string or null
        DECLARE refresh type function return Promise void
        DECLARE filterByStatus type function with status param return void
        DECLARE currentFilter type ReimbursementStatus or null
        DECLARE resolveReimbursement type function return Promise boolean
        DECLARE isResolving type boolean
        DECLARE resolveError type string or null
    }

    DECLARE function useManagerReimbursements
    return type UseManagerReimbursementsReturn {
        DECLARE state reimbursements type array initial empty
        DECLARE state isLoading type boolean initial true
        DECLARE state error type string or null initial null
        DECLARE state currentFilter type ReimbursementStatus or null initial null
        DECLARE state isResolving type boolean initial false
        DECLARE state resolveError type string or null initial null
        
        GET user from useAuth

        DECLARE async function fetchReimbursements callback
        return Promise type void {
            SET isLoading to true
            SET error to null

            TRY {
                LOG "useManagerReimbursements: Fetching all reimbursements"
                
                CALL reimbursementApi.getAll with currentFilter
                GET data
                
                LOG "useManagerReimbursements: Retrieved reimbursements"
                SET reimbursements to data
            } CATCH error {
                LOG error "useManagerReimbursements: Failed to fetch"
                
                EXTRACT error message
                SET error state
                SET reimbursements to empty
            } FINALLY {
                SET isLoading to false
            }
        }

        USE effect on user and fetchReimbursements change {
            IF user exists {
                CALL fetchReimbursements
            }
        }

        DECLARE async function refresh
        return Promise type void {
            LOG "useManagerReimbursements: Manual refresh"
            CALL fetchReimbursements
        }

        DECLARE function filterByStatus with param:
            status type ReimbursementStatus or null
        return void {
            LOG "useManagerReimbursements: Filtering by status"
            SET currentFilter to status
        }

        DECLARE async function resolveReimbursement with param:
            id type number
            status type ReimbursementStatus
            comment optional type string
        return Promise type boolean {
            IF status not APPROVED and not DENIED {
                SET resolveError "Status must be APPROVED or DENIED"
                RETURN false
            }

            SET isResolving to true
            SET resolveError to null

            TRY {
                LOG "useManagerReimbursements: Resolving reimbursement"
                
                CALL reimbursementApi.resolve with id and data
                
                LOG "useManagerReimbursements: Resolution successful"
                
                CALL fetchReimbursements to refresh list
                
                RETURN true
            } CATCH error {
                LOG error "useManagerReimbursements: Failed to resolve"
                
                EXTRACT error message
                SET resolveError state
                RETURN false
            } FINALLY {
                SET isResolving to false
            }
        }

        RETURN object with all properties
    }

    EXPORT useManagerReimbursements
}


DECLARE module "useUpgradeRequest.ts" {
    DECLARE interface "UseUpgradeRequestReturn" {
        DECLARE requestUpgrade type function return Promise boolean
        DECLARE isLoading type boolean
        DECLARE error type string or null
        DECLARE success type boolean
    }

    DECLARE function useUpgradeRequest
    return type UseUpgradeRequestReturn {
        DECLARE state isLoading type boolean initial false
        DECLARE state error type string or null initial null
        DECLARE state success type boolean initial false
        
        GET user and updateUser from useAuth
        GET navigate from useNavigate

        DECLARE async function requestUpgrade
        return Promise type boolean {
            IF no user {
                SET error "No user logged in"
                RETURN false
            }

            IF user role not RESTRICTED {
                SET error "Only restricted users can request"
                RETURN false
            }

            SET isLoading to true
            SET error to null
            SET success to false

            TRY {
                LOG "useUpgradeRequest: Requesting employee access"
                
                CALL userApi.requestEmployeeAccess with userId
                GET updatedUser
                
                LOG "useUpgradeRequest: Upgrade successful"
                
                CALL updateUser with updatedUser
                
                SET success to true
                
                LOG "useUpgradeRequest: Redirecting"
                
                AFTER 1500ms delay {
                    CALL navigate with ROUTES.EMPLOYEE
                }
                
                RETURN true
            } CATCH error {
                LOG error "useUpgradeRequest: Upgrade failed"
                
                EXTRACT error message
                SET error state
                RETURN false
            } FINALLY {
                SET isLoading to false
            }
        }

        RETURN object with all properties
    }

    EXPORT useUpgradeRequest
}


//---------------------------------------
// Components - Authentication:
//---------------------------------------

DECLARE module "Login.tsx" {
    DECLARE function Login
    return type ReactElement {
        DECLARE state email type string initial empty
        DECLARE state password type string initial empty
        DECLARE state validationError type string or null initial null
        
        GET isAuthenticated and user from useAuth
        GET handleLogin, isLoading, error from useLogin
        GET navigate from useNavigate

        USE effect on mount {
            LOG "Login: checking auth state"
            IF isAuthenticated AND user {
                LOG "User already authenticated, redirecting"
                GET redirectPath
                CALL navigate with redirectPath
            }
        }

        DECLARE function validateForm
        return boolean {
            SET validationError to null
            
            IF no email or password {
                SET validationError "Please fill in all fields"
                RETURN false
            }
            
            IF email not valid format {
                SET validationError "Please enter valid email"
                RETURN false
            }
            
            RETURN true
        }

        DECLARE async function handleSubmit with param:
            e type FormEvent
        return Promise type void {
            PREVENT default
            
            IF not validateForm {
                RETURN
            }
            
            LOG "Submitting login form"
            
            CALL handleLogin with email and password
        }

        DECLARE function handleEmailChange with param:
            e type ChangeEvent
        return void {
            SET email from event
            IF validationError {
                SET validationError to null
            }
        }

        DECLARE function handlePasswordChange with param:
            e type ChangeEvent
        return void {
            SET password from event
            IF validationError {
                SET validationError to null
            }
        }

        COMPUTE displayError as validationError or error

        RENDER login form with:
            - title
            - error display if displayError exists
            - email input with onChange handler
            - password input with onChange handler
            - submit button disabled if isLoading
            - link to registration
            - dev test accounts info if dev mode
    }

    EXPORT Login
}


DECLARE module "Registration.tsx" {
    DECLARE constant PASSWORD_REQUIREMENTS object

    DECLARE function Registration
    return type ReactElement {
        DECLARE state email type string initial empty
        DECLARE state password type string initial empty
        DECLARE state confirmPassword type string initial empty
        DECLARE state isLoading type boolean initial false
        DECLARE state error type string or null initial null
        DECLARE state showPasswordRequirements type boolean initial false
        
        GET login, isAuthenticated, user from useAuth
        GET navigate from useNavigate

        USE effect on mount {
            LOG "Registration: Checking auth state"
            IF isAuthenticated AND user {
                LOG "User already authenticated, redirecting"
                GET redirectPath
                CALL navigate with redirectPath
            }
        }

        DECLARE function validatePassword with param:
            pwd type string
        return string or null {
            CHECK each PASSWORD_REQUIREMENTS rule
            RETURN error message if any rule fails
            RETURN null if all pass
        }

        DECLARE async function handleSubmit with param:
            e type FormEvent
        return Promise type void {
            PREVENT default
            
            SET error to null
            
            IF any field empty {
                SET error "Please fill in all fields"
                RETURN
            }
            
            IF email not valid format {
                SET error "Please enter valid email"
                RETURN
            }
            
            GET passwordError from validatePassword
            IF passwordError {
                SET error to passwordError
                RETURN
            }
            
            IF password not equals confirmPassword {
                SET error "Passwords do not match"
                RETURN
            }
            
            SET isLoading to true
            LOG "Starting registration process"
            
            TRY {
                CALL authApi.register with credentials
                GET response
                LOG "Registration successful"
                
                CALL login with token and user
                
                LOG "Redirecting to restricted dashboard"
                
                CALL navigate with ROUTES.RESTRICTED
            } CATCH error {
                LOG error "Registration failed"
                
                EXTRACT error message
                SET error state
            } FINALLY {
                SET isLoading to false
            }
        }

        DECLARE function handleEmailChange with param:
            e type ChangeEvent
        return void {
            SET email from event
            IF error {
                SET error to null
            }
        }

        DECLARE function handlePasswordChange with param:
            e type ChangeEvent
        return void {
            SET password from event
            IF error {
                SET error to null
            }
        }

        DECLARE function handleConfirmPasswordChange with param:
            e type ChangeEvent
        return void {
            SET confirmPassword from event
            IF error {
                SET error to null
            }
        }

        DECLARE function handlePasswordFocus
        return void {
            SET showPasswordRequirements to true
        }

        DECLARE function handlePasswordBlur
        return void {
            IF no password {
                SET showPasswordRequirements to false
            }
        }

        RENDER registration form with:
            - title
            - error display if error exists
            - email input with onChange handler
            - password input with focus/blur handlers
            - password requirements hint if showPasswordRequirements
            - confirm password input
            - submit button disabled if isLoading
            - link to login
            - info about default role
    }

    EXPORT Registration
}


DECLARE module "ProtectedRoute.tsx" {
    DECLARE interface "ProtectedRouteProps" {
        DECLARE children type ReactNode
    }

    DECLARE function ProtectedRoute with param:
        children type ReactNode
    return type ReactElement {
        GET isAuthenticated and isLoading from useAuth
        GET location from useLocation
        
        LOG "ProtectedRoute check"
        
        IF isLoading {
            RENDER loading state centered
            RETURN
        }
        
        IF not isAuthenticated {
            LOG "User not authenticated, redirecting"
            RENDER Navigate to ROUTES.LOGIN with state
            RETURN
        }
        
        RENDER children
    }

    EXPORT ProtectedRoute
}


//---------------------------------------
// Components - Layout & Navigation:
//---------------------------------------

DECLARE module "Layout.tsx" {
    DECLARE interface "LayoutProps" {
        DECLARE children type ReactNode
    }

    DECLARE function Layout with param:
        children type ReactNode
    return type ReactElement {
        GET isAuthenticated and isLoading from useAuth
        
        IF isLoading {
            RENDER loading state centered
            RETURN
        }
        
        IF not isAuthenticated {
            RENDER children without sidebar
            RETURN
        }
        
        RENDER flex container with:
            - Sidebar component
            - main content area with children
    }

    EXPORT Layout
}


DECLARE module "Sidebar.tsx" {
    DECLARE interface "NavItem" {
        DECLARE label type string
        DECLARE path type string
        DECLARE roles type array of RoleType
    }

    DECLARE constant navigationItems as array of NavItem with all dashboards

    DECLARE function Sidebar
    return type ReactElement {
        GET user, token, logout, isAuthenticated from useAuth
        GET navigate from useNavigate

        DECLARE async function handleLogout
        return Promise type void {
            LOG "Initiating logout process"
            
            TRY {
                IF token exists {
                    CALL authApi.logout with token
                    LOG "Backend logout successful"
                }
            } CATCH error {
                LOG error "Backend logout failed"
            }
            
            CALL logout
            
            CALL navigate with ROUTES.LOGIN
            LOG "Logout complete"
        }

        IF not isAuthenticated or no user {
            RENDER empty fragment
            RETURN
        }

        FILTER navigationItems by user role
        GET userNavItems

        RENDER sidebar with:
            - user info section
            - navigation menu with NavLink for each item
            - logout button at bottom
            - dev info if dev mode
    }

    EXPORT Sidebar
}


//---------------------------------------
// Components - Dashboards:
//---------------------------------------

DECLARE module "DashboardRouter.tsx" {
    DECLARE function DashboardRouter
    return type ReactElement {
        GET user from useAuth
        GET navigate from useNavigate

        USE effect on user change {
            IF user AND pathname equals dashboard {
                GET redirectPath from ROLE_REDIRECT
                CALL navigate with redirectPath
            }
        }

        RENDER Routes with:
            - Route for restricted dashboard
            - Route for employee dashboard
            - Route for manager dashboard
    }

    EXPORT DashboardRouter
}


DECLARE module "Dashboard.tsx" {
    DECLARE function Dashboard
    return type ReactElement {
        GET user and isLoading from useAuth
        GET navigate from useNavigate

        USE effect on user and isLoading change {
            IF isLoading {
                RETURN
            }
            
            IF no user {
                LOG error "No user found"
                CALL navigate with login
                RETURN
            }
            
            GET redirectPath from ROLE_REDIRECT
            
            IF redirectPath exists {
                LOG "Redirecting to role dashboard"
                CALL navigate with redirectPath
            } ELSE {
                LOG warn "No redirect path configured"
            }
        }

        IF isLoading or no user {
            RENDER loading message
            RETURN
        }

        RENDER redirecting message
    }

    EXPORT Dashboard
}


DECLARE module "RestrictedDashboard.tsx" {
    DECLARE function RestrictedDashboard
    return type ReactElement {
        GET user from useAuth
        GET requestUpgrade, isLoading, error, success from useUpgradeRequest

        LOG "Restricted Dashboard - Auth State"

        DECLARE async function handleRequestAccess
        return Promise type void {
            LOG "User requesting employee access"
            CALL requestUpgrade
        }

        RENDER Layout with:
            - page title
            - welcome section
            - info about restricted access
            - success message if success
            - error message if error
            - request access button if not success
            - info card about employee access
            - dev info if dev mode
    }

    EXPORT RestrictedDashboard
}


DECLARE module "EmployeeDashboard.tsx" {
    DECLARE function EmployeeDashboard
    return type ReactElement {
        GET user from useAuth
        GET reimbursements, isLoading, error, refresh, filterByStatus, currentFilter from useReimbursements
        GET createReimbursement, isCreating, createError, resetCreate from useCreateReimbursement
        
        DECLARE state showCreateForm type boolean initial false
        DECLARE state description type string initial empty
        DECLARE state type type ReimbursementType initial 'OTHER'

        DECLARE async function handleCreateSubmit with param:
            e type FormEvent
        return Promise type void {
            PREVENT default
            
            CREATE data object with description and type
            
            GET result from createReimbursement with data
            
            IF result {
                CLEAR form fields
                SET showCreateForm to false
                CALL refresh
            }
        }

        DECLARE function handleCancelCreate
        return void {
            CLEAR form fields
            SET showCreateForm to false
            CALL resetCreate
        }

        DECLARE function getStatusColor with param:
            status type ReimbursementStatus
        return string {
            SWITCH on status return appropriate color
        }

        RENDER Layout with:
            - page title
            - welcome message
            - action buttons for create and filter
            - create form if showCreateForm
            - loading state if isLoading
            - error display if error
            - reimbursements list with cards
            - empty state if no reimbursements
    }

    EXPORT EmployeeDashboard
}


DECLARE module "ManagerDashboard.tsx" {
    DECLARE function ManagerDashboard
    return type ReactElement {
        GET user from useAuth
        GET reimbursements, isLoading, error, filterByStatus, currentFilter, resolveReimbursement, isResolving, resolveError from useManagerReimbursements
        
        DECLARE state selectedReimbursement type Reimbursement or null initial null
        DECLARE state resolutionStatus type ReimbursementStatus initial 'APPROVED'
        DECLARE state comment type string initial empty
        DECLARE state showResolveModal type boolean initial false

        DECLARE function handleOpenResolve with param:
            reimbursement type Reimbursement
            status type ReimbursementStatus
        return void {
            SET selectedReimbursement to reimbursement
            SET resolutionStatus to status
            SET comment to empty
            SET showResolveModal to true
        }

        DECLARE function handleCloseResolve
        return void {
            SET selectedReimbursement to null
            SET resolutionStatus to APPROVED
            SET comment to empty
            SET showResolveModal to false
        }

        DECLARE async function handleSubmitResolution
        return Promise type void {
            IF no selectedReimbursement {
                RETURN
            }

            GET success from resolveReimbursement with id, status, and comment

            IF success {
                CALL handleCloseResolve
            }
        }

        DECLARE function getStatusColor with param:
            status type ReimbursementStatus
        return string {
            SWITCH on status return appropriate color
        }

        RENDER Layout with:
            - page title
            - welcome message
            - filter buttons
            - loading state if isLoading
            - error display if error
            - reimbursements list with:
                - employee email
                - status badge
                - type
                - description
                - approve/deny buttons if pending
            - empty state if no reimbursements
            - resolve modal if showResolveModal with:
                - reimbursement details
                - resolve error if resolveError
                - comment textarea
                - confirm/cancel buttons
    }

    EXPORT ManagerDashboard
}


//---------------------------------------
// Main App:
//---------------------------------------

DECLARE module "App.tsx" {
    DECLARE function App
    return type ReactElement {
        RENDER AuthProvider wrapping:
            RENDER Router wrapping:
                RENDER Routes with:
                    - Route for login
                    - Route for registration
                    - Route for dashboard with ProtectedRoute wrapping DashboardRouter
                    - Route for root redirecting to login
                    - Route for catch-all redirecting to login
    }

    EXPORT App
}


DECLARE module "main.tsx" {
    GET root element from DOM
    CREATE root with ReactDOM

    RENDER in StrictMode:
        - App component
}

```