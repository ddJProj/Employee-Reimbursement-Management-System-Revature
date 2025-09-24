package com.ddjproj.revature.dto;

import com.ddjproj.revature.domain.entity.UserAccount;
import org.springframework.stereotype.Component;
import com.ddjproj.revature.dto.account.UserAccountDTO;

import java.util.stream.Collectors;

@Component
public class UserAccountMapper {

    /**
     * Convert UserAccount entity to DTO (no password)
     */
    public UserAccountDTO toDto(UserAccount entity) {
        if (entity == null) {
            return null;
        }


        return new UserAccountDTO(
                entity.getUserAccountId(),
                entity.getEmail(),
                entity.getRole(),
                entity.getPermissions().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet())
        );
    }

    /**
     * Convert DTO to UserAccount entity (for creation)
     */
    public UserAccount toEntity(UserAccountDTO dto) {
        if (dto == null) {
            return null;
        }

        UserAccount entity = new UserAccount();
        entity.setEmail(dto.getEmail());
        if (dto.getRole() != null) {
            entity.setRole(dto.getRole());
        }
        // Pass hashed before setting
        // userAccountId auto-gen

        return entity;
    }

    /**
     * Update existing entity from DTO
     */
    public void updateEntityFromDto(UserAccount entity, UserAccountDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        if (dto.getEmail() != null) {
            entity.setEmail(dto.getEmail());
        }
        if (dto.getRole() != null) {
            entity.setRole(dto.getRole());
        }
        // only update passwork through authenticated methods
    }
}
