<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Platform-wide audit log.
 * Records who did what, when, and to which record.
 * Used by the HasAuditLog trait (automatically) and manually for sensitive actions.
 *
 * Never soft-delete or modify these records — they are the source of truth.
 * In production, this table should be append-only with restricted permissions.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->nullable()                                   // null for system actions
                  ->constrained('users')
                  ->nullOnDelete();
            $table->string('action', 100);                      // created, updated, deleted, login, etc.
            $table->string('model_type', 255)->nullable();       // App\Models\Appointment
            $table->unsignedBigInteger('model_id')->nullable();  // record ID
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();        // IPv6 max = 45 chars
            $table->text('user_agent')->nullable();
            $table->text('description')->nullable();             // human-readable summary
            $table->timestamp('created_at')->useCurrent();

            // Admin queries
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
            $table->index('action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
