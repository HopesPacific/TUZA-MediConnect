<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'patient_id', 'facility_id', 'service_id',
        'appointment_date', 'appointment_time', 'reason',
        'status', 'notes', 'rejection_reason', 'managed_by',
        'reschedule_date', 'reschedule_time', 'reschedule_reason',
        'cancellation_reason', 'cancelled_at', 'completed_at',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'reschedule_date'  => 'date',
        'cancelled_at'     => 'datetime',
        'completed_at'     => 'datetime',
        'status' => 'string',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(HealthcareFacility::class, 'facility_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function managedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'managed_by');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(AppointmentStatusHistory::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isPending(): bool    { return $this->status === AppointmentStatus::PENDING; }
    public function isConfirmed(): bool  { return $this->status === AppointmentStatus::CONFIRMED; }
    public function isCompleted(): bool  { return $this->status === AppointmentStatus::COMPLETED; }
    public function isCancelled(): bool  { return $this->status === AppointmentStatus::CANCELLED; }
    public function isRejected(): bool   { return $this->status === AppointmentStatus::REJECTED; }

    public function canBeCancelledByPatient(): bool
    {
        return in_array($this->status, [
            AppointmentStatus::PENDING,
            AppointmentStatus::CONFIRMED,
        ]);
    }

    public function scopePending($query)    { return $query->where('status', 'pending'); }
    public function scopeConfirmed($query)  { return $query->where('status', 'confirmed'); }
    public function scopeCompleted($query)  { return $query->where('status', 'completed'); }
    public function scopeUpcoming($query)
    {
        return $query->whereIn('status', ['pending', 'confirmed'])
                     ->where('appointment_date', '>=', today());
    }
}
