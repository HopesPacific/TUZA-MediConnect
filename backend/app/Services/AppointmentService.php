<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\AppointmentStatusHistory;
use App\Models\FacilityService;
use App\Services\Notification\NotificationService;
use Illuminate\Support\Facades\DB;

/**
 * All appointment business logic lives here — not in the controller.
 * NotificationService is called AFTER the DB transaction commits
 * so a notification failure never rolls back a booking.
 */
class AppointmentService
{
    private NotificationService $notifier;

    public function __construct()
    {
        $this->notifier = new NotificationService();
    }

    // ── Book ─────────────────────────────────────────────────────────────────

    public function book(array $data, int $patientId): Appointment
    {
        // 1. Verify facility offers this service
        $facilityService = FacilityService::where('facility_id', $data['facility_id'])
            ->where('service_id', $data['service_id'])
            ->where('is_available', true)
            ->first();

        if (!$facilityService) {
            throw new \Exception('This service is not available at the selected facility.');
        }

        // 2. Slot conflict check (friendly message before the DB unique constraint fires)
        $conflict = Appointment::where('facility_id', $data['facility_id'])
            ->where('appointment_date', $data['appointment_date'])
            ->where('appointment_time', $data['appointment_time'])
            ->whereNotIn('status', [AppointmentStatus::CANCELLED, AppointmentStatus::REJECTED])
            ->exists();

        if ($conflict) {
            throw new \Exception('This time slot is already booked. Please choose a different time.');
        }

        // 3. Same-patient same-day check
        $sameDay = Appointment::where('patient_id', $patientId)
            ->where('facility_id', $data['facility_id'])
            ->where('appointment_date', $data['appointment_date'])
            ->whereNotIn('status', [AppointmentStatus::CANCELLED, AppointmentStatus::REJECTED])
            ->exists();

        if ($sameDay) {
            throw new \Exception('You already have an appointment at this facility on the selected date.');
        }

        // 4. Persist (transaction ensures appointment + history are both saved or neither)
        $appointment = DB::transaction(function () use ($data, $patientId) {
            $appt = Appointment::create([
                'patient_id'       => $patientId,
                'facility_id'      => $data['facility_id'],
                'service_id'       => $data['service_id'],
                'appointment_date' => $data['appointment_date'],
                'appointment_time' => $data['appointment_time'],
                'reason'           => $data['reason'],
                'status'           => AppointmentStatus::PENDING,
            ]);

            AppointmentStatusHistory::create([
                'appointment_id' => $appt->id,
                'from_status'    => null,
                'to_status'      => AppointmentStatus::PENDING,
                'changed_by'     => $patientId,
                'reason'         => 'Appointment requested by patient.',
                'changed_at'     => now(),
            ]);

            return $appt;
        });

        // 5. Notify AFTER transaction — failure here never rolls back the booking
        $this->notifier->notifyAppointmentRequested(
            $appointment->load(['patient', 'service', 'facility'])
        );

        return $appointment;
    }

    // ── Cancel (patient) ──────────────────────────────────────────────────────

