<div align="center">
  <img src="./client/src/assets/react.svg" alt="Logo" width="80" height="80">
  <h1 align="center">Smart Leads Dashboard</h1>

  <p align="center">
    A production-grade, full-stack lead management platform built with the MERN stack and TypeScript.
    <br />
    <br />
    <a href="https://smart-leads-rntc2mf6o-abhay030s-projects.vercel.app/"><strong>Explore the Live Demo »</strong></a>
    <br />
    <br />
    <i>(No sign-up required! Click <b>"Explore Demo Workspace"</b> on the login page for instant access)</i>
  </p>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

---

## 🌟 Overview

**Smart Leads Dashboard** is a scalable, secure, and highly polished lead management application designed to showcase enterprise-level architectural patterns. It features secure JWT authentication, Role-Based Access Control (RBAC), robust server-side pagination, advanced filtering, and a sleek, fully responsive UI equipped with an automatic Dark Mode.

### 🚀 Key Features

- **Instant Demo Workspace**: A custom-built, auto-seeding demo mode that populates the database with 35 highly realistic leads on server startup, allowing evaluators to bypass the registration flow.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `sales` users. Destructive actions (like deleting leads) are strictly protected by backend middleware.
- **Advanced Data Table**: Features debounced search, multi-parameter filtering, and backend-driven pagination for handling massive datasets efficiently.
- **Analytics Overview**: A lightweight command center aggregating real-time metrics (New, Contacted, Qualified, Lost) dynamically without relying on heavy third-party charting libraries.
- **CSV Data Export**: One-click generation and downloading of CSV reports respecting current dashboard filters.
- **Premium UI/UX**: Designed with a custom Tailwind CSS theme system, micro-animations, skeleton loaders, and a beautifully integrated dark mode.

---

## 🏗️ Architecture & Engineering Quality

This project is not a simple CRUD app. It demonstrates serious software engineering principles:

* **Strict TypeScript**: 100% type-safe across both frontend and backend (`tsc -b` strictly enforced), utilizing `verbatimModuleSyntax` and Zod validation.
* **Service-Layer Pattern**: The Express backend decouples HTTP routing/controllers from core business logic (housed in `services/`), allowing for isolated testing and clean code.
* **Centralized Error Handling**: A unified `AppError` architecture ensures all exceptions—from database validation failures to 404s—are caught asynchronously and formatted cleanly before hitting the client.
* **Containerization**: The entire application is orchestrated via Docker Compose, utilizing highly optimized, multi-stage Alpine images for both the React client (served via Nginx) and the Node API.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- React 18 + Vite
- TypeScript
- Tailwind CSS (with custom design system tokens)
- React Router DOM v6
- Axios (with automated JWT interceptors)
- React Hook Form + Zod (Strict validation)
- Lucide React (Icons)

### Backend (`/server`)
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (JWT) + bcryptjs (Auth)
- Helmet + Morgan (Security & Logging)

---

## 🚀 Local Development Setup

To run this project locally, you can use either **Docker** (recommended) or **npm**.

### Option 1: Using Docker Compose (Easiest)

Requires Docker Desktop to be installed.

```bash
# Clone the repository
git clone https://github.com/Abhay030/Smart-leads.git
cd Smart-leads

# Spin up the entire stack (MongoDB, Node API, Nginx Frontend)
docker-compose up -d --build
```
*The app will be instantly accessible at `http://localhost`.*

### Option 2: Manual Setup

**1. Setup Backend:**
```bash
cd server
npm install
cp .env.example .env 
# (Update .env with your local or Atlas MONGO_URI)
npm run dev
```

**2. Setup Frontend:**
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

---

## ☁️ Deployment

- **Frontend**: Hosted on [Vercel](https://vercel.com) using the Edge Network.
- **Backend**: Hosted on [Render](https://render.com) using a Node Web Service.
- **Database**: Hosted on MongoDB Atlas.

> **Note for Evaluators:** The backend API is hosted on a free Render instance. If it hasn't been accessed recently, the very first request (e.g., logging into the Demo Workspace) may take ~30 seconds as the server spins out of hibernation. All subsequent requests will be lightning fast.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
