package com.ddjproj.revature.repository;

import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.domain.enums.Roles;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserAccountRepoImpl implements UserAccountRepository{
    private final JpaUserAccountRepository jpaUserAccountRepository;

    public UserAccountRepoImpl(JpaUserAccountRepository jpaUserAccountRepository) {
        this.jpaUserAccountRepository = jpaUserAccountRepository;
    }


    @Override
    public Optional<UserAccount> findByEmail(String email) {
        return jpaUserAccountRepository.findUserAccountByEmail(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaUserAccountRepository.existsByEmail(email);
    }

    @Override
    public List<UserAccount> findByRole(String role) {
        try{
            Roles enumRole = Roles.valueOf(role.toUpperCase());
            return jpaUserAccountRepository.findUserAccountByRole(enumRole);
        } catch (IllegalArgumentException except){
            return List.of(); // failure returns empty list
        }
    }

    @Override
    public boolean existsByRole(Roles targetRole) {
        return jpaUserAccountRepository.existsByRole(targetRole);
    }

    @Override
    public UserAccount save(UserAccount userAccount) {
        return jpaUserAccountRepository.save(userAccount);
    }

    @Override
    public Optional<UserAccount> findById(Long id) {
        return jpaUserAccountRepository.findById(id);
    }

    @Override
    public List<UserAccount> findAll() {
        return jpaUserAccountRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        jpaUserAccountRepository.deleteById(id);
    }
}
