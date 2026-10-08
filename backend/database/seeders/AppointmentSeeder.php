<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\AppointmentStatusHistory;
use App\Models\HealthcareFacility;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $patients   = User::where('role', 'patient')->get();
        $facilities = HealthcareFacility::with('services')->get();
        $staff      = User::where('role', 'facility_staff')->first();

        $times    = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];
        $reasons  = [
            'General check-up and health screening',
            'Follow-up for previous treatment',
            'Persistent headache and dizziness',
            'Dental pain and discomfort',
            'Routine antenatal care visit',
            'Child vaccination schedule',
            'Laboratory blood test results review',
        ];

        $appointments = [
            // Upcoming confirmed appointments
            ['patient_idx' => 0, 'days' => 3,   'time' => '09:00', 'status' => 'confirmed'],
            ['patient_idx' => 1, 'days' => 5,   'time' => '10:00', 'status' => 'confirmed'],
            ['patient_idx' => 2, 'days' => 7,   'time' => '14:00', 'status' => 'pending'],
            // Past completed
            ['patient_idx' => 0, 'days' => -7,  'time' => '09:30', 'status' => 'completed'],
            ['patient_idx' => 1, 'days' => -14, 'time' => '11:00', 'status' => 'completed'],
            ['patient_idx' => 2, 'days' => -3,  'time' => '10:00', 'status' => 'completed'],
            // Cancelled/rejected
            ['patient_idx' => 0, 'days' => -10, 'time' => '14:30', 'status' => 'cancelled'],
            ['patient_idx' => 1, 'days' => -5,  'time' => '15:00', 'status' => 'rejected'],
        ];

        foreach ($appointments as $i => $data) {
            $patient  = $patients[$data['patient_idx']];
            $facility = $facilities[$i % $facilities->count()];

            // Pick a service the facility offers
            $service = $facility->services->first() ?? Service::first();

            $date = now()->addDays($data['days'])->toDateString();

            $appointment = Appointment::create([
                'patient_id'       => $patient->id,
                'facility_id'      => $facility->id,
                'service_id'       => $service->id,
                'appointment_date' => $date,
                'appointment_time' => $data['time'],
                'reason'           => $reasons[$i % count($reasons)],
                'status'           => $data['status'],
                'managed_by'       => $staff?->id,
                'notes'            => $data['status'] === 'completed' ? 'Patient seen and treated.' : null,
                'rejection_reason' => $data['status'] === 'rejected'  ? 'Slot no longer available.' : null,
                'cancellation_reason' => $data['status'] === 'cancelled' ? 'Patient requested cancellation.' : null,
                'cancelled_at'     => $data['status'] === 'cancelled' ? now()->subDays(abs($data['days'])) : null,
                'completed_at'     => $data['status'] === 'completed' ? now()->subDays(abs($data['days'])) : null,
            ]);

            // Create status history entries
            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'from_status'    => null,
                'to_status'      => 'pending',
                'changed_by'     => $patient->id,
                'reason'         => 'Appointment requested',
                'changed_at'     => now()->subDays(abs($data['days']) + 1),
            ]);

            if ($data['status'] !== 'pending') {
                AppointmentStatusHistory::create([
                    'appointment_id' => $appointment->id,
                    'from_status'    => 'pending',
                    'to_status'      => $data['status'],
                    'changed_by'     => $staff?->id ?? $patient->id,
                    'changed_at'     => now()->subDays(abs($data['days'])),
                ]);
            }
        }

        $this->command->info('✓ Appointments seeded (' . count($appointments) . ' appointments)');
    }
}
