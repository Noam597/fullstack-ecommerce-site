Fullstack E-Commerce Web App

A modern fullstack e-commerce application built with React, TypeScript, Node.js, Express, and PostgreSQL, showcasing authentication, database integration, admin functionality, and comprehensive testing.

Features

User Authentication: Sign up, login, logout with JWT and password encryption.

Shopping Cart & Orders: Manage cart items, track orders and payments.

Admin Panel: CRUD for users and products, view revenue and profit.

API Documentation: Full Swagger UI for exploring backend endpoints.

Caching & Docker: Redis caching and PostgreSQL via Docker for efficient development.

Tech Stack

Frontend: React, TypeScript, Vite, Redux Toolkit, Tailwind CSS

Backend: Node.js, Express, TypeScript, JWT authentication

Database: PostgreSQL, Redis (via Docker)

Testing: Vitest (frontend) & Jest (backend) — unit and integration tests

Getting Started

This project requires running three services: the backend, frontend, and Dockerized database.

Clone the repository and install dependencies

git clone https://github.com/Noam597/fullstack-ecommerce-site.git
cd <repo-folder>



Start Docker containers for PostgreSQL and Redis:

 docker-compose up postgres redis -d


Start the backend server:

cd server
npm install
npm run dev


Start the frontend:

cd client/store
npm install
npm run dev


Open your browser at the frontend URL (default: http://localhost:5173)

Environment Variables
Create a .env file in backend and frontend with values like:

VITE_API_URL=http://localhost:5000
DATABASE_URL=postgres://user:password@localhost:5432/dbname

License

For demonstration purposes.