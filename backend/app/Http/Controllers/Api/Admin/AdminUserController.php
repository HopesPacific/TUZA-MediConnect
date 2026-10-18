<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Auth\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin user management — view all users, activate/deactivate accounts.
 */
class AdminUserController extends BaseApiController
{
    /**
     * GET /api/v1/admin/users
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['patientProfile', 'staffProfile.facility'])
            ->orderByDesc('created_at');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(fn($q) => $q->where('name', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->orWhere('phone', 'like', $term));
        }

        if ($request->filled('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $users = $query->paginate($request->get('per_page', 20));

        return $this->successResponse(
            UserResource::collection($users),
            'Users retrieved.',
            200,
            [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
            ]
        );
    }

    /**
     * GET /api/v1/admin/users/{user}
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['patientProfile', 'staffProfile.facility']);
        return $this->successResponse(new UserResource($user));
    }

    /**
     * PATCH /api/v1/admin/users/{user}/toggle-active
     * Activate or deactivate a user account.
     */
    public function toggleActive(User $user): JsonResponse
    {
        // Prevent admin from deactivating their own account
        if ($user->id === auth()->id()) {
            return $this->errorResponse('You cannot deactivate your own account.', 422);
        }

        $user->update(['is_active' => !$user->is_active]);

        // Revoke all tokens if deactivating
        if (!$user->is_active) {
            $user->tokens()->delete();
        }

        $status = $user->is_active ? 'activated' : 'deactivated';
        return $this->successResponse(new UserResource($user), "Account {$status} successfully.");
    }

    /**
     * GET /api/v1/admin/users/stats
     */
    public function stats(): JsonResponse
    {
        return $this->successResponse([
            'total'       => User::count(),
            'patients'    => User::where('role', 'patient')->count(),
            'staff'       => User::where('role', 'facility_staff')->count(),
            'admins'      => User::where('role', 'administrator')->count(),
            'active'      => User::where('is_active', true)->count(),
            'inactive'    => User::where('is_active', false)->count(),
            'new_today'   => User::whereDate('created_at', today())->count(),
            'new_month'   => User::whereMonth('created_at', now()->month)->count(),
        ]);
    }
}
