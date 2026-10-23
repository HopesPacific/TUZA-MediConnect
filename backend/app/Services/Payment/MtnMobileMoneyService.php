<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * MTN Mobile Money (MoMo) Payment Integration.
 *
 * Status: Sandbox architecture — NOT tested with live credentials.
 * To activate:
 *   1. Register at https://momodeveloper.mtn.com
 *   2. Subscribe to "Collection" product
 *   3. Get your API User, API Key, and Subscription Key
 *   4. Set in .env:
 *        PAYMENT_DRIVER=mtn
 *        MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com   (sandbox)
 *        MTN_MOMO_COLLECTION_PRIMARY_KEY=your-subscription-key
 *        MTN_MOMO_API_USER=your-api-user-uuid
 *        MTN_MOMO_API_KEY=your-api-key
 *        MTN_MOMO_ENVIRONMENT=sandbox   (or production)
 *        MTN_MOMO_CURRENCY=UGX          (or RWF, GHS, etc.)
 *        MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/mtn/callback
 *
 * MTN MoMo Collection API flow:
 *   1. POST /collection/token/   → get Bearer access token
 *   2. POST /collection/v1_0/requesttopay  → initiate payment (returns 202)
 *   3. GET  /collection/v1_0/requesttopay/{referenceId}  → check status
 */
class MtnMobileMoneyService implements PaymentServiceInterface
{
    private string $baseUrl;
    private string $primaryKey;
    private string $apiUser;
    private string $apiKey;
    private string $environment;
    private string $currency;
    private string $callbackUrl;

    public function __construct()
    {
        $this->baseUrl      = rtrim(config('services.mtn.base_url', 'https://sandbox.momodeveloper.mtn.com'), '/');
        $this->primaryKey   = config('services.mtn.primary_key', '');
        $this->apiUser      = config('services.mtn.api_user', '');
        $this->apiKey       = config('services.mtn.api_key', '');
        $this->environment  = config('services.mtn.environment', 'sandbox');
        $this->currency     = config('services.mtn.currency', 'UGX');
        $this->callbackUrl  = config('services.mtn.callback_url', '');
    }

    // ── PaymentServiceInterface ───────────────────────────────────────────────

    /**
     * Initiate a Request-to-Pay (pull payment) to the customer's MTN number.
     */
    public function initiatePayment(array $data): array
    {
        $referenceId = Str::uuid()->toString(); // Unique per transaction

        try {
            $token = $this->getAccessToken();

            if (!$token) {
                return [
                    'success'         => false,
                    'transaction_ref' => null,
                    'message'         => 'Failed to authenticate with MTN MoMo API.',
                ];
            }

            // Clean the phone number — MTN expects format without leading +
            $phone = $this->normalizePhone($data['phone'] ?? '');

            $payload = [
                'amount'       => (string) round($data['amount'], 0),
                'currency'     => $this->currency,
                'externalId'   => $data['reference'] ?? $referenceId,
                'payer'        => [
                    'partyIdType' => 'MSISDN',
                    'partyId'     => $phone,
                ],
                'payerMessage' => substr($data['description'] ?? 'Healthcare payment', 0, 160),
                'payeeNote'    => substr($data['description'] ?? 'Tuza MediConnect', 0, 160),
            ];

            $response = Http::withHeaders([
                'Authorization'                => "Bearer {$token}",
                'X-Reference-Id'               => $referenceId,
                'X-Target-Environment'         => $this->environment,
                'Ocp-Apim-Subscription-Key'    => $this->primaryKey,
                'X-Callback-Url'               => $this->callbackUrl,
                'Content-Type'                 => 'application/json',
            ])->post("{$this->baseUrl}/collection/v1_0/requesttopay", $payload);

            // MTN returns 202 Accepted on success (async)
            if ($response->status() === 202) {
                Log::info("[MTN MoMo] RequestToPay initiated. Ref: {$referenceId}, Phone: {$phone}");
                return [
                    'success'         => true,
                    'transaction_ref' => $referenceId,
                    'status'          => 'pending',
                    'message'         => 'Payment request sent to ' . $phone . '. Please approve on your MTN phone.',
                ];
            }

            Log::error("[MTN MoMo] RequestToPay failed. Status: {$response->status()} Body: {$response->body()}");
            return [
                'success'         => false,
                'transaction_ref' => null,
                'message'         => 'MTN MoMo payment request failed: ' . $this->parseError($response->body()),
            ];

        } catch (\Exception $e) {
            Log::error("[MTN MoMo] Exception: " . $e->getMessage());
            return [
                'success'         => false,
                'transaction_ref' => null,
                'message'         => 'MTN MoMo service unavailable. Please try again.',
            ];
        }
    }

