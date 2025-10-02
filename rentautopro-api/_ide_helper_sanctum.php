<?php
// @formatter:off
/**
 * Helper file for Laravel Sanctum IDE support.
 * This file is not meant to be executed, it's only for IDE autocomplete.
 */

namespace Illuminate\Foundation\Auth {
    /**
     * @method \Laravel\Sanctum\NewAccessToken createToken(string $name, array $abilities = ['*'])
     * @method \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] tokens()
     * @method \Laravel\Sanctum\PersonalAccessToken|null currentAccessToken()
     */
    class User {}
}

namespace App\Models {
    /**
     * @method \Laravel\Sanctum\NewAccessToken createToken(string $name, array $abilities = ['*'])
     * @method \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] tokens()
     * @method \Laravel\Sanctum\PersonalAccessToken|null currentAccessToken()
     */
    class User extends \Illuminate\Foundation\Auth\User {}
}
