<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Facility\FacilityAppointmentController;
use App\Http\Controllers\Api\Facility\FacilityDashboardController;
use App\Http\Controllers\Api\Facility\FacilityProfileController;
use App\Http\Controllers\Api\Patient\AppointmentController;
use App\Http\Controllers\Api\Patient\DashboardController;
use App\Http\Controllers\Api\Patient\FacilityBrowseController;
use App\Http\Controllers\Api\Shared\HealthCheckController;
use App\Http\Controllers\Api\Shared\ServiceController;
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

    // ── Public Services (no auth) ─────────────────────────────────────────────
    Route::prefix('services')->name('services.')->group(function () {
        Route::get('/',                           [ServiceController::class, 'index'])->name('index');
        Route::get('categories',                  [ServiceController::class, 'categories'])->name('categories');
        Route::get('{service}',                   [ServiceController::class, 'show'])->name('show');
    });
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

        // ── Facility Staff ────────────────────────────────────────────────────
        Route::middleware('role:facility_staff')->prefix('facility')->name('facility.')->group(function () {
            // Dashboard
            Route::get('dashboard',                                        FacilityDashboardController::class)->name('dashboard');
            // Profile & services
            Route::get('profile',                                          [FacilityProfileController::class, 'show'])->name('profile');
            Route::put('profile',                                          [FacilityProfileController::class, 'update'])->name('profile.update');
            Route::get('services',                                         [FacilityProfileController::class, 'listServices'])->name('services.index');
            Route::post('services/{serviceId}',                            [FacilityProfileController::class, 'addService'])->name('services.add');
            Route::delete('services/{serviceId}',                          [FacilityProfileController::class, 'removeService'])->name('services.remove');
            Route::patch('services/{serviceId}/toggle',                    [FacilityProfileController::class, 'toggleService'])->name('services.toggle');
            // Appointment management
            Route::get('appointments/stats',                               [FacilityAppointmentController::class, 'stats'])->name('appointments.stats');
            Route::get('appointments',                                     [FacilityAppointmentController::class, 'index'])->name('appointments.index');
            Route::get('appointments/{appointment}',                       [FacilityAppointmentController::class, 'show'])->name('appointments.show');
            Route::patch('appointments/{appointment}/confirm',             [FacilityAppointmentController::class, 'confirm'])->name('appointments.confirm');
            Route::patch('appointments/{appointment}/reject',              [FacilityAppointmentController::class, 'reject'])->name('appointments.reject');
            Route::patch('appointments/{appointment}/reschedule',          [FacilityAppointmentController::class, 'reschedule'])->name('appointments.reschedule');
            Route::patch('appointments/{appointment}/complete',            [FacilityAppointmentController::class, 'complete'])->name('appointments.complete');
        });

        // ── Services (Phase 6) ────────────────────────────────────────────────
        // Route::prefix('services')->name('services.')->group(function () { });

        // ── Notifications (Phase 8) ───────────────────────────────────────────
        // Route::prefix('notifications')->name('notifications.')->group(function () { });

        // ── Messages (Phase 9) ────────────────────────────────────────────────
        // Route::prefix('messages')->name('messages.')->group(function () { });

        // ── Payments (Phase 10) ───────────────────────────────────────────────
        // Route::prefix('payments')->name('payments.')->group(function () { });

        // ── Admin — Service Management (Phase 6 partial, expanded in Phase 12) ──
        Route::middleware('role:administrator')->prefix('admin')->name('admin.')->group(function () {
            Route::post('services',                   [ServiceController::class, 'store'])->name('services.store');
            Route::put('services/{service}',          [ServiceController::class, 'update'])->name('services.update');
            Route::delete('services/{service}',       [ServiceController::class, 'destroy'])->name('services.destroy');
            Route::patch('services/{service}/toggle', [ServiceController::class, 'toggle'])->name('services.toggle');
        });
    });
});
