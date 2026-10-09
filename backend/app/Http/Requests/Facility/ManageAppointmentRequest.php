<?php

namespace App\Http\Requests\Facility;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ManageAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isStaff() || auth()->user()?->isAdmin();
    }

    public function rules(): array
    {
        return [
            'reason'           => ['nullable', 'string', 'max:1000'],
            'notes'            => ['nullable', 'string', 'max:2000'],
            'appointment_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'appointment_time' => ['sometimes', 'regex:/^\d{2}:\d{2}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'appointment_date.after_or_equal' => 'Reschedule date cannot be in the past.',
            'appointment_time.regex'          => 'Time must be in HH:MM format.',
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
