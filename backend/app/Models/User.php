<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Traits\HasAuditLog;
// Note: PHP 8.0 — we use string constants instead of backed enums
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'name', 'email', 'phone', 'password', 'role',
        'is_active', 'last_login_at', 'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at'     => 'datetime',
        'is_active'         => 'boolean',
        'role'              => 'string',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function patientProfile(): HasOne
    {
        return $this->hasOne(PatientProfile::class);
    }

    public function staffProfile(): HasOne
    {
        return $this->hasOne(HealthcareStaff::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isPatient(): bool
    {
        return $this->role === UserRole::PATIENT;
    }

    public function isStaff(): bool
    {
        return $this->role === UserRole::FACILITY_STAFF;
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMINISTRATOR;
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function getFacility(): ?HealthcareFacility
    {
        return $this->staffProfile?->facility;
    }
}
