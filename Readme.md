Fullstack E-Commerce Web Application

A modern full-stack e-commerce application built with React, TypeScript, Node.js, Express, PostgreSQL, and Redis.

This project is fully Dockerized. Using Docker Compose, the frontend, backend, PostgreSQL, and Redis all run together and can be started with a single command, mirroring a real-world development setup.

🚀 Features
Authentication & Authorization

User signup, login, and logout

JWT-based authentication

Secure password hashing

Role-based access (admin vs user)

E-Commerce Functionality

Product browsing and management

Shopping cart and checkout flow

Order tracking and payment status

Admin Panel

CRUD operations for users and products

Revenue and profit overview

Admin-only protected routes

Backend & Infrastructure

REST API built with Express and TypeScript

PostgreSQL database

Redis caching for performance optimization

Swagger API documentation

Testing

Frontend testing with Vitest

Backend unit and integration testing with Jest

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

JWT Authentication

Database & Caching

PostgreSQL

Redis

DevOps

Docker

Docker Compose

Swagger

🐳 Dockerized Architecture

The entire application is containerized using Docker and orchestrated with Docker Compose.

Services

Frontend (React)

Backend (Node.js / Express)

PostgreSQL

Redis

This setup allows the full stack to be started, stopped, and rebuilt consistently across environments.

⚙️ Getting Started
Prerequisites

Docker

Docker Compose

🚀 Quick Start (Recommended)

Start the entire application with one command:

docker-compose up --build


This will start:

Frontend at http://localhost:5173

Backend API at http://localhost:5000

Swagger API docs at http://localhost:5000/api-docs

PostgreSQL and Redis containers

🔧 Manual Development (Optional)

If you prefer to run services without Docker:

Backend
cd server
npm install
npm run dev

Frontend
cd client/store
npm install
npm run dev


Note: Manual mode still requires PostgreSQL and Redis to be running.

🔐 Environment Variables

Environment variables are managed via Docker Compose.
If running manually, create .env files as needed.

Backend
DATABASE_URL=postgres://user:password@postgres:5432/dbname
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://redis:6379

Frontend
VITE_API_URL=http://localhost:5000

📌 Project Goals

Build a production-style full-stack application

Practice authentication, authorization, and role management

Work with relational databases and caching

Learn Docker-based development workflows

Write maintainable, testable code

📄 License

This project is for demonstration and educational purposes.