<?php

namespace App\Providers;

use App\Services\Payment\MockPaymentService;
use App\Services\Payment\PaymentServiceInterface;
use App\Services\Sms\MockSmsService;
use App\Services\Sms\SmsServiceInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * We bind interfaces to concrete implementations here.
     * To swap providers in production, change the binding below —
     * no other code in the application needs to change.
     */
    public function register(): void
    {
        // SMS Service binding
        // To use a real SMS provider: create a new class implementing
        // SmsServiceInterface, then replace MockSmsService here.
        $this->app->bind(SmsServiceInterface::class, function () {
            $driver = config('services.sms.driver', 'mock');

            return match ($driver) {
                // 'africastalking' => new \App\Services\Sms\AfricasTalkingService(),
                // 'twilio'         => new \App\Services\Sms\TwilioSmsService(),
                default          => new MockSmsService(),
            };
        });

        // Payment Service binding
        $this->app->bind(PaymentServiceInterface::class, function () {
            $driver = config('services.payment.driver', 'mock');

            return match ($driver) {
                'mtn'         => new \App\Services\Payment\MtnMobileMoneyService(),
                // 'mpesa'    => new \App\Services\Payment\MpesaService(),
                // 'stripe'   => new \App\Services\Payment\StripeService(),
                default        => new MockPaymentService(),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
