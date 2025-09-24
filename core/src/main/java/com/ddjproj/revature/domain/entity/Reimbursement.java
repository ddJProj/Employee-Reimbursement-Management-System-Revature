package com.ddjproj.revature.domain.entity;

import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.ddjproj.revature.domain.enums.ReimbursementType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reimbursement")
@Getter
@Setter
public class Reimbursement {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "reimbursement_id", nullable = false)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;  // ID of UserAccount who created

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReimbursementType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReimbursementStatus status = ReimbursementStatus.PENDING;

    // Constructors
    public Reimbursement() {
        this.status = ReimbursementStatus.PENDING;
    }
}