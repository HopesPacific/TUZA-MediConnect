<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\Auth\UserResource;
use App\Models\AuditLog;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

/**
 * Handles all authentication: register, login, logout, profile.
 *
 * Pattern:
 *  - FormRequest handles ALL validation (controller is clean)
 *  - Resource handles ALL response shaping (no raw model returns)
 *  - AuditLog records sensitive actions (login, password change)
 */
class AuthController extends BaseApiController
{
    /**
     * POST /api/v1/auth/register
     * Register a new patient account.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => UserRole::PATIENT,
            'is_active' => true,
        ]);

        // Create the patient profile with optional fields
        PatientProfile::create([
            'user_id'                 => $user->id,
            'date_of_birth'           => $request->date_of_birth,
            'gender'                  => $request->gender,
            'location'                => $request->location,
            'emergency_contact_name'  => $request->emergency_contact_name,
            'emergency_contact_phone' => $request->emergency_contact_phone,
            'profile_completion'      => 40, // base completion on registration
        ]);

        // Load the profile so the resource can include it
        $user->load('patientProfile');

        // Issue a Sanctum token named after the device/client
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->writeAuditLog($user->id, 'registered', 'User registered successfully.');

        return $this->createdResponse([
            'user'       => new UserResource($user),
            'token'      => $token,
            'token_type' => 'Bearer',
        ], 'Account created successfully. Welcome to Tuza MediConnect!');
    }

    /**
     * POST /api/v1/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        // Generic error message — never tell the client which part is wrong
        // (prevents user enumeration attacks)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse(
                'The email or password you entered is incorrect.',
                401
            );
        }

        if (!$user->is_active) {
            return $this->errorResponse(
                'Your account has been deactivated. Please contact support.',
                403
            );
        }

        // Revoke previous tokens on new login to prevent unlimited sessions
        // In production, you may want to keep them and let the client manage logout
        $user->tokens()->delete();

        $tokenName = $request->header('User-Agent', 'web_client');
        $token     = $user->createToken($tokenName)->plainTextToken;

        // Record last login time
        $user->update(['last_login_at' => now()]);

        // Load appropriate profile based on role
        match($user->role) {
            UserRole::PATIENT        => $user->load('patientProfile'),
            UserRole::FACILITY_STAFF => $user->load(['staffProfile', 'staffProfile.facility']),
            default                  => null,
        };

        $this->writeAuditLog($user->id, 'login', 'User logged in.');

        return $this->successResponse([
            'user'       => new UserResource($user),
            'token'      => $token,
            'token_type' => 'Bearer',
        ], 'Login successful. Welcome back, ' . $user->name . '!');
    }

    /**
     * POST /api/v1/auth/logout
     */
    public function logout(): JsonResponse
    {
        $user = auth()->user();

        // Revoke only the current token (the one used in this request)
        $user->currentAccessToken()->delete();

        $this->writeAuditLog($user->id, 'logout', 'User logged out.');

        return $this->successResponse(null, 'You have been logged out successfully.');
    }

    /**
     * GET /api/v1/auth/me
     * Returns the authenticated user's profile.
     */
    public function me(): JsonResponse
    {
        $user = auth()->user();

        match($user->role) {
            UserRole::PATIENT        => $user->load('patientProfile'),
            UserRole::FACILITY_STAFF => $user->load(['staffProfile', 'staffProfile.facility']),
            default                  => null,
        };

        return $this->successResponse(new UserResource($user));
    }

    /**
     * PUT /api/v1/auth/profile
     * Update the authenticated user's profile information.
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = auth()->user();

        // Update base user fields if provided
        $userFields = $request->only(['name', 'phone']);
        if (!empty($userFields)) {
            $user->update($userFields);
        }

        // Update patient profile if the user is a patient
        if ($user->isPatient()) {
            $profileFields = $request->only([
                'date_of_birth', 'gender', 'location', 'address',
                'blood_group', 'allergies', 'chronic_conditions',
                'emergency_contact_name', 'emergency_contact_phone',
                'emergency_contact_relation',
            ]);

            $profile = $user->patientProfile ?? PatientProfile::create(['user_id' => $user->id]);
            $profile->update($profileFields);
            $profile->recalculateCompletion();

            $user->load('patientProfile');
        }

        return $this->successResponse(
            new UserResource($user),
            'Profile updated successfully.'
        );
    }

    /**
     * PUT /api/v1/auth/password
     * Change the authenticated user's password.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Current password is incorrect.', 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Revoke all other tokens — force re-login on other devices
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        $this->writeAuditLog($user->id, 'password_changed', 'User changed their password.');

        return $this->successResponse(null, 'Password changed successfully.');
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private function writeAuditLog(int $userId, string $action, string $description): void
    {
        try {
            AuditLog::create([
                'user_id'     => $userId,
                'action'      => $action,
                'description' => $description,
                'ip_address'  => request()->ip(),
                'user_agent'  => request()->userAgent(),
                'created_at'  => now(),
            ]);
        } catch (\Exception $e) {
            // Never let audit logging break auth
            \Illuminate\Support\Facades\Log::warning('Auth audit log failed: ' . $e->getMessage());
        }
    }
}
