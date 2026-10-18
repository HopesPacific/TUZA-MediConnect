<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Shared\FacilityResource;
use App\Models\HealthcareFacility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin facility management — create, update, verify, activate/deactivate.
 */
class AdminFacilityController extends BaseApiController
{
    /**
     * GET /api/v1/admin/facilities
     */
    public function index(Request $request): JsonResponse
    {
        $query = HealthcareFacility::withCount(['appointments', 'staff'])
            ->with('services')
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(fn($q) => $q->where('name', 'like', $term)
                ->orWhere('location', 'like', $term));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('verified')) {
            $query->where('is_verified', $request->boolean('verified'));
        }

        $facilities = $query->paginate($request->get('per_page', 15));

        return $this->successResponse(
            FacilityResource::collection($facilities),
            'Facilities retrieved.',
            200,
            [
                'current_page' => $facilities->currentPage(),
                'last_page'    => $facilities->lastPage(),
                'total'        => $facilities->total(),
            ]
        );
    }

    /**
     * POST /api/v1/admin/facilities
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'type'          => ['required', 'in:hospital,clinic,pharmacy,laboratory,dental,eye_care,mental_health,maternity,other'],
            'description'   => ['nullable', 'string'],
            'location'      => ['required', 'string', 'max:255'],
            'address'       => ['nullable', 'string'],
            'phone'         => ['required', 'string', 'max:20'],
            'email'         => ['nullable', 'email'],
            'opening_hours' => ['nullable', 'array'],
        ]);

        $facility = HealthcareFacility::create(array_merge($data, [
            'is_active'   => true,
            'is_verified' => false,
        ]));

        return $this->createdResponse(new FacilityResource($facility), 'Facility created successfully.');
    }

    /**
     * PUT /api/v1/admin/facilities/{facility}
     */
    public function update(Request $request, HealthcareFacility $facility): JsonResponse
    {
        $data = $request->validate([
            'name'          => ['sometimes', 'string', 'max:255'],
            'type'          => ['sometimes', 'in:hospital,clinic,pharmacy,laboratory,dental,eye_care,mental_health,maternity,other'],
            'description'   => ['nullable', 'string'],
            'location'      => ['sometimes', 'string', 'max:255'],
            'address'       => ['nullable', 'string'],
            'phone'         => ['sometimes', 'string', 'max:20'],
            'email'         => ['nullable', 'email'],
            'opening_hours' => ['nullable', 'array'],
        ]);

        $facility->update($data);

        return $this->successResponse(new FacilityResource($facility), 'Facility updated.');
    }

    /**
     * PATCH /api/v1/admin/facilities/{facility}/verify
     */
    public function verify(HealthcareFacility $facility): JsonResponse
    {
        $facility->update(['is_verified' => !$facility->is_verified]);
        $status = $facility->is_verified ? 'verified' : 'unverified';
        return $this->successResponse(new FacilityResource($facility), "Facility marked as {$status}.");
    }

    /**
     * PATCH /api/v1/admin/facilities/{facility}/toggle-active
     */
    public function toggleActive(HealthcareFacility $facility): JsonResponse
    {
        $facility->update(['is_active' => !$facility->is_active]);
        $status = $facility->is_active ? 'activated' : 'deactivated';
        return $this->successResponse(new FacilityResource($facility), "Facility {$status}.");
    }

    /**
     * DELETE /api/v1/admin/facilities/{facility}
     */
    public function destroy(HealthcareFacility $facility): JsonResponse
    {
        $facility->delete();
        return $this->successResponse(null, 'Facility deleted.');
    }
}
