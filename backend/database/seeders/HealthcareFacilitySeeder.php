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
            'monday'    => ['open' => '07:00', 'close' => '17:00', 'closed' => false],
            'tuesday'   => ['open' => '07:00', 'close' => '17:00', 'closed' => false],
            'wednesday' => ['open' => '07:00', 'close' => '17:00', 'closed' => false],
            'thursday'  => ['open' => '07:00', 'close' => '17:00', 'closed' => false],
            'friday'    => ['open' => '07:00', 'close' => '17:00', 'closed' => false],
            'saturday'  => ['open' => '08:00', 'close' => '13:00', 'closed' => false],
            'sunday'    => ['open' => '00:00', 'close' => '00:00', 'closed' => true],
        ];

        $facilities = [
            [
                'name'        => 'Kigali Family Clinic',
                'type'        => 'clinic',
                'description' => 'A modern family clinic in Kigali offering comprehensive healthcare services including general consultations, maternal health, and dental care.',
                'location'    => 'Kigali',
                'address'     => 'KN 5 Rd, Kiyovu, Kigali, Rwanda',
                'phone'       => '+250788100001',
                'email'       => 'info@kigali-clinic.rw',
                'is_verified' => true,
                'rating'      => 4.5,
                'services'    => ['General Consultation', 'Dental Consultation', 'Antenatal Care', 'Blood Test'],
                'staff_email' => 'staff@kigali-clinic.rw',
            ],
            [
                'name'        => 'Centre Hospitalier Universitaire de Kigali (CHUK)',
                'type'        => 'hospital',
                'description' => 'Rwanda\'s main referral hospital providing 24/7 emergency care, laboratory services, and specialist consultations.',
                'location'    => 'Kigali',
                'address'     => 'Avenue de l\'Hôpital, Nyarugenge, Kigali, Rwanda',
                'phone'       => '+250788100002',
                'email'       => 'info@chuk-hospital.rw',
                'is_verified' => true,
                'rating'      => 4.2,
                'services'    => ['General Consultation', 'Emergency Services', 'Blood Test', 'Malaria Test', 'HIV Test'],
                'staff_email' => 'staff@chuk-hospital.rw',
            ],
            [
                'name'        => 'Butare Dental Centre',
                'type'        => 'dental',
                'description' => 'Specialized dental clinic in Huye District providing preventive and restorative dental care for all ages.',
                'location'    => 'Butare',
                'address'     => 'KK 15 Ave, Huye District, Rwanda',
                'phone'       => '+250788100003',
                'email'       => 'info@butare-dental.rw',
                'is_verified' => false,
                'rating'      => 4.0,
                'services'    => ['Dental Consultation', 'Teeth Cleaning', 'Tooth Extraction'],
                'staff_email' => null,
            ],
            [
                'name'        => 'Musanze Community Pharmacy',
                'type'        => 'pharmacy',
                'description' => 'Community pharmacy in Musanze offering prescription dispensing and health consultations.',
                'location'    => 'Musanze',
                'address'     => 'Main Street, Musanze District, Rwanda',
                'phone'       => '+250788100004',
                'email'       => 'info@musanze-pharmacy.rw',
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

            // Attach services with pricing in RWF
            $services = Service::whereIn('name', $serviceNames)->get();
            foreach ($services as $service) {
                $facility->services()->attach($service->id, [
                    'price'            => rand(3000, 25000),
                    'currency'         => 'RWF',
                    'duration_minutes' => 30,
                    'is_available'     => true,
                ]);
            }

            // Link staff to facility
            if ($staffEmail) {
                $staffUser = User::where('email', $staffEmail)->first();
                if ($staffUser) {
                    HealthcareStaff::create([
                        'user_id'                 => $staffUser->id,
                        'facility_id'             => $facility->id,
                        'job_title'               => 'General Practitioner',
                        'can_manage_appointments' => true,
                        'can_manage_services'     => true,
                    ]);
                }
            }
        }

        $this->command->info('✓ Healthcare facilities seeded (' . count($facilities) . ' facilities)');
    }
}
