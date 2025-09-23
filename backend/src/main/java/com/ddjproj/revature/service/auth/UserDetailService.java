package com.ddjproj.revature.service.auth;

import java.util.stream.Collectors;

import com.ddjproj.revature.repository.UserAccountRepoImpl;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ddjproj.revature.domain.entity.UserAccount;
import com.ddjproj.revature.repository.UserAccountRepoImpl;

/*
 * The source I used for JWT has UserDetailsService as a part of User, but I separated the service to limit complexity.
 * https://medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application-5839e4fd8fac
 *
 */
@Service
public class UserDetailService implements UserDetailsService{
    private final UserAccountRepoImpl userAccountRepoImpl;

    public UserDetailService(UserAccountRepoImpl userAccountRepoImpl){
        this.userAccountRepoImpl = userAccountRepoImpl;

    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserAccount userAccount = userAccountRepoImpl.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("An UserAccount with that email address could not be found: " + email));

        var authorities = userAccount.getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(Collectors.toList());

        authorities.add(new SimpleGrantedAuthority("ROLE_" + userAccount.getRole().name()));

        return new User(userAccount.getEmail(), userAccount.getHashedPassword(), authorities);

    }


}
