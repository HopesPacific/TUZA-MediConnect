<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending    = 'pending';
    case Successful = 'successful';
    case Failed     = 'failed';
    case Cancelled  = 'cancelled';
    case Refunded   = 'refunded';

    public function label(): string
    {
        return match($this) {
            PaymentStatus::Pending    => 'Pending',
            PaymentStatus::Successful => 'Successful',
            PaymentStatus::Failed     => 'Failed',
            PaymentStatus::Cancelled  => 'Cancelled',
            PaymentStatus::Refunded   => 'Refunded',
        };
    }
}
