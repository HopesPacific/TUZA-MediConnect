<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\FacilityService;
use App\Models\HealthcareFacility;
use App\Models\HealthcareStaff;
use App\Models\PatientProfile;
use App\Models\Service;
use App\Models\User;
use App\Services\AppointmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    private User   $patient;
    private User   $staff;
    private string $patientToken;
    private string $staffToken;
    private HealthcareFacility $facility;
    private Service $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->patient = User::factory()->create([
            'role'     => 'patient',
            'password' => Hash::make('Test@1234'),
        ]);
        PatientProfile::create(['user_id' => $this->patient->id]);
        $this->patientToken = $this->patient->createToken('test')->plainTextToken;

        $this->facility = HealthcareFacility::create([
            'name'      => 'Test Clinic',
            'type'      => 'clinic',
            'location'  => 'Kigali',
            'phone'     => '+250788000011',
            'is_active' => true,
        ]);

        $this->service = Service::create([
            'name'      => 'General Consultation',
            'category'  => 'general',
            'is_active' => true,
        ]);

        FacilityService::create([
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'price'            => 500,
            'currency'         => 'RWF',
            'duration_minutes' => 30,
            'is_available'     => true,
        ]);

        $this->staff = User::factory()->create(['role' => 'facility_staff']);
        HealthcareStaff::create([
            'user_id'                 => $this->staff->id,
            'facility_id'             => $this->facility->id,
            'can_manage_appointments' => true,
        ]);
        $this->staffToken = $this->staff->createToken('test')->plainTextToken;
    }

    // ── Booking ───────────────────────────────────────────────────────────────

    public function test_patient_can_book_appointment(): void
    {
        $response = $this->withHeaders(['Authorization' => "Bearer {$this->patientToken}"])
            ->postJson('/api/v1/appointments', [
                'facility_id'      => $this->facility->id,
                'service_id'       => $this->service->id,
                'appointment_date' => now()->addDays(3)->toDateString(),
                'appointment_time' => '10:00',
                'reason'           => 'Regular health check-up and review.',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('appointments', [
            'patient_id'  => $this->patient->id,
            'facility_id' => $this->facility->id,
            'status'      => 'pending',
        ]);
    }

    public function test_cannot_book_appointment_in_the_past(): void
    {
        $this->withHeaders(['Authorization' => "Bearer {$this->patientToken}"])
            ->postJson('/api/v1/appointments', [
                'facility_id'      => $this->facility->id,
                'service_id'       => $this->service->id,
                'appointment_date' => now()->subDays(1)->toDateString(),
                'appointment_time' => '10:00',
                'reason'           => 'Past appointment test.',
            ])
            ->assertStatus(422);
    }

    public function test_double_booking_is_prevented(): void
    {
        $date = now()->addDays(5)->toDateString();
        $svc  = new AppointmentService();

        $svc->book([
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'appointment_date' => $date,
            'appointment_time' => '11:00',
            'reason'           => 'First booking.',
        ], $this->patient->id);

        $patient2      = User::factory()->create(['role' => 'patient']);
        PatientProfile::create(['user_id' => $patient2->id]);
        $patient2Token = $patient2->createToken('test')->plainTextToken;

        $this->withHeaders(['Authorization' => "Bearer {$patient2Token}"])
            ->postJson('/api/v1/appointments', [
                'facility_id'      => $this->facility->id,
                'service_id'       => $this->service->id,
                'appointment_date' => $date,
                'appointment_time' => '11:00',
                'reason'           => 'Conflict booking test.',
            ])
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    // ── Cancellation via AppointmentService directly ──────────────────────────

    public function test_patient_can_cancel_pending_appointment(): void
    {
        // Create the appointment directly in DB
        $appointment = Appointment::create([
            'patient_id'       => $this->patient->id,
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'appointment_date' => now()->addDays(2)->toDateString(),
            'appointment_time' => '14:00',
            'reason'           => 'Test cancellation reason.',
            'status'           => 'pending',
        ]);

        // Use the service directly — avoids policy auth complexity in tests
        $svc     = new AppointmentService();
        $updated = $svc->cancelByPatient($appointment, $this->patient->id, 'Patient requested.');

        $this->assertEquals('cancelled', $updated->status);
        $this->assertDatabaseHas('appointments', [
            'id'     => $appointment->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_patient_cannot_cancel_completed_appointment(): void
    {
        $appointment = Appointment::create([
            'patient_id'       => $this->patient->id,
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'appointment_date' => now()->subDays(1)->toDateString(),
            'appointment_time' => '09:00',
            'reason'           => 'Completed appointment.',
            'status'           => 'completed',
        ]);

        $svc = new AppointmentService();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessageMatches('/Only pending or confirmed/');

        $svc->cancelByPatient($appointment, $this->patient->id, null);
    }

    // ── Service-level authorization ───────────────────────────────────────────

    public function test_staff_can_confirm_appointment(): void
    {
        $appointment = Appointment::create([
            'patient_id'       => $this->patient->id,
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'appointment_date' => now()->addDays(2)->toDateString(),
            'appointment_time' => '09:00',
            'reason'           => 'Staff confirm test reason.',
            'status'           => 'pending',
        ]);

        $svc     = new AppointmentService();
        $updated = $svc->confirm($appointment, $this->staff->id);

        $this->assertEquals('confirmed', $updated->status);
        $this->assertDatabaseHas('appointments', [
            'id'     => $appointment->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_staff_can_reject_appointment_with_reason(): void
    {
        $appointment = Appointment::create([
            'patient_id'       => $this->patient->id,
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'appointment_date' => now()->addDays(2)->toDateString(),
            'appointment_time' => '10:00',
            'reason'           => 'Rejection test.',
            'status'           => 'pending',
        ]);

        $svc     = new AppointmentService();
        $updated = $svc->reject($appointment, $this->staff->id, 'Slot no longer available.');

        $this->assertEquals('rejected', $updated->status);
        $this->assertEquals('Slot no longer available.', $updated->rejection_reason);
    }

    public function test_cannot_confirm_already_confirmed_appointment(): void
    {
        $appointment = Appointment::create([
            'patient_id'       => $this->patient->id,
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'appointment_date' => now()->addDays(2)->toDateString(),
            'appointment_time' => '11:00',
            'reason'           => 'Already confirmed test.',
            'status'           => 'confirmed',
        ]);

        $svc = new AppointmentService();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessageMatches('/Only pending/');

        $svc->confirm($appointment, $this->staff->id);
    }

    // ── HTTP-level authorization ───────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_book(): void
    {
        $this->postJson('/api/v1/appointments', [
            'facility_id'      => $this->facility->id,
            'service_id'       => $this->service->id,
            'appointment_date' => now()->addDays(3)->toDateString(),
            'appointment_time' => '10:00',
            'reason'           => 'No auth test.',
        ])->assertStatus(401);
    }

    public function test_staff_cannot_use_patient_booking_route(): void
    {
        $this->withHeaders(['Authorization' => "Bearer {$this->staffToken}"])
            ->postJson('/api/v1/appointments', [
                'facility_id'      => $this->facility->id,
                'service_id'       => $this->service->id,
                'appointment_date' => now()->addDays(3)->toDateString(),
                'appointment_time' => '10:00',
                'reason'           => 'Staff should not use patient route.',
            ])->assertStatus(403);
    }
}
