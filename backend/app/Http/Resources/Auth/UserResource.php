<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Shapes the User model for API responses.
 *
 * Why Resources instead of returning the model directly?
 * - Never accidentally expose sensitive fields (password, remember_token)
 * - Add computed properties (e.g. profile_completion, facility_name)
 * - Control the exact JSON shape the frontend receives
 * - Decouples the DB schema from the API contract
 */
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'email'              => $this->email,
            'phone'              => $this->phone,
            'role'               => $this->role,
            'is_active'          => $this->is_active,
            'email_verified_at'  => $this->email_verified_at?->toIso8601String(),
            'last_login_at'      => $this->last_login_at?->toIso8601String(),
            'created_at'         => $this->created_at->toIso8601String(),

            // Conditionally include related data if loaded
            'patient_profile'    => $this->when(
                $this->relationLoaded('patientProfile') && $this->patientProfile,
                fn() => new PatientProfileResource($this->patientProfile)
            ),
            'staff_profile'      => $this->when(
                $this->relationLoaded('staffProfile') && $this->staffProfile,
                fn() => new StaffProfileResource($this->staffProfile)
            ),
        ];
    }
}
