<?php

namespace App\Services\Sms;

use Illuminate\Support\Facades\Log;

/**
 * Mock SMS implementation for local development and testing.
 * Instead of sending a real SMS, it logs the message.
 * Replace this with a real provider (Africa's Talking, Twilio, etc.)
 * by implementing SmsServiceInterface and binding it in AppServiceProvider.
 */
class MockSmsService implements SmsServiceInterface
{
    public function sendMessage(string $to, string $message): bool
    {
        Log::channel('stack')->info('[MockSMS] Message sent', [
            'to'      => $to,
            'message' => $message,
        ]);

        return true;
    }

    public function sendAppointmentReminder(
        string $to,
        string $patientName,
        string $facilityName,
        string $appointmentDate
    ): bool {
        $message = "Dear {$patientName}, this is a reminder for your appointment at {$facilityName} on {$appointmentDate}. - Tuza MediConnect";

        return $this->sendMessage($to, $message);
    }

    public function sendVerificationCode(string $to, string $code): bool
    {
        $message = "Your Tuza MediConnect verification code is: {$code}. Valid for 10 minutes. Do not share this code.";

        return $this->sendMessage($to, $message);
    }
}
