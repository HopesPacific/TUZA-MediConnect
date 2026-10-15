<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Sent to the facility staff when a patient requests a new appointment.
 *
 * Channels used:
 *   - database  → in-app notification bell
 *   - mail      → email (architecture ready, stub for now)
 *
 * Why a separate class per event?
 * Each notification has its own message, data payload, and routing rules.
 * Centralizing them in one class with a $type flag creates a mess.
 */
class AppointmentRequested extends Notification
{
    use Queueable;

    public function __construct(private readonly Appointment $appointment)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Data stored in the notifications table.
     * This is what the frontend reads from the API.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type'             => 'appointment_requested',
            'title'            => 'New Appointment Request',
            'message'          => "A new appointment has been requested by {$this->appointment->patient->name}.",
            'appointment_id'   => $this->appointment->id,
            'patient_name'     => $this->appointment->patient->name,
            'patient_phone'    => $this->appointment->patient->phone,
            'service_name'     => $this->appointment->service->name,
            'appointment_date' => $this->appointment->appointment_date->toDateString(),
            'appointment_time' => $this->appointment->appointment_time,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Appointment Request — Tuza MediConnect')
            ->greeting("Hello {$notifiable->name},")
            ->line("A new appointment request has been received.")
            ->line("Patient: {$this->appointment->patient->name}")
            ->line("Service: {$this->appointment->service->name}")
            ->line("Date: {$this->appointment->appointment_date->toDateString()}")
            ->line("Time: {$this->appointment->appointment_time}")
            ->action('View Appointment', url("/facility/appointments"))
            ->line('Please confirm or reject this appointment at your earliest convenience.');
    }
}
