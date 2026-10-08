<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UssdSession extends Model
{
    protected $fillable = [
        'session_id', 'phone_number', 'user_id',
        'current_menu', 'session_data', 'step',
        'status', 'last_activity_at',
    ];

    protected $casts = [
        'session_data'     => 'array',
        'last_activity_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
