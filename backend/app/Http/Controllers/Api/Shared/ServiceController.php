<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\Shared\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Services controller.
 *
 * Public endpoints (no auth): list, show, categories
 * Admin endpoints (auth + admin role): create, update, delete, toggle
 */
class ServiceController extends BaseApiController
{
    /**
     * GET /api/v1/services
     * Public — list all active services, grouped or filtered by category.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Service::active();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Admin can see inactive services too
        if ($request->boolean('include_inactive') && auth()->user()?->isAdmin()) {
            $query = Service::query()->orderBy('sort_order')->orderBy('name');
        }

        $services = $query->get();

        // Optionally group by category for the UI
        if ($request->boolean('grouped')) {
            $grouped = $services->groupBy('category')->map(fn($items, $cat) => [
                'category' => $cat,
                'label'    => $this->categoryLabel($cat),
                'services' => ServiceResource::collection($items),
            ])->values();

            return $this->successResponse($grouped);
        }

        return $this->successResponse(ServiceResource::collection($services));
    }

    /**
     * GET /api/v1/services/categories
     * Returns distinct categories with counts — used for filter UI.
     */
    public function categories(): JsonResponse
    {
        $categories = Service::active()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('category')
            ->get()
            ->map(fn($row) => [
                'value' => $row->category,
                'label' => $this->categoryLabel($row->category),
                'count' => $row->count,
            ]);

        return $this->successResponse($categories);
    }

    /**
     * GET /api/v1/services/{service}
     * Public — single service detail with facilities that offer it.
     */
    public function show(Service $service): JsonResponse
    {
        if (!$service->is_active && !auth()->user()?->isAdmin()) {
            return $this->notFoundResponse('Service not found.');
        }

        $service->load(['facilities' => fn($q) => $q->active()->with('services')]);

        return $this->successResponse(array_merge(
            (new ServiceResource($service))->toArray(request()),
            [
                'facility_count' => $service->facilities->count(),
                'facilities'     => $service->facilities->map(fn($f) => [
                    'id'          => $f->id,
                    'name'        => $f->name,
                    'location'    => $f->location,
                    'type'        => $f->type,
                    'is_verified' => $f->is_verified,
                    'price'       => $f->pivot->price,
                    'currency'    => $f->pivot->currency,
                ]),
            ]
        ));
    }

    // ── Admin CRUD ────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/admin/services
     */
    public function store(ServiceRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());
        return $this->createdResponse(new ServiceResource($service), 'Service created.');
    }

    /**
     * PUT /api/v1/admin/services/{service}
     */
    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $service->update($request->validated());
        return $this->successResponse(new ServiceResource($service), 'Service updated.');
    }

    /**
     * DELETE /api/v1/admin/services/{service}
     */
    public function destroy(Service $service): JsonResponse
    {
        // Soft delete — keeps appointment history intact
        $service->delete();
        return $this->successResponse(null, 'Service deleted.');
    }

    /**
     * PATCH /api/v1/admin/services/{service}/toggle
     */
    public function toggle(Service $service): JsonResponse
    {
        $service->update(['is_active' => !$service->is_active]);
        $status = $service->is_active ? 'activated' : 'deactivated';
        return $this->successResponse(new ServiceResource($service), "Service {$status}.");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function categoryLabel(string $category): string
    {
        return match($category) {
            'general'       => 'General Services',
            'emergency'     => 'Emergency Services',
            'dental'        => 'Dental Care',
            'laboratory'    => 'Laboratory Services',
            'maternal'      => 'Maternal Health',
            'child_health'  => 'Child Health',
            'vaccination'   => 'Vaccination',
            'mental_health' => 'Mental Health',
            'pharmacy'      => 'Pharmacy',
            'eye_care'      => 'Eye Care',
            default         => ucwords(str_replace('_', ' ', $category)),
        };
    }
}
