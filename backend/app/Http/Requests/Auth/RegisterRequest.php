<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Validates patient registration input.
 *
 * Why a FormRequest instead of inline validation?
 * - Controller stays thin and readable
 * - Validation rules are reusable and testable in isolation
 * - Authorization check (authorize()) separates who can do what
 */
class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Anyone can register (public endpoint)
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:150'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone'    => [
                'required',
                'string',
                'max:20',
                'unique:users,phone',
                // E.164 format: +254712345678
                'regex:/^\+?[1-9]\d{7,14}$/',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',                              // requires password_confirmation field
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // at least 1 upper, 1 lower, 1 digit
            ],
            'date_of_birth'              => ['nullable', 'date', 'before:today', 'after:1900-01-01'],
            'gender'                     => ['nullable', 'in:male,female,other,prefer_not_to_say'],
            'location'                   => ['nullable', 'string', 'max:255'],
            'emergency_contact_name'     => ['nullable', 'string', 'max:150'],
            'emergency_contact_phone'    => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.min'              => 'Full name must be at least 2 characters.',
            'email.unique'          => 'An account with this email already exists.',
            'phone.unique'          => 'An account with this phone number already exists.',
            'phone.regex'           => 'Please enter a valid phone number (e.g. +250788123456).',
            'password.min'          => 'Password must be at least 8 characters.',
            'password.confirmed'    => 'Password confirmation does not match.',
            'password.regex'        => 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'date_of_birth.before'  => 'Date of birth must be in the past.',
        ];
    }

    /**
     * Override failed validation to return JSON instead of a redirect.
     * This is crucial for API routes — without this, Laravel would
     * try to redirect the user, which makes no sense in an API context.
     */
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
