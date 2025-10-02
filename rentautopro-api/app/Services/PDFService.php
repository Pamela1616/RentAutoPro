<?php

namespace App\Services;

use App\Models\Rental;
use Barryvdh\DomPDF\Facade\Pdf;

class PDFService
{
    /**
     * Generate rental contract PDF
     */
    public function generateRentalPDF(Rental $rental)
    {
        $data = [
            'rental' => $rental,
            'vehicle' => $rental->vehicle,
            'client' => $rental->client,
            'generated_at' => now()->format('d/m/Y H:i:s'),
        ];

        $pdf = Pdf::loadView('pdfs.rental-contract', $data);
        
        return $pdf->download('contrato-alquiler-' . $rental->id . '.pdf');
    }
}
