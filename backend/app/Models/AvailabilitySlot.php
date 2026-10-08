<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AvailabilitySlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'facility_id', 'slot_type', 'day_of_week', 'specific_date',
        'start_time', 'end_time', 'slot_duration_minutes',
        'max_appointments_per_slot', 'is_active',
    ];

    protected $casts = [
        'specific_date' => 'date',
        'is_active'     => 'boolean',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(HealthcareFacility::class, 'facility_id');
    }
}
