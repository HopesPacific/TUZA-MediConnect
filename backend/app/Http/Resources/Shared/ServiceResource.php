<?php

namespace App\Http\Resources\Shared;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'category'         => $this->category,
            'description'      => $this->description,
            'icon'             => $this->icon,
            'is_active'        => $this->is_active,
            // Pivot data present when loaded via facility->services
            'price'            => $this->when(
                isset($this->pivot),
                fn() => $this->pivot?->price
            ),
            'currency'         => $this->when(
                isset($this->pivot),
                fn() => $this->pivot?->currency ?? 'KES'
            ),
            'duration_minutes' => $this->when(
                isset($this->pivot),
                fn() => $this->pivot?->duration_minutes
            ),
            'is_available'     => $this->when(
                isset($this->pivot),
                fn() => (bool) $this->pivot?->is_available
            ),
        ];
    }
}
