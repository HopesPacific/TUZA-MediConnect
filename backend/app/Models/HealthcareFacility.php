<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HealthcareFacility extends Model
{
    use HasFactory, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'name', 'type', 'description', 'location', 'address',
        'latitude', 'longitude', 'phone', 'email', 'website',
        'opening_hours', 'logo', 'cover_image',
        'is_active', 'is_verified', 'rating', 'total_reviews',
    ];

    protected $casts = [
        'opening_hours' => 'array',
        'is_active'     => 'boolean',
        'is_verified'   => 'boolean',
        'rating'        => 'float',
        'latitude'      => 'float',
        'longitude'     => 'float',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function staff(): HasMany
    {
        return $this->hasMany(HealthcareStaff::class, 'facility_id');
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'facility_services', 'facility_id', 'service_id')
                    ->withPivot(['price', 'currency', 'duration_minutes', 'is_available', 'notes'])
                    ->withTimestamps();
    }

    public function facilityServices(): HasMany
    {
        return $this->hasMany(FacilityService::class, 'facility_id');
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'facility_id');
    }

    public function availabilitySlots(): HasMany
    {
        return $this->hasMany(AvailabilitySlot::class, 'facility_id');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isOpenNow(): bool
    {
        if (!$this->opening_hours) return false;

        $dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $today = $dayNames[now()->dayOfWeek];
        $hours = $this->opening_hours[$today] ?? null;

        if (!$hours || ($hours['closed'] ?? false)) return false;

        $now  = now()->format('H:i');
        return $now >= $hours['open'] && $now <= $hours['close'];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }
}
