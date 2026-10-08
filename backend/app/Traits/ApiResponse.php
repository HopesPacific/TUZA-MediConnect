<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Provides a consistent JSON response format across all API controllers.
 *
 * Every API response follows this structure:
 * {
 *   "success": true|false,
 *   "message": "Human-readable message",
 *   "data": { ... }       // present on success
 *   "errors": { ... }     // present on validation failure
 *   "meta": { ... }       // present when pagination or extra info is needed
 * }
 */
trait ApiResponse
{
    /**
     * Success response — 200 OK by default.
     */
    protected function successResponse(
        mixed $data = null,
        string $message = 'Request successful',
        int $statusCode = 200,
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Created response — 201 Created.
     */
    protected function createdResponse(
        mixed $data = null,
        string $message = 'Resource created successfully'
    ): JsonResponse {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Error response — for application-level errors.
     */
    protected function errorResponse(
        string $message = 'An error occurred',
        int $statusCode = 400,
        mixed $errors = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Unauthorized response — 401.
     */
    protected function unauthorizedResponse(
        string $message = 'Unauthenticated. Please log in.'
    ): JsonResponse {
        return $this->errorResponse($message, 401);
    }

    /**
     * Forbidden response — 403.
     */
    protected function forbiddenResponse(
        string $message = 'You do not have permission to perform this action.'
    ): JsonResponse {
        return $this->errorResponse($message, 403);
    }

    /**
     * Not Found response — 404.
     */
    protected function notFoundResponse(
        string $message = 'The requested resource was not found.'
    ): JsonResponse {
        return $this->errorResponse($message, 404);
    }

    /**
     * Validation error response — 422.
     */
    protected function validationErrorResponse(
        mixed $errors,
        string $message = 'The provided data is invalid.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], 422);
    }

    /**
     * No Content response — 204 (for deletes with no body).
     */
    protected function noContentResponse(): JsonResponse
    {
        return response()->json(null, 204);
    }
}
