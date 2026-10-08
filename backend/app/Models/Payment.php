<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'appointment_id', 'amount', 'currency',
        'provider', 'transaction_ref', 'status', 'payment_method',
        'failure_reason', 'provider_response', 'paid_at',
    ];

    protected $casts = [
        'amount'            => 'float',
        'status' => 'string',
        'paid_at'           => 'datetime',
        'provider_response' => 'array',
    ];

    protected $hidden = [
        'provider_response', // don't expose raw gateway data in API responses
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function isSuccessful(): bool
    {
        return $this->status === PaymentStatus::SUCCESSFUL;
    }
}
