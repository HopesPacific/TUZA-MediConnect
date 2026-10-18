<?php

namespace App\Http\Resources\Shared;

use App\Enums\PaymentStatus;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'              => $this->id,
            'amount'          => $this->amount,
            'currency'        => $this->currency,
            'status'          => $this->status,
            'status_label'    => PaymentStatus::label($this->status),
            'payment_method'  => $this->payment_method,
            'provider'        => $this->provider,
            'transaction_ref' => $this->transaction_ref,
            'failure_reason'  => $this->failure_reason,
            'paid_at'         => $this->paid_at?->toIso8601String(),
            'created_at'      => $this->created_at->toIso8601String(),
            // Appointment summary (if loaded)
            'appointment'     => $this->when(
                $this->relationLoaded('appointment') && $this->appointment,
                fn() => [
                    'id'               => $this->appointment->id,
                    'appointment_date' => $this->appointment->appointment_date?->toDateString(),
                    'appointment_time' => $this->appointment->appointment_time,
                    'facility_name'    => $this->appointment->facility?->name,
                    'service_name'     => $this->appointment->service?->name,
                    'status'           => $this->appointment->status,
                ]
            ),
        ];
    }
}
