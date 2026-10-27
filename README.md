# Tuza MediConnect

A production-quality healthcare digital platform connecting patients with healthcare facilities across East Africa. Built as a portfolio project demonstrating modern full-stack development with Laravel and React.

![Platform Status](https://img.shields.io/badge/status-active-green)
![PHP](https://img.shields.io/badge/PHP-8.0-blue)
![Laravel](https://img.shields.io/badge/Laravel-9-red)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tests](https://img.shields.io/badge/tests-23%20passing-brightgreen)

---

## Features

### Patients
- Register and log in securely
- Browse verified healthcare facilities with search and filters
- Book appointments with date/time selection and available slot checking
- View appointment status (pending, confirmed, rescheduled, completed, cancelled, rejected)
- Cancel appointments (pending/confirmed only)
- Receive in-app, email, and SMS notifications for every appointment event
- View appointment history with full status timeline
- Manage profile (personal info, blood group, emergency contact)
- Direct messaging with facility staff
- Payment via MTN Mobile Money (sandbox) or mock

### Healthcare Staff
- Manage appointments (confirm, reject, reschedule, complete)
- View patient appointment summaries
- Update facility profile and opening hours
- Add/remove/toggle services with pricing
- Inbox for patient messages with threaded replies

### Administrators
- Platform-wide dashboard with stats and charts
- User management (activate/deactivate accounts)
- Facility management (create, verify, activate/deactivate)
- All appointment oversight
- Audit log viewer

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.0, Laravel 9 |
| Authentication | Laravel Sanctum (token-based) |
| Database | MySQL 8 |
| Frontend | React 18, Vite 5, TypeScript |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| HTTP | Axios |
| Routing | React Router v6 |
| Forms | React Hook Form |
| Notifications | Laravel Notifications (database + mail) |
| SMS | Mock (pluggable — Africa's Talking, Twilio ready) |
| Payments | MTN Mobile Money sandbox architecture |
| Testing | PHPUnit 9 |

---

## System Architecture

```
tuza-mediconnect/
├── backend/          Laravel REST API (port 8000)
└── frontend/         React SPA (port 5173)
```

**Decoupled SPA architecture:** frontend communicates with backend via REST API.
The backend is stateless and can serve a mobile app with the same APIs.

### Key patterns
- **Service layer** — business logic in `AppointmentService`, `NotificationService` etc.
- **Policy-based authorization** — `AppointmentPolicy`, `PatientProfilePolicy`
- **Interface-driven services** — `SmsServiceInterface`, `PaymentServiceInterface` (swap providers via `.env`)
- **API Resources** — all responses shaped through dedicated Resource classes
- **FormRequest validation** — controllers stay thin, rules in dedicated classes

---

## User Roles

| Role | Access |
|---|---|
| `patient` | Register, browse facilities, book appointments, messages, payments |
| `facility_staff` | Manage appointments, facility profile, services, messages |
| `administrator` | Full platform management, user/facility/audit control |

---

## Installation

### Prerequisites
- PHP >= 8.0
- Composer
- Node.js >= 18
- MySQL 8
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/tuza-mediconnect.git
cd tuza-mediconnect
```

### 2. Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup

Create the database:
```sql
CREATE DATABASE tuza_mediconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `.env`:
```
DB_DATABASE=tuza_mediconnect
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run migrations and seed:
```bash
php artisan migrate
php artisan db:seed
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

---

## Environment Configuration

### Backend `.env` (key variables)

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# SMS (mock by default — set SMS_DRIVER=africastalking for real SMS)
SMS_DRIVER=mock

# Payment (mock by default — set PAYMENT_DRIVER=mtn for MTN MoMo)
PAYMENT_DRIVER=mock

# MTN Mobile Money (sandbox)
# Register at https://momodeveloper.mtn.com
# MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
# MTN_MOMO_COLLECTION_PRIMARY_KEY=your-key
# MTN_MOMO_API_USER=your-uuid
# MTN_MOMO_API_KEY=your-api-key
# MTN_MOMO_ENVIRONMENT=sandbox
# MTN_MOMO_CURRENCY=UGX
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME="Tuza MediConnect"
```

---

## Running the Application

### Backend (Terminal 1)
```bash
cd backend
php artisan serve
# API available at http://localhost:8000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# App available at http://localhost:5173
```

---

## Development Accounts

> ⚠️ For local development only. Never use real patient data.

| Role | Email | Password |
|---|---|---|
| Administrator | admin@tuzamediconnect.com | Admin@1234 |
| Facility Staff | staff@nairobi-clinic.com | Staff@1234 |
| Facility Staff | staff@mombasa-hospital.com | Staff@1234 |
| Patient | john@example.com | Patient@1234 |
| Patient | grace@example.com | Patient@1234 |
| Patient | peter@example.com | Patient@1234 |

---

## API Documentation

Base URL: `http://localhost:8000/api/v1`

All responses follow this structure:
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... },
  "meta": { "current_page": 1, "total": 50 }
}
```

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register new patient |
| POST | `/auth/login` | None | Login |
| POST | `/auth/logout` | Bearer | Logout |
| GET  | `/auth/me` | Bearer | Current user |
| PUT  | `/auth/profile` | Bearer | Update profile |
| PUT  | `/auth/password` | Bearer | Change password |

### Facilities
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/facilities` | None | Browse facilities |
| GET | `/facilities/{id}` | None | Facility details |
| GET | `/facilities/{id}/available-slots?date=` | None | Available time slots |

### Appointments (Patient)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/appointments` | List my appointments |
| POST | `/appointments` | Book appointment |
| GET | `/appointments/{id}` | Appointment detail |
| PATCH | `/appointments/{id}/cancel` | Cancel appointment |
| GET | `/appointments/stats` | My appointment counts |

### Facility Staff
| Method | Endpoint | Description |
|---|---|---|
| GET | `/facility/dashboard` | Staff dashboard data |
| GET | `/facility/appointments` | All facility appointments |
| PATCH | `/facility/appointments/{id}/confirm` | Confirm |
| PATCH | `/facility/appointments/{id}/reject` | Reject |
| PATCH | `/facility/appointments/{id}/reschedule` | Reschedule |
| PATCH | `/facility/appointments/{id}/complete` | Mark completed |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | List notifications |
| GET | `/notifications/unread-count` | Unread count |
| PATCH | `/notifications/{id}/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all read |

### Payments (Mock / MTN MoMo Sandbox)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/payments` | Payment history |
| POST | `/payments` | Initiate payment |
| POST | `/payments/{id}/verify` | Verify payment status |

### USSD (Architecture Ready)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ussd` | USSD provider callback |
| GET | `/api/v1/ussd/test` | Simulate USSD flow (dev) |

### MTN MoMo Callback
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/mtn/callback` | MTN async payment callback |

---

## Testing

```bash
cd backend
php vendor/phpunit/phpunit/phpunit tests/ --no-coverage
```

**23 tests, 59 assertions — all passing.**

Test coverage:
- Patient registration (valid, duplicate email, weak password)
- Login (correct credentials, wrong password, inactive account)
- Protected route access
- Role-based authorization
- Appointment booking (valid, past date, reason validation)
- Double-booking prevention
- Appointment cancellation (pending allowed, completed blocked)
- Business rule enforcement in AppointmentService
- Staff confirm/reject workflows
- HTTP-level role middleware

---

## MTN Mobile Money Integration

The payment system is architected for MTN Mobile Money via the official MoMo API.

**Status: Sandbox architecture complete. Requires real developer credentials.**

To activate:
1. Register at [momodeveloper.mtn.com](https://momodeveloper.mtn.com)
2. Subscribe to the **Collection** product
3. Generate your API User, API Key, and Subscription Key
4. Add to `.env`:
   ```
   PAYMENT_DRIVER=mtn
   MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
   MTN_MOMO_COLLECTION_PRIMARY_KEY=your-key
   MTN_MOMO_API_USER=your-uuid
   MTN_MOMO_API_KEY=your-api-key
   MTN_MOMO_ENVIRONMENT=sandbox
   MTN_MOMO_CURRENCY=UGX
   MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/mtn/callback
   ```

No code changes needed — the `MtnMobileMoneyService` is already wired in.

---

## Future Improvements

| Feature | Status |
|---|---|
| MTN MoMo live credentials | Planned |
| Email verification on registration | Planned |
| Appointment reminders (scheduled jobs) | Planned |
| Africa's Talking SMS integration | Planned |
| File uploads (profile photos, facility logos) | Planned |
| Real USSD provider integration | Planned |
| Patient reviews and ratings | Planned |
| Mobile app (React Native) | Planned |
| Telemedicine / video consultations | Planned |
| Insurance claim integration | Planned |
| Multi-language support (Swahili) | Planned |

---

## Author

**Tuza MediConnect** — Portfolio Project

Built to demonstrate professional full-stack development skills including:
- Clean REST API design with Laravel
- Role-based access control with policies
- React + TypeScript SPA with modern patterns
- Interface-driven service layer (SMS, payments)
- Real-world payment provider integration architecture (MTN MoMo)
- Automated testing (PHPUnit)
- Professional UI/UX with Tailwind CSS

---

> **Disclaimer:** This is a portfolio demonstration project. It is not a real medical service. Do not use it for actual healthcare decisions.
