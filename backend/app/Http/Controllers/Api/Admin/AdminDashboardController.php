<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\HealthcareFacility;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;

/**
 * Admin dashboard — platform-wide statistics and recent activity.
 */
class AdminDashboardController extends BaseApiController
{
    public function __invoke(): JsonResponse
    {
        // ── User stats ────────────────────────────────────────────────────────
        $totalUsers     = User::count();
        $totalPatients  = User::where('role', 'patient')->count();
        $totalStaff     = User::where('role', 'facility_staff')->count();
        $activeUsers    = User::where('is_active', true)->count();

        // ── Facility stats ────────────────────────────────────────────────────
        $totalFacilities   = HealthcareFacility::count();
        $verifiedFacilities = HealthcareFacility::where('is_verified', true)->count();
        $activeFacilities  = HealthcareFacility::where('is_active', true)->count();

        // ── Appointment stats ─────────────────────────────────────────────────
        $totalAppointments  = Appointment::count();
        $pendingAppts       = Appointment::where('status', 'pending')->count();
        $confirmedAppts     = Appointment::where('status', 'confirmed')->count();
        $completedAppts     = Appointment::where('status', 'completed')->count();
        $cancelledAppts     = Appointment::where('status', 'cancelled')->count();
        $todayAppts         = Appointment::where('appointment_date', today())->count();
        $thisMonthAppts     = Appointment::whereMonth('appointment_date', now()->month)
                                ->whereYear('appointment_date', now()->year)->count();
        $completionRate     = $totalAppointments > 0
            ? round(($completedAppts / $totalAppointments) * 100, 1) : 0;

        // ── Payment stats ─────────────────────────────────────────────────────
        $totalRevenue   = Payment::where('status', 'successful')->sum('amount');
        $pendingPayments = Payment::where('status', 'pending')->count();

        // ── Monthly chart data (last 6 months) ────────────────────────────────
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $month = $date->format('M Y');
            $monthlyData[] = [
                'month'     => $month,
                'appointments' => Appointment::whereMonth('appointment_date', $date->month)
                                    ->whereYear('appointment_date', $date->year)->count(),
                'completed' => Appointment::where('status', 'completed')
                                    ->whereMonth('appointment_date', $date->month)
                                    ->whereYear('appointment_date', $date->year)->count(),
            ];
        }

        // ── Recent audit logs ─────────────────────────────────────────────────
        $recentActivity = AuditLog::with('user')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn($log) => [
                'action'      => $log->action,
                'description' => $log->description,
                'user'        => $log->user?->name ?? 'System',
                'ip_address'  => $log->ip_address,
                'created_at'  => $log->created_at?->toIso8601String(),
            ]);

        // ── Recent registrations ──────────────────────────────────────────────
        $recentUsers = User::orderByDesc('created_at')->limit(5)
            ->get(['id', 'name', 'email', 'role', 'created_at'])
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->role,
                'created_at' => $u->created_at->toIso8601String(),
            ]);

        return $this->successResponse([
            'stats' => [
                'users' => [
                    'total'    => $totalUsers,
                    'patients' => $totalPatients,
                    'staff'    => $totalStaff,
                    'active'   => $activeUsers,
                ],
                'facilities' => [
                    'total'    => $totalFacilities,
                    'verified' => $verifiedFacilities,
                    'active'   => $activeFacilities,
                ],
                'appointments' => [
                    'total'           => $totalAppointments,
                    'pending'         => $pendingAppts,
                    'confirmed'       => $confirmedAppts,
                    'completed'       => $completedAppts,
                    'cancelled'       => $cancelledAppts,
                    'today'           => $todayAppts,
                    'this_month'      => $thisMonthAppts,
                    'completion_rate' => $completionRate,
                ],
                'payments' => [
                    'total_revenue'   => round($totalRevenue, 2),
                    'pending_count'   => $pendingPayments,
                    'currency'        => 'KES',
                ],
            ],
            'monthly_chart'   => $monthlyData,
            'recent_activity' => $recentActivity,
            'recent_users'    => $recentUsers,
        ]);
    }
}
