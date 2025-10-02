<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of maintenances.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Maintenance::with('vehicle');

        // Filters - solo aplicar si el valor no está vacío
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        $perPage = $request->get('per_page', 15);
        $maintenances = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $maintenances
        ]);
    }

    /**
     * Store a newly created maintenance.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|uuid|exists:vehicles,id',
            'type' => 'required|in:preventivo,correctivo,predictivo,programado',
            'description' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'km_at_maintenance' => 'nullable|integer|min:0',
            'scheduled_date' => 'nullable|date',
            'completed_date' => 'nullable|date',
            'status' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $maintenance = Maintenance::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Mantenimiento registrado exitosamente',
                'data' => $maintenance->load('vehicle')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar el mantenimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified maintenance.
     */
    public function show(string $id): JsonResponse
    {
        $maintenance = Maintenance::with('vehicle')->find($id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Mantenimiento no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $maintenance
        ]);
    }

    /**
     * Update the specified maintenance.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $maintenance = Maintenance::find($id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Mantenimiento no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'sometimes|uuid|exists:vehicles,id',
            'type' => 'sometimes|in:preventivo,correctivo,predictivo,programado',
            'description' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'km_at_maintenance' => 'nullable|integer|min:0',
            'scheduled_date' => 'nullable|date',
            'completed_date' => 'nullable|date',
            'status' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $maintenance->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Mantenimiento actualizado exitosamente',
                'data' => $maintenance->load('vehicle')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el mantenimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified maintenance.
     */
    public function destroy(string $id): JsonResponse
    {
        $maintenance = Maintenance::find($id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Mantenimiento no encontrado'
            ], 404);
        }

        try {
            $maintenance->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mantenimiento eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el mantenimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get maintenances by vehicle.
     */
    public function byVehicle(string $vehicleId): JsonResponse
    {
        $maintenances = Maintenance::where('vehicle_id', $vehicleId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $maintenances
        ]);
    }
}
