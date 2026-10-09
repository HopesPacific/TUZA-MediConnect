<?php

namespace App\Http\Resources\Shared;

use Illuminate\Http\Resources\Json\JsonResource;

class FacilityResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'type'          => $this->type,
            'description'   => $this->description,
            'location'      => $this->location,
            'address'       => $this->address,
            'phone'         => $this->phone,
            'email'         => $this->email,
            'website'       => $this->website,
            'opening_hours' => $this->opening_hours,
            'logo'          => $this->logo ? asset('storage/' . $this->logo) : null,
            'cover_image'   => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'is_active'     => $this->is_active,
            'is_verified'   => $this->is_verified,
            'is_open_now'   => $this->isOpenNow(),
            'rating'        => $this->rating,
            'total_reviews' => $this->total_reviews,
            'services'      => $this->when(
                $this->relationLoaded('services'),
                fn() => ServiceResource::collection($this->services)
            ),
            'created_at'    => $this->created_at->toIso8601String(),
        ];
    }
}
