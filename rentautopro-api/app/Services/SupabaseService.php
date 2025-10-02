<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseService
{
    protected string $url;
    protected string $key;
    protected string $secret;

    public function __construct()
    {
        $this->url = config('services.supabase.url');
        $this->key = config('services.supabase.key');
        $this->secret = config('services.supabase.secret');
    }

    /**
     * Sign up a new user with Supabase Auth
     */
    public function signUp(string $email, string $password, array $metadata = [])
    {
        $response = Http::withHeaders([
            'apikey' => $this->key,
            'Content-Type' => 'application/json',
        ])->post("{$this->url}/auth/v1/signup", [
            'email' => $email,
            'password' => $password,
            'data' => $metadata,
        ]);

        return $response->json();
    }

    /**
     * Sign in a user with Supabase Auth
     */
    public function signIn(string $email, string $password)
    {
        $response = Http::withHeaders([
            'apikey' => $this->key,
            'Content-Type' => 'application/json',
        ])->post("{$this->url}/auth/v1/token?grant_type=password", [
            'email' => $email,
            'password' => $password,
        ]);

        return $response->json();
    }

    /**
     * Get user information from Supabase
     */
    public function getUser(string $accessToken)
    {
        $response = Http::withHeaders([
            'apikey' => $this->key,
            'Authorization' => "Bearer {$accessToken}",
        ])->get("{$this->url}/auth/v1/user");

        return $response->json();
    }

    /**
     * Sign out a user
     */
    public function signOut(string $accessToken)
    {
        $response = Http::withHeaders([
            'apikey' => $this->key,
            'Authorization' => "Bearer {$accessToken}",
        ])->post("{$this->url}/auth/v1/logout");

        return $response->json();
    }
}
