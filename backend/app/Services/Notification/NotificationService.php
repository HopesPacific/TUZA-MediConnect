<?php

namespace App\Services\Notification;

use App\Models\Appointment;
use App\Models\HealthcareStaff;
use App\Models\User;
use App\Notifications\AppointmentCancelled;
use App\Notifications\AppointmentConfirmed;
use App\Notifications\AppointmentRejected;
use App\Notifications\AppointmentRescheduled;
use App\Notifications\AppointmentRequested;
use Illuminate\Support\Facades\Log;

/**
 * Central service for sending all application notifications.
 *
 * Why a service instead of dispatching from the controller?
 * - Keeps notification logic in one place
 * - Easy to mock in tests
 * - AppointmentService calls this — controllers stay thin
 * - Future: swap channels (SMS, push) without touching business logic
 */
class NotificationService
{
    /**
     * Notify facility staff that a new appointment has been requested.
     */
    public function notifyAppointmentRequested(Appointment $appointment): void
    {
        try {
            // Load relationships if not already loaded
            $appointment->loadMissing(['patient', 'service', 'facility']);

            // Notify all staff at this facility who can manage appointments
            $staffUsers = User::whereHas('staffProfile', function ($q) use ($appointment) {
                $q->where('facility_id', $appointment->facility_id)
                  ->where('can_manage_appointments', true);
            })->get();

            foreach ($staffUsers as $staff) {
                $staff->notify(new AppointmentRequested($appointment));
            }

            Log::info("Notified {$staffUsers->count()} staff for appointment #{$appointment->id}");
        } catch (\Exception $e) {
            // Never let notification failure break the booking flow
            Log::warning("Failed to send appointment_requested notification: " . $e->getMessage());
        }
    }

    /**
     * Notify the patient that their appointment was confirmed.
     */
    public function notifyAppointmentConfirmed(Appointment $appointment): void
    {
        $this->notifyPatient($appointment, new AppointmentConfirmed($appointment));
    }

    /**
     * Notify the patient that their appointment was rejected.
     */
    public function notifyAppointmentRejected(Appointment $appointment): void
    {
        $this->notifyPatient($appointment, new AppointmentRejected($appointment));
    }

    /**
     * Notify the patient that their appointment was rescheduled.
     */
    public function notifyAppointmentRescheduled(Appointment $appointment): void
    {
        $this->notifyPatient($appointment, new AppointmentRescheduled($appointment));
    }

    /**
     * Notify facility staff that an appointment was cancelled by the patient.
     */
    public function notifyAppointmentCancelled(Appointment $appointment): void
    {
        try {
            $appointment->loadMissing(['patient', 'facility']);

            $staffUsers = User::whereHas('staffProfile', function ($q) use ($appointment) {
                $q->where('facility_id', $appointment->facility_id)
                  ->where('can_manage_appointments', true);
            })->get();

            foreach ($staffUsers as $staff) {
                $staff->notify(new AppointmentCancelled($appointment));
            }
        } catch (\Exception $e) {
            Log::warning("Failed to send appointment_cancelled notification: " . $e->getMessage());
        }
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function notifyPatient(Appointment $appointment, object $notification): void
    {
        try {
            $appointment->loadMissing(['patient', 'facility', 'service']);
            $appointment->patient->notify($notification);
        } catch (\Exception $e) {
            Log::warning("Failed to send patient notification: " . $e->getMessage());
        }
    }
}
