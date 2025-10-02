package com.ddjproj.revature.repository;

import com.ddjproj.revature.domain.entity.Reimbursement;
import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaReimbursementRepository extends JpaRepository<Reimbursement, Long> {

    List<Reimbursement> findByUserId(Long userId);

    List<Reimbursement> findByStatus(ReimbursementStatus status);

    List<Reimbursement> findByUserIdAndStatus(Long userId, ReimbursementStatus status);

    @Query("SELECT r FROM Reimbursement r ORDER BY r.id DESC")
    List<Reimbursement> findAllOrderByIdDesc();

    @Query("SELECT r FROM Reimbursement r WHERE r.userId = :userId ORDER BY r.id DESC")
    List<Reimbursement> findByUserIdOrderByIdDesc(@Param("userId") Long userId);

}
