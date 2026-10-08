<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds development user accounts.
 *
 * ⚠️  DEVELOPMENT ONLY — never use real patient information.
 * These credentials are documented in README.md for local testing only.
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Administrator ───────────────────────────────────────────────────
        User::create([
            'name'     => 'System Administrator',
            'email'    => 'admin@tuzamediconnect.com',
            'phone'    => '+254700000001',
            'password' => Hash::make('Admin@1234'),
            'role'     => UserRole::ADMINISTRATOR,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // ── Healthcare Staff ────────────────────────────────────────────────
        $staff1 = User::create([
            'name'     => 'Dr. Sarah Kimani',
            'email'    => 'staff@nairobi-clinic.com',
            'phone'    => '+254700000002',
            'password' => Hash::make('Staff@1234'),
            'role'     => UserRole::FACILITY_STAFF,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $staff2 = User::create([
            'name'     => 'Dr. James Odhiambo',
            'email'    => 'staff@mombasa-hospital.com',
            'phone'    => '+254700000003',
            'password' => Hash::make('Staff@1234'),
            'role'     => UserRole::FACILITY_STAFF,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // ── Patients ────────────────────────────────────────────────────────
        $patients = [
            [
                'name' => 'John Mwangi', 'email' => 'john@example.com',
                'phone' => '+254711000001', 'dob' => '1990-05-15',
                'gender' => 'male', 'location' => 'Nairobi',
            ],
            [
                'name' => 'Grace Wanjiku', 'email' => 'grace@example.com',
                'phone' => '+254711000002', 'dob' => '1995-08-22',
                'gender' => 'female', 'location' => 'Mombasa',
            ],
            [
                'name' => 'Peter Otieno', 'email' => 'peter@example.com',
                'phone' => '+254711000003', 'dob' => '1988-11-30',
                'gender' => 'male', 'location' => 'Kisumu',
            ],
        ];

        foreach ($patients as $p) {
            $user = User::create([
                'name'     => $p['name'],
                'email'    => $p['email'],
                'phone'    => $p['phone'],
                'password' => Hash::make('Patient@1234'),
                'role'     => UserRole::PATIENT,
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            PatientProfile::create([
                'user_id'            => $user->id,
                'date_of_birth'      => $p['dob'],
                'gender'             => $p['gender'],
                'location'           => $p['location'],
                'profile_completion' => 60,
            ]);
        }

        $this->command->info('✓ Users seeded (admin, 2 staff, 3 patients)');
    }
}
