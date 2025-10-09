

# Employee Reimbursement System - User Stories


## Guest (Unauthenticated User) Stories

### US-G01: User Registration

As a guest visitor / user
I want to create a new account with my email and password  
So that I can access the reimbursement system

**Acceptance Criteria:**

- Given I am on the registration page
- When I enter a valid email and password that meets requirements
- Then my account is created with RESTRICTED role
- And I am automatically logged in
- And I am redirected to the restricted dashboard



---

### US-G02: User Login

As a registered user  
I want to log in with my email and password  
So that I can access my account

**Acceptance Criteria:**

- Given I am on the login page
- When I enter valid credentials
- Then I am logged in successfully
- And I receive a JWT token
- And I am redirected to my role-specific dashboard


---

## Restricted User Stories

### US-R01: Request Employee Access

As a restricted user  
I want to request an upgrade to employee access  
So that I can submit reimbursement requests

**Acceptance Criteria:**

- Given I am logged in as a restricted user
- When I click "Request Employee Access" button
- Then my role is upgraded to EMPLOYEE automatically
- And I am redirected to the employee dashboard
- And I can now access employee features

---

### US-R02: View Restricted Dashboard

As a restricted user  
I want to see information about my limited access  
So that I understand what I need to do to gain full access

**Acceptance Criteria:**

- Given I am logged in as a restricted user
- When I navigate to the restricted dashboard
- Then I see a welcome message
- And I see information about employee access
- And I see a button to request upgrade



---

## Employee User Stories

### US-E01: Create Reimbursement Request

As an employee:  
I want to submit a new reimbursement request so I can get reimbursed for business expenses

**Acceptance Criteria:**

- Given I am logged in as an employee
- When I fill out the reimbursement form with description and type
- Then a new reimbursement is created with PENDING status
- And it appears in my reimbursements list
- And the form is cleared for next entry

---

### US-E02: View My Reimbursements

As an employee:
I want to view all my reimbursement requests so I can track their status

**Acceptance Criteria:**

- Given I am logged in as an employee
- When I view my dashboard
- Then I see a list of all my reimbursements
- And each shows ID, description, type, and status
- And they are ordered newest first

---

### US-E03: Filter Reimbursements by Status

As an employee: 
I want to filter my reimbursements by status so I can quickly find pending or approved requests

**Acceptance Criteria:**

- Given I am viewing my reimbursements list
- When I click a filter button (All, Pending, Approved, Denied)
- Then only reimbursements with that status are shown
- And the active filter is visually indicated
- And the count updates to reflect filtered results


---

### US-E04: View Employee Dashboard

As an employee  
I want to see my personalized dashboard so I can manage my reimbursements efficiently

**Acceptance Criteria:**

- Given I am logged in as an employee
- When I navigate to the employee dashboard
- Then I see my email displayed
- And I see a button to create new reimbursement
- And I see filter buttons
- And I see my reimbursements list
- And I see a logout button in the sidebar


---

## Manager User Stories

### US-M01: View All Reimbursements

As a manager:  
I want to view all reimbursement requests from all employees so I can review and process them

**Acceptance Criteria:**

- Given I am logged in as a manager
- When I view the manager dashboard
- Then I see all reimbursements from all employees
- And each shows employee email, description, type, and status
- And they are ordered newest first


---

### US-M02: Filter All Reimbursements by Status

As a manager:  
I want to filter reimbursements by status so I can focus on pending requests that need review

**Acceptance Criteria:**

- Given I am viewing all reimbursements
- When I click a filter button (All, Pending, Approved, Denied)
- Then only reimbursements with that status are shown
- And the active filter is visually indicated
- And the count updates to reflect filtered results


---

### US-M03: Approve Reimbursement Request

As a manager:  
I want to approve a pending reimbursement request so the employee can be reimbursed

**Acceptance Criteria:**

- Given I am viewing a pending reimbursement
- When I click the "Approve" button
- Then a confirmation modal appears
- And I can optionally add a comment
- When I confirm the approval
- Then the reimbursement status changes to APPROVED
- And the list refreshes to show the updated status
- And the employee can see the approval


---

### US-M04: Deny Reimbursement Request

As a manager:  
I want to deny a pending reimbursement request so I can reject inappropriate or invalid requests

**Acceptance Criteria:**

- Given I am viewing a pending reimbursement
- When I click the "Deny" button
- Then a confirmation modal appears
- And I can optionally add a comment explaining why
- When I confirm the denial
- Then the reimbursement status changes to DENIED
- And the list refreshes to show the updated status
- And the employee can see the denial

---

### US-M05: Add Comment When Resolving

As a manager:  
I want to add a comment when approving or denying so I can provide context for my decision

**Acceptance Criteria:**

- Given I am approving or denying a reimbursement
- When I view the resolution modal
- Then I see a comment text field
- And I can enter additional notes
- And the comment is saved with the resolution


---

### US-M06: View Manager Dashboard

As a manager:  
I want to see a comprehensive dashboard of all reimbursements so I can efficiently manage the approval process

**Acceptance Criteria:**

- Given I am logged in as a manager
- When I navigate to the manager dashboard
- Then I see all reimbursements from all employees
- And I see filter options
- And I see approve/deny buttons on pending requests
- And I see employee information for each request
- And I can access user management features


---

### US-M07: View All Users

As a manager:  
I want to view a list of all users in the system so I can manage user accounts

**Acceptance Criteria:**

- Given I am logged in as a manager
- When I access the user management section
- Then I see a list of all users
- And each shows user ID, email, and role
- And I see options to manage each user



---

### US-M08: Delete User Account

As a manager  
I want to delete user accounts so I can remove inactive or terminated employees

**Acceptance Criteria:**

- Given I am viewing the user list
- When I select delete for a user
- Then a confirmation dialog appears
- When I confirm deletion
- Then the user account is permanently removed
- And their reimbursements remain in system for records
- And I receive confirmation of deletion



---

## All Authenticated Users Stories

### US-A01: Logout

As an authenticated user:  
I want to log out of my account so I can secure my session when done

**Acceptance Criteria:**

- Given I am logged in
- When I click the logout button in the sidebar
- Then my JWT token is invalidated
- And my session data is cleared
- And I am redirected to the login page
- And I cannot access protected routes

---

### US-A02: Session Persistence

As an authenticated user:  
I want to remain logged in when I refresh the page so I don't have to login again constantly

**Acceptance Criteria:**

- Given I am logged in
- When I refresh the browser page
- Then I remain logged in
- And I see the same dashboard I was on
- And my token is still valid



---

### US-A03: View Profile Information

As an authenticated user:  
I want to see my email and role in the sidebar so I know which account I'm logged into

**Acceptance Criteria:**

- Given I am logged in
- When I view any page
- Then I see my email in the sidebar
- And I see my role displayed
- And I see my available navigation options


---

## System Administration Stories (TODO)

### US-SA01: Assign Manager Role

As a system administrator:  
I want to promote employees to manager role so they can approve reimbursements




