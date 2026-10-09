<?php

namespace App\Http\Controllers\Api\Facility;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Facility\UpdateFacilityRequest;
use App\Http\Resources\Shared\FacilityResource;
use App\Http\Resources\Shared\ServiceResource;
use App\Models\FacilityService;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Facility staff can view and update their own facility's profile.
 */
class FacilityProfileController extends BaseApiController
{
    /**
     * GET /api/v1/facility/profile
     */
    public function show(): JsonResponse
    {
        $facility = auth()->user()->getFacility();

        if (!$facility) {
            return $this->errorResponse('You are not assigned to any facility.', 403);
        }

        $facility->load('services');

        return $this->successResponse(new FacilityResource($facility));
    }

    /**
     * PUT /api/v1/facility/profile
     */
    public function update(UpdateFacilityRequest $request): JsonResponse
    {
        $facility = auth()->user()->getFacility();

        if (!$facility) {
            return $this->errorResponse('You are not assigned to any facility.', 403);
        }

        $facility->update($request->validated());
        $facility->load('services');

        return $this->successResponse(
            new FacilityResource($facility),
            'Facility profile updated successfully.'
        );
    }

    /**
     * GET /api/v1/facility/services
     * List services the facility currently offers.
     */
    public function listServices(): JsonResponse
    {
        $facility = auth()->user()->getFacility();
        if (!$facility) return $this->errorResponse('No facility assigned.', 403);

        $facility->load('services');

        return $this->successResponse(ServiceResource::collection($facility->services));
    }

    /**
     * POST /api/v1/facility/services/{serviceId}
     * Add a service to the facility.
     */
    public function addService(Request $request, int $serviceId): JsonResponse
    {
        $facility = auth()->user()->getFacility();
        if (!$facility) return $this->errorResponse('No facility assigned.', 403);

        $service = Service::active()->find($serviceId);
        if (!$service) return $this->notFoundResponse('Service not found.');

        $request->validate([
            'price'            => ['nullable', 'numeric', 'min:0'],
            'duration_minutes' => ['nullable', 'integer', 'min:5', 'max:480'],
            'notes'            => ['nullable', 'string', 'max:500'],
        ]);

        // Attach or update if already exists
        $facility->services()->syncWithoutDetaching([
            $serviceId => [
                'price'            => $request->price,
                'currency'         => 'KES',
                'duration_minutes' => $request->get('duration_minutes', 30),
                'is_available'     => true,
                'notes'            => $request->notes,
            ],
        ]);

        return $this->successResponse(null, 'Service added to facility.');
    }

    /**
     * DELETE /api/v1/facility/services/{serviceId}
     * Remove a service from the facility.
     */
    public function removeService(int $serviceId): JsonResponse
    {
        $facility = auth()->user()->getFacility();
        if (!$facility) return $this->errorResponse('No facility assigned.', 403);

        $facility->services()->detach($serviceId);

        return $this->successResponse(null, 'Service removed from facility.');
    }

    /**
     * PATCH /api/v1/facility/services/{serviceId}/toggle
     * Toggle availability of a service.
     */
    public function toggleService(int $serviceId): JsonResponse
    {
        $facility = auth()->user()->getFacility();
        if (!$facility) return $this->errorResponse('No facility assigned.', 403);

        $pivot = FacilityService::where('facility_id', $facility->id)
            ->where('service_id', $serviceId)
            ->first();

        if (!$pivot) return $this->notFoundResponse('Service not found in your facility.');

        $pivot->update(['is_available' => !$pivot->is_available]);

        $status = $pivot->is_available ? 'available' : 'unavailable';
        return $this->successResponse(null, "Service marked as {$status}.");
    }
}
