package com.ddjproj.revature.dto;

import com.ddjproj.revature.domain.entity.Reimbursement;
import com.ddjproj.revature.dto.reimbursement.CreateReimbursementDTO;
import com.ddjproj.revature.dto.reimbursement.ReimbursementResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ReimbursementMapper {

    /**
     * Convert Reimbursement entity to Response DTO
     */
    public ReimbursementResponseDTO toResponseDto(Reimbursement entity) {
        if (entity == null) {
            return null;
        }

        return ReimbursementResponseDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .description(entity.getDescription())
                .amount(entity.getAmount())
                .type(entity.getType())
                .status(entity.getStatus())
                .build();
    }

    /**
     * Create new Reimbursement entity from CreateDto
     */
    public Reimbursement toEntity(CreateReimbursementDTO dto) {
        if (dto == null) {
            return null;
        }

        Reimbursement entity = new Reimbursement();
        entity.setDescription(dto.getDescription());
        entity.setAmount(dto.getAmount());
        entity.setType(dto.getType());
        // set to PENDING by default in constructor
        // userId set by service

        return entity;
    }

    /**
     * Update entity from createdto (edits)
     */
    public void updateEntityFromDto(Reimbursement entity, CreateReimbursementDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setDescription(dto.getDescription());
        entity.setAmount(dto.getAmount());
        entity.setType(dto.getType());
        //
    }
}
