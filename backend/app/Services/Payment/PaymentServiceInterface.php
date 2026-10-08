<?php

namespace App\Services\Payment;

/**
 * Contract for all payment service implementations.
 * Supports future integration with M-Pesa, Stripe, Flutterwave, etc.
 */
interface PaymentServiceInterface
{
    /**
     * Initiate a payment request.
     *
     * @param  array  $data  Must contain: amount, currency, phone/card, reference, description
     * @return array         Returns: ['success' => bool, 'transaction_ref' => string, 'message' => string]
     */
    public function initiatePayment(array $data): array;

    /**
     * Verify the status of a payment transaction.
     *
     * @param  string  $transactionRef  The payment provider's transaction reference
     * @return array                    Returns: ['success' => bool, 'status' => string, 'data' => array]
     */
    public function verifyPayment(string $transactionRef): array;

    /**
     * Process a refund for a completed payment.
     *
     * @param  string  $transactionRef  The original transaction reference
     * @param  float   $amount          Amount to refund (must not exceed original)
     * @return array                    Returns: ['success' => bool, 'message' => string]
     */
    public function refundPayment(string $transactionRef, float $amount): array;
}
