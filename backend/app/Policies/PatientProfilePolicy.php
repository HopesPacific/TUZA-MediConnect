<?php

namespace App\Policies;

use App\Models\PatientProfile;
use App\Models\User;

class PatientProfilePolicy
{
    /** Patient can only view/update their own profile. Admin can view all. */
    public function view(User $user, PatientProfile $profile): bool
    {
        return $user->isAdmin() || $profile->user_id === $user->id;
    }

    public function update(User $user, PatientProfile $profile): bool
    {
        return $profile->user_id === $user->id;
    }
}
