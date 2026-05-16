# Smart Leads Dashboard

A production-grade MERN (MongoDB, Express, React, Node.js) application designed for robust, secure, and scalable lead management. Built as a comprehensive evaluation of full-stack engineering practices.

## 🚀 Features

- **Authentication & RBAC:** JWT-based stateless authentication. Role-based access control (Admin vs Sales) tightly integrated at both API middleware and UI levels.
- **Lead Management:** Full CRUD capabilities with concurrent combined filtering, debounced search, and pagination.
- **Analytics Dashboard:** A real-time aggregated overview of the lead pipeline (New, Contacted, Qualified, Lost) and source tracking.
- **CSV Export:** Native client-side CSV downloads leveraging robust server-side data generation.
- **Dark Mode:** A meticulously crafted, premium SaaS UI that fluidly transitions between light and dark modes.

## 🛠 Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS, React Hook Form, Zod, Axios, Lucide React.
**Backend:** Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs, express-validator.
**Infrastructure:** Docker, Docker Compose, Nginx.

## 📦 Local Development Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your local MONGO_URI
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

## 🐳 Docker Deployment

The entire stack is containerized for simple one-command deployment. 
This brings up the Nginx Frontend (`port 80`), the Node Backend (`port 5000`), and a MongoDB instance with persistent volumes.

```bash
docker-compose up -d --build
```
Access the application at `http://localhost`.

## 📁 Architecture Highlights

- **Thin Controllers:** The Express backend uses the Service pattern to cleanly separate HTTP concerns from business logic.
- **Centralized Errors:** A robust global error handler maps Mongoose validations and JWT errors to standard client-friendly formats.
- **Concurrent DB Queries:** `Promise.all` is heavily utilized to optimize the performance of the Analytics Dashboard.
- **Accessible UI:** Custom built components (`Button`, `Input`, `Select`, `Table`) prioritizing high contrast ratios and keyboard navigability.
