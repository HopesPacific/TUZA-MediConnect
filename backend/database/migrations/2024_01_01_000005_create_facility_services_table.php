<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pivot table linking facilities to the services they offer.
 * Each facility-service pair can have its own price, duration, and availability.
 * This is a many-to-many relationship with extra columns.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_id')
                  ->constrained('healthcare_facilities')
                  ->cascadeOnDelete();
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->cascadeOnDelete();
            $table->decimal('price', 10, 2)->nullable();         // null = free / price on request
            $table->string('currency', 3)->default('RWF');
            $table->integer('duration_minutes')->default(30);    // appointment slot length
            $table->boolean('is_available')->default(true);
            $table->text('notes')->nullable();                   // facility-specific notes
            $table->timestamps();

            // A facility can offer a service only once
            $table->unique(['facility_id', 'service_id']);
            $table->index('facility_id');
            $table->index('service_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_services');
    }
};
