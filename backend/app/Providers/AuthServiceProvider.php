<?php

namespace App\Providers;

use App\Models\Appointment;
use App\Models\PatientProfile;
use App\Policies\AppointmentPolicy;
use App\Policies\PatientProfilePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Map models to their authorization policies.
     * Once registered here, $this->authorize() and Gate::allows() work automatically.
     */
    protected $policies = [
        Appointment::class    => AppointmentPolicy::class,
        PatientProfile::class => PatientProfilePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
