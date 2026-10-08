<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Explicit pivot model for facility_services.
 * Using an explicit model (instead of a plain pivot) lets us
 * query facility services directly and add validation/logic.
 */
class FacilityService extends Model
{
    protected $table = 'facility_services';

    protected $fillable = [
        'facility_id', 'service_id', 'price', 'currency',
        'duration_minutes', 'is_available', 'notes',
    ];

    protected $casts = [
        'price'        => 'float',
        'is_available' => 'boolean',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(HealthcareFacility::class, 'facility_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
