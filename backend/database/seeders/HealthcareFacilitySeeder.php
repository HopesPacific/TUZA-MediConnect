<?php

namespace Database\Seeders;

use App\Models\HealthcareFacility;
use App\Models\HealthcareStaff;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class HealthcareFacilitySeeder extends Seeder
{
    public function run(): void
    {
        $openingHours = [
            'monday'    => ['open' => '08:00', 'close' => '17:00', 'closed' => false],
            'tuesday'   => ['open' => '08:00', 'close' => '17:00', 'closed' => false],
            'wednesday' => ['open' => '08:00', 'close' => '17:00', 'closed' => false],
            'thursday'  => ['open' => '08:00', 'close' => '17:00', 'closed' => false],
            'friday'    => ['open' => '08:00', 'close' => '17:00', 'closed' => false],
            'saturday'  => ['open' => '09:00', 'close' => '13:00', 'closed' => false],
            'sunday'    => ['open' => '00:00', 'close' => '00:00', 'closed' => true],
        ];

        $facilities = [
            [
                'name'        => 'Nairobi Family Clinic',
                'type'        => 'clinic',
                'description' => 'A modern family clinic offering comprehensive healthcare services including general consultations, maternal health, and dental care.',
                'location'    => 'Nairobi',
                'address'     => 'Westlands, Nairobi, Kenya',
                'phone'       => '+254720100001',
                'email'       => 'info@nairobi-clinic.com',
                'is_verified' => true,
                'rating'      => 4.5,
                'services'    => ['General Consultation', 'Dental Consultation', 'Antenatal Care', 'Blood Test'],
                'staff_email' => 'staff@nairobi-clinic.com',
            ],
            [
                'name'        => 'Mombasa General Hospital',
                'type'        => 'hospital',
                'description' => 'A full-service hospital providing 24/7 emergency care, laboratory services, and specialist consultations.',
                'location'    => 'Mombasa',
                'address'     => 'Moi Avenue, Mombasa, Kenya',
                'phone'       => '+254720100002',
                'email'       => 'info@mombasa-hospital.com',
                'is_verified' => true,
                'rating'      => 4.2,
                'services'    => ['General Consultation', 'Emergency Services', 'Blood Test', 'Malaria Test', 'HIV Test'],
                'staff_email' => 'staff@mombasa-hospital.com',
            ],
            [
                'name'        => 'Kisumu Dental Centre',
                'type'        => 'dental',
                'description' => 'Specialized dental clinic providing preventive and restorative dental care for all ages.',
                'location'    => 'Kisumu',
                'address'     => 'Oginga Odinga Street, Kisumu, Kenya',
                'phone'       => '+254720100003',
                'email'       => 'info@kisumu-dental.com',
                'is_verified' => false,
                'rating'      => 4.0,
                'services'    => ['Dental Consultation', 'Teeth Cleaning', 'Tooth Extraction'],
                'staff_email' => null,
            ],
            [
                'name'        => 'Nakuru Wellness Pharmacy',
                'type'        => 'pharmacy',
                'description' => 'Community pharmacy offering prescription dispensing and health consultations.',
                'location'    => 'Nakuru',
                'address'     => 'Kenyatta Avenue, Nakuru, Kenya',
                'phone'       => '+254720100004',
                'email'       => 'info@nakuru-pharmacy.com',
                'is_verified' => false,
                'rating'      => 3.8,
                'services'    => ['Prescription Dispensing', 'General Consultation'],
                'staff_email' => null,
            ],
        ];

        foreach ($facilities as $data) {
            $serviceNames = $data['services'];
            $staffEmail   = $data['staff_email'];
            unset($data['services'], $data['staff_email']);

            $facility = HealthcareFacility::create(array_merge($data, [
                'is_active'     => true,
                'opening_hours' => $openingHours,
                'total_reviews' => rand(5, 50),
            ]));

            // Attach services with pricing
            $services = Service::whereIn('name', $serviceNames)->get();
            foreach ($services as $service) {
                $facility->services()->attach($service->id, [
                    'price'             => rand(300, 2000),
                    'currency'          => 'KES',
                    'duration_minutes'  => 30,
                    'is_available'      => true,
                ]);
            }

            // Link staff to facility
            if ($staffEmail) {
                $staffUser = User::where('email', $staffEmail)->first();
                if ($staffUser) {
                    HealthcareStaff::create([
                        'user_id'                  => $staffUser->id,
                        'facility_id'              => $facility->id,
                        'job_title'                => 'General Practitioner',
                        'can_manage_appointments'  => true,
                        'can_manage_services'      => true,
                    ]);
                }
            }
        }

        $this->command->info('✓ Healthcare facilities seeded (' . count($facilities) . ' facilities)');
    }
}
