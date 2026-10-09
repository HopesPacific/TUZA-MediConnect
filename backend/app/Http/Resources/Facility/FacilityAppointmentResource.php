<?php

namespace App\Http\Resources\Facility;

use App\Enums\AppointmentStatus;
use App\Http\Resources\Auth\UserResource;
use App\Http\Resources\Shared\ServiceResource;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Appointment resource from the facility staff perspective.
 * Includes patient info (not exposed in the patient-side resource).
 */
class FacilityAppointmentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                   => $this->id,
            'appointment_date'     => $this->appointment_date?->toDateString(),
            'appointment_time'     => $this->appointment_time,
            'reason'               => $this->reason,
            'status'               => $this->status,
            'status_label'         => AppointmentStatus::label($this->status),
            'status_color'         => AppointmentStatus::color($this->status),
            'notes'                => $this->notes,
            'rejection_reason'     => $this->rejection_reason,
            'reschedule_date'      => $this->reschedule_date?->toDateString(),
            'reschedule_time'      => $this->reschedule_time,
            'reschedule_reason'    => $this->reschedule_reason,
            'cancellation_reason'  => $this->cancellation_reason,
            'completed_at'         => $this->completed_at?->toIso8601String(),
            // Patient info — included for staff view
            'patient'              => $this->when(
                $this->relationLoaded('patient'),
                fn() => [
                    'id'    => $this->patient->id,
                    'name'  => $this->patient->name,
                    'email' => $this->patient->email,
                    'phone' => $this->patient->phone,
                ]
            ),
            'service'              => $this->when(
                $this->relationLoaded('service'),
                fn() => new ServiceResource($this->service)
            ),
            'created_at'           => $this->created_at->toIso8601String(),
        ];
    }
}
