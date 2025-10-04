package com.ddjproj.revature.controller.auth;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ddjproj.revature.dto.auth.LoginAuthRequestDTO;
import com.ddjproj.revature.dto.auth.LoginAuthResponseDTO;
import com.ddjproj.revature.dto.auth.RegisterAuthRequestDTO;
import com.ddjproj.revature.exception.ApplicationException;
import com.ddjproj.revature.exception.security.InvalidPasswordException;
import com.ddjproj.revature.exception.validation.EmailValidationException;
import com.ddjproj.revature.service.auth.AuthenticationService;
import com.ddjproj.revature.service.auth.TokenBlacklistService;
import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.repository.UserAccountRepository;



// TODO: UPDATE LOCATION, IMPORTS, AND ENDPOINTS


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {


    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    private final TokenBlacklistService tokenBlacklist;
    private final AuthenticationService authenticationService;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationController(AuthenticationService authenticationService, PasswordEncoder passwordEncoder, UserAccountRepository userAccountRepository, TokenBlacklistService tokenBlacklist){
        this.authenticationService = authenticationService;
        this.passwordEncoder = passwordEncoder;
        this.userAccountRepository = userAccountRepository;
        this.tokenBlacklist = tokenBlacklist;

    }


    /**
     * user new account registration endpoint
     *
     * @param request
     * @return
     * @throws EmailValidationException invalid email provided
     */
    @PostMapping("/register")
    public ResponseEntity<LoginAuthResponseDTO> register(@RequestBody RegisterAuthRequestDTO request) throws ApplicationException {
        logger.info("Registration request received for email: {}", request.getEmail());

        try {
            LoginAuthResponseDTO response = authenticationService.register(request);
            logger.info("User {} registered successfully with role: {}",
                    request.getEmail(), response.getRole());
            return ResponseEntity.ok(response);
        } catch (EmailValidationException e) {
            logger.warn("Registration failed - email validation error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Registration failed for email {}: {}", request.getEmail(), e.getMessage());
            throw e;
        }

    }

    /**
     * User login endpoint
     * Authenticates user and returns JWT token
     *
     * @param request credentials (email, password)
     * @return token and user data
     * @throws InvalidPasswordException if credentials are invalid
     */
    @PostMapping("/login")
    public ResponseEntity<LoginAuthResponseDTO> login(@RequestBody LoginAuthRequestDTO request)
            throws InvalidPasswordException {
        logger.info("Login request received for email: {}", request.getEmail());

        try {
            LoginAuthResponseDTO response = authenticationService.authenticate(request);
            logger.info("User {} logged in successfully with role: {}",
                    request.getEmail(), response.getRole());
            return ResponseEntity.ok(response);
        } catch (InvalidPasswordException e) {
            logger.warn("Login failed for email {}: Invalid credentials", request.getEmail());
            throw e;
        } catch (Exception e) {
            logger.error("Login failed for email {}: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    /**
     * FIXME: remove / remove dependencies where remaining
     * Alternative authentication endpoint
     * Alias for /login endpoint, use /login, as it is better developed
     *
     * @param request
     * @return
     * @throws InvalidPasswordException - for invalid password entries
     */
    @PostMapping("/authenticate")
    public ResponseEntity<LoginAuthResponseDTO> authenticate(@RequestBody LoginAuthRequestDTO request) throws InvalidPasswordException {

        logger.info("Authentication request received for email: {}", request.getEmail());
        return ResponseEntity.ok(authenticationService.authenticate(request));
        
    }

    /**
     * blacklists user's token, logs user from system
     * 
     * @param authHeader
     * @return
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        logger.info("Logout request received");

        if (authHeader != null && authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);
            tokenBlacklist.blacklistToken(token); // deauth the token for session
            logger.info("Token successfully blacklisted");

        } else {
            logger.warn("Logout called without valid Authorization header");
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "You have successfully logged out of the system.");
        return ResponseEntity.ok(response);
    }
    


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("password");

        logger.info("Password reset request for email: {}", email);
        try {
            UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


            String hashedPassword = passwordEncoder.encode(newPassword);     // hash the new password
            user.setPasswordHash(hashedPassword); // update stored hash value for useraccount
            userAccountRepository.save(user);  // persist the new hash

            logger.info("Password reset successful for user: {}", email);
            return ResponseEntity.ok("Password reset successful");
        } catch (UsernameNotFoundException e) {
            logger.warn("Password reset failed - user not found: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: User not found");
        } catch (Exception e) {
            logger.error("Password reset failed for {}: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }

    }

//    @GetMapping("/test")
//    public ResponseEntity<String> testAuthEndpoint() {
//        return ResponseEntity.ok("Endpoint is correctly authorizing.");
//    }
    

    
}
