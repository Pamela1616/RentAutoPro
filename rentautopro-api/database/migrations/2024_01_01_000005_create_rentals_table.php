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
        Schema::create('rentals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('vehicle_id')->constrained();
            $table->foreignUuid('client_id')->constrained();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('start_km')->nullable();
            $table->integer('end_km')->nullable();
            $table->decimal('total_cost', 10, 2)->nullable();
            $table->enum('status', ['reservado', 'activo', 'completado', 'cancelado'])->default('reservado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
