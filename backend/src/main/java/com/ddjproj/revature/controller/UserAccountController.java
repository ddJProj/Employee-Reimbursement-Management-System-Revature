package com.ddjproj.revature.controller;

import com.ddjproj.revature.dto.account.AccountUpgradeRequestDTO;
import com.ddjproj.revature.dto.account.UserAccountDTO;
import com.ddjproj.revature.exception.ResourceNotFoundException;
import com.ddjproj.revature.exception.validation.UnauthorizedException;
import com.ddjproj.revature.exception.validation.ValidationException;
import com.ddjproj.revature.service.accounts.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for user account management operations
 * Handles user listing, role upgrades, and account deletion
 *
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserAccountController {

    private static final Logger logger = LoggerFactory.getLogger(UserAccountController.class);

    private final UserAccountService userAccountService;

    @Autowired
    public UserAccountController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    /**
     * Get all users in the system (Manager only)
     * @return List of all user accounts
     * @throws UnauthorizedException if user lacks permission
     * Endpoint: GET /api/users
     * Required Permission: VIEW_ALL_USERACCOUNTS
     */
    @GetMapping
    public ResponseEntity<List<UserAccountDTO>> getAllUsers() {
        logger.info("Request to get all users");

        List<UserAccountDTO> users = userAccountService.getAllUsers();

        logger.info("Returning {} users", users.size());
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     * @param id User account ID
     * @return User account data
     * @throws ResourceNotFoundException if user not found
     * Endpoint: GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserAccountDTO> getUserById(@PathVariable Long id)
            throws ResourceNotFoundException {
        logger.info("Request to get user with id: {}", id);

        UserAccountDTO user = userAccountService.getUserById(id);

        logger.info("Returning user: {}", user.getEmail());
        return ResponseEntity.ok(user);
    }

    /**
     * Request upgrade from RESTRICTED to EMPLOYEE role
     * Automatically processes the upgrade (no manager approval needed for MVP)
     * @param request Contains userAccountId requesting upgrade
     * @return Updated user account with EMPLOYEE role
     * @throws ResourceNotFoundException if user not found
     * @throws ValidationException if user is not RESTRICTED role
     * Endpoint: POST /api/users/upgrade
     * Required Role: RESTRICTED
     */
    @PostMapping("/upgrade")
    public ResponseEntity<UserAccountDTO> requestUpgrade(
            @RequestBody AccountUpgradeRequestDTO request)
            throws ResourceNotFoundException, ValidationException {
        logger.info("Upgrade request received for user id: {}", request.getUserAccountId());

        UserAccountDTO upgradedUser = userAccountService.processUpgradeRequest(request);

        logger.info("User {} upgraded to EMPLOYEE successfully",
                upgradedUser.getEmail());

        return ResponseEntity.ok(upgradedUser);
    }

    /**
     * Delete user account (Manager only)
     * Cannot delete own account
     * @param id User account ID to delete
     * @return Success message
     * @throws ResourceNotFoundException if user not found
     * @throws UnauthorizedException if trying to delete own account
     * Endpoint: DELETE /api/users/{id}
     * Required Permission: DELETE_USER
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id)
            throws ResourceNotFoundException {
        logger.info("Request to delete user with id: {}", id);

        userAccountService.deleteUser(id);

        logger.info("User {} deleted successfully", id);

        return ResponseEntity.ok("User deleted successfully");
    }

    /**
     * Test endpoint to verify controller is working
     * @return Test message
     * Endpoint: GET /api/users/test
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("User controller test endpoint called");
        return ResponseEntity.ok("User controller is working correctly");
    }
}
