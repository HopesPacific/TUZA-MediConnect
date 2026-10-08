<?php

namespace App\Enums;

final class AppointmentStatus
{
    const PENDING     = 'pending';
    const CONFIRMED   = 'confirmed';
    const RESCHEDULED = 'rescheduled';
    const COMPLETED   = 'completed';
    const CANCELLED   = 'cancelled';
    const REJECTED    = 'rejected';

    const ALL = [
        self::PENDING, self::CONFIRMED, self::RESCHEDULED,
        self::COMPLETED, self::CANCELLED, self::REJECTED,
    ];

    public static function label(string $status): string
    {
        return match($status) {
            self::PENDING     => 'Pending',
            self::CONFIRMED   => 'Confirmed',
            self::RESCHEDULED => 'Rescheduled',
            self::COMPLETED   => 'Completed',
            self::CANCELLED   => 'Cancelled',
            self::REJECTED    => 'Rejected',
            default           => 'Unknown',
        };
    }

    public static function color(string $status): string
    {
        return match($status) {
            self::PENDING     => 'yellow',
            self::CONFIRMED   => 'blue',
            self::RESCHEDULED => 'purple',
            self::COMPLETED   => 'green',
            self::CANCELLED   => 'gray',
            self::REJECTED    => 'red',
            default           => 'gray',
        };
    }

    private function __construct() {}
}
