<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentRejected extends Notification
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
            'type'           => 'appointment_rejected',
            'title'          => 'Appointment Not Available',
            'message'        => "Your appointment at {$this->appointment->facility->name} could not be accommodated.",
            'appointment_id' => $this->appointment->id,
            'facility_name'  => $this->appointment->facility->name,
            'reason'         => $this->appointment->rejection_reason,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Update — Tuza MediConnect')
            ->greeting("Hello {$notifiable->name},")
            ->line("Your appointment request could not be accommodated.")
            ->line("Reason: " . ($this->appointment->rejection_reason ?? 'No reason provided.'))
            ->action('Book Another', url("/patient/book"));
    }
}
