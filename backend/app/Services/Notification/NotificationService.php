<?php

namespace App\Services\Notification;

use App\Models\Appointment;
use App\Models\User;
use App\Notifications\AppointmentCancelled;
use App\Notifications\AppointmentConfirmed;
use App\Notifications\AppointmentRejected;
use App\Notifications\AppointmentRescheduled;
use App\Notifications\AppointmentRequested;
use App\Services\Sms\SmsServiceInterface;
use Illuminate\Support\Facades\Log;

/**
 * Central notification dispatcher.
 * Sends both in-app (database) notifications AND SMS.
 * All failures are caught and logged — never break the booking flow.
 */
class NotificationService
{
    private SmsNotificationService $smsNotifier;

    public function __construct()
    {
        $this->smsNotifier = new SmsNotificationService(
            app(SmsServiceInterface::class)
        );
    }

    public function notifyAppointmentRequested(Appointment $appointment): void
    {
        try {
            $appointment->loadMissing(['patient', 'service', 'facility']);

            $staffUsers = User::whereHas('staffProfile', function ($q) use ($appointment) {
                $q->where('facility_id', $appointment->facility_id)
                  ->where('can_manage_appointments', true);
            })->get();

            foreach ($staffUsers as $staff) {
                $staff->notify(new AppointmentRequested($appointment));
            }

            Log::info("Notified {$staffUsers->count()} staff for appointment #{$appointment->id}");
        } catch (\Exception $e) {
            Log::warning("appointment_requested notification failed: " . $e->getMessage());
        }
    }

    public function notifyAppointmentConfirmed(Appointment $appointment): void
    {
        $this->notifyPatient($appointment, new AppointmentConfirmed($appointment));

        // SMS confirmation
        try {
            $this->smsNotifier->sendAppointmentConfirmed($appointment);
        } catch (\Exception $e) {
            Log::warning("SMS confirm failed: " . $e->getMessage());
        }
    }

    public function notifyAppointmentRejected(Appointment $appointment): void
    {
        $this->notifyPatient($appointment, new AppointmentRejected($appointment));

        try {
            $this->smsNotifier->sendAppointmentRejected($appointment);
        } catch (\Exception $e) {
            Log::warning("SMS reject failed: " . $e->getMessage());
        }
    }

    public function notifyAppointmentRescheduled(Appointment $appointment): void
    {
        $this->notifyPatient($appointment, new AppointmentRescheduled($appointment));
    }

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
            Log::warning("appointment_cancelled notification failed: " . $e->getMessage());
        }
    }

    private function notifyPatient(Appointment $appointment, object $notification): void
    {
        try {
            $appointment->loadMissing(['patient', 'facility', 'service']);
            $appointment->patient->notify($notification);
        } catch (\Exception $e) {
            Log::warning("Patient notification failed: " . $e->getMessage());
        }
    }
}
