<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Appointments — the core business entity of the platform.
 *
 * Workflow:
 *   Patient submits → pending
 *   Staff confirms  → confirmed
 *   Staff rejects   → rejected  (rejection_reason required)
 *   Staff reschedules → rescheduled (new date/time stored)
 *   Appointment happens → completed
 *   Patient/staff cancels → cancelled
 *
 * Double-booking prevention: unique index on (facility_id, appointment_date, appointment_time)
 * enforced at the database level, with additional check in the service layer.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            // Who booked it
            $table->foreignId('patient_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Where
            $table->foreignId('facility_id')
                  ->constrained('healthcare_facilities')
                  ->cascadeOnDelete();

            // For which service
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->restrictOnDelete();

            // When
            $table->date('appointment_date')->index();
            $table->time('appointment_time');

            // Why
            $table->text('reason');

            // Status lifecycle
            $table->enum('status', [
                'pending', 'confirmed', 'rescheduled',
                'completed', 'cancelled', 'rejected',
            ])->default('pending')->index();

            // Staff actions
            $table->text('notes')->nullable();                   // staff internal notes
            $table->text('rejection_reason')->nullable();
            $table->foreignId('managed_by')->nullable()          // staff who last updated
                  ->constrained('users')
                  ->nullOnDelete();

            // Rescheduling
            $table->date('reschedule_date')->nullable();
            $table->time('reschedule_time')->nullable();
            $table->text('reschedule_reason')->nullable();

            // Cancellation
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            // Completion
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Prevent double-booking at the DB level
            $table->unique(['facility_id', 'appointment_date', 'appointment_time'], 'unique_slot');

            // Common query indexes
            $table->index(['patient_id', 'status']);
            $table->index(['facility_id', 'appointment_date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
