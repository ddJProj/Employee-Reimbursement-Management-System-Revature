package com.ddjproj.revature.domain.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "employee")
public class Employee {


        @OneToOne
        @JoinColumn(name = "user_id" ,unique = true)
        private UserAccount userAccount;

        @Id
        @Column(unique = true)
        private String employeeId;

        public Employee(){
            this.employeeId = "EMP" + userAccount.getUserAccountId();
        }

        public String getEmployeeId(){
            return this.employeeId;
        }

        private void setEmployeeId(String employeeId){
            this.employeeId= employeeId;
        }
        public UserAccount getUserAccount(){
            return this.userAccount;
        }

        public void setUserAccount(UserAccount userAccount){
            this.userAccount= userAccount;
        }
}