    public function cancelByPatient(Appointment $appointment, int $userId, ?string $reason): Appointment
    {
        if (!$appointment->canBeCancelledByPatient()) {
            throw new \Exception('Only pending or confirmed appointments can be cancelled.');
        }

        $old = $appointment->status;

        $updated = DB::transaction(function () use ($appointment, $userId, $reason, $old) {
            $appointment->update([
                'status'              => AppointmentStatus::CANCELLED,
                'cancellation_reason' => $reason ?? 'Cancelled by patient.',
                'cancelled_at'        => now(),
            ]);

            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'from_status'    => $old,
                'to_status'      => AppointmentStatus::CANCELLED,
                'changed_by'     => $userId,
                'reason'         => $reason ?? 'Cancelled by patient.',
                'changed_at'     => now(),
            ]);

            return $appointment->fresh(['facility', 'service', 'patient']);
        });

        $this->notifier->notifyAppointmentCancelled($updated);

        return $updated;
    }

    // ── Confirm (staff) ───────────────────────────────────────────────────────

    public function confirm(Appointment $appointment, int $staffId): Appointment
    {
        if ($appointment->status !== AppointmentStatus::PENDING) {
            throw new \Exception('Only pending appointments can be confirmed.');
        }

        $updated = DB::transaction(function () use ($appointment, $staffId) {
            $appointment->update([
                'status'     => AppointmentStatus::CONFIRMED,
                'managed_by' => $staffId,
            ]);

            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'from_status'    => AppointmentStatus::PENDING,
                'to_status'      => AppointmentStatus::CONFIRMED,
                'changed_by'     => $staffId,
                'changed_at'     => now(),
            ]);

            return $appointment->fresh(['facility', 'service', 'patient']);
        });

        $this->notifier->notifyAppointmentConfirmed($updated);

        return $updated;
    }

    // ── Reject (staff) ────────────────────────────────────────────────────────

    public function reject(Appointment $appointment, int $staffId, string $reason): Appointment
    {
        if (!in_array($appointment->status, [AppointmentStatus::PENDING, AppointmentStatus::CONFIRMED])) {
            throw new \Exception('Only pending or confirmed appointments can be rejected.');
        }

        $old = $appointment->status;

        $updated = DB::transaction(function () use ($appointment, $staffId, $reason, $old) {
            $appointment->update([
                'status'           => AppointmentStatus::REJECTED,
                'rejection_reason' => $reason,
                'managed_by'       => $staffId,
            ]);

            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'from_status'    => $old,
                'to_status'      => AppointmentStatus::REJECTED,
                'changed_by'     => $staffId,
                'reason'         => $reason,
                'changed_at'     => now(),
            ]);

            return $appointment->fresh(['facility', 'service', 'patient']);
        });

        $this->notifier->notifyAppointmentRejected($updated);

        return $updated;
    }

    // ── Reschedule (staff) ────────────────────────────────────────────────────

    public function reschedule(Appointment $appointment, int $staffId, array $data): Appointment
    {
        if (!in_array($appointment->status, [AppointmentStatus::PENDING, AppointmentStatus::CONFIRMED])) {
            throw new \Exception('Only pending or confirmed appointments can be rescheduled.');
        }

        $old = $appointment->status;

        $updated = DB::transaction(function () use ($appointment, $staffId, $data, $old) {
            $appointment->update([
                'status'            => AppointmentStatus::RESCHEDULED,
                'reschedule_date'   => $data['appointment_date'],
                'reschedule_time'   => $data['appointment_time'],
                'reschedule_reason' => $data['reason'] ?? null,
                'managed_by'        => $staffId,
            ]);

            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'from_status'    => $old,
                'to_status'      => AppointmentStatus::RESCHEDULED,
                'changed_by'     => $staffId,
                'reason'         => $data['reason'] ?? 'Rescheduled by facility staff.',
                'changed_at'     => now(),
            ]);

            return $appointment->fresh(['facility', 'service', 'patient']);
        });

        $this->notifier->notifyAppointmentRescheduled($updated);

        return $updated;
    }

    // ── Complete (staff) ──────────────────────────────────────────────────────

    public function complete(Appointment $appointment, int $staffId): Appointment
    {
        if ($appointment->status !== AppointmentStatus::CONFIRMED) {
            throw new \Exception('Only confirmed appointments can be marked as completed.');
        }

        return DB::transaction(function () use ($appointment, $staffId) {
            $appointment->update([
                'status'       => AppointmentStatus::COMPLETED,
                'completed_at' => now(),
                'managed_by'   => $staffId,
            ]);

            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'from_status'    => AppointmentStatus::CONFIRMED,
                'to_status'      => AppointmentStatus::COMPLETED,
                'changed_by'     => $staffId,
                'changed_at'     => now(),
            ]);

            return $appointment->fresh(['facility', 'service', 'patient']);
        });
        // No notification on complete — status is visible in the dashboard
    }
}
