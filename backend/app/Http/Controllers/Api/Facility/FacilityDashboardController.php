<?php

namespace App\Http\Controllers\Api\Facility;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Facility\FacilityAppointmentResource;
use App\Models\Appointment;
use App\Models\HealthcareFacility;
use Illuminate\Http\JsonResponse;

/**
 * Single endpoint that returns everything needed for the facility staff dashboard.
 */
class FacilityDashboardController extends BaseApiController
{
    public function __invoke(): JsonResponse
    {
        $user     = auth()->user();
        $facility = $user->getFacility();

        if (!$facility) {
            return $this->errorResponse('You are not assigned to any facility.', 403);
        }

        $facilityId = $facility->id;
        $today      = now()->toDateString();

        // Today's appointments
        $todayAppointments = Appointment::with(['patient', 'service'])
            ->where('facility_id', $facilityId)
            ->where('appointment_date', $today)
            ->orderBy('appointment_time')
            ->get();

        // Pending requests (all dates)
        $pendingCount = Appointment::where('facility_id', $facilityId)
            ->where('status', 'pending')
            ->count();

        // Upcoming confirmed (next 7 days)
        $upcomingConfirmed = Appointment::with(['patient', 'service'])
            ->where('facility_id', $facilityId)
            ->where('status', 'confirmed')
            ->whereBetween('appointment_date', [$today, now()->addDays(7)->toDateString()])
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->limit(10)
            ->get();

        // Stats
        $stats = [
            'today_total'       => Appointment::where('facility_id', $facilityId)
                                    ->where('appointment_date', $today)->count(),
            'today_confirmed'   => Appointment::where('facility_id', $facilityId)
                                    ->where('appointment_date', $today)->where('status', 'confirmed')->count(),
            'today_completed'   => Appointment::where('facility_id', $facilityId)
                                    ->where('appointment_date', $today)->where('status', 'completed')->count(),
            'pending_requests'  => $pendingCount,
            'total_this_month'  => Appointment::where('facility_id', $facilityId)
                                    ->whereMonth('appointment_date', now()->month)
                                    ->whereYear('appointment_date', now()->year)->count(),
            'completed_total'   => Appointment::where('facility_id', $facilityId)
                                    ->where('status', 'completed')->count(),
        ];

        return $this->successResponse([
            'facility'          => [
                'id'          => $facility->id,
                'name'        => $facility->name,
                'type'        => $facility->type,
                'location'    => $facility->location,
                'is_verified' => $facility->is_verified,
            ],
            'staff'             => [
                'id'        => $user->id,
                'name'      => $user->name,
                'job_title' => $user->staffProfile?->job_title,
            ],
            'stats'             => $stats,
            'today_appointments' => FacilityAppointmentResource::collection($todayAppointments),
            'upcoming_confirmed' => FacilityAppointmentResource::collection($upcomingConfirmed),
        ]);
    }
}
