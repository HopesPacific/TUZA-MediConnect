<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            // General
            ['name' => 'General Consultation',    'category' => 'general',     'icon' => 'stethoscope',   'sort_order' => 1],
            ['name' => 'Follow-up Consultation',  'category' => 'general',     'icon' => 'clipboard',     'sort_order' => 2],
            ['name' => 'Emergency Services',       'category' => 'emergency',   'icon' => 'alert-circle',  'sort_order' => 3],
            // Dental
            ['name' => 'Dental Consultation',     'category' => 'dental',      'icon' => 'smile',         'sort_order' => 10],
            ['name' => 'Teeth Cleaning',          'category' => 'dental',      'icon' => 'smile',         'sort_order' => 11],
            ['name' => 'Tooth Extraction',        'category' => 'dental',      'icon' => 'smile',         'sort_order' => 12],
            // Laboratory
            ['name' => 'Blood Test',              'category' => 'laboratory',  'icon' => 'droplet',       'sort_order' => 20],
            ['name' => 'Urinalysis',              'category' => 'laboratory',  'icon' => 'droplet',       'sort_order' => 21],
            ['name' => 'Malaria Test',            'category' => 'laboratory',  'icon' => 'activity',      'sort_order' => 22],
            ['name' => 'HIV Test',                'category' => 'laboratory',  'icon' => 'activity',      'sort_order' => 23],
            // Maternal
            ['name' => 'Antenatal Care',          'category' => 'maternal',    'icon' => 'heart',         'sort_order' => 30],
            ['name' => 'Postnatal Care',          'category' => 'maternal',    'icon' => 'heart',         'sort_order' => 31],
            ['name' => 'Family Planning',         'category' => 'maternal',    'icon' => 'users',         'sort_order' => 32],
            // Child Health
            ['name' => 'Child Wellness Check',    'category' => 'child_health','icon' => 'baby',          'sort_order' => 40],
            ['name' => 'Vaccination',             'category' => 'vaccination', 'icon' => 'shield',        'sort_order' => 41],
            // Mental Health
            ['name' => 'Mental Health Consultation', 'category' => 'mental_health', 'icon' => 'brain',   'sort_order' => 50],
            ['name' => 'Counselling Session',     'category' => 'mental_health','icon' => 'message-circle','sort_order' => 51],
            // Pharmacy
            ['name' => 'Prescription Dispensing', 'category' => 'pharmacy',   'icon' => 'package',       'sort_order' => 60],
        ];

        foreach ($services as $service) {
            Service::create(array_merge($service, [
                'description' => null,
                'is_active'   => true,
            ]));
        }

        $this->command->info('✓ Services seeded (' . count($services) . ' services)');
    }
}
