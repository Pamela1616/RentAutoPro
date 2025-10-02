<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaintenanceAlertController extends Controller
{
    /**
     * Display a listing of maintenance alerts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MaintenanceAlert::with('vehicle');

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        $perPage = $request->get('per_page', 15);
        $alerts = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $alerts
        ]);
    }

    /**
     * Store a newly created maintenance alert.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|uuid|exists:vehicles,id',
            'alert_type' => 'required|in:km,tiempo',
            'threshold_value' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $alert = MaintenanceAlert::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Alerta de mantenimiento creada exitosamente',
                'data' => $alert->load('vehicle')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la alerta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified maintenance alert.
     */
    public function show(string $id): JsonResponse
    {
        $alert = MaintenanceAlert::with('vehicle')->find($id);

        if (!$alert) {
            return response()->json([
                'success' => false,
                'message' => 'Alerta no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $alert
        ]);
    }

    /**
     * Update the specified maintenance alert.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $alert = MaintenanceAlert::find($id);

        if (!$alert) {
            return response()->json([
                'success' => false,
                'message' => 'Alerta no encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'alert_type' => 'sometimes|in:km,tiempo',
            'threshold_value' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $alert->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Alerta actualizada exitosamente',
                'data' => $alert->load('vehicle')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la alerta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified maintenance alert.
     */
    public function destroy(string $id): JsonResponse
    {
        $alert = MaintenanceAlert::find($id);

        if (!$alert) {
            return response()->json([
                'success' => false,
                'message' => 'Alerta no encontrada'
            ], 404);
        }

        try {
            $alert->delete();

            return response()->json([
                'success' => true,
                'message' => 'Alerta eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la alerta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Manually trigger an alert.
     */
    public function trigger(string $id): JsonResponse
    {
        $alert = MaintenanceAlert::with('vehicle')->find($id);

        if (!$alert) {
            return response()->json([
                'success' => false,
                'message' => 'Alerta no encontrada'
            ], 404);
        }

        try {
            $alert->update([
                'last_alert_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Alerta disparada exitosamente',
                'data' => $alert
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al disparar la alerta: ' . $e->getMessage()
            ], 500);
        }
    }
}
