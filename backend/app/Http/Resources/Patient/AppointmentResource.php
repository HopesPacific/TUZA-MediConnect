<?php

namespace App\Http\Resources\Patient;

use App\Enums\AppointmentStatus;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Shared\FacilityResource;
use App\Http\Resources\Shared\ServiceResource;

class AppointmentResource extends JsonResource
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
            'cancelled_at'         => $this->cancelled_at?->toIso8601String(),
            'completed_at'         => $this->completed_at?->toIso8601String(),
            'can_cancel'           => $this->canBeCancelledByPatient(),
            'facility'             => $this->when(
                $this->relationLoaded('facility'),
                fn() => new FacilityResource($this->facility)
            ),
            'service'              => $this->when(
                $this->relationLoaded('service'),
                fn() => new ServiceResource($this->service)
            ),
            'created_at'           => $this->created_at->toIso8601String(),
        ];
    }
}
