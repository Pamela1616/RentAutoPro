<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar el seeder de usuarios
        $this->call([
            UserSeeder::class,
        ]);

        // También puedes usar factories para crear usuarios adicionales si lo necesitas
        // User::factory(10)->create();
    }
}