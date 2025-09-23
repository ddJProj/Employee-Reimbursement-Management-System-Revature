package com.ddjproj.revature.repository;

import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.domain.enums.Roles;
import com.ddjproj.revature.repository.UserAccountRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaUserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findUserAccountByEmail(String email);
    boolean existsByEmail(String email);
    List<UserAccount> findUserAccountByRole(Roles role);
    boolean existsByRole(Roles role);
    // countByRole ?
}
