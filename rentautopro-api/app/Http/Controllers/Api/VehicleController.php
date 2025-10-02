<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    /**
     * Display a listing of the vehicles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::query();

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('brand')) {
            $query->where('brand', 'ilike', "%{$request->brand}%");
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'ilike', "%{$search}%")
                    ->orWhere('model', 'ilike', "%{$search}%")
                    ->orWhere('license_plate', 'ilike', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $vehicles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $vehicles
        ]);
    }

    /**
     * Store a newly created vehicle.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'required|string|max:20|unique:vehicles,license_plate',
            'status' => 'nullable|in:disponible,alquilado,mantenimiento',
            'current_km' => 'nullable|integer|min:0',
            'fuel_type' => 'nullable|string|max:20',
            'daily_rate' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vehicle = Vehicle::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Vehículo creado exitosamente',
                'data' => $vehicle
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el vehículo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified vehicle.
     */
    public function show(string $id): JsonResponse
    {
        $vehicle = Vehicle::with(['maintenances', 'rentals', 'fuelLogs', 'maintenanceAlerts'])
            ->find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehículo no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $vehicle
        ]);
    }

    /**
     * Update the specified vehicle.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehículo no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'brand' => 'sometimes|string|max:100',
            'model' => 'sometimes|string|max:100',
            'year' => 'sometimes|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'sometimes|string|max:20|unique:vehicles,license_plate,' . $id,
            'status' => 'sometimes|in:disponible,alquilado,mantenimiento',
            'current_km' => 'sometimes|integer|min:0',
            'fuel_type' => 'sometimes|string|max:20',
            'daily_rate' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vehicle->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Vehículo actualizado exitosamente',
                'data' => $vehicle
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el vehículo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified vehicle.
     */
    public function destroy(string $id): JsonResponse
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehículo no encontrado'
            ], 404);
        }

        try {
            $vehicle->delete();

            return response()->json([
                'success' => true,
                'message' => 'Vehículo eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el vehículo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vehicle history (maintenances and rentals).
     */
    public function history(string $id): JsonResponse
    {
        $vehicle = Vehicle::with([
            'maintenances' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'rentals' => function ($query) {
                $query->with('client')->orderBy('created_at', 'desc');
            },
            'fuelLogs' => function ($query) {
                $query->orderBy('date', 'desc');
            }
        ])->find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehículo no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'vehicle' => $vehicle,
                'maintenances' => $vehicle->maintenances,
                'rentals' => $vehicle->rentals,
                'fuel_logs' => $vehicle->fuelLogs,
            ]
        ]);
    }
}
