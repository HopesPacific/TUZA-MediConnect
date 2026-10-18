<?php

namespace App\Http\Requests\Patient;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class InitiatePaymentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'appointment_id' => ['required', 'integer', 'exists:appointments,id'],
            'payment_method' => ['required', 'in:mpesa,card,bank_transfer,cash,insurance'],
            'amount'         => ['required', 'numeric', 'min:0'],
            'currency'       => ['nullable', 'string', 'size:3'],
            'phone'          => ['nullable', 'string', 'max:20'], // for M-Pesa
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method.in' => 'Payment method must be one of: mpesa, card, bank_transfer, cash, insurance.',
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
