# Saylani-Bootcamp-LMS4

A full-stack Learning Management System (LMS) built for Saylani Bootcamp.

## Project Structure

```
Saylani-Bootcamp-LMS4/

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.model.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── students/
│   │   │   ├── student.controller.js
│   │   │   ├── student.model.js
│   │   │   ├── student.routes.js
│   │   │   ├── student.service.js
│   │   │   └── student.validation.js
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendance.controller.js
│   │   │   ├── attendance.model.js
│   │   │   ├── attendance.routes.js
│   │   │   ├── attendance.service.js
│   │   │   └── attendance.validation.js
│   │   │
│   │   ├── teams/
│   │   │   ├── team.controller.js
│   │   │   ├── team.model.js
│   │   │   ├── team.routes.js
│   │   │   ├── team.service.js
│   │   │   └── team.validation.js
│   │   │
│   │   ├── projects/
│   │   │   ├── project.controller.js
│   │   │   ├── project.model.js
│   │   │   ├── project.routes.js
│   │   │   ├── project.service.js
│   │   │   └── project.validation.js
│   │   │
│   │   ├── tasks/
│   │   │   ├── task.controller.js
│   │   │   ├── task.model.js
│   │   │   ├── task.routes.js
│   │   │   ├── task.service.js
│   │   │   └── task.validation.js
│   │   │
│   │   └── dashboard/
│   │       ├── dashboard.controller.js
│   │       ├── dashboard.routes.js
│   │       └── dashboard.service.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── response.js
│   │   └── logger.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── yarn.lock
```


## Features

- User registration and login with JWT authentication
- Zod-based request validation
- Password hashing with bcrypt
- Protected routes with Bearer token middleware
- RESTful API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Saylani-Bootcamp-LMS4
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

### Running the Backend

```bash
cd backend
npm start
```

The API will be available at `http://localhost:5000`.

### API Endpoints

| Method | Endpoint     | Description     | Auth Required |
|--------|--------------|-----------------|---------------|
| POST   | /api/auth/register | Register a new user | No  |
| POST   | /api/auth/login    | Login with credentials | No |
| GET    | /api/auth/me       | Get current user profile | Yes |

## Branch

This project uses a `development` branch for ongoing feature work. The `main` branch represents production-ready code.
