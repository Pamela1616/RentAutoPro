<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('brand', 100);
            $table->string('model', 100);
            $table->integer('year');
            $table->string('license_plate', 20)->unique();
            $table->enum('status', ['disponible', 'alquilado', 'mantenimiento'])->default('disponible');
            $table->integer('current_km')->default(0);
            $table->string('fuel_type', 20)->nullable();
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
