# Project Blueprint

A mobile-first web application that generates hyper-personalized, time-blocked life plans.

## Features

- **Onboarding Engine**: Collect user data and goals.
- **AI Architect**: Generates 30/50/90-day plans.
- **Active Timeline**: Vertical timeline for daily tasks.
- **Pivot Logic**: Adjusts schedule if off-track.
- **Progress Analytics**: Tracks completion and identity points.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: (To be integrated: Clerk/Firebase).

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    - Ensure PostgreSQL is running.
    - Create a `.env` file with `DATABASE_URL`.
    - Run migrations:
      ```bash
      npx prisma migrate dev
      ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Run Tests**:
    - Guardrail Logic:
      ```bash
      npx tsx scripts/test-guardrail.ts
      ```

## Design

See [DESIGN.md](./DESIGN.md) for the database schema and API structure.
