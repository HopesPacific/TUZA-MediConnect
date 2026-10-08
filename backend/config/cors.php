<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    | Allows the React frontend (running on a different port during development)
    | to communicate with this Laravel API.
    |
    | In production, set FRONTEND_URL to your actual domain.
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // This must be true for Sanctum SPA authentication to work
    'supports_credentials' => true,

];
