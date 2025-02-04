# Job Portal Microservices

A job portal application built with Node.js using a microservices architecture.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### User Profile
- POST /api/users/profile - Create/Update user profile
- GET /api/users/profile - Get user profile

### Jobs
- POST /api/jobs - Create a new job posting
- GET /api/jobs/search - Search jobs

## Technology Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication

## Project Structure 