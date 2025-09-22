package com.ddjproj.revature.domain.entity;

import com.ddjproj.revature.domain.enums.Roles;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="user_account")
@Getter
@Setter
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "user_id", nullable = false)
    private Long userAccountId;

    private String email;

    private String passwordHash;

    // default role assigned to a newly created userAccount
    private Roles role = Roles.RESTRICTED;

    // ex: employeeId = "EMP" + userAccountId;
    // ex: managerId = "MAN" + userAccountId;
    private String roleId;

    // are we adding a created date? if so
    // private LocalDateTime creationDate = LocalDateTime.now();


}
