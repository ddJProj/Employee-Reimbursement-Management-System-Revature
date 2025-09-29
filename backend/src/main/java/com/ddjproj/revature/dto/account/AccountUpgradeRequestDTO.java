package com.ddjproj.revature.dto.account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for requesting account upgrade from RESTRICTED to EMPLOYEE
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountUpgradeRequestDTO {

    private Long userAccountId;
}
