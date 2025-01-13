# User Authentication API

A secure Node.js REST API implementing user authentication with email confirmation functionality. This API provides endpoints for user registration, login, and profile management, complete with email verification.

## Features

- User registration with email verification
- Secure authentication using JWT (JSON Web Tokens)
- Password hashing using bcrypt
- Email confirmation system using Nodemailer
- User profile management
- MongoDB integration for data persistence
- Express.js server with middleware architecture

## Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.0.0 or higher)
- SMTP server access for sending emails

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
// add your mongodb URL
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_sender_email
APP_URL=your_application_url or http://localhost:8000/api
```

>>>>>>>>>>if you are using http://localhost:8000/api then you can test the confirmation link mail on the same device where this code is running otherwise you need to deployee this code

# Gmail SMTP Setup Guide

This guide explains how to set up and use Gmail's SMTP service for sending emails through your application.

## Option 1: Using App Password (Recommended)

If you're using Gmail, follow these steps to generate an App Password:

1. **Enable 2-Step Verification**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable "2-Step Verification" if not already enabled

2. **Generate App Password**
   - Go to [Google Account Security Settings](https://myaccount.google.com/security)
   - Scroll to "2-Step Verification"
   - At the bottom, click on "App passwords"
   - Select App: Choose "Other (Custom name)"
   - Enter a name (e.g., "Node Mailer")
   - Click "Generate"
   - Google will display a 16-character password

3. **Configure Environment Variables**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
SMTP_FROM=your.email@gmail.com
```


## API Endpoints

### Authentication Routes

#### POST /api/signup
Register a new user with email confirmation.

Request body:
```json
{
  "username": "example_user",
  "email": "user@example.com",
  "password": "secure_password123"
}
```

#### POST /api/login
Authenticate a user and receive a JWT.

Request body:
```json
{
  "email": "user@example.com",
  "password": "secure_password123"
}
```

#### GET /api/profile
Retrieve user profile information (requires authentication).

Headers:
```
Authorization: Bearer <jwt_token>
```

#### GET /api/confirm-email/:token
Confirm user email address using the token sent via email.

## Directory Structure

```
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── utils/
│   └── emailService.js
├── app.js
└── .env
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Email verification requirement
- Secure password storage
- Input validation
- Protected routes using middleware
- Environment variable configuration
- Token expiration

## Error Handling

The API implements comprehensive error handling:
- Input validation errors
- Authentication errors
- Database operation errors
- Email sending errors
- Token verification errors

## Email Template

The confirmation email includes:
- Personalized greeting
- Confirmation link
- 24-hour expiration notice
- Clean, responsive HTML design

## Development

To start the server in development mode:

```bash
npm run dev
```

For production:

```bash
npm start
```

## Testing API Endpoints

You can test the API endpoints using cURL or Postman:

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile:
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

