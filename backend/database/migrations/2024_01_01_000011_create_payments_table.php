<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Payment records for appointment fees.
 * Architecture is provider-agnostic — the 'provider' and 'transaction_ref' columns
 * store whatever the payment gateway returns.
 *
 * Currently uses mock data. Ready for M-Pesa, Stripe, Flutterwave etc.
 * Integration is done in PaymentServiceInterface implementations.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('appointment_id')
                  ->nullable()
                  ->constrained('appointments')
                  ->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('RWF');
            $table->string('provider', 50)->nullable();         // 'mpesa', 'stripe', 'mock'
            $table->string('transaction_ref', 255)->nullable()->unique(); // from provider
            $table->enum('status', [
                'pending', 'successful', 'failed', 'cancelled', 'refunded',
            ])->default('pending')->index();
            $table->enum('payment_method', [
                'mpesa', 'card', 'bank_transfer', 'cash', 'insurance',
            ])->nullable();
            $table->text('failure_reason')->nullable();
            $table->json('provider_response')->nullable();      // raw provider JSON for debugging
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index('appointment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
