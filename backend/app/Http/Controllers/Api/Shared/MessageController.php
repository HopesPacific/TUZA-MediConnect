<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Patient\SendMessageRequest;
use App\Http\Resources\Shared\MessageResource;
use App\Models\HealthcareStaff;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Handles messaging between patients and healthcare facilities.
 *
 * How it works:
 *  - Patient sends a message to a facility → system routes it to the facility's staff
 *  - Staff replies → patient receives the reply
 *  - Parent/child relationship enables threaded conversations
 *  - Unread count drives the notification badge
 */
class MessageController extends BaseApiController
{
    /**
     * GET /api/v1/messages
     * Inbox — top-level messages (no parent) for the authenticated user.
     */
    public function inbox(Request $request): JsonResponse
    {
        $userId = auth()->id();

        $query = Message::with(['sender', 'receiver', 'facility', 'replies'])
            ->whereNull('parent_id')          // top-level only — replies are nested
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)
                  ->orWhere('receiver_id', $userId);
            })
            ->orderByDesc('created_at');

        if ($request->boolean('unread_only')) {
            $query->where('receiver_id', $userId)->where('is_read', false);
        }

        if ($request->filled('facility_id')) {
            $query->where('facility_id', $request->facility_id);
        }

        $messages = $query->paginate($request->get('per_page', 15));

        return $this->successResponse(
            MessageResource::collection($messages),
            'Inbox loaded.',
            200,
            [
                'current_page' => $messages->currentPage(),
                'last_page'    => $messages->lastPage(),
                'total'        => $messages->total(),
                'unread_count' => Message::where('receiver_id', $userId)
                                    ->where('is_read', false)->count(),
            ]
        );
    }

    /**
     * GET /api/v1/messages/{id}
     * Single message with its full reply thread.
     */
    public function show(Message $message): JsonResponse
    {
        $userId = auth()->id();

        if ($message->sender_id !== $userId && $message->receiver_id !== $userId) {
            return $this->forbiddenResponse();
        }

        // Mark as read when viewed
        if ($message->receiver_id === $userId && !$message->is_read) {
            $message->update(['is_read' => true, 'read_at' => now()]);
        }

        $message->load(['sender', 'receiver', 'facility', 'appointment',
            'replies.sender', 'replies.receiver']);

        return $this->successResponse(new MessageResource($message));
    }

    /**
     * POST /api/v1/messages
     * Send a new message or reply.
     */
    public function send(SendMessageRequest $request): JsonResponse
    {
        $sender = auth()->user();
        $data   = $request->validated();

        // Determine receiver:
        // Patient → sends to facility staff
        // Staff   → sends to the original message sender (patient)
        if (isset($data['parent_id'])) {
            // This is a reply — receiver is the original sender
            $parent   = Message::findOrFail($data['parent_id']);
            $receiver = $parent->sender_id === $sender->id
                ? User::find($parent->receiver_id)
                : User::find($parent->sender_id);
        } else {
            // New thread — find a staff member at the facility
            $receiver = $this->getFacilityReceiver($data['facility_id'], $sender);
        }

        if (!$receiver) {
            return $this->errorResponse(
                'No staff member available at this facility.',
                422
            );
        }

        $message = Message::create([
            'sender_id'      => $sender->id,
            'receiver_id'    => $receiver->id,
            'facility_id'    => $data['facility_id'],
            'appointment_id' => $data['appointment_id'] ?? null,
            'parent_id'      => $data['parent_id']      ?? null,
            'subject'        => $data['subject'],
            'body'           => $data['body'],
            'is_read'        => false,
        ]);

        $message->load(['sender', 'receiver', 'facility']);

        return $this->createdResponse(
            new MessageResource($message),
            'Message sent successfully.'
        );
    }

    /**
     * PATCH /api/v1/messages/{id}/read
     */
    public function markAsRead(Message $message): JsonResponse
    {
        if ($message->receiver_id !== auth()->id()) {
            return $this->forbiddenResponse();
        }

        $message->update(['is_read' => true, 'read_at' => now()]);

        return $this->successResponse(null, 'Message marked as read.');
    }

    /**
     * DELETE /api/v1/messages/{id}
     */
    public function destroy(Message $message): JsonResponse
    {
        $userId = auth()->id();

        if ($message->sender_id !== $userId && $message->receiver_id !== $userId) {
            return $this->forbiddenResponse();
        }

        $message->delete();

        return $this->successResponse(null, 'Message deleted.');
    }

    /**
     * GET /api/v1/messages/unread-count
     */
    public function unreadCount(): JsonResponse
    {
        $count = Message::where('receiver_id', auth()->id())
            ->where('is_read', false)
            ->count();

        return $this->successResponse(['count' => $count]);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Find a staff member to receive a patient's message.
     * If the sender IS a staff member, receiver will be set from parent message.
     */
    private function getFacilityReceiver(int $facilityId, User $sender): ?User
    {
        // If sender is staff, this is handled via parent_id path
        if ($sender->isStaff()) {
            return null;
        }

        // Find any active staff member at the facility
        $staff = HealthcareStaff::where('facility_id', $facilityId)
            ->whereHas('user', fn($q) => $q->where('is_active', true))
            ->with('user')
            ->first();

        return $staff?->user;
    }
}
