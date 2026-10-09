<?php

namespace App\Http\Requests\Patient;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BookAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isPatient() ?? false;
    }

    public function rules(): array
    {
        return [
            'facility_id'       => ['required', 'integer', 'exists:healthcare_facilities,id'],
            'service_id'        => ['required', 'integer', 'exists:services,id'],
            'appointment_date'  => [
                'required',
                'date',
                'after_or_equal:today',          // cannot book in the past
                'before:' . now()->addMonths(3)->toDateString(), // max 3 months ahead
            ],
            'appointment_time'  => [
                'required',
                'regex:/^\d{2}:\d{2}$/',          // HH:MM format
            ],
            'reason'            => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'appointment_date.after_or_equal' => 'Appointment date cannot be in the past.',
            'appointment_date.before'         => 'Appointments can only be booked up to 3 months in advance.',
            'appointment_time.regex'          => 'Time must be in HH:MM format (e.g. 09:30).',
            'reason.min'                      => 'Please provide at least 10 characters describing your reason for the appointment.',
            'facility_id.exists'              => 'The selected healthcare facility does not exist.',
            'service_id.exists'               => 'The selected service does not exist.',
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
