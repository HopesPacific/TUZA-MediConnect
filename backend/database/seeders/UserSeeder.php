<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds development user accounts — Rwanda context.
 * ⚠️  DEVELOPMENT ONLY — never use real patient information.
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Administrator ───────────────────────────────────────────────────
        User::create([
            'name'              => 'System Administrator',
            'email'             => 'admin@tuzamediconnect.rw',
            'phone'             => '+250780000001',
            'password'          => Hash::make('Admin@1234'),
            'role'              => UserRole::ADMINISTRATOR,
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        // ── Healthcare Staff ────────────────────────────────────────────────
        User::create([
            'name'              => 'Dr. Amina Uwimana',
            'email'             => 'staff@kigali-clinic.rw',
            'phone'             => '+250780000002',
            'password'          => Hash::make('Staff@1234'),
            'role'              => UserRole::FACILITY_STAFF,
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'              => 'Dr. Eric Habimana',
            'email'             => 'staff@chuk-hospital.rw',
            'phone'             => '+250780000003',
            'password'          => Hash::make('Staff@1234'),
            'role'              => UserRole::FACILITY_STAFF,
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        // ── Patients ────────────────────────────────────────────────────────
        $patients = [
            [
                'name'     => 'Jean Pierre Kagabo',
                'email'    => 'jean@example.com',
                'phone'    => '+250788001001',
                'dob'      => '1990-05-15',
                'gender'   => 'male',
                'location' => 'Kigali',
            ],
            [
                'name'     => 'Marie Claire Mukamana',
                'email'    => 'marie@example.com',
                'phone'    => '+250788001002',
                'dob'      => '1995-08-22',
                'gender'   => 'female',
                'location' => 'Butare',
            ],
            [
                'name'     => 'Patrick Niyonzima',
                'email'    => 'patrick@example.com',
                'phone'    => '+250788001003',
                'dob'      => '1988-11-30',
                'gender'   => 'male',
                'location' => 'Musanze',
            ],
        ];

        foreach ($patients as $p) {
            $user = User::create([
                'name'              => $p['name'],
                'email'             => $p['email'],
                'phone'             => $p['phone'],
                'password'          => Hash::make('Patient@1234'),
                'role'              => UserRole::PATIENT,
                'is_active'         => true,
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
