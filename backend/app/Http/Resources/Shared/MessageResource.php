<?php

namespace App\Http\Resources\Shared;

use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'subject'     => $this->subject,
            'body'        => $this->body,
            'is_read'     => $this->is_read,
            'read_at'     => $this->read_at?->toIso8601String(),
            'parent_id'   => $this->parent_id,
            'sender'      => $this->when($this->relationLoaded('sender'), fn() => [
                'id'   => $this->sender->id,
                'name' => $this->sender->name,
                'role' => $this->sender->role,
            ]),
            'receiver'    => $this->when($this->relationLoaded('receiver'), fn() => [
                'id'   => $this->receiver->id,
                'name' => $this->receiver->name,
                'role' => $this->receiver->role,
            ]),
            'facility'    => $this->when($this->relationLoaded('facility'), fn() => [
                'id'   => $this->facility->id,
                'name' => $this->facility->name,
            ]),
            'appointment' => $this->when(
                $this->relationLoaded('appointment') && $this->appointment,
                fn() => [
                    'id'     => $this->appointment->id,
                    'date'   => $this->appointment->appointment_date?->toDateString(),
                    'status' => $this->appointment->status,
                ]
            ),
            'replies'     => $this->when(
                $this->relationLoaded('replies'),
                fn() => MessageResource::collection($this->replies)
            ),
            'reply_count' => $this->when(
                $this->relationLoaded('replies'),
                fn() => $this->replies->count()
            ),
            'created_at'  => $this->created_at->toIso8601String(),
        ];
    }
}
