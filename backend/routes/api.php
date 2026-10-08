<?php

use App\Http\Controllers\Api\Shared\HealthCheckController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Tuza MediConnect
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api automatically by RouteServiceProvider.
| We use /api/v1/ prefix for versioning.
|
| Route organization:
|   - Public routes (no auth required)
|   - Auth routes (registration, login)
|   - Protected routes (require valid Sanctum token)
|     - Patient routes
|     - Facility staff routes
|     - Admin routes
|
| Routes for each module are added as they are built in subsequent phases.
*/

// ─── Health Check ────────────────────────────────────────────────────────────
Route::get('/v1/health', HealthCheckController::class)->name('health');

// ─── Version 1 API ───────────────────────────────────────────────────────────
Route::prefix('v1')->name('api.v1.')->group(function () {

    // ── Auth (Phase 3) ──────────────────────────────────────────────────────
    // Route::prefix('auth')->name('auth.')->group(function () {
    //     Route::post('register', [AuthController::class, 'register'])->name('register');
    //     Route::post('login',    [AuthController::class, 'login'])->name('login');
    //     Route::post('logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
    // });

    // ── Protected Routes ────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // ── Patient (Phase 4) ──────────────────────────────────────────
        // Route::prefix('patient')->name('patient.')->group(function () { ... });

        // ── Facilities (Phase 5) ───────────────────────────────────────
        // Route::prefix('facilities')->name('facilities.')->group(function () { ... });

        // ── Services (Phase 6) ─────────────────────────────────────────
        // Route::prefix('services')->name('services.')->group(function () { ... });

        // ── Appointments (Phase 7) ─────────────────────────────────────
        // Route::prefix('appointments')->name('appointments.')->group(function () { ... });

        // ── Notifications (Phase 8) ────────────────────────────────────
        // Route::prefix('notifications')->name('notifications.')->group(function () { ... });

        // ── Messages (Phase 9) ─────────────────────────────────────────
        // Route::prefix('messages')->name('messages.')->group(function () { ... });

        // ── Payments (Phase 10) ────────────────────────────────────────
        // Route::prefix('payments')->name('payments.')->group(function () { ... });

        // ── Admin (various phases) ─────────────────────────────────────
        // Route::prefix('admin')->name('admin.')->middleware('role:administrator')->group(function () { ... });
    });

});
