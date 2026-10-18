<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Patient\InitiatePaymentRequest;
use App\Http\Resources\Shared\PaymentResource;
use App\Models\Appointment;
use App\Models\Payment;
use App\Services\Payment\PaymentServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Payment management for patients.
 *
 * Architecture:
 *  - Uses PaymentServiceInterface — swap providers without changing this controller
 *  - MockPaymentService is used in development (set PAYMENT_DRIVER=mock in .env)
 *  - Production: bind a real provider in AppServiceProvider
 *
 * Status: Mock integration. Real payment provider not yet integrated.
 */
class PaymentController extends BaseApiController
{
    private PaymentServiceInterface $paymentService;

    public function __construct(PaymentServiceInterface $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * GET /api/v1/payments
     * List the authenticated patient's payment history.
     */
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::with(['appointment.facility', 'appointment.service'])
            ->where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 10));

        return $this->successResponse(
            PaymentResource::collection($payments),
            'Payment history retrieved.',
            200,
            [
                'current_page' => $payments->currentPage(),
                'last_page'    => $payments->lastPage(),
                'total'        => $payments->total(),
            ]
        );
    }

    /**
     * GET /api/v1/payments/{id}
     */
    public function show(Payment $payment): JsonResponse
    {
        if ($payment->user_id !== auth()->id()) {
            return $this->forbiddenResponse();
        }

        $payment->load(['appointment.facility', 'appointment.service']);

        return $this->successResponse(new PaymentResource($payment));
    }

    /**
     * POST /api/v1/payments
     * Initiate a payment for an appointment.
     *
     * Status: Mock integration — no real money is processed.
     * The architecture is ready for a real provider to be plugged in.
     */
    public function initiate(InitiatePaymentRequest $request): JsonResponse
    {
        $user        = auth()->user();
        $appointment = Appointment::with(['facility', 'service'])
            ->findOrFail($request->appointment_id);

        // Authorization: patient can only pay for their own appointments
        if ($appointment->patient_id !== $user->id) {
            return $this->forbiddenResponse('You can only pay for your own appointments.');
        }

        // Prevent duplicate pending payments
        $existing = Payment::where('appointment_id', $appointment->id)
            ->whereIn('status', ['pending', 'successful'])
            ->first();

        if ($existing) {
            return $this->errorResponse(
                'A payment for this appointment already exists.',
                422
            );
        }

        // Call the payment service (mock or real)
        $result = $this->paymentService->initiatePayment([
            'amount'         => $request->amount,
            'currency'       => $request->currency ?? 'KES',
            'phone'          => $request->phone ?? $user->phone,
            'reference'      => 'APT-' . $appointment->id . '-' . time(),
            'description'    => "Payment for {$appointment->service?->name} at {$appointment->facility?->name}",
        ]);

        // Record the payment regardless of mock/real
        $payment = Payment::create([
            'user_id'         => $user->id,
            'appointment_id'  => $appointment->id,
            'amount'          => $request->amount,
            'currency'        => $request->currency ?? 'KES',
            'provider'        => config('services.payment.driver', 'mock'),
            'transaction_ref' => $result['transaction_ref'] ?? null,
            'status'          => $result['success'] ? 'pending' : 'failed',
            'payment_method'  => $request->payment_method,
            'failure_reason'  => $result['success'] ? null : ($result['message'] ?? 'Payment initiation failed.'),
        ]);

        $payment->load(['appointment.facility', 'appointment.service']);

        return $this->createdResponse(
            new PaymentResource($payment),
            $result['message'] ?? 'Payment initiated. Status: mock (no real transaction processed).'
        );
    }

    /**
     * POST /api/v1/payments/{id}/verify
     * Verify payment status with the provider.
     * In mock mode, this always returns successful.
     */
    public function verify(Payment $payment): JsonResponse
    {
        if ($payment->user_id !== auth()->id()) {
            return $this->forbiddenResponse();
        }

        if (!$payment->transaction_ref) {
            return $this->errorResponse('No transaction reference to verify.', 422);
        }

        $result = $this->paymentService->verifyPayment($payment->transaction_ref);

        if ($result['success']) {
            $payment->update([
                'status'  => 'successful',
                'paid_at' => now(),
            ]);
        } else {
            $payment->update(['status' => 'failed']);
        }

        $payment->load(['appointment.facility', 'appointment.service']);

        return $this->successResponse(
            new PaymentResource($payment),
            $result['success'] ? 'Payment verified successfully.' : 'Payment verification failed.'
        );
    }

    /**
     * GET /api/v1/payments/stats
     * Summary stats for the patient dashboard.
     */
    public function stats(): JsonResponse
    {
        $userId = auth()->id();

        return $this->successResponse([
            'total_paid'    => Payment::where('user_id', $userId)->where('status', 'successful')->sum('amount'),
            'pending_count' => Payment::where('user_id', $userId)->where('status', 'pending')->count(),
            'total_count'   => Payment::where('user_id', $userId)->count(),
            'currency'      => 'KES',
        ]);
    }
}
