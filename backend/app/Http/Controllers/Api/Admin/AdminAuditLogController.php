<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditLogController extends BaseApiController
{
    /**
     * GET /api/v1/admin/audit-logs
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('user')
            ->orderByDesc('created_at');

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $logs = $query->paginate($request->get('per_page', 25));

        $formatted = $logs->getCollection()->map(fn($log) => [
            'id'          => $log->id,
            'action'      => $log->action,
            'description' => $log->description,
            'model_type'  => class_basename($log->model_type ?? ''),
            'model_id'    => $log->model_id,
            'ip_address'  => $log->ip_address,
            'user'        => $log->user ? ['id' => $log->user->id, 'name' => $log->user->name] : null,
            'created_at'  => $log->created_at?->toIso8601String(),
        ]);

        return $this->successResponse($formatted, 'Audit logs retrieved.', 200, [
            'current_page' => $logs->currentPage(),
            'last_page'    => $logs->lastPage(),
            'total'        => $logs->total(),
        ]);
    }
}
