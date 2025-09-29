package com.ddjproj.revature.dto.reimbursement;

import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.ddjproj.revature.domain.enums.ReimbursementType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReimbursementResponseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("userEmail")
    private String userEmail;

    @JsonProperty("description")
    private String description;

    @JsonProperty("type")
    private ReimbursementType type;

    @JsonProperty("status")
    private ReimbursementStatus status;
}