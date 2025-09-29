package com.ddjproj.revature.service;

import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.domain.enums.Permissions;
import com.ddjproj.revature.exception.validation.UnauthorizedException;
import com.ddjproj.revature.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {

    private final UserAccountRepository userAccountRepository;
    private final PermissionEvaluator permissionEvaluator;

    @Autowired
    public PermissionService(UserAccountRepository userAccountRepository,
                             PermissionEvaluator permissionEvaluator) {
        this.userAccountRepository = userAccountRepository;
        this.permissionEvaluator = permissionEvaluator;
    }

    /**
     * Get the current authenticated user
     */
    public UserAccount getCurrentUser() throws UnauthorizedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }

        String email = auth.getName();
        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + email));
    }

    /**
     * Check if current user has the required permission
     */
    public boolean hasPermission(Permissions permission) throws UnauthorizedException {
        return hasPermission(permission, null);
    }

    /**
     * Check if current user has the required permission for a specific resource
     */
    public boolean hasPermission(Permissions permission, Object resource) throws UnauthorizedException {
        UserAccount currentUser = getCurrentUser();
        return permissionEvaluator.hasPermission(currentUser, permission, resource);
    }

    /**
     * Require that the current user has the permission, throw exception if not
     */
    public void requirePermission(Permissions permission) throws UnauthorizedException {
        requirePermission(permission, null);
    }

    /**
     * Require that the current user has the permission for a resource, throw exception if not
     */
    public void requirePermission(Permissions permission, Object resource) throws UnauthorizedException {
        if (!hasPermission(permission, resource)) {
            throw new UnauthorizedException("Permission denied: " + permission.name());
        }
    }
}
