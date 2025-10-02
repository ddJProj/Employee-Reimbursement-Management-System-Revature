package com.ddjproj.revature.service;


import com.ddjproj.revature.domain.entity.Reimbursement;
import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.dto.*;
import com.ddjproj.revature.domain.enums.Permissions;
import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.ddjproj.revature.domain.enums.Roles;
import com.ddjproj.revature.dto.reimbursement.CreateReimbursementDTO;
import com.ddjproj.revature.dto.reimbursement.ReimbursementResponseDTO;
import com.ddjproj.revature.dto.reimbursement.ResolveReimbursementDTO;
import com.ddjproj.revature.exception.ResourceNotFoundException;
import com.ddjproj.revature.exception.validation.UnauthorizedException;
import com.ddjproj.revature.exception.validation.ValidationException;
import com.ddjproj.revature.repository.ReimbursementRepository;
import com.ddjproj.revature.repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
@Service
@Transactional
public class ReimbursementService {
    private static final Logger logger = LoggerFactory.getLogger(ReimbursementService.class);

    private final ReimbursementRepository reimbursementRepository;
    private final UserAccountRepository userAccountRepository;
    private final PermissionService permissionService;
    private final ReimbursementMapper reimbursementMapper;

    @Autowired
    public ReimbursementService(ReimbursementRepository reimbursementRepository,
                                UserAccountRepository userAccountRepository,
                                PermissionService permissionService,
                                ReimbursementMapper reimbursementMapper) {
        this.reimbursementRepository = reimbursementRepository;
        this.userAccountRepository = userAccountRepository;
        this.permissionService = permissionService;
        this.reimbursementMapper = reimbursementMapper;
    }

    public ReimbursementResponseDTO createReimbursement(CreateReimbursementDTO dto) throws UnauthorizedException {
        logger.info("Creating new reimbursement request");

        // Check permission
        permissionService.requirePermission(Permissions.CREATE_REIMBURSEMENT_REQUEST);

        UserAccount currentUser = permissionService.getCurrentUser();
        logger.info("User {} creating reimbursement", currentUser.getEmail());

        // Create reimbursement using mapper
        Reimbursement reimbursement = reimbursementMapper.toEntity(dto);
        reimbursement.setUserId(currentUser.getUserAccountId());

        Reimbursement saved = reimbursementRepository.save(reimbursement);
        logger.info("Reimbursement {} created successfully", saved.getId());

        // Convert to response DTO and add user email
        ReimbursementResponseDTO responseDto = reimbursementMapper.toResponseDto(saved);
        responseDto.setUserEmail(currentUser.getEmail());

        return responseDto;
    }

    public ReimbursementResponseDTO getReimbursementById(Long id) throws ResourceNotFoundException, UnauthorizedException {
        logger.info("Fetching reimbursement with id: {}", id);

        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reimbursement not found with id: " + id));

        // Check permission with the actual resource
        permissionService.requirePermission(Permissions.VIEW_SINGLE_REIMBURSEMENT_REQUEST, reimbursement);

        return enrichResponseDto(reimbursement);
    }

    public List<ReimbursementResponseDTO> getMyReimbursements(ReimbursementStatus statusFilter) throws UnauthorizedException {
        permissionService.requirePermission(Permissions.VIEW_SUBMITTED_REIMBURSEMENT_REQUESTS);

        UserAccount currentUser = permissionService.getCurrentUser();
        logger.info("User {} fetching their reimbursements", currentUser.getEmail());

        List<Reimbursement> reimbursements;
        if (statusFilter != null) {
            reimbursements = reimbursementRepository.findByUserIdAndStatus(currentUser.getUserAccountId(), statusFilter);
        } else {
            reimbursements = reimbursementRepository.findByUserId(currentUser.getUserAccountId());
        }

        return reimbursements.stream()
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    public List<ReimbursementResponseDTO> getAllReimbursements(ReimbursementStatus statusFilter) throws UnauthorizedException {
        permissionService.requirePermission(Permissions.VIEW_ALL_REIMBURSEMENT_REQUESTS);

        logger.info("Fetching all reimbursements with status filter: {}", statusFilter);

        List<Reimbursement> reimbursements;
        if (statusFilter != null) {
            reimbursements = reimbursementRepository.findByStatus(statusFilter);
        } else {
            reimbursements = reimbursementRepository.findAll();
        }

        return reimbursements.stream()
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    public ReimbursementResponseDTO updateReimbursement(Long id, CreateReimbursementDTO dto) throws ResourceNotFoundException, UnauthorizedException {
        logger.info("Updating reimbursement with id: {}", id);

        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reimbursement not found with id: " + id));

        // Check permission with the actual resource
        permissionService.requirePermission(Permissions.EDIT_PENDING_REIMBURSEMENT, reimbursement);

        // Update fields using mapper
        reimbursementMapper.updateEntityFromDto(reimbursement, dto);

        Reimbursement saved = reimbursementRepository.save(reimbursement);
        logger.info("Reimbursement {} updated successfully", id);

        return enrichResponseDto(saved);
    }

    public ReimbursementResponseDTO resolveReimbursement(Long id, ResolveReimbursementDTO dto) throws ValidationException, UnauthorizedException, ResourceNotFoundException {
        logger.info("Resolving reimbursement with id: {}", id);

        Reimbursement reimbursement = reimbursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reimbursement not found with id: " + id));

        // Check permission - only managers can resolve
        if (permissionService.getCurrentUser().getRole() != Roles.MANAGER) {
            throw new UnauthorizedException("Only managers can resolve reimbursements");
        }

        // Additional check: can only resolve pending reimbursements
        if (reimbursement.getStatus() != ReimbursementStatus.PENDING) {
            throw new ValidationException("Can only resolve pending reimbursements");
        }

        UserAccount resolver = permissionService.getCurrentUser();
        logger.info("User {} resolving reimbursement {} with status: {}",
                resolver.getEmail(), id, dto.getStatus());

        reimbursement.setStatus(dto.getStatus());

        // Since we don't have resolver fields in the simplified entity,
        // we just update the status

        Reimbursement saved = reimbursementRepository.save(reimbursement);
        logger.info("Reimbursement {} resolved successfully with status: {}", id, dto.getStatus());

        return enrichResponseDto(saved);
    }

    private ReimbursementResponseDTO enrichResponseDto(Reimbursement reimbursement) {
        ReimbursementResponseDTO dto = reimbursementMapper.toResponseDto(reimbursement);

        // Fetch user email
        userAccountRepository.findById(reimbursement.getUserId())
                .ifPresent(user -> dto.setUserEmail(user.getEmail()));

        return dto;
    }
}