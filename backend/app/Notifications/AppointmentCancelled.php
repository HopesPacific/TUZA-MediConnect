<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentCancelled extends Notification
{
    use Queueable;

    private $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'           => 'appointment_cancelled',
            'title'          => 'Appointment Cancelled',
            'message'        => "{$this->appointment->patient->name} has cancelled their appointment.",
            'appointment_id' => $this->appointment->id,
            'patient_name'   => $this->appointment->patient->name,
            'reason'         => $this->appointment->cancellation_reason,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Cancelled — Tuza MediConnect')
            ->greeting("Hello {$notifiable->name},")
            ->line("{$this->appointment->patient->name} has cancelled their appointment.")
            ->line("Date: {$this->appointment->appointment_date->toDateString()}")
            ->line("Reason: " . ($this->appointment->cancellation_reason ?? 'No reason provided.'));
    }
}
