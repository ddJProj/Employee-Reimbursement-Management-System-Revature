package com.ddjproj.revature.dto.account;

import com.ddjproj.revature.domain.enums.Roles;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAccountDTO {
    private Long userAccountId;
    private String email;
    private String password; // Only used for creation, never returned
    private Roles role;
    private Set<String> permissions;

    // Constructor for response (without password)
    public UserAccountDTO(Long userAccountId, String email, Roles role, Set<String> permissions) {
        this.userAccountId = userAccountId;
        this.email = email;
        this.role = role;
        this.permissions = permissions;
    }
}
