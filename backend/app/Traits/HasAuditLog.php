<?php

namespace App\Traits;

/**
 * Adds audit logging capability to any model.
 * Models using this trait will automatically log
 * create, update, and delete events.
 */
trait HasAuditLog
{
    public static function bootHasAuditLog(): void
    {
        // Only log if audit logging is enabled in config
        if (!config('app.audit_log_enabled', true)) {
            return;
        }

        static::created(function ($model) {
            self::writeAuditLog('created', $model);
        });

        static::updated(function ($model) {
            self::writeAuditLog('updated', $model);
        });

        static::deleted(function ($model) {
            self::writeAuditLog('deleted', $model);
        });
    }

    private static function writeAuditLog(string $action, $model): void
    {
        try {
            // We use a deferred DB write to avoid breaking the main request
            // if audit logging fails. This is replaced by a queue job in production.
            \App\Models\AuditLog::create([
                'user_id'      => auth()->id(),
                'action'       => $action,
                'model_type'   => get_class($model),
                'model_id'     => $model->getKey(),
                'old_values'   => $action === 'updated'
                    ? json_encode($model->getOriginal())
                    : null,
                'new_values'   => in_array($action, ['created', 'updated'])
                    ? json_encode($model->getAttributes())
                    : null,
                'ip_address'   => request()->ip(),
                'user_agent'   => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            // Never let audit logging break the main application flow
            \Illuminate\Support\Facades\Log::warning('Audit log write failed: ' . $e->getMessage());
        }
    }
}
