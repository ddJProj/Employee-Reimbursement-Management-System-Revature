
```

//---------------------------------------
//---------------------------------------
// BACKEND MODULE - Service Layer
// Spring Boot Application
//---------------------------------------
//---------------------------------------


//---------------------------------------
// Repository Implementations (JPA):
//---------------------------------------

DECLARE interface "JpaUserAccountRepository" extends JpaRepository {
    DECLARE function findUserAccountByEmail with param:
        email type String
    return Optional type UserAccount

    DECLARE function existsByEmail with param:
        email type String
    return boolean

    DECLARE function findUserAccountByRole with param:
        role type Roles
    return List type UserAccount

    DECLARE function existsByRole with param:
        role type Roles
    return boolean
}


DECLARE class "UserAccountRepoImpl" implements UserAccountRepository {
    DECLARE jpaUserAccountRepository type JpaUserAccountRepository

    IMPLEMENT function findByEmail with param:
        email type String
    return Optional type UserAccount {
        RETURN jpaUserAccountRepository.findUserAccountByEmail(email)
    }

    IMPLEMENT function existsByEmail with param:
        email type String
    return boolean {
        RETURN jpaUserAccountRepository.existsByEmail(email)
    }

    IMPLEMENT function findByRole with param:
        role type String
    return List type UserAccount {
        TRY {
            CONVERT role string to Roles enum
            RETURN jpaUserAccountRepository.findUserAccountByRole(enumRole)
        } CATCH IllegalArgumentException {
            RETURN empty list
        }
    }

    IMPLEMENT function existsByRole with param:
        targetRole type Roles
    return boolean {
        RETURN jpaUserAccountRepository.existsByRole(targetRole)
    }

    IMPLEMENT function save with param:
        userAccount type UserAccount
    return UserAccount {
        RETURN jpaUserAccountRepository.save(userAccount)
    }

    IMPLEMENT function findById with param:
        id type Long
    return Optional type UserAccount {
        RETURN jpaUserAccountRepository.findById(id)
    }

    IMPLEMENT function findAll
    return List type UserAccount {
        RETURN jpaUserAccountRepository.findAll()
    }

    IMPLEMENT function deleteById with param:
        id type Long
    return void {
        CALL jpaUserAccountRepository.deleteById(id)
    }
}


DECLARE interface "JpaReimbursementRepository" extends JpaRepository {
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

    DECLARE function findAllOrderByIdDesc
    return List type Reimbursement

    DECLARE function findByUserIdOrderByIdDesc with param:
        userId type Long
    return List type Reimbursement
}


DECLARE class "ReimbursementRepoImpl" implements ReimbursementRepository {
    DECLARE jpaRepository type JpaReimbursementRepository

    IMPLEMENT function save with param:
        reimbursement type Reimbursement
    return Reimbursement {
        RETURN jpaRepository.save(reimbursement)
    }

    IMPLEMENT function findById with param:
        id type Long
    return Optional type Reimbursement {
        RETURN jpaRepository.findById(id)
    }

    IMPLEMENT function findAll
    return List type Reimbursement {
        RETURN jpaRepository.findAllOrderByIdDesc()
    }

    IMPLEMENT function findByUserId with param:
        userId type Long
    return List type Reimbursement {
        RETURN jpaRepository.findByUserIdOrderByIdDesc(userId)
    }

    IMPLEMENT function findByStatus with param:
        status type ReimbursementStatus
    return List type Reimbursement {
        RETURN jpaRepository.findByStatus(status)
    }

    IMPLEMENT function findByUserIdAndStatus with param:
        userId type Long
        status type ReimbursementStatus
    return List type Reimbursement {
        RETURN jpaRepository.findByUserIdAndStatus(userId, status)
    }

    IMPLEMENT function deleteById with param:
        id type Long
    return void {
        CALL jpaRepository.deleteById(id)
    }
}


//---------------------------------------
// DTOs (Data Transfer Objects):
//---------------------------------------

DECLARE class "LoginAuthRequestDTO" {
    DECLARE email type String
    DECLARE password type String
}


DECLARE class "RegisterAuthRequestDTO" {
    DECLARE email type String
    DECLARE password type String
}


DECLARE class "LoginAuthResponseDTO" {
    DECLARE token type String
    DECLARE role type String
    DECLARE userId type Long
    DECLARE email type String
    DECLARE permissions type Set of String
}


DECLARE class "UserAccountDTO" {
    DECLARE userAccountId type Long
    DECLARE email type String
    DECLARE password type String
    DECLARE role type Roles
    DECLARE permissions type Set of String
}


DECLARE class "AccountUpgradeRequestDTO" {
    DECLARE userAccountId type Long
}


DECLARE class "CreateReimbursementDTO" {
    DECLARE description type String (min 10 chars, required)
    DECLARE type type ReimbursementType (required)
}


DECLARE class "ReimbursementResponseDTO" {
    DECLARE id type Long
    DECLARE userId type Long
    DECLARE userEmail type String
    DECLARE description type String
    DECLARE type type ReimbursementType
    DECLARE status type ReimbursementStatus
}


DECLARE class "ResolveReimbursementDTO" {
    DECLARE status type ReimbursementStatus (required)
    DECLARE comment type String (optional)
}


//---------------------------------------
// Mappers:
//---------------------------------------

DECLARE class "UserAccountMapper" {
    DECLARE function toDto with param:
        entity type UserAccount
    return UserAccountDTO {
        IF entity is null {
            RETURN null
        }
        CREATE UserAccountDTO with values from entity
        CONVERT permissions to string set
        RETURN DTO
    }

    DECLARE function toEntity with param:
        dto type UserAccountDTO
    return UserAccount {
        IF dto is null {
            RETURN null
        }
        CREATE new UserAccount entity
        SET email and role from dto
        RETURN entity
    }

    DECLARE function updateEntityFromDto with param:
        entity type UserAccount
        dto type UserAccountDTO
    return void {
        IF entity is null OR dto is null {
            RETURN
        }
        UPDATE entity fields from dto if not null
    }
}


DECLARE class "ReimbursementMapper" {
    DECLARE function toResponseDto with param:
        entity type Reimbursement
    return ReimbursementResponseDTO {
        IF entity is null {
            RETURN null
        }
        CREATE ReimbursementResponseDTO with values from entity
        RETURN DTO
    }

    DECLARE function toEntity with param:
        dto type CreateReimbursementDTO
    return Reimbursement {
        IF dto is null {
            RETURN null
        }
        CREATE new Reimbursement entity
        SET description and type from dto
        RETURN entity with default PENDING status
    }

    DECLARE function updateEntityFromDto with param:
        entity type Reimbursement
        dto type CreateReimbursementDTO
    return void {
        IF entity is null OR dto is null {
            RETURN
        }
        UPDATE entity description and type from dto
    }
}


//---------------------------------------
// Authentication & Security Services:
//---------------------------------------

DECLARE class "JwtService" {
    DECLARE secretKey type String (from config)
    DECLARE jwtExpiration type long (from config)

    DECLARE function extractUsername with param:
        token type String
    return String {
        EXTRACT username claim from token
        RETURN username
    }

    DECLARE function extractClaim with param:
        token type String
        claimsResolver type Function
    return generic type T {
        EXTRACT all claims from token
        APPLY claimsResolver function to claims
        RETURN result
    }

    DECLARE function generateToken with param:
        userDetails type UserDetails
    return String {
        CALL buildToken with empty claims map and userDetails
        RETURN JWT token string
    }

    DECLARE function buildToken with param:
        extraClaims type Map
        userDetails type UserDetails
        expiration type long
    return String {
        CREATE JWT token with required values:
            - username as subject
            - issued time as current time
            - expiration time calculated
        SIGN token with secret key
        RETURN token string
    }

    DECLARE function isTokenValid with param:
        token type String
        userDetails type UserDetails
    return boolean {
        EXTRACT username from token
        CHECK username matches userDetails
        CHECK token not expired
        RETURN validation result
    }

    DECLARE function isTokenExpired with param:
        token type String
    return boolean {
        EXTRACT expiration date from token
        COMPARE to current date
        RETURN true if expired
    }

    DECLARE function extractExpiration with param:
        token type String
    return Date {
        EXTRACT expiration claim from token
        RETURN date
    }

    DECLARE function extractAllClaims with param:
        token type String
    return Claims {
        PARSE JWT token with secret key
        RETURN claims body
    }
}


DECLARE class "TokenBlacklistService" {
    DECLARE blacklistedTokens type Set of String

    DECLARE function blacklistToken with param:
        token type String
    return void {
        ADD token to blacklistedTokens set
    }

    DECLARE function isTokenBlackListed with param:
        token type String
    return boolean {
        CHECK if token exists in blacklistedTokens
        RETURN result
    }
}


DECLARE class "UserDetailService" implements UserDetailsService {
    DECLARE userAccountRepoImpl type UserAccountRepoImpl

    IMPLEMENT function loadUserByUsername with param:
        email type String
    return UserDetails {
        FIND userAccount by email
        IF not found {
            THROW UsernameNotFoundException
        }
        
        CONVERT user permissions to authorities list
        ADD role as authority with ROLE prefix
        
        CREATE UserDetails object with:
            - email as username
            - passwordHash
            - authorities list
        RETURN UserDetails
    }
}


DECLARE class "AuthenticationService" {
    DECLARE userAccountRepository type UserAccountRepository
    DECLARE userAccountService type UserAccountService
    DECLARE jwtService type JwtService
    DECLARE authenticationManager type AuthenticationManager
    DECLARE userDetailService type UserDetailService
    DECLARE pwEncoder type PasswordEncoder
    DECLARE PASSWORD_PATTERN type regex pattern

    DECLARE function validatePassword with param:
        passwordString type String
    return String {
        IF passwordString is null {
            THROW InvalidPasswordException
        }
        IF length less than 8 {
            THROW InvalidPasswordException
        }
        IF not matches PASSWORD_PATTERN {
            THROW InvalidPasswordException
        }
        RETURN passwordString
    }

    DECLARE function register with param:
        request type RegisterAuthRequestDTO
    return LoginAuthResponseDTO {
        IF email already exists {
            THROW EmailValidationException
        }
        
        VALIDATE password
        
        CREATE UserAccountDTO with:
            - email from request
            - password from request
            - role as RESTRICTED
        
        CREATE new user account via userAccountService
        LOAD userDetails
        GENERATE JWT token
        
        GET permissions from role as string set
        
        RETURN LoginAuthResponseDTO with:
            - token
            - role name
            - userId
            - email
            - permissions
    }

    DECLARE function authenticate with param:
        request type LoginAuthRequestDTO
    return LoginAuthResponseDTO {
        TRY {
            FIND userAccount by email
            IF not found {
                THROW UsernameNotFoundException
            }
            
            VERIFY password matches stored hash
            IF not matching {
                THROW InvalidPasswordException
            }
            
            AUTHENTICATE using authenticationManager
            LOAD userDetails
            GENERATE JWT token
            
            GET permissions from role as string set
            
            RETURN LoginAuthResponseDTO with all required fields
        } CATCH InvalidPasswordException {
            LOG error
            THROW exception
        } CATCH any other Exception {
            LOG error
            THROW exception
        }
    }
}


//---------------------------------------
// Permission Services:
//---------------------------------------

DECLARE class "PermissionEvaluatorImpl" implements PermissionEvaluator {
    DECLARE function hasPermission with param:
        userAccount type UserAccount
        permissionType type Permissions
        resourceObject type Object
    return boolean {
        IF userAccount role is MANAGER {
            RETURN true
        }
        
        CHECK if user has base permission in role
        IF not has base permission {
            RETURN false
        }
        
        IF resourceObject is not null {
            RETURN evaluateResourcePermission with userAccount, permission, resource
        }
        
        RETURN true
    }

    DECLARE function evaluateResourcePermission with param:
        userAccount type UserAccount
        permissionType type Permissions
        resourceObject type Object
    return boolean {
        IF resourceObject is Reimbursement {
            CAST to Reimbursement
            
            SWITCH on permissionType:
                CASE VIEW_ALL_REIMBURSEMENT_REQUESTS:
                    IF user is EMPLOYEE {
                        CHECK reimbursement belongs to user
                    }
                
                CASE VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS:
                    CHECK reimbursement belongs to user
                
                CASE VIEW_SINGLE_REIMBURSEMENT_REQUEST:
                    IF user is EMPLOYEE {
                        CHECK reimbursement belongs to user
                    }
                
                CASE EDIT_PENDING_REIMBURSEMENT:
                    CHECK reimbursement belongs to user
                    CHECK reimbursement status is PENDING
                
                DEFAULT:
                    BREAK
        }
        
        IF resourceObject is UserAccount {
            CAST to UserAccount
            
            IF permissionType is DELETE_USER {
                CHECK not trying to delete own account
            }
        }
        
        RETURN true
    }
}


DECLARE class "PermissionService" {
    DECLARE userAccountRepository type UserAccountRepository
    DECLARE permissionEvaluator type PermissionEvaluator

    DECLARE function getCurrentUser
    return UserAccount {
        GET authentication from SecurityContext
        IF auth is null OR not authenticated {
            THROW UnauthorizedException
        }
        
        EXTRACT email from authentication
        FIND user by email
        IF not found {
            THROW UnauthorizedException
        }
        
        RETURN user
    }

    DECLARE function hasPermission with param:
        permission type Permissions
        resource type Object (nullable)
    return boolean {
        GET currentUser
        RETURN permissionEvaluator.hasPermission with user, permission, resource
    }

    DECLARE function requirePermission with param:
        permission type Permissions
        resource type Object (nullable)
    return void {
        IF not hasPermission with permission and resource {
            THROW UnauthorizedException
        }
    }
}


//---------------------------------------
// Business Services:
//---------------------------------------

DECLARE class "UserAccountService" {
    DECLARE userAccountRepository type UserAccountRepository
    DECLARE userAccountMapper type UserAccountMapper
    DECLARE passwordEncoder type PasswordEncoder

    DECLARE function createUserAccount with param:
        userAccountDTO type UserAccountDTO
    return UserAccountDTO {
        LOG "Creating new user account"
        
        IF email already exists {
            THROW ValidationException
        }
        
        CONVERT DTO to entity
        
        IF password provided {
            HASH password
            SET entity passwordHash
        }
        
        IF role not specified {
            SET role to RESTRICTED
        }
        
        SAVE entity
        LOG "User account created"
        
        CONVERT entity to DTO
        RETURN DTO
    }

    DECLARE function getUserById with param:
        id type Long
    return UserAccountDTO {
        LOG "Fetching user account by id"
        
        FIND user by id
        IF not found {
            THROW ResourceNotFoundException
        }
        
        CONVERT to DTO
        RETURN DTO
    }

    DECLARE function getUserByEmail with param:
        email type String
    return UserAccountDTO {
        LOG "Fetching user account by email"
        
        FIND user by email
        IF not found {
            THROW ResourceNotFoundException
        }
        
        CONVERT to DTO
        RETURN DTO
    }

    DECLARE function getAllUsers
    return List type UserAccountDTO {
        LOG "Fetching all user accounts"
        
        GET all users from repository
        CONVERT each to DTO
        RETURN list of DTOs
    }

    DECLARE function updateUserRole with param:
        userId type Long
        newRole type Roles
    return UserAccountDTO {
        LOG "Updating user role"
        
        FIND user by id
        IF not found {
            THROW ResourceNotFoundException
        }
        
        SET user role to newRole
        SAVE user
        
        LOG "User role updated"
        
        CONVERT to DTO
        RETURN DTO
    }

    DECLARE function processUpgradeRequest with param:
        upgradeRequest type AccountUpgradeRequestDTO
    return UserAccountDTO {
        LOG "Processing upgrade request"
        
        FIND user by id
        IF not found {
            THROW ResourceNotFoundException
        }
        
        IF user role is not RESTRICTED {
            THROW ValidationException
        }
        
        RETURN updateUserRole with userId and EMPLOYEE role
    }

    DECLARE function deleteUser with param:
        userId type Long
    return void {
        LOG "Deleting user account"
        
        FIND user by id to verify exists
        IF not found {
            THROW ResourceNotFoundException
        }
        
        DELETE user by id
        LOG "User account deleted"
    }
}


DECLARE class "ReimbursementService" {
    DECLARE reimbursementRepository type ReimbursementRepository
    DECLARE userAccountRepository type UserAccountRepository
    DECLARE permissionService type PermissionService
    DECLARE reimbursementMapper type ReimbursementMapper

    DECLARE function createReimbursement with param:
        dto type CreateReimbursementDTO
    return ReimbursementResponseDTO {
        LOG "Creating new reimbursement request"
        
        CHECK permission CREATE_REIMBURSEMENT_REQUEST
        
        GET currentUser
        LOG "User creating reimbursement"
        
        CONVERT dto to entity
        SET entity userId to currentUser id
        
        SAVE entity
        LOG "Reimbursement created successfully"
        
        CONVERT to response DTO
        SET userEmail from currentUser
        RETURN response DTO
    }

    DECLARE function getReimbursementById with param:
        id type Long
    return ReimbursementResponseDTO {
        LOG "Fetching reimbursement by id"
        
        FIND reimbursement by id
        IF not found {
            THROW ResourceNotFoundException
        }
        
        CHECK permission VIEW_SINGLE_REIMBURSEMENT_REQUEST with reimbursement
        
        RETURN enrichResponseDto with reimbursement
    }

    DECLARE function getMyReimbursements with param:
        statusFilter type ReimbursementStatus (nullable)
    return List type ReimbursementResponseDTO {
        CHECK permission VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS
        
        GET currentUser
        LOG "User fetching their reimbursements"
        
        IF statusFilter is not null {
            FIND by userId and status
        } ELSE {
            FIND by userId
        }
        
        CONVERT each to response DTO and enrich
        RETURN list of DTOs
    }

    DECLARE function getAllReimbursements with param:
        statusFilter type ReimbursementStatus (nullable)
    return List type ReimbursementResponseDTO {
        CHECK permission VIEW_ALL_REIMBURSEMENT_REQUESTS
        
        LOG "Fetching all reimbursements"
        
        IF statusFilter is not null {
            FIND by status
        } ELSE {
            FIND all
        }
        
        CONVERT each to response DTO and enrich
        RETURN list of DTOs
    }

    DECLARE function updateReimbursement with param:
        id type Long
        dto type CreateReimbursementDTO
    return ReimbursementResponseDTO {
        LOG "Updating reimbursement"
        
        FIND reimbursement by id
        IF not found {
            THROW ResourceNotFoundException
        }
        
        CHECK permission EDIT_PENDING_REIMBURSEMENT with reimbursement
        
        UPDATE entity from dto
        SAVE entity
        
        LOG "Reimbursement updated successfully"
        
        RETURN enrichResponseDto with saved entity
    }

    DECLARE function resolveReimbursement with param:
        id type Long
        dto type ResolveReimbursementDTO
    return ReimbursementResponseDTO {
        LOG "Resolving reimbursement"
        
        FIND reimbursement by id
        IF not found {
            THROW ResourceNotFoundException
        }
        
        GET currentUser
        IF user role is not MANAGER {
            THROW UnauthorizedException
        }
        
        IF reimbursement status is not PENDING {
            THROW ValidationException
        }
        
        LOG "User resolving reimbursement"
        
        SET reimbursement status from dto
        SAVE
        
        LOG "Reimbursement resolved successfully"
        
        RETURN enrichResponseDto with saved entity
    }

    DECLARE function enrichResponseDto with param:
        reimbursement type Reimbursement
    return ReimbursementResponseDTO {
        CONVERT to response DTO
        
        FIND user by reimbursement userId
        IF found {
            SET dto userEmail from user email
        }
        
        RETURN dto
    }
}


//---------------------------------------
// Security Configuration:
//---------------------------------------

DECLARE class "JwtAuthenticationFilter" extends OncePerRequestFilter {
    DECLARE tokenBlacklistService type TokenBlacklistService
    DECLARE jwtService type JwtService
    DECLARE userDetailService type UserDetailService

    IMPLEMENT function doFilterInternal with param:
        request type HttpServletRequest
        response type HttpServletResponse
        filterChain type FilterChain
    return void {
        LOG "Processing request"
        
        GET path from request
        IF path contains auth endpoints {
            CONTINUE filter chain without validation
            RETURN
        }
        
        GET Authorization header
        IF header is null OR not starts with Bearer {
            CONTINUE filter chain
            RETURN
        }
        
        TRY {
            EXTRACT token from header
            
            IF token is blacklisted {
                LOG "Token is blacklisted"
                CONTINUE filter chain
                RETURN
            }
            
            EXTRACT username from token
            
            IF username exists AND no authentication in SecurityContext {
                LOAD userDetails
                
                IF token is valid {
                    CREATE authentication token
                    SET authentication details
                    SET authentication in SecurityContext
                }
            }
        } CATCH any Exception {
            LOG error
        }
        
        CONTINUE filter chain
    }
}


DECLARE class "SecurityBeansConfig" {
    DECLARE jwtAuthenticationFilter type JwtAuthenticationFilter
    DECLARE userDetailService type UserDetailService

    DECLARE function securityFilterChain with param:
        http type HttpSecurity
    return SecurityFilterChain {
        CONFIGURE http security:
            - DISABLE CSRF
            - ENABLE CORS
            - CONFIGURE authorization rules
            - SET session management to STATELESS
            - ADD authenticationProvider
            - ADD jwtAuthenticationFilter
            - CONFIGURE headers for H2 console (dev only)
        
        RETURN built security filter chain
    }

    DECLARE function authenticationManager with param:
        config type AuthenticationConfiguration
    return AuthenticationManager {
        RETURN config authenticationManager
    }

    DECLARE function authenticationProvider
    return AuthenticationProvider {
        CREATE DaoAuthenticationProvider
        SET userDetailsService
        SET passwordEncoder
        RETURN provider
    }

    DECLARE function corsConfigurationSource
    return CorsConfigurationSource {
        CREATE CorsConfiguration with:
            - allowed origins
            - allowed methods
            - allowed headers
            - exposed headers
            - allow credentials
            - max age
        
        REGISTER configuration for all paths
        RETURN source
    }

    DECLARE function passwordEncoder
    return PasswordEncoder {
        RETURN new BCryptPasswordEncoder
    }
}


//---------------------------------------
// Controllers:
//---------------------------------------

DECLARE class "AuthenticationController" {
    DECLARE tokenBlacklist type TokenBlacklistService
    DECLARE authenticationService type AuthenticationService
    DECLARE userAccountRepository type UserAccountRepository
    DECLARE passwordEncoder type PasswordEncoder

    DECLARE function register with param:
        request type RegisterAuthRequestDTO
    return ResponseEntity type LoginAuthResponseDTO {
        LOG "Registration request received"

        TRY {
            CALL authenticationService.register with request
            GET response
            LOG "User registered successfully"
            RETURN ok response with data
        } CATCH EmailValidationException {
            LOG warn "Registration failed - email validation error"
            THROW exception
        } CATCH Exception {
            LOG error "Registration failed"
            THROW exception
        }
    }

    DECLARE function login with param:
        request type LoginAuthRequestDTO
    return ResponseEntity type LoginAuthResponseDTO {
        LOG "Login request received"

        TRY {
            CALL authenticationService.authenticate with request
            GET response
            LOG "User logged in successfully"
            RETURN ok response with data
        } CATCH InvalidPasswordException {
            LOG warn "Login failed - invalid credentials"
            THROW exception
        } CATCH Exception {
            LOG error "Login failed"
            THROW exception
        }
    }

    DECLARE function logout with param:
        authHeader type String
    return ResponseEntity type Map {
        LOG "Logout request received"

        IF authHeader exists AND starts with Bearer {
            EXTRACT token
            BLACKLIST token
            LOG "Token successfully blacklisted"
        } ELSE {
            LOG warn "Logout called without valid Authorization header"
        }
        
        CREATE success response message
        RETURN ok response
    }

    DECLARE function resetPassword with param:
        request type Map
    return ResponseEntity type String {
        GET email and newPassword from request
        LOG "Password reset request"
        
        TRY {
            FIND user by email
            IF not found {
                THROW UsernameNotFoundException
            }
            
            HASH new password
            UPDATE user passwordHash
            SAVE user
            
            LOG "Password reset successful"
            RETURN ok response with success message
        } CATCH UsernameNotFoundException {
            LOG warn "Password reset failed - user not found"
            RETURN not found status with error message
        } CATCH Exception {
            LOG error "Password reset failed"
            RETURN internal server error with message
        }
    }
}


DECLARE class "UserAccountController" {
    DECLARE userAccountService type UserAccountService

    DECLARE function getAllUsers
    return ResponseEntity type List of UserAccountDTO {
        LOG "Request to get all users"

        GET users from userAccountService.getAllUsers()

        LOG "Returning users count"
        RETURN ok response with users
    }

    DECLARE function getUserById with param:
        id type Long
    return ResponseEntity type UserAccountDTO {
        LOG "Request to get user with id"

        GET user from userAccountService.getUserById with id

        LOG "Returning user"
        RETURN ok response with user
    }

    DECLARE function requestUpgrade with param:
        request type AccountUpgradeRequestDTO
    return ResponseEntity type UserAccountDTO {
        LOG "Upgrade request received"

        GET upgradedUser from userAccountService.processUpgradeRequest with request

        LOG "User upgraded to EMPLOYEE successfully"

        RETURN ok response with upgradedUser
    }

    DECLARE function deleteUser with param:
        id type Long
    return ResponseEntity type String {
        LOG "Request to delete user"

        CALL userAccountService.deleteUser with id

        LOG "User deleted successfully"

        RETURN ok response with success message
    }

    DECLARE function testEndpoint
    return ResponseEntity type String {
        LOG "User controller test endpoint called"
        RETURN ok response with test message
    }
}


DECLARE class "ReimbursementController" {
    DECLARE reimbursementService type ReimbursementService

    DECLARE function createReimbursement with param:
        dto type CreateReimbursementDTO
    return ResponseEntity type ReimbursementResponseDTO {
        GET response from reimbursementService.createReimbursement with dto
        RETURN created status with response
    }

    DECLARE function getReimbursement with param:
        id type Long
    return ResponseEntity type ReimbursementResponseDTO {
        GET response from reimbursementService.getReimbursementById with id
        RETURN ok response
    }

    DECLARE function getMyReimbursements with param:
        status type ReimbursementStatus (optional)
    return ResponseEntity type List of ReimbursementResponseDTO {
        GET response from reimbursementService.getMyReimbursements with status
        RETURN ok response
    }

    DECLARE function getAllReimbursements with param:
        status type ReimbursementStatus (optional)
    return ResponseEntity type List of ReimbursementResponseDTO {
        GET response from reimbursementService.getAllReimbursements with status
        RETURN ok response
    }

    DECLARE function updateReimbursement with param:
        id type Long
        dto type CreateReimbursementDTO
    return ResponseEntity type ReimbursementResponseDTO {
        GET response from reimbursementService.updateReimbursement with id and dto
        RETURN ok response
    }

    DECLARE function resolveReimbursement with param:
        id type Long
        dto type ResolveReimbursementDTO
    return ResponseEntity type ReimbursementResponseDTO {
        GET response from reimbursementService.resolveReimbursement with id and dto
        RETURN ok response
    }
}


//---------------------------------------
// Exception Handling:
//---------------------------------------

DECLARE class "ApplicationException" extends Exception {
    // Base exception for all application exceptions
}

DECLARE class "ResourceNotFoundException" extends ApplicationException {
    // Thrown when requested resource not found
}

DECLARE class "ValidationException" extends ApplicationException {
    // Thrown when validation fails
}

DECLARE class "UnauthorizedException" extends ApplicationException {
    // Thrown when user lacks required permissions
}

DECLARE class "InvalidPasswordException" extends ApplicationException {
    // Thrown when password doesn't meet requirements
}

DECLARE class "EmailValidationException" extends ApplicationException {
    // Thrown when email validation fails
}

DECLARE class "DatabaseException" extends ApplicationException {
    // Thrown when database operations fail
}


```