<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Blocks deactivated accounts from accessing the API.
 * Even if a user has a valid Sanctum token, if their account
 * has been deactivated by an admin, they cannot proceed.
 *
 * Applied on all authenticated routes.
 */
class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();

        if ($user && !$user->is_active) {
            // Revoke all tokens so the client cannot retry silently
            $user->tokens()->delete();

            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated. Please contact support.',
            ], 403);
        }

        return $next($request);
    }
}
