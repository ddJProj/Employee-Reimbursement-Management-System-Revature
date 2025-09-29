package com.ddjproj.revature.controller.auth;

import java.util.HashMap;
import java.util.Map;

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
     * 
     * @param request
     * @return
     * @throws EmailValidationException 
     */
    @PostMapping("/register")
    public ResponseEntity<LoginAuthResponseDTO> register(@RequestBody RegisterAuthRequestDTO request) throws ApplicationException {
        return ResponseEntity.ok(authenticationService.register(request));
        
    }

    /**
     * 
     * @param request
     * @return
     * @throws InvalidPasswordException 
     */
    @PostMapping("/authenticate")
    public ResponseEntity<LoginAuthResponseDTO> authenticate(@RequestBody LoginAuthRequestDTO request) throws InvalidPasswordException {
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
        if (authHeader != null && authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);
            tokenBlacklist.blacklistToken(token); // deauth the token for session
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "You have successfully logged out of the system.");
        return ResponseEntity.ok(response);
    }
    


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("password");
        
        try {
            UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


            String hashedPassword = passwordEncoder.encode(newPassword);     // hash the new password
            user.setPasswordHash(hashedPassword); // update stored hash value for useraccount
            userAccountRepository.save(user);  // persist the new hash
            
            return ResponseEntity.ok("Password reset successful. New hash: " + hashedPassword);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testAuthEndpoint() {
        return ResponseEntity.ok("Endpoint is correctly authorizing.");
    }
    

    
}
