package com.ddjproj.revature.dto.reimbursement;

import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.ddjproj.revature.domain.enums.ReimbursementType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for querying/filtering reimbursement requests
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReimbursementRequestDTO {

    @JsonProperty("status")
    private ReimbursementStatus status;

    @JsonProperty("type")
    private ReimbursementType type;

    @JsonProperty("userId")
    private Long userId;

}