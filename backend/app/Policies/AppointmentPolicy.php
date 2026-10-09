<?php

namespace App\Policies;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\User;

/**
 * Authorization rules for appointments.
 *
 * Why policies instead of inline checks?
 * - Rules live in one place — easy to audit
 * - Controllers stay clean: $this->authorize('cancel', $appointment)
 * - Works with Laravel Gate automatically
 */
class AppointmentPolicy
{
    /**
     * Patient can view their own appointment.
     * Staff can view appointments at their facility.
     * Admin can view all.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        if ($user->isAdmin()) return true;

        if ($user->isPatient()) {
            return $appointment->patient_id === $user->id;
        }

        if ($user->isStaff()) {
            return $appointment->facility_id === $user->getFacility()?->id;
        }

        return false;
    }

    /**
     * Only patients can create appointments.
     */
    public function create(User $user): bool
    {
        return $user->isPatient();
    }

    /**
     * Patient can cancel their own pending/confirmed appointments.
     */
    public function cancel(User $user, Appointment $appointment): bool
    {
        if (!$user->isPatient()) return false;
        if ($appointment->patient_id !== $user->id) return false;

        return in_array($appointment->status, [
            AppointmentStatus::PENDING,
            AppointmentStatus::CONFIRMED,
        ]);
    }

    /**
     * Facility staff can manage (confirm/reject/reschedule/complete)
     * appointments at their facility.
     */
    public function manage(User $user, Appointment $appointment): bool
    {
        if ($user->isAdmin()) return true;

        return $user->isStaff()
            && $appointment->facility_id === $user->getFacility()?->id;
    }
}
