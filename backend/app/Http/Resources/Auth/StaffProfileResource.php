<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Resources\Json\JsonResource;

class StaffProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                       => $this->id,
            'facility_id'              => $this->facility_id,
            'facility_name'            => $this->facility?->name,
            'job_title'                => $this->job_title,
            'department'               => $this->department,
            'specialization'           => $this->specialization,
            'license_number'           => $this->license_number,
            'can_manage_appointments'  => $this->can_manage_appointments,
            'can_manage_services'      => $this->can_manage_services,
        ];
    }
}
