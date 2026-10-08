<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class HealthcareStaff extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'facility_id', 'job_title', 'department',
        'license_number', 'specialization', 'profile_photo',
        'can_manage_appointments', 'can_manage_services',
    ];

    protected $casts = [
        'can_manage_appointments' => 'boolean',
        'can_manage_services'     => 'boolean',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(HealthcareFacility::class, 'facility_id');
    }
}
