<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Support\Facades\DB;

/**
 * Simple health check endpoint.
 * Used to verify the API is running and the database is reachable.
 * Useful for deployment checks and monitoring.
 */
class HealthCheckController extends BaseApiController
{
    public function __invoke(): \Illuminate\Http\JsonResponse
    {
        $dbStatus = 'disconnected';

        try {
            DB::connection()->getPdo();
            $dbStatus = 'connected';
        } catch (\Exception $e) {
            $dbStatus = 'error: ' . $e->getMessage();
        }

        return $this->successResponse([
            'api'         => 'Tuza MediConnect API',
            'version'     => 'v1',
            'status'      => 'operational',
            'database'    => $dbStatus,
            'timestamp'   => now()->toIso8601String(),
            'environment' => app()->environment(),
        ], 'API is healthy');
    }
}
