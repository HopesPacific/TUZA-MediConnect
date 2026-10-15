<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Patient\BookAppointmentRequest;
use App\Http\Requests\Patient\CancelAppointmentRequest;
use App\Http\Resources\Patient\AppointmentDetailResource;
use App\Http\Resources\Patient\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Patient appointment management.
 * Patients can: list, view, book, cancel their own appointments.
 * Staff actions (confirm, reject, reschedule, complete) live in the Facility controller.
 */
class AppointmentController extends BaseApiController
{
    private AppointmentService $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    /**
     * GET /api/v1/appointments
     * List the authenticated patient's appointments with optional filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['facility', 'service'])
            ->where('patient_id', auth()->id())
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter upcoming only
        if ($request->boolean('upcoming')) {
            $query->upcoming();
        }

        $appointments = $query->paginate($request->get('per_page', 10));

        return $this->successResponse(
            AppointmentResource::collection($appointments),
            'Appointments retrieved successfully.',
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
     * GET /api/v1/appointments/{id}
     */
    public function show(Appointment $appointment): JsonResponse
    {
        $this->authorize('view', $appointment);

        $appointment->load(['facility', 'service', 'statusHistory.changedBy']);

        return $this->successResponse(new AppointmentDetailResource($appointment));
    }

    /**
     * POST /api/v1/appointments
     * Book a new appointment.
     */
    public function store(BookAppointmentRequest $request): JsonResponse
    {
        try {
            $appointment = $this->appointmentService->book(
                $request->validated(),
                auth()->id()
            );

            $appointment->load(['facility', 'service']);

            return $this->createdResponse(
                new AppointmentResource($appointment),
                'Appointment booked successfully. You will be notified when it is confirmed.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /api/v1/appointments/{id}/cancel
     */
    public function cancel(CancelAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('cancel', $appointment);

        try {
            $updated = $this->appointmentService->cancelByPatient(
                $appointment,
                auth()->id(),
                $request->reason
            );

            return $this->successResponse(
                new AppointmentResource($updated),
                'Appointment cancelled successfully.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * GET /api/v1/appointments/stats
     * Summary counts for the patient dashboard.
     */
    public function stats(): JsonResponse
    {
        $patientId = auth()->id();

        $stats = [
            'upcoming'   => Appointment::where('patient_id', $patientId)->upcoming()->count(),
            'pending'    => Appointment::where('patient_id', $patientId)->pending()->count(),
            'confirmed'  => Appointment::where('patient_id', $patientId)->confirmed()->count(),
            'completed'  => Appointment::where('patient_id', $patientId)->completed()->count(),
            'total'      => Appointment::where('patient_id', $patientId)->count(),
        ];

        return $this->successResponse($stats);
    }
}
