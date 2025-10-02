<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FuelLogController;
use App\Http\Controllers\Api\MaintenanceAlertController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        
        // Vehicles
        Route::apiResource('vehicles', VehicleController::class);
        Route::get('vehicles/{id}/history', [VehicleController::class, 'history']);
        
        // Maintenance
        Route::apiResource('maintenances', MaintenanceController::class);
        Route::get('vehicles/{id}/maintenances', [MaintenanceController::class, 'byVehicle']);
        
        // Maintenance Alerts
        Route::apiResource('maintenance-alerts', MaintenanceAlertController::class);
        Route::post('maintenance-alerts/{id}/trigger', [MaintenanceAlertController::class, 'trigger']);
        
        // Clients
        Route::apiResource('clients', ClientController::class);
        
        // Rentals
        Route::apiResource('rentals', RentalController::class);
        Route::post('rentals/{id}/pdf', [RentalController::class, 'generatePDF']);
        Route::post('rentals/{id}/complete', [RentalController::class, 'complete']);
        
        // Fuel Logs
        Route::apiResource('fuel-logs', FuelLogController::class);
        Route::get('vehicles/{id}/fuel-logs', [FuelLogController::class, 'byVehicle']);
        
        // Dashboard
        Route::get('dashboard/kpis', [DashboardController::class, 'kpis']);
        
        // Reports
        Route::get('reports/income', [ReportController::class, 'income']);
        Route::get('reports/maintenance-costs', [ReportController::class, 'maintenanceCosts']);
        Route::get('reports/fleet-availability', [ReportController::class, 'fleetAvailability']);
    });
});
