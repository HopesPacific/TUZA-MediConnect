<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Links facility_staff users to their healthcare facilities.
 * A staff member belongs to one facility (can be changed by admin).
 * Stores their professional details and role within the facility.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('healthcare_staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()                                     // 1 staff record per user
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('facility_id')
                  ->constrained('healthcare_facilities')
                  ->cascadeOnDelete();
            $table->string('job_title', 150)->nullable();        // e.g. "General Practitioner"
            $table->string('department', 150)->nullable();       // e.g. "Paediatrics"
            $table->string('license_number', 100)->nullable();   // professional registration
            $table->string('specialization', 255)->nullable();
            $table->string('profile_photo')->nullable();
            $table->boolean('can_manage_appointments')->default(true);
            $table->boolean('can_manage_services')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('facility_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('healthcare_staff');
    }
};
