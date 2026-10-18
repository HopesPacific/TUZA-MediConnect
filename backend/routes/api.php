<?php

use App\Http\Controllers\Api\Admin\AdminAppointmentController;
use App\Http\Controllers\Api\Admin\AdminAuditLogController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminFacilityController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Facility\FacilityAppointmentController;
use App\Http\Controllers\Api\Facility\FacilityDashboardController;
use App\Http\Controllers\Api\Facility\FacilityProfileController;
use App\Http\Controllers\Api\Patient\AppointmentController;
use App\Http\Controllers\Api\Patient\DashboardController;
use App\Http\Controllers\Api\Patient\FacilityBrowseController;
use App\Http\Controllers\Api\Patient\PaymentController;
use App\Http\Controllers\Api\Shared\HealthCheckController;
use App\Http\Controllers\Api\Shared\MessageController;
use App\Http\Controllers\Api\Shared\NotificationController;
use App\Http\Controllers\Api\Shared\ServiceController;
use App\Http\Controllers\Api\Shared\UssdController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Tuza MediConnect v1
|--------------------------------------------------------------------------
*/

// ── Health Check ──────────────────────────────────────────────────────────────
Route::get('/v1/health', HealthCheckController::class)->name('health');

// ── USSD Callback (public — called by USSD provider, no auth token) ───────────
// Status: Architecture ready. Real USSD provider not yet connected.
Route::post('/ussd', [UssdController::class, 'handle'])->name('ussd.callback');

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

    // ── USSD Test (dev only) ──────────────────────────────────────────────────
    Route::get('ussd/test', [UssdController::class, 'test'])->name('ussd.test');
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

        // ── Notifications (all authenticated users) ───────────────────────────
        Route::prefix('notifications')->name('notifications.')->group(function () {
            Route::get('/',                          [NotificationController::class, 'index'])->name('index');
            Route::get('unread-count',               [NotificationController::class, 'unreadCount'])->name('unread');
            Route::patch('read-all',                 [NotificationController::class, 'markAllAsRead'])->name('read-all');
            Route::patch('{id}/read',                [NotificationController::class, 'markAsRead'])->name('read');
            Route::delete('{id}',                    [NotificationController::class, 'destroy'])->name('destroy');
        });

        // ── Messages (all authenticated users) ───────────────────────────────
        Route::prefix('messages')->name('messages.')->group(function () {
            Route::get('/',                          [MessageController::class, 'inbox'])->name('inbox');
            Route::get('unread-count',               [MessageController::class, 'unreadCount'])->name('unread');
            Route::post('/',                         [MessageController::class, 'send'])->name('send');
            Route::get('{message}',                  [MessageController::class, 'show'])->name('show');
            Route::patch('{message}/read',           [MessageController::class, 'markAsRead'])->name('read');
            Route::delete('{message}',               [MessageController::class, 'destroy'])->name('destroy');
        });

        // ── Payments (patients) ───────────────────────────────────────────────
        Route::middleware('role:patient')->prefix('payments')->name('payments.')->group(function () {
            Route::get('stats',           [PaymentController::class, 'stats'])->name('stats');
            Route::get('/',               [PaymentController::class, 'index'])->name('index');
            Route::post('/',              [PaymentController::class, 'initiate'])->name('initiate');
            Route::get('{payment}',       [PaymentController::class, 'show'])->name('show');
            Route::post('{payment}/verify', [PaymentController::class, 'verify'])->name('verify');
        });
        // Route::prefix('payments')->name('payments.')->group(function () { });

        // ── Admin (Phase 11/12) ───────────────────────────────────────────────
        Route::middleware('role:administrator')->prefix('admin')->name('admin.')->group(function () {
            // Dashboard
            Route::get('dashboard',                                     AdminDashboardController::class)->name('dashboard');
            // Services
            Route::post('services',                                     [ServiceController::class, 'store'])->name('services.store');
            Route::put('services/{service}',                            [ServiceController::class, 'update'])->name('services.update');
            Route::delete('services/{service}',                         [ServiceController::class, 'destroy'])->name('services.destroy');
            Route::patch('services/{service}/toggle',                   [ServiceController::class, 'toggle'])->name('services.toggle');
            // Appointments
            Route::get('appointments/stats',                            [AdminAppointmentController::class, 'stats'])->name('appointments.stats');
            Route::get('appointments',                                  [AdminAppointmentController::class, 'index'])->name('appointments.index');
            // Users
            Route::get('users/stats',                                   [AdminUserController::class, 'stats'])->name('users.stats');
            Route::get('users',                                         [AdminUserController::class, 'index'])->name('users.index');
            Route::get('users/{user}',                                  [AdminUserController::class, 'show'])->name('users.show');
            Route::patch('users/{user}/toggle-active',                  [AdminUserController::class, 'toggleActive'])->name('users.toggle');
            // Facilities
            Route::get('facilities',                                    [AdminFacilityController::class, 'index'])->name('facilities.index');
            Route::post('facilities',                                   [AdminFacilityController::class, 'store'])->name('facilities.store');
            Route::put('facilities/{facility}',                         [AdminFacilityController::class, 'update'])->name('facilities.update');
            Route::patch('facilities/{facility}/verify',                [AdminFacilityController::class, 'verify'])->name('facilities.verify');
            Route::patch('facilities/{facility}/toggle-active',         [AdminFacilityController::class, 'toggleActive'])->name('facilities.toggle');
            Route::delete('facilities/{facility}',                      [AdminFacilityController::class, 'destroy'])->name('facilities.destroy');
            // Audit Logs
            Route::get('audit-logs',                                    [AdminAuditLogController::class, 'index'])->name('audit-logs.index');
        });
    });
});
