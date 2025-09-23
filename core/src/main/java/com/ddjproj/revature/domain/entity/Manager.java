package com.ddjproj.revature.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

public class Manager {

    @OneToOne
    @JoinColumn(name = "user_id" ,unique = true)
    private UserAccount userAccount;

    @Id
    @Column(unique = true)
    private String managerId;

    public Manager(){
        this.managerId= "MAN" + userAccount.getUserAccountId();
    }

    public String getManagerId(){
        return this.managerId;
    }

    private void setManagerId(String managerId){
        this.managerId = managerId;
    }
    public UserAccount getUserAccount(){
        return this.userAccount;
    }

    public void setUserAccount(UserAccount userAccount){
        this.userAccount= userAccount;
    }
}