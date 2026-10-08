<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Healthcare facilities — hospitals, clinics, pharmacies, labs, etc.
 * Each facility can have multiple staff members and offer multiple services.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('healthcare_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->enum('type', [
                'hospital', 'clinic', 'pharmacy', 'laboratory',
                'dental', 'eye_care', 'mental_health', 'maternity', 'other',
            ])->index();
            $table->text('description')->nullable();
            $table->string('location', 255);                     // city/district
            $table->string('address', 500)->nullable();          // full street address
            $table->decimal('latitude', 10, 7)->nullable();      // for future map integration
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('phone', 20);
            $table->string('email', 255)->nullable();
            $table->string('website', 255)->nullable();
            $table->json('opening_hours')->nullable();           // { monday: {open, close, closed}, ... }
            $table->string('logo')->nullable();                  // storage path
            $table->string('cover_image')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_verified')->default(false)->index();
            $table->decimal('rating', 3, 2)->nullable();         // 0.00 - 5.00
            $table->integer('total_reviews')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Full-text search on name and location
            $table->index(['name', 'location']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('healthcare_facilities');
    }
};
