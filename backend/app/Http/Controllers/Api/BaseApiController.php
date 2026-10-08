<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;

/**
 * Base controller for all API controllers.
 * All API controllers extend this class to inherit the
 * consistent response formatting provided by ApiResponse.
 */
abstract class BaseApiController extends Controller
{
    use ApiResponse;
}
