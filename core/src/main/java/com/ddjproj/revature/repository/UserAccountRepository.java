package com.ddjproj.revature.repository;

import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.domain.enums.Roles;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository {
    Optional<UserAccount> findByEmail(String email);
    boolean existsByEmail(String email);
    List<UserAccount> findByRole(String role);
    boolean existsByRole(Roles targetRole);

    UserAccount save(UserAccount userAccount);
    Optional<UserAccount> findById(Long id);
    List<UserAccount> findAll();
    void deleteById(Long id);

}
