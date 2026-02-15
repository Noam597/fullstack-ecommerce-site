Fullstack E-Commerce Web Application

A production-style full-stack e-commerce application built with React, TypeScript, Node.js, Express, PostgreSQL, and Redis.

The entire system is fully Dockerized using Docker Compose. The frontend, backend, PostgreSQL, and Redis run together with a single command, mirroring a real-world multi-service architecture.

🚀 Features
🔐 Authentication & Authorization
Dual-Token JWT Authentication

The application implements a secure access + refresh token strategy:

Access Token

JWT

15-minute expiration

Stored in HttpOnly cookie

Used to authenticate API requests

Refresh Token

Long-lived

Stored in HttpOnly cookie

Backed by Redis session store

Used to generate new access tokens when expired

Invalidated on logout

Session Management (Redis-backed)

Each refresh token is associated with a unique UUID stored in Redis:

Enables server-side session revocation

Prevents reuse of invalidated refresh tokens

Allows secure logout across sessions

On logout:

Refresh token entry is deleted from Redis

Both access and refresh cookies are cleared

Role-Based Access Control

Admin and User roles

Middleware-protected routes

Admin-only access for product and user management

🛒 E-Commerce Functionality

Product browsing

Shopping cart management

Checkout flow

Order tracking

Payment status handling

🛠 Admin Panel

CRUD operations for users and products

Revenue and profit overview

Protected admin routes

🧠 Backend & Infrastructure

REST API built with Express and TypeScript

PostgreSQL relational database

Redis used for:

Refresh token session storage

Performance optimization and caching

Swagger API documentation

🧪 Testing

Frontend testing with Vitest

Backend unit and integration testing with Jest

Auth flow and protected route testing included

🧱 Tech Stack
Frontend

React

TypeScript

Vite

Redux Toolkit

Tailwind CSS

Backend

Node.js

Express

TypeScript

JWT (Access + Refresh Token Strategy)

Database & Caching

PostgreSQL

Redis

DevOps & Tooling

Docker

Docker Compose

Swagger

🐳 Dockerized Architecture

The entire application is containerized and orchestrated with Docker Compose.

Services

Frontend (React)

Backend (Node.js / Express API)

PostgreSQL

Redis

This setup allows the full stack to be started, stopped, and rebuilt consistently across environments.

⚙️ Getting Started
Prerequisites

Docker

Docker Compose

🚀 Quick Start (Recommended)

Start the entire application:

docker-compose up --build


Services will run at:

Frontend → http://localhost:5173

Backend API → http://localhost:5000

Swagger Docs → http://localhost:5000/api-docs

🔧 Manual Development (Optional)

If running without Docker:

Backend
cd server
npm install
npm run dev

Frontend
cd client/store
npm install
npm run dev


Note: PostgreSQL and Redis must be running locally.

🔐 Environment Variables

Environment variables are managed via Docker Compose.

If running manually, create .env files.

Backend
DATABASE_URL=postgres://user:password@postgres:5432/dbname
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://redis:6379

Frontend
VITE_API_URL=http://localhost:5000

📌 Project Goals

Build a production-style full-stack application

Implement secure authentication with refresh token rotation

Practice role-based authorization

Work with relational databases and caching systems

Learn containerized development workflows

Write maintainable, testable code

📄 License

This project is for demonstration and educational purposes.