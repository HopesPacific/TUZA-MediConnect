<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentConfirmed extends Notification
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
            'type'             => 'appointment_confirmed',
            'title'            => 'Appointment Confirmed',
            'message'          => "Your appointment at {$this->appointment->facility->name} has been confirmed.",
            'appointment_id'   => $this->appointment->id,
            'facility_name'    => $this->appointment->facility->name,
            'service_name'     => $this->appointment->service->name,
            'appointment_date' => $this->appointment->appointment_date->toDateString(),
            'appointment_time' => $this->appointment->appointment_time,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Confirmed — Tuza MediConnect')
            ->greeting("Hello {$notifiable->name},")
            ->line("Your appointment has been confirmed.")
            ->line("Facility: {$this->appointment->facility->name}")
            ->action('View Appointment', url("/patient/appointments/{$this->appointment->id}"));
    }
}
