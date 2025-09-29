package com.ddjproj.revature.dto.reimbursement;

import com.ddjproj.revature.domain.enums.ReimbursementType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateReimbursementDTO {

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    @JsonProperty("description")
    private String description;

    @NotNull(message = "Reimbursement type is required")
    @JsonProperty("type")
    private ReimbursementType type;
}