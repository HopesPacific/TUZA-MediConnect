<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Auth\PatientProfileResource;
use App\Http\Resources\Patient\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

/**
 * Aggregates all data needed for the patient dashboard in one request.
 * Instead of the frontend making 4 separate API calls on load,
 * this returns everything in a single response.
 */
class DashboardController extends BaseApiController
{
    public function __invoke(): JsonResponse
    {
        $user      = auth()->user();
        $patientId = $user->id;

        // Load profile
        $user->load('patientProfile');

        // Upcoming appointments (next 5)
        $upcoming = Appointment::with(['facility', 'service'])
            ->where('patient_id', $patientId)
            ->upcoming()
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->limit(5)
            ->get();

        // Recent history (last 5 completed/cancelled/rejected)
        $history = Appointment::with(['facility', 'service'])
            ->where('patient_id', $patientId)
            ->whereIn('status', ['completed', 'cancelled', 'rejected'])
            ->orderByDesc('appointment_date')
            ->limit(5)
            ->get();

        // Summary stats
        $stats = [
            'upcoming'  => Appointment::where('patient_id', $patientId)->upcoming()->count(),
            'pending'   => Appointment::where('patient_id', $patientId)->pending()->count(),
            'completed' => Appointment::where('patient_id', $patientId)->completed()->count(),
            'total'     => Appointment::where('patient_id', $patientId)->count(),
        ];

        return $this->successResponse([
            'user'              => [
                'id'                 => $user->id,
                'name'               => $user->name,
                'email'              => $user->email,
                'phone'              => $user->phone,
                'role'               => $user->role,
            ],
            'profile'           => $user->patientProfile
                ? new PatientProfileResource($user->patientProfile)
                : null,
            'stats'             => $stats,
            'upcoming_appointments' => AppointmentResource::collection($upcoming),
            'recent_history'    => AppointmentResource::collection($history),
        ]);
    }
}
