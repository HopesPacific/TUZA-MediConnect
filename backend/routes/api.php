<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Shared\HealthCheckController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Tuza MediConnect v1
|--------------------------------------------------------------------------
*/

// ── Health Check (public) ─────────────────────────────────────────────────────
Route::get('/v1/health', HealthCheckController::class)->name('health');

// ── Version 1 ─────────────────────────────────────────────────────────────────
Route::prefix('v1')->name('api.v1.')->group(function () {

    // ── Auth — Public (no token required) ────────────────────────────────────
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login',    [AuthController::class, 'login'])->name('login');
    });

    // ── Auth — Protected (valid Sanctum token required) ───────────────────────
    Route::middleware(['auth:sanctum', 'active'])->group(function () {

        // Auth management
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::post('logout',           [AuthController::class, 'logout'])->name('logout');
            Route::get('me',                [AuthController::class, 'me'])->name('me');
            Route::put('profile',           [AuthController::class, 'updateProfile'])->name('profile.update');
            Route::put('password',          [AuthController::class, 'changePassword'])->name('password.change');
        });

        // ── Patient routes (Phase 4) ──────────────────────────────────────────
        // Route::prefix('patient')->name('patient.')->middleware('role:patient')->group(function () { });

        // ── Facilities (Phase 5) ──────────────────────────────────────────────
        // Route::prefix('facilities')->name('facilities.')->group(function () { });

        // ── Services (Phase 6) ────────────────────────────────────────────────
        // Route::prefix('services')->name('services.')->group(function () { });

        // ── Appointments (Phase 7) ────────────────────────────────────────────
        // Route::prefix('appointments')->name('appointments.')->group(function () { });

        // ── Notifications (Phase 8) ───────────────────────────────────────────
        // Route::prefix('notifications')->name('notifications.')->group(function () { });

        // ── Messages (Phase 9) ────────────────────────────────────────────────
        // Route::prefix('messages')->name('messages.')->group(function () { });

        // ── Payments (Phase 10) ───────────────────────────────────────────────
        // Route::prefix('payments')->name('payments.')->group(function () { });

        // ── Admin (Phase 12) ──────────────────────────────────────────────────
        // Route::prefix('admin')->name('admin.')->middleware('role:administrator')->group(function () { });
    });
});
