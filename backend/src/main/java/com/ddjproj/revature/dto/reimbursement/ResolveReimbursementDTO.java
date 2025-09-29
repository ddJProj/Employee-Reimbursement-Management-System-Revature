package com.ddjproj.revature.dto.reimbursement;

import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResolveReimbursementDTO {

    @NotNull(message = "Status is required")
    @JsonProperty("status")
    private ReimbursementStatus status;

    @JsonProperty("comment")
    private String comment;
}