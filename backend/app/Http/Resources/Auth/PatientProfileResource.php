<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Resources\Json\JsonResource;

class PatientProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                         => $this->id,
            'date_of_birth'              => $this->date_of_birth?->toDateString(),
            'age'                        => $this->age,          // computed accessor from model
            'gender'                     => $this->gender,
            'location'                   => $this->location,
            'address'                    => $this->address,
            'blood_group'                => $this->blood_group,
            'allergies'                  => $this->allergies,
            'chronic_conditions'         => $this->chronic_conditions,
            'emergency_contact_name'     => $this->emergency_contact_name,
            'emergency_contact_phone'    => $this->emergency_contact_phone,
            'emergency_contact_relation' => $this->emergency_contact_relation,
            'profile_photo'              => $this->profile_photo
                ? asset('storage/' . $this->profile_photo)
                : null,
            'profile_completion'         => $this->profile_completion,
        ];
    }
}
