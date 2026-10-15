<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentRescheduled extends Notification
{
    use Queueable;

    public function __construct(private readonly Appointment $appointment)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'             => 'appointment_rescheduled',
            'title'            => 'Appointment Rescheduled',
            'message'          => "Your appointment at {$this->appointment->facility->name} has been rescheduled.",
            'appointment_id'   => $this->appointment->id,
            'facility_name'    => $this->appointment->facility->name,
            'new_date'         => $this->appointment->reschedule_date?->toDateString(),
            'new_time'         => $this->appointment->reschedule_time,
            'reason'           => $this->appointment->reschedule_reason,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Rescheduled — Tuza MediConnect')
            ->greeting("Hello {$notifiable->name},")
            ->line("Your appointment has been rescheduled.")
            ->line("Facility: {$this->appointment->facility->name}")
            ->line("New Date: " . $this->appointment->reschedule_date?->toDateString())
            ->line("New Time: " . $this->appointment->reschedule_time)
            ->action('View Appointment', url("/patient/appointments/{$this->appointment->id}"))
            ->line('Please confirm you can attend the new time, or contact the facility.');
    }
}
