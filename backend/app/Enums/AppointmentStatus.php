<?php

namespace App\Enums;

/**
 * Represents all possible states in the appointment lifecycle.
 */
enum AppointmentStatus: string
{
    case Pending      = 'pending';
    case Confirmed    = 'confirmed';
    case Rescheduled  = 'rescheduled';
    case Completed    = 'completed';
    case Cancelled    = 'cancelled';
    case Rejected     = 'rejected';

    public function label(): string
    {
        return match($this) {
            AppointmentStatus::Pending     => 'Pending',
            AppointmentStatus::Confirmed   => 'Confirmed',
            AppointmentStatus::Rescheduled => 'Rescheduled',
            AppointmentStatus::Completed   => 'Completed',
            AppointmentStatus::Cancelled   => 'Cancelled',
            AppointmentStatus::Rejected    => 'Rejected',
        };
    }

    /**
     * Returns the CSS/badge color class for UI display.
     */
    public function color(): string
    {
        return match($this) {
            AppointmentStatus::Pending     => 'yellow',
            AppointmentStatus::Confirmed   => 'blue',
            AppointmentStatus::Rescheduled => 'purple',
            AppointmentStatus::Completed   => 'green',
            AppointmentStatus::Cancelled   => 'gray',
            AppointmentStatus::Rejected    => 'red',
        };
    }
}
