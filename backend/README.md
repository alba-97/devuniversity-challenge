# Todo List Backend

## Overview

This is a backend for a Todo List application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- RESTful API for task management
- User authentication with JWT
- Swagger API documentation
- Error handling middleware
- MongoDB integration

## Prerequisites

- Node.js (v18+)
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm start`: Run production build
- `npm run dev`: Run development server
- `npm run build`: Compile TypeScript
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run swagger`: Generate Swagger documentation

## API Documentation

Access Swagger documentation at `/api-docs` when the server is running.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Server port
- `NODE_ENV`: Environment mode

## Testing

Run tests with Jest:

```bash
npm test
```

## Deployment

1. Build the project: `npm run build`
2. Start the server: `npm start`

## Technologies

- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Swagger
- Jest
- ESLint
