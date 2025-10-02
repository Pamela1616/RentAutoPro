<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@rentautopro.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Crear usuario gestor
        User::create([
            'name' => 'Gestor de Flota',
            'email' => 'gestor@rentautopro.com',
            'password' => Hash::make('gestor123'),
            'role' => 'gestor',
            'email_verified_at' => now(),
        ]);

        // Crear usuario cliente
        User::create([
            'name' => 'Cliente Demo',
            'email' => 'cliente@rentautopro.com',
            'password' => Hash::make('cliente123'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);

        // Crear usuario de prueba adicional
        User::create([
            'name' => 'Usuario Test',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);
    }
}