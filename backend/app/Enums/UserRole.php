<?php

namespace App\Enums;

/**
 * Defines the user roles available in the Tuza MediConnect platform.
 * Using string-backed enum for readable values in the database.
 */
enum UserRole: string
{
    case Patient          = 'patient';
    case FacilityStaff    = 'facility_staff';
    case Administrator    = 'administrator';

    /**
     * Human-readable label for display in the UI.
     */
    public function label(): string
    {
        return match($this) {
            UserRole::Patient       => 'Patient',
            UserRole::FacilityStaff => 'Healthcare Staff',
            UserRole::Administrator => 'Administrator',
        };
    }
}
