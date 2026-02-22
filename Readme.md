Full-Stack E-Commerce Platform

A production-style full-stack e-commerce application built with React, TypeScript, Node.js, Express, PostgreSQL, and Redis.

The entire system is fully containerized using Docker Compose. The frontend, backend API, PostgreSQL database, and Redis cache run together with a single command, mirroring a real-world multi-service architecture.

🚀 Overview

This project demonstrates how to design and implement a secure, scalable, and production-oriented e-commerce system with:

JWT authentication (access + refresh token strategy)

Redis-backed session management

Role-based access control (RBAC)

Dockerized multi-service architecture

RESTful API with Swagger documentation

Unit and integration testing

Server-side PDF receipt generation

🔐 Authentication & Authorization
Dual-Token JWT Strategy

The application implements a secure access + refresh token mechanism:

Access Token

JSON Web Token (JWT)

15-minute expiration

Stored in HttpOnly cookie

Used to authenticate API requests

Refresh Token

Long-lived token

Stored in HttpOnly cookie

Backed by Redis session store

Used to generate new access tokens

Invalidated on logout

This approach balances security and user experience by minimizing exposure while maintaining seamless sessions.

🧠 Redis-Backed Session Management

Each refresh token is associated with a unique UUID stored in Redis.

This enables:

Server-side session revocation

Protection against refresh token reuse

Secure logout across devices

On logout:

Refresh token entry is removed from Redis

Access and refresh cookies are cleared

🛡 Role-Based Access Control (RBAC)

Two system roles:

User

Admin

Protected routes are enforced through middleware:

Admin-only product management

Admin-only user management

Revenue & profit visibility restricted to admins

🛒 E-Commerce Features

Product browsing

Shopping cart management

Checkout workflow

Order persistence

Payment status tracking

Order history per user

The system models real-world commerce flows while maintaining secure access control.

🧾 PDF Receipt Generation

The platform includes server-side PDF receipt generation for completed orders.

📄 How It Works

After a successful checkout:

The backend dynamically generates a detailed receipt

The receipt includes:

Order ID

Customer information

Itemized products

Pricing breakdown (subtotal, tax, total)

Payment status

Timestamp

⚙️ Technical Implementation

PDF generation is handled using PDFKit

Order data is retrieved from PostgreSQL

A protected API endpoint streams the generated PDF

The frontend provides a one-click download experience

🔒 Security Considerations

Receipt endpoint is authentication-protected

Users can only access their own receipts

Admins can access all receipts

PDFs are generated server-side to prevent client-side tampering

This mirrors how production commerce systems generate authoritative transaction records.

🛠 Admin Panel

Admin functionality includes:

Full CRUD operations for products

User management

Revenue overview

Profit tracking

Protected admin routes

The admin system demonstrates backend authorization and frontend route protection working together.

🧠 Backend Architecture

REST API built with Express and TypeScript

Token-based authentication (Access + Refresh)

Structured middleware architecture

Centralized error handling

Swagger API documentation

🗄 Database & Caching Layer
PostgreSQL

Primary relational database:

Users

Products

Orders

Order Items

Redis

Used for:

Refresh token session storage

Performance optimization

Caching frequently accessed data

🧪 Testing
Frontend

Unit testing with Vitest

Backend

Unit and integration testing with Jest

Authentication flow testing

Protected route validation

Testing ensures reliability across critical business logic and security layers.

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

JWT Authentication Strategy

Infrastructure

PostgreSQL

Redis

Docker

Docker Compose

Swagger

🐳 Dockerized Architecture

The entire system is containerized and orchestrated with Docker Compose.

Services

Frontend (React)

Backend API (Node.js / Express)

PostgreSQL

Redis

This setup enables:

Environment consistency

Simplified onboarding

Production-like local development

Reproducible builds

⚙️ Getting Started
Prerequisites

Docker

Docker Compose

🚀 Quick Start (Recommended)

Start the entire stack:

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
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
REDIS_URL=redis://redis:6379
Frontend
VITE_API_URL=http://localhost:5000
📌 Project Goals

This project was built to:

Design a production-style full-stack system

Implement secure authentication with refresh token rotation

Apply role-based authorization patterns

Work with relational databases and caching systems

Practice containerized development workflows

Write maintainable, testable, scalable code

📄 License

This project is for demonstration and educational purposes.