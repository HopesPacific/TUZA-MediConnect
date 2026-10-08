<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Master list of services offered on the platform.
 * Services are then linked to specific facilities via facility_services.
 * This allows the same service name to exist at multiple facilities
 * with different prices or durations.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('category', 100)->index();            // e.g. dental, laboratory
            $table->text('description')->nullable();
            $table->string('icon', 100)->nullable();             // icon name for UI
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);           // display ordering
            $table->timestamps();
            $table->softDeletes();

            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
