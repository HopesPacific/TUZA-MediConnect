<?php

namespace App\Enums;

final class PaymentStatus
{
    const PENDING    = 'pending';
    const SUCCESSFUL = 'successful';
    const FAILED     = 'failed';
    const CANCELLED  = 'cancelled';
    const REFUNDED   = 'refunded';

    const ALL = [
        self::PENDING, self::SUCCESSFUL, self::FAILED,
        self::CANCELLED, self::REFUNDED,
    ];

    public static function label(string $status): string
    {
        return match($status) {
            self::PENDING    => 'Pending',
            self::SUCCESSFUL => 'Successful',
            self::FAILED     => 'Failed',
            self::CANCELLED  => 'Cancelled',
            self::REFUNDED   => 'Refunded',
            default          => 'Unknown',
        };
    }

    private function __construct() {}
}
