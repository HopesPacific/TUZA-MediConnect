<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                       => ['sometimes', 'string', 'min:2', 'max:150'],
            'phone'                      => [
                'sometimes', 'string', 'max:20',
                'unique:users,phone,' . auth()->id(),
                'regex:/^\+?[1-9]\d{7,14}$/',
            ],
            'date_of_birth'              => ['nullable', 'date', 'before:today'],
            'gender'                     => ['nullable', 'in:male,female,other,prefer_not_to_say'],
            'location'                   => ['nullable', 'string', 'max:255'],
            'address'                    => ['nullable', 'string', 'max:500'],
            'blood_group'                => ['nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'allergies'                  => ['nullable', 'string', 'max:1000'],
            'chronic_conditions'         => ['nullable', 'string', 'max:1000'],
            'emergency_contact_name'     => ['nullable', 'string', 'max:150'],
            'emergency_contact_phone'    => ['nullable', 'string', 'max:20'],
            'emergency_contact_relation' => ['nullable', 'string', 'max:100'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'The provided data is invalid.',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }
}
