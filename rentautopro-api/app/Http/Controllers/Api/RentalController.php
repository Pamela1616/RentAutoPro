<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Models\Vehicle;
use App\Services\PDFService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RentalController extends Controller
{
    protected PDFService $pdfService;

    public function __construct(PDFService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    /**
     * Display a listing of rentals.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Rental::with(['vehicle', 'client']);

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $perPage = $request->get('per_page', 15);
        $rentals = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $rentals
        ]);
    }

    /**
     * Store a newly created rental.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|uuid|exists:vehicles,id',
            'client_id' => 'required|uuid|exists:clients,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'start_km' => 'nullable|integer|min:0',
            'status' => 'nullable|in:reservado,activo,completado,cancelado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check vehicle availability
            $vehicle = Vehicle::find($request->vehicle_id);
            if ($vehicle->status !== 'disponible') {
                return response()->json([
                    'success' => false,
                    'message' => 'El vehículo no está disponible'
                ], 400);
            }

            // Calculate total cost
            $startDate = \Carbon\Carbon::parse($request->start_date);
            $endDate = \Carbon\Carbon::parse($request->end_date);
            $days = $startDate->diffInDays($endDate) + 1;
            $totalCost = $days * $vehicle->daily_rate;

            $rental = Rental::create([
                ...$request->all(),
                'total_cost' => $totalCost,
                'status' => $request->status ?? 'reservado',
            ]);

            // Update vehicle status
            $vehicle->update(['status' => 'alquilado']);

            return response()->json([
                'success' => true,
                'message' => 'Alquiler creado exitosamente',
                'data' => $rental->load(['vehicle', 'client'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el alquiler: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified rental.
     */
    public function show(string $id): JsonResponse
    {
        $rental = Rental::with(['vehicle', 'client'])->find($id);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Alquiler no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rental
        ]);
    }

    /**
     * Update the specified rental.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $rental = Rental::find($id);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Alquiler no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'start_km' => 'sometimes|integer|min:0',
            'end_km' => 'sometimes|integer|min:0',
            'status' => 'sometimes|in:reservado,activo,completado,cancelado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $rental->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Alquiler actualizado exitosamente',
                'data' => $rental->load(['vehicle', 'client'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el alquiler: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified rental.
     */
    public function destroy(string $id): JsonResponse
    {
        $rental = Rental::find($id);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Alquiler no encontrado'
            ], 404);
        }

        try {
            $rental->delete();

            return response()->json([
                'success' => true,
                'message' => 'Alquiler eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el alquiler: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete a rental.
     */
    public function complete(Request $request, string $id): JsonResponse
    {
        $rental = Rental::with(['vehicle'])->find($id);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Alquiler no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'end_km' => 'required|integer|min:' . $rental->start_km,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $rental->update([
                'end_km' => $request->end_km,
                'status' => 'completado',
            ]);

            // Update vehicle
            $rental->vehicle->update([
                'current_km' => $request->end_km,
                'status' => 'disponible',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Alquiler completado exitosamente',
                'data' => $rental->load(['vehicle', 'client'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al completar el alquiler: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate PDF for rental.
     */
    public function generatePDF(string $id)
    {
        $rental = Rental::with(['vehicle', 'client'])->find($id);

        if (!$rental) {
            return response()->json([
                'success' => false,
                'message' => 'Alquiler no encontrado'
            ], 404);
        }

        try {
            return $this->pdfService->generateRentalPDF($rental);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}
