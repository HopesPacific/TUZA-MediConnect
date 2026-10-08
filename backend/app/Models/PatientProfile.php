<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'date_of_birth', 'gender', 'location', 'address',
        'blood_group', 'allergies', 'chronic_conditions',
        'emergency_contact_name', 'emergency_contact_phone',
        'emergency_contact_relation', 'profile_photo', 'profile_completion',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Recalculate and update the profile completion percentage.
     * Called whenever the profile is updated.
     */
    public function recalculateCompletion(): void
    {
        $fields = [
            'date_of_birth', 'gender', 'location', 'blood_group',
            'emergency_contact_name', 'emergency_contact_phone',
        ];

        $filled = collect($fields)->filter(fn($f) => !empty($this->$f))->count();
        $this->profile_completion = (int) round(($filled / count($fields)) * 100);
        $this->saveQuietly(); // save without triggering model events
    }

    public function getAgeAttribute(): ?int
    {
        return $this->date_of_birth?->diffInYears(now());
    }
}
