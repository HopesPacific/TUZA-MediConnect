<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Laravel's built-in database notification table.
 * We use the standard structure so Laravel's Notification system works out of the box.
 * The 'type' column stores the full class name of the notification.
 * The 'data' column stores JSON payload.
 *
 * This table is used for IN-APP notifications.
 * Email and SMS are sent separately via their own channels.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');                              // Notification class name
            $table->morphs('notifiable');                        // polymorphic — notifiable_type + notifiable_id
            $table->text('data');                               // JSON payload
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            // Quick lookup: unread notifications for a user
            $table->index(['notifiable_id', 'notifiable_type', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
