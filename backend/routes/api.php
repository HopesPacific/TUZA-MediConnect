<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Patient\AppointmentController;
use App\Http\Controllers\Api\Patient\DashboardController;
use App\Http\Controllers\Api\Patient\FacilityBrowseController;
use App\Http\Controllers\Api\Shared\HealthCheckController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Tuza MediConnect v1
|--------------------------------------------------------------------------
*/

// ── Health Check ──────────────────────────────────────────────────────────────
Route::get('/v1/health', HealthCheckController::class)->name('health');

Route::prefix('v1')->name('api.v1.')->group(function () {

    // ── Public Auth ───────────────────────────────────────────────────────────
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login',    [AuthController::class, 'login'])->name('login');
    });

    // ── Public Facility Browsing (no auth needed to browse) ───────────────────
    Route::prefix('facilities')->name('facilities.')->group(function () {
        Route::get('/',                                      [FacilityBrowseController::class, 'index'])->name('index');
        Route::get('{healthcareFacility}',                   [FacilityBrowseController::class, 'show'])->name('show');
        Route::get('{healthcareFacility}/available-slots',   [FacilityBrowseController::class, 'availableSlots'])->name('slots');
    });

    // ── Protected Routes ──────────────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'active'])->group(function () {

        // Auth management
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::post('logout',  [AuthController::class, 'logout'])->name('logout');
            Route::get('me',       [AuthController::class, 'me'])->name('me');
            Route::put('profile',  [AuthController::class, 'updateProfile'])->name('profile.update');
            Route::put('password', [AuthController::class, 'changePassword'])->name('password.change');
        });

        // ── Patient routes ────────────────────────────────────────────────────
        Route::middleware('role:patient')->prefix('patient')->name('patient.')->group(function () {
            Route::get('dashboard', DashboardController::class)->name('dashboard');
        });

        // ── Appointments (patients) ───────────────────────────────────────────
        Route::middleware('role:patient')->prefix('appointments')->name('appointments.')->group(function () {
            Route::get('stats',          [AppointmentController::class, 'stats'])->name('stats');
            Route::get('/',              [AppointmentController::class, 'index'])->name('index');
            Route::post('/',             [AppointmentController::class, 'store'])->name('store');
            Route::get('{appointment}',  [AppointmentController::class, 'show'])->name('show');
            Route::patch('{appointment}/cancel', [AppointmentController::class, 'cancel'])->name('cancel');
        });

        // ── Facility Staff (Phase 5) ──────────────────────────────────────────
        // Route::middleware('role:facility_staff')->prefix('facility')->name('facility.')->group(function () { });

        // ── Services (Phase 6) ────────────────────────────────────────────────
        // Route::prefix('services')->name('services.')->group(function () { });

        // ── Notifications (Phase 8) ───────────────────────────────────────────
        // Route::prefix('notifications')->name('notifications.')->group(function () { });

        // ── Messages (Phase 9) ────────────────────────────────────────────────
        // Route::prefix('messages')->name('messages.')->group(function () { });

        // ── Payments (Phase 10) ───────────────────────────────────────────────
        // Route::prefix('payments')->name('payments.')->group(function () { });

        // ── Admin (Phase 12) ──────────────────────────────────────────────────
        // Route::middleware('role:administrator')->prefix('admin')->name('admin.')->group(function () { });
    });
});
