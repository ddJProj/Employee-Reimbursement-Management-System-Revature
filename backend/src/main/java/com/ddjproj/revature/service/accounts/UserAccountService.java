package com.ddjproj.revature.service.accounts;

import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.domain.enums.Roles;
import com.ddjproj.revature.dto.account.UserAccountDTO;
import com.ddjproj.revature.dto.account.AccountUpgradeRequestDTO;
import com.ddjproj.revature.exception.ResourceNotFoundException;
import com.ddjproj.revature.exception.validation.ValidationException;
import com.ddjproj.revature.dto.UserAccountMapper;
import com.ddjproj.revature.repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
public class UserAccountService {
    private static final Logger logger = LoggerFactory.getLogger(UserAccountService.class);

    private final UserAccountRepository userAccountRepository;
    private final UserAccountMapper userAccountMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserAccountService(UserAccountRepository userAccountRepository,
                              UserAccountMapper userAccountMapper,
                              PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.userAccountMapper = userAccountMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserAccountDTO createUserAcount(UserAccountDTO userAccountDTO) throws ValidationException {
        logger.info("Creating new user account with email: {}", userAccountDTO.getEmail());

        // Check if email already exists
        if (userAccountRepository.existsByEmail(userAccountDTO.getEmail())) {
            throw new ValidationException("Email already exists: " + userAccountDTO.getEmail());
        }

        // Create new user account
        UserAccount userAccount = userAccountMapper.toEntity(userAccountDTO);

        // Hash the password if provided
        if (userAccountDTO.getPassword() != null) {
            userAccount.setPasswordHash(passwordEncoder.encode(userAccountDTO.getPassword()));
        }

        // Set default role to RESTRICTED if not specified
        if (userAccount.getRole() == null) {
            userAccount.setRole(Roles.RESTRICTED);
        }

        UserAccount saved = userAccountRepository.save(userAccount);
        logger.info("User account created with id: {}", saved.getUserAccountId());

        return userAccountMapper.toDto(saved);
    }

    public UserAccountDTO getUserById(Long id) throws ResourceNotFoundException {
        logger.info("Fetching user account with id: {}", id);

        UserAccount userAccount = userAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return userAccountMapper.toDto(userAccount);
    }

    public UserAccountDTO getUserByEmail(String email) throws ResourceNotFoundException {
        logger.info("Fetching user account with email: {}", email);

        UserAccount userAccount = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return userAccountMapper.toDto(userAccount);
    }

    public List<UserAccountDTO> getAllUsers() {
        logger.info("Fetching all user accounts");

        List<UserAccount> users = userAccountRepository.findAll();

        return users.stream()
                .map(userAccountMapper::toDto)
                .collect(Collectors.toList());
    }

    public UserAccountDTO updateUserRole(Long userId, Roles newRole) throws ResourceNotFoundException {
        logger.info("Updating user {} role to {}", userId, newRole);

        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        userAccount.setRole(newRole);
        UserAccount saved = userAccountRepository.save(userAccount);

        logger.info("User {} role updated to {}", userId, newRole);

        return userAccountMapper.toDto(saved);
    }

    public UserAccountDTO processUpgradeRequest(AccountUpgradeRequestDTO upgradeRequest) throws ResourceNotFoundException, ValidationException {
        logger.info("Processing upgrade request for user {}", upgradeRequest.getUserAccountId());

        UserAccount userAccount = userAccountRepository.findById(upgradeRequest.getUserAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + upgradeRequest.getUserAccountId()));

        // Validate current role is RESTRICTED
        if (userAccount.getRole() != Roles.RESTRICTED) {
            throw new ValidationException("Only RESTRICTED users can request role upgrades");
        }

        // Always upgrade to EMPLOYEE (the only valid upgrade path)
        return updateUserRole(userAccount.getUserAccountId(), Roles.EMPLOYEE);
    }


    public void deleteUser(Long userId) throws ResourceNotFoundException {
        logger.info("Deleting user account with id: {}", userId);

        // Check if user exists by trying to find them
        userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        userAccountRepository.deleteById(userId);
        logger.info("User account {} deleted", userId);
    }

}
