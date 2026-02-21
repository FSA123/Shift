# Project Blueprint - Design Document

## Database Schema

We will use PostgreSQL as the database. Below is the proposed schema using a relational model.

### 1. Users
Stores user profile and global settings. Authentication is handled by an external provider (Clerk/Firebase), so this table links to that identity.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR | PK | Unique ID from Auth Provider |
| `email` | VARCHAR | UNIQUE, NOT NULL | User email |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `onboarding_data` | JSONB | | Stores current routine, sleep cycles, goals, non-negotiables |

### 2. UserPlans
Represents a specific 30, 50, or 90-day plan for a user.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Unique Plan ID |
| `user_id` | VARCHAR | FK -> Users.id | Owner of the plan |
| `title` | VARCHAR | | Plan name or main goal title |
| `start_date` | DATE | NOT NULL | When the plan starts |
| `end_date` | DATE | NOT NULL | When the plan ends |
| `duration_days` | INT | | 30, 50, or 90 |
| `status` | ENUM | 'ACTIVE', 'COMPLETED', 'ARCHIVED' | Plan status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |

### 3. DailySchedules
Represents a single day within a UserPlan.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Unique Schedule ID |
| `plan_id` | UUID | FK -> UserPlans.id | Parent Plan |
| `date` | DATE | NOT NULL | The specific date |
| `day_number` | INT | NOT NULL | Day 1, Day 2, etc. |
| `summary` | TEXT | | Daily specific focus or summary |
| `status` | ENUM | 'PENDING', 'IN_PROGRESS', 'COMPLETED' | Status of the day |

### 4. DailyTasks
Individual time-blocked tasks for a specific day.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Unique Task ID |
| `schedule_id` | UUID | FK -> DailySchedules.id | Parent Day |
| `title` | VARCHAR | NOT NULL | Task name |
| `description` | TEXT | | Details |
| `start_time` | TIME | NOT NULL | Start time of the task |
| `end_time` | TIME | NOT NULL | End time of the task |
| `duration_minutes`| INT | NOT NULL | Calculated duration |
| `category` | ENUM | 'SLEEP', 'WORK', 'GOAL', 'ROUTINE', 'BUFFER' | Task type |
| `is_negotiable` | BOOLEAN | DEFAULT FALSE | Can this be moved/skipped? |
| `status` | ENUM | 'PENDING', 'COMPLETED', 'SKIPPED' | Task status |
| `identity_points` | INT | DEFAULT 0 | Points for completing this task |

---

## API Structure

We will use RESTful API endpoints (implemented via Next.js API Routes or Node.js/Express).

### Onboarding & Plan Generation

*   **POST /api/onboarding**
    *   **Body**: `{ routine: {...}, goals: [...], non_negotiables: [...] }`
    *   **Action**: Updates `Users.onboarding_data`.

*   **POST /api/plans/generate**
    *   **Body**: `{ duration: 30, start_date: "2023-10-27" }`
    *   **Action**: Calls AI Architect to generate the full plan.
    *   **Guardrail**: Validates 24h integrity before saving to `UserPlans`, `DailySchedules`, and `DailyTasks`.

### Active Timeline & Execution

*   **GET /api/plans/current**
    *   **Action**: Returns the active `UserPlan` and the `DailySchedule` + `DailyTasks` for the current date.

*   **PATCH /api/tasks/:taskId**
    *   **Body**: `{ status: "COMPLETED" }`
    *   **Action**: Updates task status, calculates identity points.

### The Pivot Engine

*   **POST /api/plans/pivot**
    *   **Body**: `{ current_time: "14:30", reason: "Meeting ran late" }`
    *   **Action**:
        1.  Fetch remaining tasks for the day.
        2.  Call AI to re-optimize schedule from `current_time` to sleep time.
        3.  **Guardrail**: Verify new schedule sums correctly.
        4.  Update DB with new task times/durations.

### Analytics

*   **GET /api/analytics**
    *   **Action**: Returns completion %, total identity points earned, streak info.
