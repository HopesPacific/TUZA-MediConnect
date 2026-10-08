<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Mock payment service for local development.
 * Simulates success/failure without hitting a real payment gateway.
 * Replace by binding a real implementation in AppServiceProvider.
 */
class MockPaymentService implements PaymentServiceInterface
{
    public function initiatePayment(array $data): array
    {
        $transactionRef = 'MOCK-' . strtoupper(Str::random(12));

        Log::info('[MockPayment] Payment initiated', [
            'ref'    => $transactionRef,
            'amount' => $data['amount'] ?? 0,
            'data'   => $data,
        ]);

        return [
            'success'         => true,
            'transaction_ref' => $transactionRef,
            'status'          => 'pending',
            'message'         => 'Mock payment initiated. In production, the user would be redirected to the payment provider.',
        ];
    }

    public function verifyPayment(string $transactionRef): array
    {
        Log::info('[MockPayment] Payment verified', ['ref' => $transactionRef]);

        // In mock mode, all payments with a valid ref are "successful"
        return [
            'success' => true,
            'status'  => 'successful',
            'data'    => [
                'transaction_ref' => $transactionRef,
                'amount'          => 0,
                'currency'        => 'KES',
                'paid_at'         => now()->toIso8601String(),
            ],
        ];
    }

    public function refundPayment(string $transactionRef, float $amount): array
    {
        Log::info('[MockPayment] Refund processed', [
            'ref'    => $transactionRef,
            'amount' => $amount,
        ]);

        return [
            'success' => true,
            'message' => "Mock refund of {$amount} processed for transaction {$transactionRef}.",
        ];
    }
}
