<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Receives asynchronous payment status callbacks from MTN MoMo.
 *
 * MTN calls this URL after the customer approves or rejects a payment request.
 * Configure as: MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/mtn/callback
 *
 * MTN sends a POST with JSON body:
 * {
 *   "financialTransactionId": "...",
 *   "externalId": "your-reference-uuid",
 *   "amount": "1500",
 *   "currency": "UGX",
 *   "payer": { "partyIdType": "MSISDN", "partyId": "256712345678" },
 *   "payerMessage": "...",
 *   "payeeNote": "...",
 *   "status": "SUCCESSFUL"  // or FAILED
 * }
 *
 * Status: Architecture ready. Will work once MTN credentials are configured.
 */
class MtnCallbackController extends BaseApiController
{
    public function handle(Request $request): \Illuminate\Http\JsonResponse
    {
        $payload = $request->all();

        Log::info('[MTN Callback] Received:', $payload);

        $externalId = $payload['externalId']    ?? null;
        $status     = strtolower($payload['status'] ?? '');
        $mtnTxnId   = $payload['financialTransactionId'] ?? null;

        if (!$externalId) {
            return $this->errorResponse('Missing externalId.', 400);
        }

        // Find the payment by transaction reference (our UUID = externalId)
        $payment = Payment::where('transaction_ref', $externalId)->first();

        if (!$payment) {
            Log::warning("[MTN Callback] Payment not found for ref: {$externalId}");
            // Return 200 so MTN doesn't retry (we just don't have this record)
            return $this->successResponse(null, 'Acknowledged.');
        }

        $mapped = match($status) {
            'successful' => 'successful',
            'failed'     => 'failed',
            default      => 'pending',
        };

        $payment->update([
            'status'            => $mapped,
            'paid_at'           => $mapped === 'successful' ? now() : null,
            'provider_response' => $payload,
        ]);

        Log::info("[MTN Callback] Payment #{$payment->id} updated to: {$mapped}");

        // Return 200 — MTN expects this to stop retrying
        return $this->successResponse(null, 'Payment status updated.');
    }
}
