<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Facility\FacilityAppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin-level appointment management.
 * Admins can view ALL appointments across all facilities.
 */
class AdminAppointmentController extends BaseApiController
{
    /**
     * GET /api/v1/admin/appointments
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['patient', 'service', 'facility'])
            ->orderByDesc('appointment_date')
            ->orderByDesc('appointment_time');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('facility_id')) {
            $query->where('facility_id', $request->facility_id);
        }

        if ($request->filled('date')) {
            $query->where('appointment_date', $request->date);
        }

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->whereHas('patient', fn($q) =>
                $q->where('name', 'like', $term)->orWhere('email', 'like', $term)
            );
        }

        $appointments = $query->paginate($request->get('per_page', 20));

        return $this->successResponse(
            FacilityAppointmentResource::collection($appointments),
            'Appointments retrieved.',
            200,
            [
                'current_page' => $appointments->currentPage(),
                'last_page'    => $appointments->lastPage(),
                'per_page'     => $appointments->perPage(),
                'total'        => $appointments->total(),
            ]
        );
    }

    /**
     * GET /api/v1/admin/appointments/stats
     * Platform-wide appointment statistics.
     */
    public function stats(): JsonResponse
    {
        $total     = Appointment::count();
        $today     = now()->toDateString();

        return $this->successResponse([
            'total'          => $total,
            'pending'        => Appointment::where('status', 'pending')->count(),
            'confirmed'      => Appointment::where('status', 'confirmed')->count(),
            'completed'      => Appointment::where('status', 'completed')->count(),
            'cancelled'      => Appointment::where('status', 'cancelled')->count(),
            'rejected'       => Appointment::where('status', 'rejected')->count(),
            'today'          => Appointment::where('appointment_date', $today)->count(),
            'this_month'     => Appointment::whereMonth('appointment_date', now()->month)
                                    ->whereYear('appointment_date', now()->year)->count(),
            'completion_rate' => $total > 0
                ? round((Appointment::where('status', 'completed')->count() / $total) * 100, 1)
                : 0,
        ]);
    }
}
