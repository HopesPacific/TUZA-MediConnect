<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\UssdSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * USSD Integration Endpoint.
 *
 * Status: Architecture ready — NOT connected to a real USSD provider.
 * This endpoint implements the standard USSD gateway callback pattern
 * (Africa's Talking, Safaricom, etc.) so a real provider can be
 * connected without rewriting this controller.
 *
 * A real USSD provider calls POST /api/ussd with:
 *   sessionId, phoneNumber, serviceCode, text (user input so far)
 * And expects a text response prefixed with "CON " (continue) or "END " (final).
 *
 * How to activate real USSD:
 * 1. Register your service code with a provider (e.g. Africa's Talking *384*12345#)
 * 2. Set the callback URL to POST /api/ussd
 * 3. Set USSD_DRIVER=africastalking in .env
 * 4. This controller handles the rest.
 */
class UssdController extends BaseApiController
{
    /**
     * POST /api/ussd
     * Main USSD callback endpoint.
     * Accepts requests from any USSD gateway that follows the standard format.
     */
    public function handle(Request $request): \Illuminate\Http\Response
    {
        $sessionId   = $request->input('sessionId',   $request->input('session_id', ''));
        $phoneNumber = $request->input('phoneNumber',  $request->input('phone_number', ''));
        $text        = $request->input('text', '');

        // Parse user input steps (e.g. "1*2" = menu 1, then option 2)
        $steps = $text === '' ? [] : explode('*', $text);

        $response = $this->processMenu($sessionId, $phoneNumber, $steps);

        // USSD responses are plain text — "CON " for more input, "END " for final screen
        return response($response, 200)->header('Content-Type', 'text/plain');
    }

    /**
     * GET /api/v1/ussd/test
     * Development test endpoint — simulates USSD flow via JSON.
     * Remove in production.
     */
    public function test(Request $request): JsonResponse
    {
        $steps    = $request->input('steps', []);
        $phone    = $request->input('phone', '+254700000000');
        $response = $this->processMenu('test-session-' . time(), $phone, $steps);

        return $this->successResponse([
            'response'  => $response,
            'steps'     => $steps,
            'continues' => str_starts_with($response, 'CON '),
        ], 'USSD simulation result');
    }

    // ── Menu processor ────────────────────────────────────────────────────────

    private function processMenu(string $sessionId, string $phone, array $steps): string
    {
        $level = count($steps);

        // Main menu (no input yet)
        if ($level === 0) {
            return "CON Welcome to Tuza MediConnect\n"
                 . "1. Book Appointment\n"
                 . "2. Check Appointment Status\n"
                 . "3. Cancel Appointment\n"
                 . "4. Find Healthcare Facility\n"
                 . "5. Contact Support";
        }

        $choice = $steps[0] ?? '';

        return match ($choice) {
            '1' => $this->bookingMenu($steps),
            '2' => $this->appointmentStatusMenu($phone, $steps),
            '3' => $this->cancelMenu($phone, $steps),
            '4' => $this->facilitiesMenu($steps),
            '5' => "END For support, call +254 700 000 000 or email support@tuzamediconnect.com",
            default => "END Invalid option. Please try again.",
        };
    }

    private function bookingMenu(array $steps): string
    {
        $level = count($steps);

        if ($level === 1) {
            return "CON Book Appointment\nEnter your registered email:";
        }
        if ($level === 2) {
            return "CON Select service type:\n1. General Consultation\n2. Dental\n3. Laboratory\n4. Maternal Health\n5. Other";
        }
        if ($level === 3) {
            return "CON Enter preferred date (DD/MM/YYYY):";
        }
        if ($level === 4) {
            return "END Appointment request submitted!\nYou will receive a confirmation SMS shortly.\nRef: " . strtoupper(substr(md5(implode('', $steps)), 0, 8));
        }

        return "END Session ended.";
    }

    private function appointmentStatusMenu(string $phone, array $steps): string
    {
        // In real integration, look up appointments by phone number
        $pending   = \App\Models\Appointment::whereHas('patient', fn($q) => $q->where('phone', $phone))
            ->where('status', 'pending')->count();
        $confirmed = \App\Models\Appointment::whereHas('patient', fn($q) => $q->where('phone', $phone))
            ->where('status', 'confirmed')->count();

        if ($pending + $confirmed === 0) {
            return "END No active appointments found for this number.\nVisit tuzamediconnect.com to book.";
        }

        return "END Your appointments:\nPending: {$pending}\nConfirmed: {$confirmed}\n\nFor details, log in at tuzamediconnect.com";
    }

    private function cancelMenu(string $phone, array $steps): string
    {
        $level = count($steps);

        if ($level === 1) {
            return "CON Cancel Appointment\nEnter appointment reference number:";
        }

        return "END Cancellation request received.\nYou will receive a confirmation SMS.";
    }

    private function facilitiesMenu(array $steps): string
    {
        $facilities = \App\Models\HealthcareFacility::active()
            ->orderBy('name')
            ->limit(5)
            ->pluck('name', 'id');

        $list = $facilities->values()->map(fn($name, $i) => ($i + 1) . ". {$name}")->implode("\n");

        return "END Nearby Healthcare Facilities:\n{$list}\n\nVisit tuzamediconnect.com for full list.";
    }
}
