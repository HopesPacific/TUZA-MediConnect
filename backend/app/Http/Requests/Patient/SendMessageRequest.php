<?php

namespace App\Http\Requests\Patient;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'facility_id'    => ['required', 'integer', 'exists:healthcare_facilities,id'],
            'subject'        => ['required', 'string', 'min:3', 'max:255'],
            'body'           => ['required', 'string', 'min:5', 'max:5000'],
            'appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
            'parent_id'      => ['nullable', 'integer', 'exists:messages,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject.min' => 'Subject must be at least 3 characters.',
            'body.min'    => 'Message body must be at least 5 characters.',
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
