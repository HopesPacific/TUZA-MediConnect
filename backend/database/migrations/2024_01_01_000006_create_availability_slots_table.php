<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Facility availability slots.
 * Defines when a facility is available for appointments.
 * Two types:
 *   - recurring: same time every week (e.g. Mon 08:00-17:00)
 *   - override:  a specific date is blocked or has custom hours
 *
 * The appointment system checks these before allowing a booking.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_id')
                  ->constrained('healthcare_facilities')
                  ->cascadeOnDelete();
            $table->enum('slot_type', ['recurring', 'override'])->default('recurring');
            $table->tinyInteger('day_of_week')->nullable();      // 0=Sun, 1=Mon ... 6=Sat (for recurring)
            $table->date('specific_date')->nullable();           // for override type
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('slot_duration_minutes')->default(30);
            $table->integer('max_appointments_per_slot')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['facility_id', 'day_of_week']);
            $table->index(['facility_id', 'specific_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_slots');
    }
};