    /**
     * Check the status of a previously initiated payment.
     */
    public function verifyPayment(string $transactionRef): array
    {
        try {
            $token = $this->getAccessToken();
            if (!$token) {
                return ['success' => false, 'status' => 'failed', 'data' => []];
            }

            $response = Http::withHeaders([
                'Authorization'             => "Bearer {$token}",
                'X-Target-Environment'      => $this->environment,
                'Ocp-Apim-Subscription-Key' => $this->primaryKey,
            ])->get("{$this->baseUrl}/collection/v1_0/requesttopay/{$transactionRef}");

            if (!$response->successful()) {
                return ['success' => false, 'status' => 'failed', 'data' => []];
            }

            $body   = $response->json();
            $status = strtolower($body['status'] ?? 'failed');

            // MTN statuses: PENDING, SUCCESSFUL, FAILED
            $mappedStatus = match($status) {
                'successful' => 'successful',
                'pending'    => 'pending',
                default      => 'failed',
            };

            Log::info("[MTN MoMo] Verify {$transactionRef}: {$status}");

            return [
                'success' => $mappedStatus === 'successful',
                'status'  => $mappedStatus,
                'data'    => [
                    'transaction_ref'  => $transactionRef,
                    'amount'           => $body['amount']   ?? 0,
                    'currency'         => $body['currency'] ?? $this->currency,
                    'payer'            => $body['payer']    ?? [],
                    'paid_at'          => $mappedStatus === 'successful' ? now()->toIso8601String() : null,
                    'raw_status'       => $status,
                ],
            ];

        } catch (\Exception $e) {
            Log::error("[MTN MoMo] Verify exception: " . $e->getMessage());
            return ['success' => false, 'status' => 'failed', 'data' => []];
        }
    }

    /**
     * Refund a completed payment (MTN MoMo Disbursement API).
     * Note: Requires separate Disbursement product subscription.
     */
    public function refundPayment(string $transactionRef, float $amount): array
    {
        // Refunds require the Disbursements API product — architecture ready
        // but not implemented here. Contact MTN to enable disbursements.
        Log::warning("[MTN MoMo] Refund not yet implemented. Ref: {$transactionRef}");

        return [
            'success' => false,
            'message' => 'Refunds via MTN MoMo are not yet implemented. Please process manually.',
        ];
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Obtain a Bearer access token using API User + API Key (Basic Auth).
     */
    private function getAccessToken(): ?string
    {
        try {
            $response = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => $this->primaryKey,
                'Content-Type'              => 'application/json',
            ])
            ->withBasicAuth($this->apiUser, $this->apiKey)
            ->post("{$this->baseUrl}/collection/token/");

            if ($response->successful()) {
                return $response->json('access_token');
            }

            Log::error("[MTN MoMo] Token fetch failed: " . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error("[MTN MoMo] Token exception: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Normalise phone to MTN expected format (no +, no spaces).
     * e.g. +256712345678 → 256712345678
     */
    private function normalizePhone(string $phone): string
    {
        return ltrim(preg_replace('/\s+/', '', $phone), '+');
    }

    private function parseError(string $body): string
    {
        $decoded = json_decode($body, true);
        return $decoded['message'] ?? $decoded['reason'] ?? 'Unknown error';
    }
}
