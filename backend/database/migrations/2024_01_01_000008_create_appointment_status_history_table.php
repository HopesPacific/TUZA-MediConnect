<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Audit trail for every status change on an appointment.
 * Never delete — this is a permanent log.
 * Useful for: disputes, audits, staff performance tracking.
 *
 * Example row:
 *   appointment_id: 42, from: pending, to: confirmed, changed_by: staff_user_id
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')
                  ->constrained('appointments')
                  ->cascadeOnDelete();
            $table->enum('from_status', [
                'pending', 'confirmed', 'rescheduled',
                'completed', 'cancelled', 'rejected',
            ])->nullable();                                      // null for initial creation
            $table->enum('to_status', [
                'pending', 'confirmed', 'rescheduled',
                'completed', 'cancelled', 'rejected',
            ]);
            $table->foreignId('changed_by')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->text('reason')->nullable();
            $table->timestamp('changed_at')->useCurrent();

            $table->index('appointment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_status_history');
    }
};
