package com.ddjproj.revature.controller;



import com.ddjproj.revature.dto.reimbursement.*;
import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.ddjproj.revature.exception.ResourceNotFoundException;
import com.ddjproj.revature.exception.validation.UnauthorizedException;
import com.ddjproj.revature.exception.validation.ValidationException;
import com.ddjproj.revature.service.ReimbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reimbursements")
@CrossOrigin
public class ReimbursementController {

    private final ReimbursementService reimbursementService;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService) {
        this.reimbursementService = reimbursementService;
    }

    @PostMapping
    public ResponseEntity<ReimbursementResponseDTO> createReimbursement(@Valid @RequestBody CreateReimbursementDTO dto) throws UnauthorizedException {
        ReimbursementResponseDTO response = reimbursementService.createReimbursement(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReimbursementResponseDTO> getReimbursement(@PathVariable Long id) throws UnauthorizedException, ResourceNotFoundException {
        ReimbursementResponseDTO response = reimbursementService.getReimbursementById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/self")
    public ResponseEntity<List<ReimbursementResponseDTO>> getMyReimbursements(
            @RequestParam(required = false) ReimbursementStatus status) throws UnauthorizedException {
        List<ReimbursementResponseDTO> response = reimbursementService.getMyReimbursements(status);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ReimbursementResponseDTO>> getAllReimbursements(
            @RequestParam(required = false) ReimbursementStatus status) throws UnauthorizedException {
        List<ReimbursementResponseDTO> response = reimbursementService.getAllReimbursements(status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReimbursementResponseDTO> updateReimbursement(
            @PathVariable Long id,
            @Valid @RequestBody CreateReimbursementDTO dto) throws UnauthorizedException, ResourceNotFoundException {
        ReimbursementResponseDTO response = reimbursementService.updateReimbursement(id, dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ReimbursementResponseDTO> resolveReimbursement(
            @PathVariable Long id,
            @Valid @RequestBody ResolveReimbursementDTO dto) throws ValidationException, UnauthorizedException, ResourceNotFoundException {
        ReimbursementResponseDTO response = reimbursementService.resolveReimbursement(id, dto);
        return ResponseEntity.ok(response);
    }
}