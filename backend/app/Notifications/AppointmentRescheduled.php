<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentRescheduled extends Notification
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
            'type'           => 'appointment_rescheduled',
            'title'          => 'Appointment Rescheduled',
            'message'        => "Your appointment at {$this->appointment->facility->name} has been rescheduled.",
            'appointment_id' => $this->appointment->id,
            'facility_name'  => $this->appointment->facility->name,
            'new_date'       => $this->appointment->reschedule_date?->toDateString(),
            'new_time'       => $this->appointment->reschedule_time,
            'reason'         => $this->appointment->reschedule_reason,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Rescheduled — Tuza MediConnect')
            ->greeting("Hello {$notifiable->name},")
            ->line("Your appointment has been rescheduled.")
            ->line("New Date: " . $this->appointment->reschedule_date?->toDateString())
            ->action('View Appointment', url("/patient/appointments/{$this->appointment->id}"));
    }
}
