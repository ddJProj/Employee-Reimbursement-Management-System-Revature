

# Employee Reimbursement System

A fullstack web application for managing employee reimbursement requests. Employees can submit reimbursement tickets for business expenses, while managers can review and approve or deny these requests.

**Live Application:** http://revp1-ers-frontend.s3-website.us-east-2.amazonaws.com/

## Architecture

This application follows a layered architecture pattern with clear separation of concerns:

- **Core Layer**: Domain models, enums, and repository interfaces (framework-agnostic)
- **Backend Layer**: Spring Boot REST API with JWT authentication
- **Frontend Layer**: React SPA with TypeScript and role-based routing

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Security)
- MySQL 8.0 (production database)
- JWT authentication with BCrypt password hashing
- Maven build tool

### Frontend
- React 18 with TypeScript
- Vite build tool
- Axios for API communication
- React Router for navigation
- Tailwind CSS for styling

### Infrastructure
- AWS EC2 (backend hosting via Docker)
- AWS S3 (frontend static hosting)
- AWS RDS MySQL (database)
- GitHub Actions (CI/CD pipeline)

## Features

### User Roles

The system supports three user roles with distinct permissions:

**Restricted Users** (newly registered)
- Request upgrade to Employee access
- Limited system access until upgraded

**Employees**
- Create reimbursement requests
- View their own reimbursements
- Filter reimbursements by status (Pending, Approved, Denied)
- Edit pending reimbursements

**Managers**
- View all reimbursements from all employees
- Approve or deny pending reimbursements
- Add comments when resolving requests
- View and manage all users
- Delete user accounts

### Reimbursement Types
- Food
- Airline
- Gas
- Hotel
- Supplies
- Other

### Security Features
- JWT token-based authentication
- Password requirements (8+ characters, uppercase, lowercase, number, special character)
- BCrypt password hashing
- Token blacklist for logout
- CORS configuration
- Protected routes on frontend
- Session persistence via localStorage

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 20 or higher
- pnpm 10 or higher
- MySQL 8.0
- Docker (for containerized deployment)

### Local Development Setup

#### Backend

1. Clone the repository
```bash
git clone https://github.com/your-username/employee-reimbursement-system.git
cd employee-reimbursement-system
```

2. Configure database connection

Create `backend/src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/reimbursement_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000
```

3. Build and run the backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8080`

#### Frontend

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
pnpm install
```

3. Configure API endpoint

Create `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Start development server
```bash
pnpm run dev
```

The frontend will be available at `http://localhost:5173`

### Test Accounts

For development and testing:

```
Manager Account:
Email: manager@test.com
Password: Password123!

Employee Account:
Email: employee@test.com
Password: Password123!
```

## API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - User login
POST   /api/auth/logout      - User logout
```

### Reimbursements
```
POST   /api/reimbursements              - Create reimbursement (Employee)
GET    /api/reimbursements/self         - Get own reimbursements (Employee)
GET    /api/reimbursements              - Get all reimbursements (Manager)
GET    /api/reimbursements/{id}         - Get single reimbursement
PUT    /api/reimbursements/{id}         - Update reimbursement (Employee)
PUT    /api/reimbursements/{id}/resolve - Approve/deny reimbursement (Manager)
```

### Users
```
GET    /api/users                - Get all users (Manager)
POST   /api/users/upgrade        - Request employee access (Restricted)
DELETE /api/users/{id}           - Delete user (Manager)
```

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

## Deployment

The application uses GitHub Actions for automated deployment:

### Backend Deployment
- Triggers on push to `main` branch (backend files changed)
- Builds Docker image with JWT secret
- Deploys to EC2 instance
- Connects to RDS MySQL database
- Available at: `http://ec2-instance:8080`

### Frontend Deployment
- Triggers on push to `main` branch (frontend files changed)
- Builds production bundle with Vite
- Deploys static files to S3 bucket
- Configured with backend API URL
- Available at: http://project1-frontend-bucket-ddj.s3-website.us-east-2.amazonaws.com

### Setting Up Your Own Deployment

If forking this repository, you need to configure:

1. **GitHub Secrets** - Add all required secrets in your repository settings under Settings > Secrets and variables > Actions

2. **Frontend Environment Variable** - Update `.github/workflows/deploy-frontend.yml`:
```yaml
env:
  NODE_ENV: production
  VITE_API_BASE_URL: http://YOUR_EC2_HOST:8080/api
```
Replace `YOUR_EC2_HOST` with your actual EC2 public IP or domain.

3. **S3 Bucket Name** - Update `.github/workflows/deploy-frontend.yml`:
```yaml
aws s3 sync frontend/dist/ s3://YOUR_BUCKET_NAME/
```
Replace `YOUR_BUCKET_NAME` with your S3 bucket name.

4. **Local Development** - Create `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```
Or point to your deployed backend for testing.

### Required GitHub Secrets

Configure these in your GitHub repository settings (Settings > Secrets and variables > Actions):

**AWS Configuration:**
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - AWS region (e.g., us-east-2)
- `S3_BUCKET_NAME` - Your S3 bucket name

**EC2 Configuration:**
- `EC2_HOST` - EC2 public IP address
- `EC2_USER` - EC2 SSH username (usually ubuntu or ec2-user)
- `EC2_SSH_KEY` - Private SSH key for EC2 access

**Database Configuration:**
- `DB_HOST` - RDS endpoint hostname
- `DB_PORT` - Database port (usually 3306 for MySQL)
- `DB_NAME` - Database name
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

**Application Configuration:**
- `JWT_SECRET` - Secret key for JWT token signing (generate a secure random string)

## Project Structure

```
employee-reimbursement-system/
├── backend/
│   └── src/main/java/com/ddjproj/revature/
│       ├── controller/       # REST API endpoints
│       ├── service/          # Business logic
│       ├── repository/       # Data access layer
│       ├── domain/           # Core entities and enums
│       ├── dto/              # Data transfer objects
│       ├── mapper/           # DTO-Entity mappers
│       ├── security/         # JWT and authentication
│       └── exception/        # Custom exceptions
├── core/
│   └── domain/               # Shared domain models
├── frontend/
│   └── src/
│       ├── components/       # React components
│       ├── context/          # Auth context
│       ├── hooks/            # Custom hooks
│       ├── services/         # API services
│       └── utils/            # Utility functions
├── .github/workflows/        # CI/CD pipelines
├── Dockerfile               # Backend container
└── docker-compose.yml       # Local development setup
```


## Known Limitations

- User role assignment to Manager requires direct database modification
- No reimbursement amount values implemented
- No password reset functionality via email
- Comments on resolved reimbursements are stored but not displayed in UI
- No pagination on reimbursement lists
- Session timeout based on JWT expiration only

## Future Enhancements

- Email notifications for reimbursement status changes
- Float reimbursement amount values included with each instance
- File upload support for receipts
- Advanced filtering and search
- Pagination for large datasets
- Admin dashboard for system configuration
- Password reset via email
- Audit trail for all actions
- Export reimbursements to CSV/PDF
