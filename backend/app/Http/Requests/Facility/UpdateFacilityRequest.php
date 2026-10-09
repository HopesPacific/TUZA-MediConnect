<?php

namespace App\Http\Requests\Facility;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isStaff() || auth()->user()?->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name'           => ['sometimes', 'string', 'max:255'],
            'description'    => ['nullable', 'string', 'max:5000'],
            'phone'          => ['sometimes', 'string', 'max:20'],
            'email'          => ['nullable', 'email', 'max:255'],
            'website'        => ['nullable', 'url', 'max:255'],
            'address'        => ['nullable', 'string', 'max:500'],
            'location'       => ['sometimes', 'string', 'max:255'],
            'opening_hours'  => ['nullable', 'array'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'The provided data is invalid.',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
