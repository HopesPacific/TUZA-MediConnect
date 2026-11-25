# Tuza MediConnect

A healthcare digital platform connecting patients with healthcare facilities. Built with Laravel (backend API) and React (frontend SPA).

![PHP](https://img.shields.io/badge/PHP-8.0-blue)
![Laravel](https://img.shields.io/badge/Laravel-9-red)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tests](https://img.shields.io/badge/tests-21%20passing-brightgreen)

---

## ⚡ Quick Start — Run the Full Project

### Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Check |
|---|---|---|
| PHP | >= 8.0 | `php --version` |
| Composer | any | `composer --version` |
| Node.js | >= 18 | `node --version` |
| npm | any | `npm --version` |
| MySQL | 8.0 | Via XAMPP, Laragon, or standalone |
| Git | any | `git --version` |

---

### Step 1 — Clone or open the project

If starting fresh:
```bash
git clone https://github.com/yourusername/tuza-mediconnect.git
cd "TUZA MEDI-SYSTEM"
```

---

### Step 2 — Set up the Backend

```bash
cd backend
```

**Install PHP dependencies:**
```bash
composer install
```

**Copy the environment file:**
```bash
copy .env.example .env
```

**Generate the application key:**
```bash
php artisan key:generate
```

**Configure the database** — open `backend/.env` and update these lines:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tuza_mediconnect
DB_USERNAME=root
DB_PASSWORD=
```
> Leave `DB_PASSWORD` empty if you are using XAMPP default (no password).

**Create the database** — open MySQL and run:
```sql
CREATE DATABASE tuza_mediconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Or via command line:
```bash
mysql -u root -e "CREATE DATABASE tuza_mediconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**Run migrations and seed demo data:**
```bash
php artisan migrate --seed
```

You should see:
```
✓ Users seeded (admin, 2 staff, 3 patients)
✓ Services seeded (18 services)
✓ Healthcare facilities seeded (4 facilities)
✓ Appointments seeded (8 appointments)
```

---

### Step 3 — Set up the Frontend

Open a **new terminal window** and run:

```bash
cd frontend
npm install
```

---

### Step 4 — Start the Backend (Terminal 1)

```bash
cd backend
php artisan serve
```

Expected output:
```
INFO  Server running on [http://127.0.0.1:8000].
```

Verify it works: open `http://localhost:8000/api/v1/health` in your browser.
You should see: `"status": "operational"`

---

### Step 5 — Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.2.10  ready in 3078 ms
➜  Local:   http://localhost:5173/
```

---

### Step 6 — Open the App

Open your browser and go to: **`http://localhost:5173`**

---

## 🔑 Demo Login Accounts

> These accounts are created by the database seeder. For local development only.

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | admin@tuzamediconnect.com | Admin@1234 | Full platform management |
| **Facility Staff** | staff@nairobi-clinic.com | Staff@1234 | Nairobi Family Clinic |
| **Facility Staff** | staff@mombasa-hospital.com | Staff@1234 | Mombasa General Hospital |
| **Patient** | john@example.com | Patient@1234 | Patient dashboard |
| **Patient** | grace@example.com | Patient@1234 | Patient dashboard |
| **Patient** | peter@example.com | Patient@1234 | Patient dashboard |

**Tip:** On the login page, click the **Admin**, **Staff**, or **Patient** quick-fill button to auto-fill credentials instantly.

---

## 🧭 Navigation Guide

After logging in, you are automatically redirected to the correct dashboard based on your role.

### As a Patient (`john@example.com`)
| Page | URL | What it does |
|---|---|---|
| Dashboard | `/patient/dashboard` | Upcoming appointments, quick actions |
| Appointments | `/patient/appointments` | List all appointments with status filter |
| Book | `/patient/book` | 4-step booking wizard |
| Find Facilities | `/patient/facilities` | Search and browse healthcare facilities |
| Services | `/patient/services` | Browse all 18+ service categories |
| Notifications | `/patient/notifications` | Appointment alerts and updates |
| Messages | `/patient/messages` | Message facility staff directly |
| Profile | `/patient/profile` | Edit personal and medical info |

### As Facility Staff (`staff@nairobi-clinic.com`)
| Page | URL | What it does |
|---|---|---|
| Dashboard | `/facility/dashboard` | Today's schedule, stats |
| Appointments | `/facility/appointments` | Confirm, reject, reschedule, complete |
| Messages | `/facility/messages` | Inbox from patients |
| Profile | `/facility/profile` | Edit facility information |
| Services | `/facility/services` | Add/remove services with pricing |

### As Administrator (`admin@tuzamediconnect.com`)
| Page | URL | What it does |
|---|---|---|
| Dashboard | `/admin/dashboard` | Platform-wide stats and charts |
| Users | `/admin/users` | Manage all user accounts |
| Facilities | `/admin/facilities` | Verify and manage facilities |
| Appointments | `/admin/appointments` | View all platform appointments |
| Audit Logs | `/admin/audit-logs` | Security and activity log |

### Public pages (no login required)
| Page | URL |
|---|---|
| Landing page | `/` |
| Services catalog | `/services` |

---

## 🛠 Troubleshooting

### MySQL won't connect
If you see `SQLSTATE[HY000] [2002] No connection`:
- Open **XAMPP Control Panel** → click **Start** next to MySQL
- Or if using standalone MySQL: start the MySQL service
- Then restart `php artisan serve`

### Port already in use
If port 8000 is taken:
```bash
php artisan serve --port=8001
```
Then update `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8001/api/v1
```

### npm install fails
```bash
cd frontend
npm install --legacy-peer-deps
```

### Migrations fail
If you get a migration error, reset the database:
```bash
php artisan migrate:fresh --seed --force
```

### Vite proxy errors (API calls fail)
Make sure the backend is running on port 8000 before starting the frontend.
The frontend proxies `/api` requests to `http://localhost:8000` via `vite.config.ts`.

---

## Running Tests

```bash
cd backend
php vendor/phpunit/phpunit/phpunit tests/Feature/AuthTest.php --no-coverage
php vendor/phpunit/phpunit/phpunit tests/Feature/AppointmentTest.php --no-coverage
```

Expected: **21 tests, all passing**

Tests cover:
- Patient registration (valid, duplicate email, weak password)
- Login (correct credentials, wrong password, inactive account)
- Protected routes and role-based access
- Appointment booking and double-booking prevention
- Appointment cancellation rules
- Staff confirm/reject workflows

---

## Project Structure

```
TUZA MEDI-SYSTEM/
├── backend/                Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── Auth/           Login, register, logout
│   │   │   ├── Patient/        Patient dashboard, appointments
│   │   │   ├── Facility/       Staff appointment management
│   │   │   ├── Admin/          Admin management
│   │   │   └── Shared/         Services, notifications, messages
│   │   ├── Models/             Eloquent models (User, Appointment, etc.)
│   │   ├── Services/           Business logic (AppointmentService, SMS, etc.)
│   │   ├── Notifications/      In-app and email notifications
│   │   └── Policies/           Authorization rules
│   ├── database/
│   │   ├── migrations/         17 database tables
│   │   └── seeders/            Demo data
│   └── routes/api.php          45+ API routes
│
└── frontend/               React + Vite + TypeScript SPA
    └── src/
        ├── api/                Axios API clients
        ├── components/         Reusable UI components
        │   ├── common/         Button, Input, Modal, Badge, etc.
        │   ├── layout/         Sidebars, layouts per role
        │   └── appointments/   Appointment cards
        ├── hooks/              Custom React hooks
        ├── pages/
        │   ├── public/         Landing, Services
        │   ├── auth/           Login, Register
        │   ├── patient/        Patient pages
        │   ├── facility/       Staff pages
        │   └── admin/          Admin pages
        ├── routes/             Protected/Guest route guards
        ├── store/              Zustand auth store
        └── types/              TypeScript interfaces
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | PHP 8.0, Laravel 9 |
| Authentication | Laravel Sanctum (Bearer tokens) |
| Database | MySQL 8 |
| Frontend | React 18, Vite 5, TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State management | Zustand |
| HTTP client | Axios |
| Routing | React Router v6 |
| Forms | React Hook Form |
| Notifications | Laravel Notifications (database + mail channels) |
| SMS | Mock service (pluggable — Africa's Talking compatible) |
| Testing | PHPUnit 9 |

---

## Features

- ✅ Patient registration and secure login
- ✅ Role-based access (Patient / Staff / Admin)
- ✅ Browse and search healthcare facilities
- ✅ 4-step appointment booking wizard
- ✅ Appointment lifecycle (pending → confirmed → completed)
- ✅ Double-booking prevention (database + service layer)
- ✅ In-app notification bell with real-time unread count
- ✅ Email notification stubs (ready for SMTP config)
- ✅ SMS notification architecture (mock, swap via .env)
- ✅ Direct messaging (patient ↔ facility staff, threaded)
- ✅ Patient profile with completion tracking
- ✅ Facility service management with pricing
- ✅ Admin dashboard with platform statistics
- ✅ Audit log for all sensitive actions
- ✅ USSD endpoint architecture (ready for provider)

---

## Author

Built as a portfolio project demonstrating professional full-stack development with Laravel and React.

> **Disclaimer:** This is a demonstration project. It is not a real medical service.
