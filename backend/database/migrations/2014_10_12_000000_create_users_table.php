<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Core users table.
 * Stores authentication credentials and basic identity for all roles.
 * Role-specific data lives in separate profile tables (patient_profiles, healthcare_staff).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 20)->unique();
            $table->string('password');                          // bcrypt — never plain text
            $table->enum('role', ['patient', 'facility_staff', 'administrator'])
                  ->default('patient')
                  ->index();
            $table->timestamp('email_verified_at')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();                               // deactivation without data loss
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
