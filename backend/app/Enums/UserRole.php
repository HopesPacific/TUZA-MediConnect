<?php

namespace App\Enums;

/**
 * User role constants.
 * PHP 8.0 compatible — uses a final class with constants instead of enum.
 * Usage: UserRole::PATIENT, UserRole::FACILITY_STAFF, UserRole::ADMINISTRATOR
 */
final class UserRole
{
    const PATIENT        = 'patient';
    const FACILITY_STAFF = 'facility_staff';
    const ADMINISTRATOR  = 'administrator';

    const ALL = [
        self::PATIENT,
        self::FACILITY_STAFF,
        self::ADMINISTRATOR,
    ];

    public static function label(string $role): string
    {
        return match($role) {
            self::PATIENT        => 'Patient',
            self::FACILITY_STAFF => 'Healthcare Staff',
            self::ADMINISTRATOR  => 'Administrator',
            default              => 'Unknown',
        };
    }

    private function __construct() {} // prevent instantiation
}
