# Tuza MediConnect

A healthcare digital platform connecting patients with healthcare facilities in Rwanda. Built with Laravel (backend API) and React (frontend SPA).

![PHP](https://img.shields.io/badge/PHP-8.0-blue)
![Laravel](https://img.shields.io/badge/Laravel-9-red)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tests](https://img.shields.io/badge/tests-21%20passing-brightgreen)
![Country](https://img.shields.io/badge/Country-Rwanda-blue)

---

## ⚡ Quick Start — Run the Full Project

### Prerequisites

| Tool | Version | Check command |
|---|---|---|
| PHP | >= 8.0 | `php --version` |
| Composer | any | `composer --version` |
| Node.js | >= 18 | `node --version` |
| npm | any | `npm --version` |
| MySQL | 8.0 | Via XAMPP or standalone |
| Git | any | `git --version` |

---

### Step 1 — Clone or open the project

```bash
git clone https://github.com/yourusername/tuza-mediconnect.git
cd "TUZA MEDI-SYSTEM"
```

---

### Step 2 — Set up the Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

**Configure the database** — open `backend/.env` and set:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tuza_mediconnect
DB_USERNAME=root
DB_PASSWORD=
```

**Create the database:**
```bash
mysql -u root -h 127.0.0.1 -e "CREATE DATABASE tuza_mediconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**Run migrations and seed Rwandan demo data:**
```bash
php artisan migrate --seed
```

Expected output:
```
✓ Users seeded (admin, 2 staff, 3 patients)
✓ Services seeded (18 services)
✓ Healthcare facilities seeded (4 facilities)
✓ Appointments seeded (8 appointments)
```

---

### Step 3 — Set up the Frontend

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

Verify: open `http://localhost:8000/api/v1/health` → should show `"status": "operational"`

---

### Step 5 — Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

---

### Step 6 — Open the App

**`http://localhost:5173`**

---

## 🔑 Demo Login Accounts

> Rwandan names and phone numbers. For local development only.

| Role | Email | Password | Facility |
|---|---|---|---|
| **Administrator** | admin@tuzamediconnect.rw | Admin@1234 | Platform admin |
| **Facility Staff** | staff@kigali-clinic.rw | Staff@1234 | Kigali Family Clinic |
| **Facility Staff** | staff@chuk-hospital.rw | Staff@1234 | CHUK Hospital |
| **Patient** | jean@example.com | Patient@1234 | Jean Pierre Kagabo, Kigali |
| **Patient** | marie@example.com | Patient@1234 | Marie Claire Mukamana, Butare |
| **Patient** | patrick@example.com | Patient@1234 | Patrick Niyonzima, Musanze |

**Tip:** On the login page, click **Admin**, **Staff**, or **Patient** to auto-fill instantly.

---

## 🏥 Rwandan Healthcare Facilities (Seed Data)

| Facility | Type | Location | Verified |
|---|---|---|---|
| Kigali Family Clinic | Clinic | Kigali, KN 5 Rd | ✅ Yes |
| Centre Hospitalier Universitaire de Kigali (CHUK) | Hospital | Kigali, Nyarugenge | ✅ Yes |
| Butare Dental Centre | Dental | Huye District | ❌ Pending |
| Musanze Community Pharmacy | Pharmacy | Musanze District | ❌ Pending |

---

## 💱 Rwanda-specific Configuration

| Setting | Value |
|---|---|
| Currency | RWF (Rwandan Franc) |
| Country code | +250 |
| Language | Kinyarwanda (landing page) / English (app) |
| Payment | MTN Mobile Money Rwanda (sandbox) |
| SMS format | +250788XXXXXX |

---

## 🧭 Navigation Guide

### As a Patient (`jean@example.com`)
| Page | URL | Description |
|---|---|---|
| Dashboard | `/patient/dashboard` | Upcoming appointments, quick actions |
| Appointments | `/patient/appointments` | List all with status filter |
| Book | `/patient/book` | 4-step booking wizard |
| Facilities | `/patient/facilities` | Search Rwandan healthcare facilities |
| Services | `/patient/services` | Browse 18+ service categories |
| Notifications | `/patient/notifications` | Appointment alerts |
| Messages | `/patient/messages` | Message facility staff |
| Profile | `/patient/profile` | Edit personal and medical info |

### As Facility Staff (`staff@kigali-clinic.rw`)
| Page | URL | Description |
|---|---|---|
| Dashboard | `/facility/dashboard` | Today's schedule and stats |
| Appointments | `/facility/appointments` | Confirm, reject, reschedule, complete |
| Messages | `/facility/messages` | Inbox from patients |
| Profile | `/facility/profile` | Edit facility information |
| Services | `/facility/services` | Add/remove services with RWF pricing |

### As Administrator (`admin@tuzamediconnect.rw`)
| Page | URL | Description |
|---|---|---|
| Dashboard | `/admin/dashboard` | Platform statistics and charts |
| Users | `/admin/users` | Manage user accounts |
| Facilities | `/admin/facilities` | Verify Rwandan facilities |
| Appointments | `/admin/appointments` | Platform-wide view |
| Audit Logs | `/admin/audit-logs` | Security log |

### Public (no login)
| Page | URL |
|---|---|
| Landing page (Kinyarwanda) | `/` |
| Services catalog | `/services` |

---

## 🛠 Troubleshooting

### MySQL won't connect
```
SQLSTATE[HY000] [2002] No connection
```
→ Open XAMPP Control Panel → Start MySQL → restart `php artisan serve`

### Port already in use
```bash
php artisan serve --port=8001
```
Update `frontend/.env`: `VITE_API_BASE_URL=http://localhost:8001/api/v1`

### npm install fails
```bash
npm install --legacy-peer-deps
```

### Reset database
```bash
php artisan migrate:fresh --seed --force
```

### Vite starts on wrong port (5174 instead of 5173)
Another process is using 5173. Either stop it, or use 5174 — the app works on either port.

---

## Running Tests

```bash
cd backend
php vendor/phpunit/phpunit/phpunit tests/Feature/AuthTest.php --no-coverage
php vendor/phpunit/phpunit/phpunit tests/Feature/AppointmentTest.php --no-coverage
```

Expected: **21 tests, all passing**

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
│   │   ├── Models/             Eloquent models
│   │   ├── Services/           Business logic (AppointmentService, SMS, MTN MoMo)
│   │   ├── Notifications/      In-app and email notifications
│   │   └── Policies/           Authorization rules
│   ├── database/
│   │   ├── migrations/         17 database tables
│   │   └── seeders/            Rwandan demo data
│   └── routes/api.php          45+ API routes
│
└── frontend/               React + Vite + TypeScript SPA
    └── src/
        ├── api/                Axios API clients
        ├── components/         Reusable UI components
        ├── hooks/              Custom React hooks
        ├── pages/
        │   ├── public/         Landing (Kinyarwanda), Services
        │   ├── auth/           Login, Register
        │   ├── patient/        Patient pages
        │   ├── facility/       Staff pages
        │   └── admin/          Admin pages
        ├── store/              Zustand auth store
        └── types/              TypeScript interfaces
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | PHP 8.0, Laravel 9 |
| Authentication | Laravel Sanctum |
| Database | MySQL 8 |
| Frontend | React 18, Vite 5, TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| HTTP | Axios |
| Routing | React Router v6 |
| Forms | React Hook Form |
| Notifications | Laravel Notifications (database + mail) |
| SMS | Mock (MTN Rwanda compatible) |
| Payment | MTN Mobile Money Rwanda (sandbox architecture) |
| Testing | PHPUnit 9 |

---

## Features

- ✅ Patient registration and login (Rwandan phone format +250)
- ✅ Role-based access (Patient / Staff / Admin)
- ✅ Browse Rwandan healthcare facilities (Kigali, Butare, Musanze, Rubavu)
- ✅ 4-step appointment booking wizard
- ✅ Appointment lifecycle (pending → confirmed → completed)
- ✅ Double-booking prevention
- ✅ In-app notifications with bell and unread count
- ✅ Direct messaging (patient ↔ facility staff, threaded)
- ✅ Patient profile with completion tracking
- ✅ Facility service management with RWF pricing
- ✅ MTN Mobile Money Rwanda sandbox integration
- ✅ Admin dashboard with platform statistics
- ✅ Audit log
- ✅ Landing page in Kinyarwanda
- ✅ Currency in RWF (Rwandan Franc)

---

## MTN Mobile Money Rwanda

The payment architecture is built for **MTN Mobile Money Rwanda**.

To activate real payments:
1. Register at [momodeveloper.mtn.com](https://momodeveloper.mtn.com)
2. Subscribe to the **Collection** product
3. Add to `backend/.env`:
```
PAYMENT_DRIVER=mtn
MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_COLLECTION_PRIMARY_KEY=your-subscription-key
MTN_MOMO_API_USER=your-api-user-uuid
MTN_MOMO_API_KEY=your-api-key
MTN_MOMO_ENVIRONMENT=sandbox
MTN_MOMO_CURRENCY=RWF
MTN_MOMO_CALLBACK_URL=https://yourdomain.rw/api/mtn/callback
```

No code changes needed — `MtnMobileMoneyService` is already wired in.

---

## Author

Built as a portfolio project for Rwandan hospital implementation.

> **Disclaimer:** This is a demonstration project. It is not a real medical service.
