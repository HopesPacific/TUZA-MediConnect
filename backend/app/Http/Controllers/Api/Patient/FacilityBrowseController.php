<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Shared\FacilityResource;
use App\Models\HealthcareFacility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Public-facing facility browsing for patients.
 * No auth required to list/search — allows guests to browse.
 * Auth required to book (handled in AppointmentController).
 */
class FacilityBrowseController extends BaseApiController
{
    /**
     * GET /api/v1/facilities
     * Browse all active facilities with search/filter/pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = HealthcareFacility::with('services')
            ->active()
            ->orderBy('is_verified', 'desc')
            ->orderByDesc('rating');

        // Full-text search on name and location
        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhere('location', 'like', $term)
                  ->orWhere('description', 'like', $term);
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('verified')) {
            $query->verified();
        }

        $facilities = $query->paginate($request->get('per_page', 12));

        return $this->successResponse(
            FacilityResource::collection($facilities),
            'Facilities retrieved successfully.',
            200,
            [
                'current_page' => $facilities->currentPage(),
                'last_page'    => $facilities->lastPage(),
                'per_page'     => $facilities->perPage(),
                'total'        => $facilities->total(),
            ]
        );
    }

    /**
     * GET /api/v1/facilities/{id}
     * Full facility details including services and availability.
     */
    public function show(HealthcareFacility $healthcareFacility): JsonResponse
    {
        if (!$healthcareFacility->is_active) {
            return $this->notFoundResponse('This facility is not currently active.');
        }

        $healthcareFacility->load('services');

        return $this->successResponse(
            new FacilityResource($healthcareFacility),
            'Facility details retrieved.'
        );
    }

    /**
     * GET /api/v1/facilities/{id}/available-slots
     * Returns available time slots for a given facility on a given date.
     * Used by the booking form to populate the time picker.
     */
    public function availableSlots(Request $request, HealthcareFacility $healthcareFacility): JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $date      = $request->date;
        $dayOfWeek = date('N', strtotime($date)); // 1=Mon, 7=Sun

        // Get all possible slots from facility availability
        $slots = $healthcareFacility->availabilitySlots()
            ->where('is_active', true)
            ->where(function ($q) use ($dayOfWeek, $date) {
                $q->where(function ($q2) use ($dayOfWeek) {
                    $q2->where('slot_type', 'recurring')
                       ->where('day_of_week', $dayOfWeek % 7); // convert to 0=Sun
                })->orWhere(function ($q2) use ($date) {
                    $q2->where('slot_type', 'override')
                       ->where('specific_date', $date);
                });
            })
            ->get();

        // If no slots configured, return default 08:00–17:00 in 30min increments
        if ($slots->isEmpty()) {
            $slots = $this->generateDefaultSlots();
        } else {
            $slots = $this->expandSlots($slots);
        }

        // Remove already-booked times
        $booked = \App\Models\Appointment::where('facility_id', $healthcareFacility->id)
            ->where('appointment_date', $date)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->pluck('appointment_time')
            ->map(fn($t) => substr($t, 0, 5))
            ->toArray();

        $available = array_values(array_filter(
            $slots,
            fn($slot) => !in_array($slot, $booked)
        ));

        return $this->successResponse([
            'date'      => $date,
            'slots'     => $available,
            'booked'    => $booked,
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function generateDefaultSlots(): array
    {
        $slots = [];
        for ($h = 8; $h < 17; $h++) {
            $slots[] = sprintf('%02d:00', $h);
            $slots[] = sprintf('%02d:30', $h);
        }
        return $slots;
    }

    private function expandSlots($availabilitySlots): array
    {
        $slots = [];
        foreach ($availabilitySlots as $slot) {
            $start    = strtotime($slot->start_time);
            $end      = strtotime($slot->end_time);
            $duration = ($slot->slot_duration_minutes ?? 30) * 60;

            for ($t = $start; $t < $end; $t += $duration) {
                $slots[] = date('H:i', $t);
            }
        }
        return array_unique($slots);
    }
}
