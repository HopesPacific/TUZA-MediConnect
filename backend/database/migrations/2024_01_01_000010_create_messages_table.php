<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Internal messaging between patients and healthcare facilities.
 * Supports threaded replies via parent_id (self-referential).
 *
 * A message always involves:
 *   - A sender (user)
 *   - A receiver (user — could be facility admin or specific staff)
 *   - A facility context (so staff can filter inbox by facility)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('receiver_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('facility_id')
                  ->constrained('healthcare_facilities')
                  ->cascadeOnDelete();
            $table->foreignId('appointment_id')
                  ->nullable()                                   // optionally linked to an appointment
                  ->constrained('appointments')
                  ->nullOnDelete();
            $table->foreignId('parent_id')
                  ->nullable()                                   // for thread replies
                  ->constrained('messages')
                  ->nullOnDelete();
            $table->string('subject', 255);
            $table->text('body');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Inbox queries
            $table->index(['receiver_id', 'is_read']);
            $table->index(['facility_id', 'receiver_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
