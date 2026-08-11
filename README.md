<div align="center">
  <h1>Enterprise Multi-Tenant SaaS Platform</h1>
  <p>
    <strong>A highly scalable, production-ready B2B SaaS architecture built for performance, security, and developer velocity.</strong>
  </p>
</div>

<br />

## 📖 Overview

The **Enterprise Multi-Tenant SaaS Platform** is a flagship architecture designed to serve as the bedrock for modern, scalable B2B applications. It provides true tenant isolation, robust role-based access control (RBAC), and a meticulously crafted developer experience out of the box.

Engineered with a modular-monolith approach inside an NPM workspace, the platform perfectly balances immediate development velocity with long-term architectural sustainability.

## 🏗 Architecture

This repository operates as a strict monorepo, cleanly separating the presentation layer from business logic while sharing a cohesive ecosystem.

- **`apps/web` (Frontend)**: Next.js (App Router), React, Tailwind CSS, TypeScript. A highly responsive, glassmorphism-inspired UI designed for enterprise aesthetics and optimal user engagement.
- **`apps/api` (Backend)**: NestJS, TypeScript, Drizzle ORM, PostgreSQL. A robust, strictly-typed REST API featuring global validation pipelines, scalable connection pooling, and deterministic health checks.
- **`packages/*` (Future)**: Shared TypeScript interfaces, utility functions, and design system tokens.

## 🚀 Key Capabilities

- **Strict Tenant Isolation**: Data segregation at the persistence layer guaranteeing enterprise-grade compliance.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions across organization members.
- **Edge-Ready Persistence**: Utilizing Drizzle ORM for lightning-fast, zero-overhead SQL generation tailored for PostgreSQL.
- **Type-Safe Contract**: End-to-end TypeScript alignment ensuring runtime safety and unmatched developer productivity.
- **Enterprise UI/UX**: Premium dashboard interfaces engineered for complex data visualization and seamless workflows.

## 💻 Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (React)
- **Styling**: Vanilla CSS & TailwindCSS (hybrid approach for maximum control)
- **Tooling**: Turbopack, ESLint

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: `class-validator`, `class-transformer`, `joi`

### Infrastructure & Operations
- **Monorepo Management**: NPM Workspaces
- **Identifiers**: UUID v7 (Time-sorted for optimal B-Tree indexing)
- **CI/CD**: GitHub Actions workflows for linting, type-checking, unit, and E2E testing (Coming Soon)

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v20 LTS recommended)
- PostgreSQL (v15+)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devoguzz/multi-tenant-saas-platform.git
   cd multi-tenant-saas-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Configure the environment variables for the backend.
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   *Ensure you update the `DATABASE_URL` in your `.env` file to point to your local PostgreSQL instance.*

### Running Locally

To start the entire platform concurrently:

```bash
# Start the Next.js frontend (turbopack)
npm run dev:web

# Start the NestJS backend
npm run dev:api
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1/health

---

## 🧪 Testing

The platform enforces strict quality gates before any deployment.

```bash
# Run unit and e2e tests across all workspaces
npm run test

# Run code linters
npm run lint
```

## 🔒 Security

If you discover a security vulnerability within this project, please report it immediately. We take all security vulnerabilities seriously and will address them promptly.

## 📄 License

Copyright © 2026. All rights reserved.
