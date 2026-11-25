<?php

namespace App\Services\Sms;

/**
 * Contract for all SMS service implementations.
 * To switch providers, create a new class that implements this
 * interface and bind it in AppServiceProvider — no other code changes needed.
 */
interface SmsServiceInterface
{
    /**
     * Send a plain SMS message to a phone number.
     *
     * @param  string  $to       Recipient phone number (E.164 format e.g. +250788123456)
     * @param  string  $message  The SMS body text
     * @return bool              True on success, false on failure
     */
    public function sendMessage(string $to, string $message): bool;

    /**
     * Send an appointment reminder SMS.
     *
     * @param  string  $to               Recipient phone number
     * @param  string  $patientName      Patient's full name
     * @param  string  $facilityName     Name of the healthcare facility
     * @param  string  $appointmentDate  Human-readable appointment date/time
     * @return bool
     */
    public function sendAppointmentReminder(
        string $to,
        string $patientName,
        string $facilityName,
        string $appointmentDate
    ): bool;

    /**
     * Send a verification/OTP code via SMS.
     *
     * @param  string  $to    Recipient phone number
     * @param  string  $code  The verification code
     * @return bool
     */
    public function sendVerificationCode(string $to, string $code): bool;
}
