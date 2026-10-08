<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * USSD session state storage.
 * USSD is stateless by nature — the provider sends session_id + user input on each request.
 * We store session state here so multi-step USSD flows (e.g. booking) can work.
 *
 * Status: Architecture ready. Real integration pending USSD provider.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ussd_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 255)->unique();         // from USSD provider
            $table->string('phone_number', 20);
            $table->foreignId('user_id')
                  ->nullable()                                   // null if not yet identified
                  ->constrained('users')
                  ->nullOnDelete();
            $table->string('current_menu', 100)->default('main');
            $table->json('session_data')->nullable();            // stores in-progress booking data
            $table->integer('step')->default(0);
            $table->enum('status', ['active', 'completed', 'timeout', 'error'])
                  ->default('active');
            $table->timestamp('last_activity_at')->useCurrent();
            $table->timestamps();

            $table->index('phone_number');
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ussd_sessions');
    }
};
