package com.ddjproj.revature.domain.entity;

import com.ddjproj.revature.domain.enums.Permissions;
import com.ddjproj.revature.domain.enums.Roles;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name="user_account")
@Getter
@Setter
@NoArgsConstructor
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "user_id", nullable = false)
    private Long userAccountId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    // default role assigned to a newly created userAccount
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles role = Roles.RESTRICTED;

    /**
     * New account creation constructor for a UserAccount instance. Automatically sets user role to restricted
     *
     */
    public UserAccount(String email, String password){
        this.email = email;
        this.passwordHash = password;
        this.role = Roles.RESTRICTED;
    }

    // permissions are dependent on Role enum
    @Transient
    public Set<Permissions> getPermissions() {
        return role.getPermissions();
    }

    // are we adding a created date? if so
    // private LocalDateTime creationDate = LocalDateTime.now();


}
