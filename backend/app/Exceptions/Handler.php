<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

/**
 * Global exception handler.
 * Converts all exceptions into consistent JSON responses for API requests.
 * This prevents raw Laravel HTML error pages from being returned to the frontend.
 */
class Handler extends ExceptionHandler
{
    protected $levels = [];

    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Custom reporting can be added here (e.g., Sentry, Bugsnag)
        });
    }

    /**
     * Render an exception into an HTTP response.
     * For all API routes, we return structured JSON instead of HTML.
     */
    public function render($request, Throwable $e): mixed
    {
        if ($request->is('api/*') || $request->expectsJson()) {
            return $this->handleApiException($e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException(Throwable $e): JsonResponse
    {
        // Laravel validation failure
        if ($e instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'The provided data is invalid.',
                'errors'  => $e->errors(),
            ], 422);
        }

        // Eloquent model not found (e.g., findOrFail())
        if ($e instanceof ModelNotFoundException) {
            $modelName = class_basename($e->getModel());
            return response()->json([
                'success' => false,
                'message' => "{$modelName} not found.",
            ], 404);
        }

        // Unauthenticated (no token / expired token)
        if ($e instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
            ], 401);
        }

        // HTTP exceptions (403 Forbidden, 404 Not Found, 429 Too Many Requests, etc.)
        if ($e instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'An HTTP error occurred.',
            ], $e->getStatusCode());
        }

        // Generic server error — never expose internal details in production
        $message = app()->isLocal()
            ? $e->getMessage()
            : 'An unexpected error occurred. Please try again later.';

        return response()->json([
            'success' => false,
            'message' => $message,
        ], 500);
    }
}
