# Fullstack Auth App

This is a fullstack authentication application built with React, TailwindCSS, Ant Design (AntD) for the frontend, and NestJS for the backend.

## Table of Contents

- [Frontend](#frontend)
  - [Features](#features)
  - [Setup](#setup)
  - [Scripts](#scripts)
- [Backend](#backend)
  - [Features](#features-1)
  - [Setup](#setup-1)
  - [Scripts](#scripts-1)

## Frontend

### Features

- User registration and login
- Form validation with Ant Design
- Responsive design with TailwindCSS
- Feature-Based design pattern

### Setup

1. Navigate to the frontend directory:

   ```sh
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   cp .env.example .env # copy env variables
   ```

3. Start the development server:

   ```sh
   npm start
   ```

### Scripts

- `npm start`: Starts the development server.
- `npm build`: Builds the app for production.
- `npm test`: Runs the test suite.

## Backend

### Features

- User authentication with JWT
- RESTful API with NestJS
- MongoDB Database integration with TypeORM
- Role based access control

> To add a user as an admin please update the `roles` field in the database to `["admin"]`. This can be done using a tool like MongoDB Compass.This will be automated in the future.

### Setup

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   cp .env.example .env # copy env variables
   ```

3. Set up the database:

   ```sh
   # Make sure to configure your database connection in the .env file
   npm run typeorm migration:run
   ```

4. Start the development server:

   ```sh
   npm run start:dev
   ```

### Scripts

- `npm run start:dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run test`: Runs the test suite.
- `npm run typeorm migration:run`: Runs database migrations.
