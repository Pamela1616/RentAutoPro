<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FuelLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FuelLogController extends Controller
{
    /**
     * Display a listing of fuel logs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = FuelLog::with('vehicle');

        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        $perPage = $request->get('per_page', 15);
        $fuelLogs = $query->orderBy('date', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $fuelLogs
        ]);
    }

    /**
     * Store a newly created fuel log.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|uuid|exists:vehicles,id',
            'date' => 'required|date',
            'km' => 'required|integer|min:0',
            'liters' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'fuel_station' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $fuelLog = FuelLog::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Registro de combustible creado exitosamente',
                'data' => $fuelLog->load('vehicle')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el registro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified fuel log.
     */
    public function show(string $id): JsonResponse
    {
        $fuelLog = FuelLog::with('vehicle')->find($id);

        if (!$fuelLog) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $fuelLog
        ]);
    }

    /**
     * Update the specified fuel log.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $fuelLog = FuelLog::find($id);

        if (!$fuelLog) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|date',
            'km' => 'sometimes|integer|min:0',
            'liters' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'fuel_station' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $fuelLog->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Registro actualizado exitosamente',
                'data' => $fuelLog->load('vehicle')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el registro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified fuel log.
     */
    public function destroy(string $id): JsonResponse
    {
        $fuelLog = FuelLog::find($id);

        if (!$fuelLog) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado'
            ], 404);
        }

        try {
            $fuelLog->delete();

            return response()->json([
                'success' => true,
                'message' => 'Registro eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el registro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get fuel logs by vehicle.
     */
    public function byVehicle(string $vehicleId): JsonResponse
    {
        $fuelLogs = FuelLog::where('vehicle_id', $vehicleId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $fuelLogs
        ]);
    }
}
