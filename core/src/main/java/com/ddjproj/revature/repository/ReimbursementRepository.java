package com.ddjproj.revature.repository;

import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import com.ddjproj.revature.domain.entity.Reimbursement;

import java.util.List;
import java.util.Optional;

public interface ReimbursementRepository {
    Reimbursement save(Reimbursement reimbursement);
    Optional<Reimbursement> findById(Long id);
    List<Reimbursement> findAll();
    List<Reimbursement> findByUserId(Long userId);
    List<Reimbursement> findByStatus(ReimbursementStatus status);
    List<Reimbursement> findByUserIdAndStatus(Long userId, ReimbursementStatus status);
    void deleteById(Long id);

}
