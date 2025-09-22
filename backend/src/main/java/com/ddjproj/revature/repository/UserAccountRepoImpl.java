package com.ddjproj.revature.repository;

import com.ddjproj.revature.domain.entity.Role;
import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.dto.EntityMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserAccountRepoImpl implements UserAccountRepository{
    private final JpaUserAccountRepository jpaUserAccountRepository;
    private final EntityMapper entityMapper;


    @Override
    public Optional<UserAccount> findByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public boolean existsByEmail(String email) {
        return false;
    }

    @Override
    public List<UserAccount> findByRole(String role) {
        return List.of();
    }

    @Override
    public boolean existsByRole(Role targetRole) {
        return false;
    }

    @Override
    public UserAccount save(UserAccount userAccount) {
        return null;
    }

    @Override
    public Optional<UserAccount> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public List<UserAccount> findAll() {
        return List.of();
    }

    @Override
    public void deleteById(Long id) {

    }
}
