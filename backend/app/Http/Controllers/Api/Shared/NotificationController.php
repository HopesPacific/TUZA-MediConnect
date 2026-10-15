<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Notification management for all authenticated users.
 * Works for patients, facility staff, and admins alike.
 */
class NotificationController extends BaseApiController
{
    /**
     * GET /api/v1/notifications
     * List paginated notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user  = auth()->user();
        $query = $user->notifications();

        if ($request->boolean('unread_only')) {
            $query = $user->unreadNotifications();
        }

        $notifications = $query->paginate($request->get('per_page', 15));

        $formatted = $notifications->getCollection()->map(fn($n) => [
            'id'         => $n->id,
            'type'       => $n->data['type']    ?? 'general',
            'title'      => $n->data['title']   ?? 'Notification',
            'message'    => $n->data['message'] ?? '',
            'data'       => $n->data,
            'read_at'    => $n->read_at?->toIso8601String(),
            'is_read'    => !is_null($n->read_at),
            'created_at' => $n->created_at->toIso8601String(),
        ]);

        return $this->successResponse(
            $formatted,
            'Notifications retrieved.',
            200,
            [
                'current_page'  => $notifications->currentPage(),
                'last_page'     => $notifications->lastPage(),
                'per_page'      => $notifications->perPage(),
                'total'         => $notifications->total(),
                'unread_count'  => $user->unreadNotifications()->count(),
            ]
        );
    }

    /**
     * GET /api/v1/notifications/unread-count
     * Lightweight endpoint polled by the notification bell.
     */
    public function unreadCount(): JsonResponse
    {
        $count = auth()->user()->unreadNotifications()->count();
        return $this->successResponse(['count' => $count]);
    }

    /**
     * PATCH /api/v1/notifications/{id}/read
     * Mark a single notification as read.
     */
    public function markAsRead(string $id): JsonResponse
    {
        $notification = auth()->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return $this->notFoundResponse('Notification not found.');
        }

        $notification->markAsRead();

        return $this->successResponse(null, 'Notification marked as read.');
    }

    /**
     * PATCH /api/v1/notifications/read-all
     * Mark all notifications as read.
     */
    public function markAllAsRead(): JsonResponse
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);
        return $this->successResponse(null, 'All notifications marked as read.');
    }

    /**
     * DELETE /api/v1/notifications/{id}
     * Delete a single notification.
     */
    public function destroy(string $id): JsonResponse
    {
        auth()->user()
            ->notifications()
            ->where('id', $id)
            ->delete();

        return $this->successResponse(null, 'Notification deleted.');
    }
}
