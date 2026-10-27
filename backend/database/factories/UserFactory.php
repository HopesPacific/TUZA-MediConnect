<?php

namespace Database\Factories;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'               => fake()->name(),
            'email'              => fake()->unique()->safeEmail(),
            'phone'              => '+254' . fake()->unique()->numerify('7########'),
            'email_verified_at'  => now(),
            'password'           => Hash::make('Test@1234'),
            'role'               => UserRole::PATIENT,
            'is_active'          => true,
            'remember_token'     => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn () => ['email_verified_at' => null]);
    }

    public function patient(): static
    {
        return $this->state(fn () => ['role' => UserRole::PATIENT]);
    }

    public function facilityStaff(): static
    {
        return $this->state(fn () => ['role' => UserRole::FACILITY_STAFF]);
    }

    public function administrator(): static
    {
        return $this->state(fn () => ['role' => UserRole::ADMINISTRATOR]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
