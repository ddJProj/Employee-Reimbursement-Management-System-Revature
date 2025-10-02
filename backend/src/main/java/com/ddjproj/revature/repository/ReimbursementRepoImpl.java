package com.ddjproj.revature.repository;

import com.ddjproj.revature.domain.entity.Reimbursement;
import com.ddjproj.revature.domain.enums.ReimbursementStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ReimbursementRepoImpl implements ReimbursementRepository {

    private final JpaReimbursementRepository jpaRepository;

    @Autowired
    public ReimbursementRepoImpl(JpaReimbursementRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Reimbursement save(Reimbursement reimbursement) {
        return jpaRepository.save(reimbursement);
    }

    @Override
    public Optional<Reimbursement> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Reimbursement> findAll() {
        return jpaRepository.findAllOrderByIdDesc();
    }

    @Override
    public List<Reimbursement> findByUserId(Long userId) {
        return jpaRepository.findByUserIdOrderByIdDesc(userId);
    }

    @Override
    public List<Reimbursement> findByStatus(ReimbursementStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public List<Reimbursement> findByUserIdAndStatus(Long userId, ReimbursementStatus status) {
        return jpaRepository.findByUserIdAndStatus(userId, status);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}

