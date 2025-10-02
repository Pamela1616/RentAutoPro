<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Rental;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get income report.
     */
    public function income(Request $request): JsonResponse
    {
        try {
            $startDate = $request->get('start_date', now()->subMonths(6));
            $endDate = $request->get('end_date', now());

            // Monthly income
            $monthlyIncome = Rental::select(
                    DB::raw("to_char(created_at, 'YYYY-MM') as month"),
                    DB::raw('sum(total_cost) as total')
                )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->where('status', '!=', 'cancelado')
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            // Income by vehicle
            $incomeByVehicle = Rental::select(
                    'vehicles.brand',
                    'vehicles.model',
                    'vehicles.license_plate',
                    DB::raw('count(rentals.id) as rental_count'),
                    DB::raw('sum(rentals.total_cost) as total_income')
                )
                ->join('vehicles', 'rentals.vehicle_id', '=', 'vehicles.id')
                ->whereBetween('rentals.created_at', [$startDate, $endDate])
                ->where('rentals.status', '!=', 'cancelado')
                ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model', 'vehicles.license_plate')
                ->orderBy('total_income', 'desc')
                ->get();

            $totalIncome = Rental::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', '!=', 'cancelado')
                ->sum('total_cost');

            return response()->json([
                'success' => true,
                'data' => [
                    'monthly_income' => $monthlyIncome,
                    'income_by_vehicle' => $incomeByVehicle,
                    'total_income' => floatval($totalIncome),
                    'period' => [
                        'start' => $startDate,
                        'end' => $endDate,
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar reporte de ingresos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get maintenance costs report.
     */
    public function maintenanceCosts(Request $request): JsonResponse
    {
        try {
            $startDate = $request->get('start_date', now()->subMonths(6));
            $endDate = $request->get('end_date', now());

            // Monthly maintenance costs
            $monthlyCosts = Maintenance::select(
                    DB::raw("to_char(created_at, 'YYYY-MM') as month"),
                    DB::raw('sum(cost) as total')
                )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            // Costs by vehicle
            $costsByVehicle = Maintenance::select(
                    'vehicles.brand',
                    'vehicles.model',
                    'vehicles.license_plate',
                    DB::raw('count(maintenances.id) as maintenance_count'),
                    DB::raw('sum(maintenances.cost) as total_cost')
                )
                ->join('vehicles', 'maintenances.vehicle_id', '=', 'vehicles.id')
                ->whereBetween('maintenances.created_at', [$startDate, $endDate])
                ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model', 'vehicles.license_plate')
                ->orderBy('total_cost', 'desc')
                ->get();

            // Costs by type
            $costsByType = Maintenance::select(
                    'type',
                    DB::raw('count(id) as count'),
                    DB::raw('sum(cost) as total')
                )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('type')
                ->get();

            $totalCost = Maintenance::whereBetween('created_at', [$startDate, $endDate])
                ->sum('cost');

            return response()->json([
                'success' => true,
                'data' => [
                    'monthly_costs' => $monthlyCosts,
                    'costs_by_vehicle' => $costsByVehicle,
                    'costs_by_type' => $costsByType,
                    'total_cost' => floatval($totalCost),
                    'period' => [
                        'start' => $startDate,
                        'end' => $endDate,
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar reporte de costos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get fleet availability report.
     */
    public function fleetAvailability(Request $request): JsonResponse
    {
        try {
            // Current status distribution
            $statusDistribution = Vehicle::select(
                    'status',
                    DB::raw('count(*) as count')
                )
                ->groupBy('status')
                ->get();

            // Vehicles with most rentals
            $mostRentedVehicles = Vehicle::select(
                    'vehicles.id',
                    'vehicles.brand',
                    'vehicles.model',
                    'vehicles.license_plate',
                    'vehicles.status',
                    DB::raw('count(rentals.id) as rental_count')
                )
                ->leftJoin('rentals', 'vehicles.id', '=', 'rentals.vehicle_id')
                ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model', 'vehicles.license_plate', 'vehicles.status')
                ->orderBy('rental_count', 'desc')
                ->limit(10)
                ->get();

            // Vehicles requiring maintenance soon
            $maintenanceDue = Vehicle::with('maintenanceAlerts')
                ->where('status', '!=', 'mantenimiento')
                ->get()
                ->filter(function ($vehicle) {
                    return $vehicle->maintenanceAlerts->where('is_active', true)->count() > 0;
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'status_distribution' => $statusDistribution,
                    'most_rented_vehicles' => $mostRentedVehicles,
                    'maintenance_due' => $maintenanceDue,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar reporte de disponibilidad: ' . $e->getMessage()
            ], 500);
        }
    }
}
