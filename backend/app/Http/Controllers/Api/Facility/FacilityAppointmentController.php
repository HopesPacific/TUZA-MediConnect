<?php

namespace App\Http\Controllers\Api\Facility;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Facility\ManageAppointmentRequest;
use App\Http\Resources\Facility\FacilityAppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Facility staff appointment management.
 * All actions are scoped to the staff member's own facility.
 */
class FacilityAppointmentController extends BaseApiController
{
    private AppointmentService $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    /**
     * GET /api/v1/facility/appointments
     * List appointments at the staff's facility with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $facilityId = auth()->user()->getFacility()?->id;
        if (!$facilityId) return $this->errorResponse('No facility assigned.', 403);

        $query = Appointment::with(['patient', 'service'])
            ->where('facility_id', $facilityId)
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->where('appointment_date', $request->date);
        }

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->whereHas('patient', fn($q) => $q->where('name', 'like', $term)
                ->orWhere('phone', 'like', $term));
        }

        $appointments = $query->paginate($request->get('per_page', 15));

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
     * GET /api/v1/facility/appointments/{id}
     */
    public function show(Appointment $appointment): JsonResponse
    {
        $this->ensureFacilityOwns($appointment);
        $appointment->load(['patient', 'service', 'statusHistory.changedBy']);

        return $this->successResponse(new FacilityAppointmentResource($appointment));
    }

    /**
     * PATCH /api/v1/facility/appointments/{id}/confirm
     */
    public function confirm(Appointment $appointment): JsonResponse
    {
        $this->ensureFacilityOwns($appointment);

        try {
            $updated = $this->appointmentService->confirm($appointment, auth()->id());
            return $this->successResponse(
                new FacilityAppointmentResource($updated),
                'Appointment confirmed successfully.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /api/v1/facility/appointments/{id}/reject
     */
    public function reject(ManageAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $this->ensureFacilityOwns($appointment);

        if (empty($request->reason)) {
            return $this->errorResponse('A reason is required to reject an appointment.', 422);
        }

        try {
            $updated = $this->appointmentService->reject(
                $appointment,
                auth()->id(),
                $request->reason
            );
            return $this->successResponse(
                new FacilityAppointmentResource($updated),
                'Appointment rejected.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /api/v1/facility/appointments/{id}/reschedule
     */
    public function reschedule(ManageAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $this->ensureFacilityOwns($appointment);

        try {
            $updated = $this->appointmentService->reschedule(
                $appointment,
                auth()->id(),
                $request->validated()
            );
            return $this->successResponse(
                new FacilityAppointmentResource($updated),
                'Appointment rescheduled. The patient will be notified.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /api/v1/facility/appointments/{id}/complete
     */
    public function complete(Appointment $appointment): JsonResponse
    {
        $this->ensureFacilityOwns($appointment);

        try {
            $updated = $this->appointmentService->complete($appointment, auth()->id());
            return $this->successResponse(
                new FacilityAppointmentResource($updated),
                'Appointment marked as completed.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * GET /api/v1/facility/appointments/stats
     */
    public function stats(): JsonResponse
    {
        $facilityId = auth()->user()->getFacility()?->id;
        if (!$facilityId) return $this->errorResponse('No facility assigned.', 403);

        $today = now()->toDateString();

        return $this->successResponse([
            'pending'         => Appointment::where('facility_id', $facilityId)->where('status', 'pending')->count(),
            'confirmed'       => Appointment::where('facility_id', $facilityId)->where('status', 'confirmed')->count(),
            'today'           => Appointment::where('facility_id', $facilityId)->where('appointment_date', $today)->count(),
            'completed_total' => Appointment::where('facility_id', $facilityId)->where('status', 'completed')->count(),
            'this_month'      => Appointment::where('facility_id', $facilityId)
                                    ->whereMonth('appointment_date', now()->month)->count(),
        ]);
    }

    // ── Guard ─────────────────────────────────────────────────────────────────

    private function ensureFacilityOwns(Appointment $appointment): void
    {
        $facilityId = auth()->user()->getFacility()?->id;

        if ($appointment->facility_id !== $facilityId && !auth()->user()->isAdmin()) {
            abort(403, 'You can only manage appointments at your own facility.');
        }
    }
}
