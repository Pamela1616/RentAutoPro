<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Maintenance;
use App\Models\Rental;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard KPIs and statistics.
     */
    public function kpis(): JsonResponse
    {
        try {
            // Total vehicles
            $totalVehicles = Vehicle::count();
            $availableVehicles = Vehicle::where('status', 'disponible')->count();
            $rentedVehicles = Vehicle::where('status', 'alquilado')->count();
            $maintenanceVehicles = Vehicle::where('status', 'mantenimiento')->count();

            // Active rentals
            $activeRentals = Rental::where('status', 'activo')->count();
            $reservedRentals = Rental::where('status', 'reservado')->count();

            // Total clients
            $totalClients = Client::count();

            // Revenue this month
            $monthRevenue = Rental::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->where('status', '!=', 'cancelado')
                ->sum('total_cost');

            // Maintenance costs this month
            $monthMaintenanceCost = Maintenance::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('cost');

            // Pending maintenances
            $pendingMaintenances = Maintenance::where('status', 'pendiente')->count();

            // Recent rentals
            $recentRentals = Rental::with(['vehicle', 'client'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            // Fleet utilization
            $fleetUtilization = $totalVehicles > 0 
                ? round(($rentedVehicles / $totalVehicles) * 100, 2) 
                : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'vehicles' => [
                        'total' => $totalVehicles,
                        'available' => $availableVehicles,
                        'rented' => $rentedVehicles,
                        'maintenance' => $maintenanceVehicles,
                        'utilization_rate' => $fleetUtilization,
                    ],
                    'rentals' => [
                        'active' => $activeRentals,
                        'reserved' => $reservedRentals,
                        'recent' => $recentRentals,
                    ],
                    'clients' => [
                        'total' => $totalClients,
                    ],
                    'financials' => [
                        'month_revenue' => floatval($monthRevenue),
                        'month_maintenance_cost' => floatval($monthMaintenanceCost),
                        'net_profit' => floatval($monthRevenue - $monthMaintenanceCost),
                    ],
                    'maintenance' => [
                        'pending' => $pendingMaintenances,
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener KPIs: ' . $e->getMessage()
            ], 500);
        }
    }
}
