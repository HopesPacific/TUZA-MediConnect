<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Patient-specific profile information.
 * Separated from users to keep the users table clean and role-specific
 * data neatly organized. A patient has exactly one profile (1:1 relationship).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()                                     // 1 profile per user
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable();
            $table->string('location', 255)->nullable();
            $table->string('address', 500)->nullable();
            $table->string('blood_group', 10)->nullable();       // A+, O-, etc.
            $table->text('allergies')->nullable();               // free text for now
            $table->text('chronic_conditions')->nullable();
            $table->string('emergency_contact_name', 150)->nullable();
            $table->string('emergency_contact_phone', 20)->nullable();
            $table->string('emergency_contact_relation', 100)->nullable();
            $table->string('profile_photo')->nullable();         // storage path
            $table->tinyInteger('profile_completion')->default(0); // 0-100 percentage
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_profiles');
    }
};
