<?php

namespace App\Services\Notification;

use App\Models\Appointment;
use App\Models\User;
use App\Services\Sms\SmsServiceInterface;
use Illuminate\Support\Facades\Log;

/**
 * Sends SMS notifications for appointment events.
 *
 * Status: MOCK — uses MockSmsService which logs instead of sending.
 * To activate real SMS:
 *  1. Create a class implementing SmsServiceInterface (e.g. AfricasTalkingService)
 *  2. Set SMS_DRIVER=africastalking in .env
 *  3. Update AppServiceProvider binding
 *  No other code changes needed.
 */
class SmsNotificationService
{
    private SmsServiceInterface $sms;

    public function __construct(SmsServiceInterface $sms)
    {
        $this->sms = $sms;
    }

    public function sendAppointmentConfirmed(Appointment $appointment): void
    {
        $this->send(
            $appointment->patient->phone,
            "Tuza MediConnect: Your appointment at {$appointment->facility->name} on " .
            "{$appointment->appointment_date->format('D, d M Y')} at {$appointment->appointment_time} is CONFIRMED. " .
            "Ref: #" . str_pad($appointment->id, 6, '0', STR_PAD_LEFT)
        );
    }

    public function sendAppointmentRejected(Appointment $appointment): void
    {
        $this->send(
            $appointment->patient->phone,
            "Tuza MediConnect: Your appointment at {$appointment->facility->name} could not be accommodated. " .
            "Reason: " . ($appointment->rejection_reason ?? 'No reason provided.') .
            " Please visit tuzamediconnect.com to rebook."
        );
    }

    public function sendAppointmentReminder(Appointment $appointment): void
    {
        $this->sms->sendAppointmentReminder(
            $appointment->patient->phone,
            $appointment->patient->name,
            $appointment->facility->name,
            $appointment->appointment_date->format('D, d M Y') . ' at ' . $appointment->appointment_time
        );
    }

    public function sendVerificationCode(User $user, string $code): void
    {
        $this->sms->sendVerificationCode($user->phone, $code);
    }

    private function send(string $to, string $message): void
    {
        try {
            $this->sms->sendMessage($to, $message);
        } catch (\Exception $e) {
            Log::warning("SMS notification failed for {$to}: " . $e->getMessage());
        }
    }
}
