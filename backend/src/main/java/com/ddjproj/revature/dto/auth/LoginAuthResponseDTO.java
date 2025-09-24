package com.ddjproj.revature.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginAuthResponseDTO {
    private String token;
    private String role;
    private Long userId;
    private String email;
    private Set<String> permissions;
}
