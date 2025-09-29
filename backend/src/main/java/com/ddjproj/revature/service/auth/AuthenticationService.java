package com.ddjproj.revature.service.auth;


import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.ddjproj.revature.domain.enums.Roles;
import com.ddjproj.revature.exception.validation.ValidationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
// https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/bcrypt/BCrypt.html

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ddjproj.revature.dto.account.UserAccountDTO;
import com.ddjproj.revature.dto.auth.LoginAuthRequestDTO;
import com.ddjproj.revature.dto.auth.LoginAuthResponseDTO;
import com.ddjproj.revature.dto.auth.RegisterAuthRequestDTO;


import com.ddjproj.revature.exception.security.InvalidPasswordException;
import com.ddjproj.revature.exception.validation.EmailValidationException;

import com.ddjproj.revature.service.UserDetailService;
import com.ddjproj.revature.service.accounts.UserAccountService;
import com.ddjproj.revature.domain.entity.UserAccount;

import com.ddjproj.revature.repository.UserAccountRepository;


/*
 * 
 * Source(s) : 
 * https://medium.com/@th.chousiadas/spring-security-architecture-of-jwt-authentication-a7967a8ee309
 * 
 */
@Service
public class AuthenticationService {

    private final UserAccountRepository userAccountRepository;
    private final UserAccountService userAccountService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailService userDetailService;
    
    
    private final PasswordEncoder pwEncoder;
    // regex pattern for input found at :
    // https://stackoverflow.com/questions/3802192/regexp-java-for-password-validation
    private static final Pattern VALID_PATTERN =
        Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$");



    public AuthenticationService(PasswordEncoder pwEncoder, UserAccountRepository userAccountRepository, UserAccountService userAccountService, JwtService jwtService, AuthenticationManager authenticationManager, UserDetailService userDetailService){
        this.userAccountRepository = userAccountRepository;
        this.userAccountService = userAccountService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailService = userDetailService;
        
        this.pwEncoder = pwEncoder;
    }


    /**
     *
     * @param passwordString
     * @return
     */
    public String validatePassword(String passwordString) throws InvalidPasswordException {
        if(passwordString == null){
            throw new InvalidPasswordException
                ("Password entry must not be blank!");
        }
        if (passwordString.length() < 8){
            throw new InvalidPasswordException
                ("Password must be greater than 8 characters in length.");
        }
        if (!VALID_PATTERN.matcher(passwordString).matches()){
            throw new InvalidPasswordException
                ("Password must contain no spaces, at least one number, one special character, one uppercase, and one lowercase letter.");
        }

        return passwordString;
    }


    /**
     *
     * @param request
     * @return
     * @throws EmailValidationException
     * @throws InvalidPasswordException
     */
    public LoginAuthResponseDTO register(RegisterAuthRequestDTO request)
            throws EmailValidationException, InvalidPasswordException, ValidationException {
        
        if (userAccountRepository.existsByEmail(request.getEmail())){
            throw new EmailValidationException("The email provided is linked to an existing account.");
        }
        
        validatePassword(request.getPassword());
        UserAccountDTO userAccountDTO = new UserAccountDTO();

        userAccountDTO.setEmail(request.getEmail());
        userAccountDTO.setPassword(request.getPassword());
        userAccountDTO.setRole(Roles.RESTRICTED);

        UserAccountDTO newUser = userAccountService.createUserAcount(userAccountDTO);

        UserDetails userDetails = userDetailService.loadUserByUsername(newUser.getEmail());

        String jwtToken = jwtService.generateToken(userDetails);

        // the set of string permissions for this account based on assigned role
        Set<String> permissionStrings = newUser.getRole().getPermissions().stream()
                .map(permission -> permission.name()) // or reference with (Permissions::name)
                .collect(Collectors.toSet());

        return LoginAuthResponseDTO.builder()
                .token(jwtToken)
                .role(newUser.getRole().name()) // including the role in auth response
                .userId(newUser.getUserAccountId())
                .email(newUser.getEmail())
                .permissions(permissionStrings)
                .build();


    }

    /**
     *
     * @param request
     * @return
          * @throws InvalidPasswordException 
          */
        public LoginAuthResponseDTO authenticate(LoginAuthRequestDTO request) throws InvalidPasswordException{
        
        try{
            // troubleshooting output
            System.out.println("Attempting to authenticate the User login: "+ request.getEmail());
            System.out.println("Password's length in characters is : "+ request.getPassword().length());

            UserAccount userAccount = userAccountRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("A matching UserAccount was not found."));

            boolean passwordsAreMatching = pwEncoder.matches(request.getPassword(), userAccount.getPasswordHash());
            System.out.println("The passwords are matching: " + passwordsAreMatching);

            if (!passwordsAreMatching) {
                throw new InvalidPasswordException("Invalid password entered.");
            }

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            UserDetails userDetails = userDetailService.loadUserByUsername(request.getEmail());
            String jwtToken = jwtService.generateToken(userDetails);

            // updated to retrieve permissions directly from enum
            Set<String> permissionStrings = userAccount.getRole().getPermissions().stream()
                    .map(permission -> permission.name()) // or reference with (Permissions::name)
                    .collect(Collectors.toSet());

            return LoginAuthResponseDTO.builder()
                    .token(jwtToken)
                    .role(userAccount.getRole().name()) // including the role in auth response
                    .userId(userAccount.getUserAccountId())
                    .email(userAccount.getEmail())
                    .permissions(permissionStrings)
                    .build();

        }catch(InvalidPasswordException e){
            System.out.println("The authentication process failed: "+ e.getMessage());
            throw e;
        } catch (Exception e){
            System.out.println("An unexpected error occurred during the authentication process: "+ e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
