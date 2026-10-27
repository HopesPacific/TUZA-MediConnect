<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AppointmentRequested extends Notification
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
            'type'             => 'appointment_requested',
            'title'            => 'New Appointment Request',
            'message'          => "A new appointment has been requested by {$this->appointment->patient->name}.",
            'appointment_id'   => $this->appointment->id,
            'patient_name'     => $this->appointment->patient->name,
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
            ->line("Patient: {$this->appointment->patient->name}")
            ->line("Service: {$this->appointment->service->name}")
            ->line("Date: {$this->appointment->appointment_date->toDateString()}")
            ->action('View Appointment', url("/facility/appointments"));
    }
}
